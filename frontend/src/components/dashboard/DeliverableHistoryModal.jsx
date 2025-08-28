import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Eye,
    Download,
    History,
    CheckCircle,
    Clock,
    AlertCircle,
    RefreshCw,
    FileText,
    Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { deliverableApi } from '@/utils/deliverableApi';
import FilePreviewModal from './FilePreviewModal';

export default function DeliverableHistoryModal({
    isOpen,
    onClose,
    purchaseId,
    featureName
}) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);

    // Get status color and text
    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return { color: 'bg-yellow-500', text: 'Pending Review', icon: <Clock className="w-3 h-3" /> };
            case 'approved':
                return { color: 'bg-green-500', text: 'Approved', icon: <CheckCircle className="w-3 h-3" /> };
            case 'revision_requested':
                return { color: 'bg-orange-500', text: 'Revision Requested', icon: <AlertCircle className="w-3 h-3" /> };
            default:
                return { color: 'bg-gray-500', text: status, icon: <FileText className="w-3 h-3" /> };
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get file name from path
    const getFileName = (filePath) => {
        if (!filePath) return 'N/A';
        return filePath.split('/').pop() || filePath.split('\\').pop() || 'Unknown file';
    };

    // Get deliverable display info (file or link)
    const getDeliverableDisplay = (version) => {
        // Check if it's a link deliverable
        if (version.deliverable_link) {
            return {
                type: 'link',
                url: version.deliverable_link,
                icon: '🔗',
                label: 'External Link',
                displayName: version.deliverable_link.length > 50
                    ? version.deliverable_link.substring(0, 50) + '...'
                    : version.deliverable_link
            };
        }

        // File deliverable
        const fileName = getFileName(version.file_path);
        return {
            type: 'file',
            fileName: fileName,
            filePath: version.file_path,
            icon: '📁',
            label: 'File'
        };
    };

    // Load history
    const loadHistory = async () => {
        if (!purchaseId || !featureName) return;

        setLoading(true);
        setError(null);

        try {
            const response = await deliverableApi.getDeliverableHistory(purchaseId, featureName);

            if (response.success) {
                setHistory(response.data || []);
            } else {
                throw new Error(response.message || 'Failed to load history');
            }
        } catch (err) {
            console.error('Error loading deliverable history:', err);
            setError(err.message);
            toast.error('Failed to load deliverable history');
        } finally {
            setLoading(false);
        }
    };

    // Load history when modal opens
    useEffect(() => {
        if (isOpen && purchaseId && featureName) {
            loadHistory();
        }
    }, [isOpen, purchaseId, featureName]);

    // Handle link click
    const handleLinkClick = (url) => {
        if (!url) {
            toast.error('No link available');
            return;
        }

        try {
            // Open link in new tab
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error opening link:', error);
            toast.error('Failed to open link');
        }
    };

    // Handle file preview
    const handlePreview = (version) => {
        const fileName = getFileName(version.file_path);
        setSelectedPreviewFile({
            filePath: version.file_path,
            fileName: fileName,
            deliverableInfo: version
        });
        setShowPreviewModal(true);
    };

    // Handle download file with progress - FORCE DOWNLOAD TO LOCAL MACHINE
    const handleDownloadFile = async (filePath, fileName) => {
        if (!filePath) {
            toast.error('No file available for download');
            return;
        }

        try {
            const downloadUrl = deliverableApi.downloadFile(filePath);

            // Fetch the file as a blob to force download behavior
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/octet-stream',
                }
            });

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status} ${response.statusText}`);
            }

            // Convert to blob and force download
            const blob = await response.blob();
            // Override the blob type to force download
            const downloadBlob = new Blob([blob], { type: 'application/octet-stream' });

            // Create blob URL and trigger download
            const blobUrl = URL.createObjectURL(downloadBlob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || getFileName(filePath);
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);



        } catch (error) {
            console.error('Download error:', error);

            // Fallback: Try XMLHttpRequest method
            try {

                const downloadUrl = deliverableApi.downloadFile(filePath);
                const xhr = new XMLHttpRequest();
                xhr.open('GET', downloadUrl, true);
                xhr.responseType = 'blob';

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
                        const blobUrl = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = fileName || getFileName(filePath);
                        link.style.display = 'none';

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);


                    } else {
                        throw new Error(`XHR failed: ${xhr.status}`);
                    }
                };

                xhr.onerror = function () {
                    throw new Error('XHR request failed');
                };

                xhr.send();

            } catch (fallbackError) {
                console.error('Fallback download also failed:', fallbackError);

                // Final fallback: Direct link method
                try {
                    const downloadUrl = deliverableApi.downloadFile(filePath);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = fileName || getFileName(filePath);
                    link.target = '_self';
                    link.rel = 'noopener noreferrer';
                    link.style.display = 'none';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (finalError) {
                    console.error('All download methods failed:', finalError);
                }
            }
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <History className="w-5 h-5" />
                            Deliverable History: {featureName}
                        </DialogTitle>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center space-x-2">
                                <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
                                <span className="text-gray-600">Loading history...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 mb-4">Error: {error}</p>
                            <Button onClick={loadHistory} className="bg-black hover:bg-gray-800 text-white">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                            </Button>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No history found for this deliverable</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((version, index) => {
                                const statusInfo = getStatusInfo(version.status);
                                const isLatest = index === 0; // First item is latest
                                const isRevision = version.version_number > 1;

                                return (
                                    <Card key={version.id} className={`border-2 ${isLatest ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                                        v{version.version_number}
                                                    </Badge>
                                                    <Badge className={`${statusInfo.color} text-white px-3 py-1 rounded-full flex items-center gap-1`}>
                                                        {statusInfo.icon}
                                                        {statusInfo.text}
                                                    </Badge>
                                                    {isLatest && (
                                                        <Badge className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                            Latest
                                                        </Badge>
                                                    )}
                                                    {isRevision && (
                                                        <Badge className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                                            Revision
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(version.uploaded_at)}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Uploaded by:</p>
                                                    <p className="text-sm text-gray-600">{version.uploaded_by_name || 'Unknown'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Type:</p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">{getDeliverableDisplay(version).icon}</span>
                                                        <p className="text-sm text-gray-600">{getDeliverableDisplay(version).label}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* File/Link Information */}
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                    {getDeliverableDisplay(version).type === 'link' ? 'Link:' : 'File:'}
                                                </p>
                                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border break-all">
                                                    {getDeliverableDisplay(version).type === 'link'
                                                        ? getDeliverableDisplay(version).displayName
                                                        : getDeliverableDisplay(version).fileName
                                                    }
                                                </p>
                                            </div>

                                            {/* Admin Notes */}
                                            {version.admin_notes && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{version.admin_notes}</p>
                                                </div>
                                            )}

                                            {/* Client Revision Request */}
                                            {version.client_revision_comment && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-gray-700">Your Revision Request:</p>
                                                    <p className="text-sm text-gray-600 bg-orange-50 p-2 rounded border-l-4 border-orange-400">
                                                        {version.client_revision_comment}
                                                    </p>
                                                    {version.revision_requested_at && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Requested: {formatDate(version.revision_requested_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex space-x-2">
                                                {getDeliverableDisplay(version).type === 'link' ? (
                                                    // Link deliverable actions
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl"
                                                        onClick={() => handleLinkClick(getDeliverableDisplay(version).url)}
                                                        title="Visit Link"
                                                    >
                                                        <Globe className="w-4 h-4 mr-1" />
                                                        Visit Link
                                                    </Button>
                                                ) : (
                                                    // File deliverable actions
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl"
                                                            onClick={() => handlePreview(version)}
                                                            title="Preview File"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            Preview
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white rounded-xl"
                                                            onClick={() => handleDownloadFile(version.file_path, getFileName(version.file_path))}
                                                            title="Download File"
                                                        >
                                                            <Download className="w-4 h-4 mr-1" />
                                                            Download
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            <FilePreviewModal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                filePath={selectedPreviewFile?.filePath}
                fileName={selectedPreviewFile?.fileName}
                deliverableInfo={selectedPreviewFile?.deliverableInfo}
            />
        </>
    );
}
