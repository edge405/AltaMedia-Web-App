import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Search,
    RefreshCw,
    Eye,
    Edit,
    Download,
    Clock,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    History,
    FileText,
    Upload,
    X,
    Send,
    Globe
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/utils/api';
import { adminDeliverableApi } from '@/utils/adminDeliverableApi';
import FilePreviewModal from '@/components/dashboard/FilePreviewModal';

export default function AdminRevisions() {
    const [revisionRequests, setRevisionRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [adminResponse, setAdminResponse] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [versionHistory, setVersionHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadType, setUploadType] = useState('files'); // 'files' or 'link'
    const [deliverableLink, setDeliverableLink] = useState('');
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);

    // Fetch revision requests from API
    const fetchRevisionRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiService.get('/revision-requests/admin');

            if (data.success) {
                console.log('Revision requests data:', data.data);
                console.log('Sample revision request structure:', data.data[0]);

                // Check for link deliverables
                const linkDeliverables = data.data.filter(req => req.deliverable_link);
                console.log('Link deliverables found:', linkDeliverables.length, linkDeliverables);

                setRevisionRequests(data.data || []);
            } else {
                throw new Error(data.message || 'Failed to fetch revision requests');
            }
        } catch (err) {
            console.error('Error fetching revision requests:', err);
            setError(err.message);
            toast.error('Failed to load revision requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevisionRequests();
    }, []);

    // Get status color based on revision request status
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return "bg-orange-500";
            case 'in_progress':
                return "bg-blue-500";
            case 'completed':
                return "bg-orange-500";
            case 'approved':
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return "Awaiting Response";
            case 'in_progress':
                return "In Progress";
            case 'completed':
                return "Submitted for Review";
            case 'approved':
                return "Approved by Client";
            case 'revision_requested':
                return "Revision Requested";
            default:
                return status;
        }
    };

    // Group revision requests by client and feature
    const groupRevisionRequests = (requests) => {
        const grouped = {};

        requests.forEach(request => {
            const key = `${request.user_id}_${request.feature_name}`;

            if (!grouped[key]) {
                grouped[key] = {
                    user_id: request.user_id,
                    user_name: request.user_name,
                    user_email: request.user_email,
                    feature_name: request.feature_name,
                    purchase_id: request.purchase_id,
                    version_number: request.version_number,
                    file_path: request.latest_file_path || request.file_path,
                    deliverable_link: request.latest_deliverable_link || request.deliverable_link,
                    deliverable_status: request.deliverable_status,
                    requests: [],
                    total_versions: request.total_versions || 1 // Use from API response
                };
                console.log('Created new group for:', key, 'with deliverable_status:', request.deliverable_status);
            }

            grouped[key].requests.push(request);
        });

        // Update deliverable_status to the most recent one for each group
        Object.values(grouped).forEach(group => {
            const sortedRequests = group.requests.sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));
            group.deliverable_status = sortedRequests[0].deliverable_status;
            console.log('Updated group deliverable_status to:', group.deliverable_status, 'for group:', `${group.user_name}_${group.feature_name}`);
        });

        const result = Object.values(grouped);
        console.log('Grouped requests result:', result.map(g => ({
            key: `${g.user_name}_${g.feature_name}`,
            deliverable_status: g.deliverable_status,
            deliverable_link: g.deliverable_link,
            file_path: g.file_path,
            request_count: g.requests.length,
            total_versions: g.total_versions
        })));

        // Check for groups with link deliverables
        const groupsWithLinks = result.filter(g => g.deliverable_link);
        console.log('Groups with link deliverables:', groupsWithLinks.length, groupsWithLinks);

        return result;
    };

    // Get the most recent request from a group
    const getMostRecentRequest = (requests) => {
        return requests.sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at))[0];
    };

    // Helper function to determine deliverable type
    const getDeliverableType = (deliverable) => {
        if (deliverable.deliverable_link) {
            return 'link';
        } else if (deliverable.file_path) {
            return 'file';
        }
        return 'unknown';
    };

    // Get the overall status for a group (show the most urgent status)
    const getGroupStatus = (requests, deliverableStatus) => {
        // Debug logging
        console.log('getGroupStatus called with:', {
            requests: requests.length,
            deliverableStatus,
            requestStatuses: requests.map(r => r.status),
            requestDeliverableStatuses: requests.map(r => r.deliverable_status)
        });

        // If deliverable is approved by client, show that status
        if (deliverableStatus === 'approved') {
            console.log('Deliverable is approved by client, returning approved');
            return 'approved';
        }

        // Otherwise, show the most urgent revision request status
        const statusPriority = { 'pending': 3, 'in_progress': 2, 'completed': 1 };
        const sortedByPriority = requests.sort((a, b) => statusPriority[b.status] - statusPriority[a.status]);
        console.log('Returning revision request status:', sortedByPriority[0].status);
        return sortedByPriority[0].status;
    };

    // Group all revision requests first
    const allGroupedRequests = groupRevisionRequests(revisionRequests);

    // Filter grouped requests
    const groupedRequests = allGroupedRequests.filter(group => {
        const mostRecentRequest = getMostRecentRequest(group.requests);
        const groupStatus = getGroupStatus(group.requests, group.deliverable_status);

        const matchesSearch =
            group.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.feature_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mostRecentRequest.request_reason?.toLowerCase().includes(searchTerm.toLowerCase());

        // Check if status matches (including approved)
        let matchesStatus = filterStatus === 'all';
        if (filterStatus === 'approved') {
            matchesStatus = groupStatus === 'approved';
        } else if (filterStatus !== 'all') {
            matchesStatus = groupStatus === filterStatus;
        }

        return matchesSearch && matchesStatus;
    });

    // Format date for display
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

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (50MB limit)
            if (file.size > 50 * 1024 * 1024) {
                toast.error('File size must be less than 50MB');
                // Reset the file input
                event.target.value = '';
                return;
            }

            // Check file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/zip',
                'application/x-rar-compressed',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'video/mp4',
                'video/mov',
                'video/avi'
            ];

            if (!allowedTypes.includes(file.type)) {
                toast.error('File type not supported. Please upload PDF, DOC, ZIP, Images, or Videos.');
                event.target.value = '';
                return;
            }

            setSelectedFile(file);
            toast.success(`File "${file.name}" selected for upload`);
        }
    };

    // Handle file removal
    const handleFileRemove = () => {
        if (selectedFile) {
            toast.info(`File "${selectedFile.name}" removed`);
        }
        setSelectedFile(null);
        // Reset the file input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Handle link input
    const handleLinkInput = (event) => {
        setDeliverableLink(event.target.value);
    };

    // Handle status update with optional file upload
    const handleStatusUpdate = async (requestId, newStatus) => {
        setUpdatingStatus(true);
        setUploadingFile(true);

        try {
            // Validate that we have the required data for file upload
            if (selectedFile && (!selectedRequest.purchase_id || !selectedRequest.feature_name)) {
                throw new Error('Missing required data for file upload. Please refresh and try again.');
            }

            // If there's a file or link to upload, upload it first
            if (selectedFile || (uploadType === 'link' && deliverableLink.trim())) {
                console.log('Uploading revision deliverable:', {
                    uploadType,
                    fileName: selectedFile?.name,
                    fileSize: selectedFile?.size,
                    deliverableLink: uploadType === 'link' ? deliverableLink : null,
                    purchaseId: selectedRequest.purchase_id,
                    featureName: selectedRequest.feature_name,
                    selectedRequest: selectedRequest
                });

                // Validate required fields
                if (!selectedRequest.purchase_id || !selectedRequest.feature_name) {
                    throw new Error(`Missing required data: purchase_id=${selectedRequest.purchase_id}, feature_name=${selectedRequest.feature_name}`);
                }

                try {
                    let uploadResponse;

                    if (uploadType === 'files' && selectedFile) {
                        // Use FormData for file uploads
                        const formData = new FormData();
                        formData.append('purchaseId', selectedRequest.purchase_id);
                        formData.append('featureName', selectedRequest.feature_name);
                        formData.append('uploadType', uploadType);
                        formData.append('adminNotes', adminResponse || `Revision response: ${newStatus}`);
                        formData.append('files', selectedFile);

                        // Log FormData contents for debugging
                        console.log('FormData contents:');
                        for (let [key, value] of formData.entries()) {
                            console.log('  FormData entry:', key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
                        }

                        uploadResponse = await adminDeliverableApi.uploadDeliverable(formData);
                    } else if (uploadType === 'link' && deliverableLink.trim()) {
                        // Use JSON for link uploads
                        const linkData = {
                            purchaseId: selectedRequest.purchase_id,
                            featureName: selectedRequest.feature_name,
                            uploadType: uploadType,
                            adminNotes: adminResponse || `Revision response: ${newStatus}`,
                            deliverableLink: deliverableLink.trim()
                        };

                        console.log('Link upload data:', linkData);
                        uploadResponse = await adminDeliverableApi.uploadDeliverableLink(linkData);
                    }

                    console.log('Upload response:', uploadResponse);

                    if (uploadResponse.success) {
                        const uploadTypeText = uploadType === 'link' ? 'link deliverable' : 'file';
                        toast.success(`New ${uploadTypeText} uploaded (v${uploadResponse.data.versionNumber})`);
                    } else {
                        throw new Error(uploadResponse.message || 'Failed to upload deliverable');
                    }
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    toast.error(`Upload failed: ${uploadError.message}`);
                    return; // Don't proceed with status update if upload failed
                }
            }

            // Update the revision request status to 'completed' (submitted for review)
            // This means the admin has responded and the client needs to review
            try {
                const statusData = await apiService.put(`/revision-requests/admin/${requestId}/status`, {
                    status: 'completed', // Always set to 'completed' when admin responds
                    adminResponse: adminResponse || undefined
                });

                if (statusData.success) {
                    // If we uploaded a new file, the deliverable status will be 'pending' for client review
                    if (selectedFile || (uploadType === 'link' && deliverableLink.trim())) {
                        toast.success('Revision submitted successfully! Client will review the new version.');
                    } else {
                        toast.success('Response submitted successfully! Client will review.');
                    }

                    fetchRevisionRequests(); // Refresh the list
                    setShowResponseModal(false);
                    setAdminResponse("");
                    setSelectedRequest(null);
                    setSelectedFile(null);
                    setUploadType('files');
                    setDeliverableLink('');
                } else {
                    throw new Error(statusData.message || 'Failed to update status');
                }
            } catch (statusError) {
                console.error('Status update error:', statusError);
                toast.error(`Status update failed: ${statusError.message}`);
            }
        } catch (err) {
            console.error('Error in handleStatusUpdate:', err);
            console.error('Error details:', {
                message: err.message,
                stack: err.stack,
                response: err.response
            });
            toast.error(err.message || 'Failed to process revision request');
        } finally {
            setUpdatingStatus(false);
            setUploadingFile(false);
        }
    };

    // Handle view deliverable
    const handleViewDeliverable = (filePath) => {
        if (filePath) {
            const downloadUrl = adminDeliverableApi.downloadFile(filePath);
            window.open(downloadUrl, '_blank');
        } else {
            toast.error('No file available for this deliverable');
        }
    };

    // Handle preview deliverable
    const handlePreviewDeliverable = (filePath, featureName) => {
        if (filePath) {
            const fileName = filePath.split('/').pop() || 'deliverable';
            setSelectedPreviewFile({
                filePath: filePath,
                fileName: fileName,
                deliverableInfo: { feature_name: featureName }
            });
            setShowPreviewModal(true);
        } else {
            toast.error('No file available for preview');
        }
    };

    // Handle download deliverable - FORCE DOWNLOAD TO LOCAL MACHINE
    const handleDownloadDeliverable = async (filePath, featureName) => {
        if (!filePath) {
            toast.error('No file available for download');
            return;
        }

        try {
            const downloadUrl = adminDeliverableApi.downloadFile(filePath);
            const fileName = filePath.split('/').pop() || 'deliverable';
            console.log('Starting forced download for:', downloadUrl);

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
            link.download = fileName;
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
                console.log('Trying XMLHttpRequest fallback...');

                const downloadUrl = adminDeliverableApi.downloadFile(filePath);
                const fileName = filePath.split('/').pop() || 'deliverable';
                const xhr = new XMLHttpRequest();
                xhr.open('GET', downloadUrl, true);
                xhr.responseType = 'blob';

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
                        const blobUrl = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = fileName;
                        link.style.display = 'none';

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                        toast.success('Download started successfully');
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
                toast.error('Failed to download file. Please try again or contact support.');
            }
        }
    };

    // Handle view version history
    const handleViewVersionHistory = async (purchaseId, featureName) => {
        setLoadingHistory(true);
        setShowVersionHistory(true);
        try {
            const data = await adminDeliverableApi.getDeliverableHistory(purchaseId, featureName);

            if (data.success) {
                setVersionHistory(data.data || []);
            } else {
                throw new Error(data.message || 'Failed to fetch version history');
            }
        } catch (err) {
            console.error('Error fetching version history:', err);
            toast.error('Failed to load version history');
            setVersionHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    // Handle response modal
    const handleOpenResponseModal = (request, group) => {
        console.log('handleOpenResponseModal called with:', { request, group });

        // Create a combined object with all necessary data
        const selectedRequestData = {
            ...request,
            purchase_id: group.purchase_id,
            feature_name: group.feature_name,
            user_name: group.user_name,
            user_email: group.user_email,
            version_number: group.version_number,
            file_path: group.file_path,
            deliverable_status: group.deliverable_status
        };

        console.log('Created selectedRequestData:', selectedRequestData);

        setSelectedRequest(selectedRequestData);
        setAdminResponse(request.admin_response || "");
        setSelectedFile(null);
        setUploadType('files');
        setDeliverableLink('');
        setShowResponseModal(true);
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center space-x-2">
                                <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
                                <span className="text-gray-600">Loading revision requests...</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-red-600 mb-4">Error loading revision requests: {error}</p>
                                <Button onClick={fetchRevisionRequests} className="bg-black hover:bg-gray-800 text-white">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Retry
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">Revision Request Management</CardTitle>
                            <p className="text-gray-600 mt-1">
                                {groupedRequests.length} client-feature groups ({revisionRequests.length} total revision requests)
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                onClick={fetchRevisionRequests}
                                variant="outline"
                                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by client name, email, feature, or reason..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors font-medium"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Awaiting Response</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Submitted for Review</option>
                            <option value="approved">Approved by Client</option>
                        </select>
                    </div>

                    {/* Revision Requests Table */}
                    <div className="overflow-x-auto">
                        {groupedRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-lg">
                                    {revisionRequests.length === 0 ? 'No revision requests found' : 'No client-feature groups match your search criteria'}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Client</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Version</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Latest Request</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Total Versions</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedRequests.map((group) => {
                                        const mostRecentRequest = getMostRecentRequest(group.requests);
                                        const groupStatus = getGroupStatus(group.requests, group.deliverable_status);

                                        return (
                                            <tr key={`${group.user_id}_${group.feature_name}`} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {group.user_name || 'Unknown User'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {group.user_email || 'No email'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-gray-900 font-medium">
                                                        {group.feature_name || 'Unknown Feature'}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                        v{group.version_number || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="text-gray-700 text-sm max-w-xs truncate" title={mostRecentRequest.request_reason}>
                                                            {mostRecentRequest.request_reason || 'No reason provided'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(mostRecentRequest.requested_at)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className={`${getStatusColor(groupStatus)} text-white px-3 py-1 rounded-full`}>
                                                        {getStatusText(groupStatus)}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-center">
                                                        <Badge className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                                            {group.total_versions} version{group.total_versions !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex space-x-2">
                                                        {(() => {
                                                            console.log('Group data for actions:', {
                                                                groupKey: `${group.user_name}_${group.feature_name}`,
                                                                deliverable_link: group.deliverable_link,
                                                                file_path: group.file_path,
                                                                deliverableType: getDeliverableType(group)
                                                            });

                                                            if (group.deliverable_link) {
                                                                // Link deliverable - show Visit Link button
                                                                return (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl"
                                                                        onClick={() => window.open(group.deliverable_link, '_blank', 'noopener,noreferrer')}
                                                                        title="Visit Link"
                                                                    >
                                                                        <Globe className="w-4 h-4" />
                                                                    </Button>
                                                                );
                                                            } else {
                                                                // File deliverable - show Preview and View buttons
                                                                return (
                                                                    <>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl"
                                                                            onClick={() => handlePreviewDeliverable(group.file_path, group.feature_name)}
                                                                            title="Preview Deliverable"
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                        </Button>
                                                                    </>
                                                                );
                                                            }
                                                        })()}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white rounded-xl"
                                                            onClick={() => handleViewVersionHistory(group.purchase_id, group.feature_name)}
                                                            title="View Version History"
                                                        >
                                                            <History className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className={`border-2 rounded-xl ${groupStatus === 'approved' || groupStatus === 'completed'
                                                                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                                                : 'border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black'
                                                                }`}
                                                            onClick={() => handleOpenResponseModal(mostRecentRequest, group)}
                                                            disabled={groupStatus === 'approved' || groupStatus === 'completed'}
                                                            title={groupStatus === 'approved'
                                                                ? 'Deliverable already approved by client'
                                                                : groupStatus === 'completed'
                                                                    ? 'Revision submitted for review - waiting for client response'
                                                                    : 'Submit Revision Response'
                                                            }
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    {groupStatus === 'in_progress' && (
                                                        <div className="mt-2">
                                                            <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                Working on Revision
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Response Modal */}
            <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Submit Revision Response
                        </DialogTitle>
                        <p className="text-sm text-gray-600 mt-2">
                            Follow these simple steps to respond to the client's revision request
                        </p>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-6">
                            {/* Step 1: Review Request */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        1
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Review Client Request</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Client
                                        </label>
                                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                                            {selectedRequest.user_name} ({selectedRequest.user_email})
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Feature
                                        </label>
                                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                                            {selectedRequest.feature_name}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        What the client is asking for:
                                    </label>
                                    <div className="bg-white p-4 rounded-lg border border-orange-200 bg-orange-50">
                                        <p className="text-sm text-gray-800">
                                            {selectedRequest.request_reason || 'No specific request provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Choose Response Type */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        2
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Choose Your Response</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUploadType('files');
                                            setSelectedFile(null);
                                            setDeliverableLink('');
                                        }}
                                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${uploadType === 'files'
                                                ? 'border-[#f7e833] bg-[#f7e833]/10 shadow-lg'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center mb-3">
                                            <Upload className="w-6 h-6 mr-3 text-blue-500" />
                                            <span className="font-semibold text-gray-900">Upload New File</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Upload a revised version of the deliverable (PDF, DOC, ZIP, images, videos)
                                        </p>
                                        <div className="text-xs text-gray-500">
                                            • Max file size: 50MB<br />
                                            • Creates a new version<br />
                                            • Client will review and approve
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUploadType('link');
                                            setSelectedFile(null);
                                            setDeliverableLink('');
                                        }}
                                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${uploadType === 'link'
                                                ? 'border-[#f7e833] bg-[#f7e833]/10 shadow-lg'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center mb-3">
                                            <Globe className="w-6 h-6 mr-3 text-green-500" />
                                            <span className="font-semibold text-gray-900">Share Link</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Provide a link to the deliverable (Google Drive, Dropbox, etc.)
                                        </p>
                                        <div className="text-xs text-gray-500">
                                            • Must be publicly accessible<br />
                                            • Creates a new version<br />
                                            • Client will review and approve
                                        </div>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setUploadType('response');
                                        setSelectedFile(null);
                                        setDeliverableLink('');
                                    }}
                                    className={`w-full mt-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${uploadType === 'response'
                                            ? 'border-[#f7e833] bg-[#f7e833]/10 shadow-lg'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <MessageSquare className="w-6 h-6 mr-3 text-purple-500" />
                                        <div>
                                            <span className="font-semibold text-gray-900">Text Response Only</span>
                                            <p className="text-sm text-gray-600 ml-9">
                                                Just provide a response without uploading a new deliverable
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Step 3: Upload or Enter Link */}
                            {(uploadType === 'files' || uploadType === 'link') && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                            3
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {uploadType === 'files' ? 'Upload Your File' : 'Enter Your Link'}
                                        </h3>
                                    </div>

                                    {uploadType === 'files' && (
                                        <div className="space-y-4">
                                            {!selectedFile ? (
                                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#f7e833] transition-colors bg-white">
                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        onChange={handleFileSelect}
                                                        accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="file-upload" className="cursor-pointer block">
                                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <Upload className="w-8 h-8 text-blue-500" />
                                                        </div>
                                                        <p className="text-lg font-medium text-gray-900 mb-2">
                                                            Click to upload your file
                                                        </p>
                                                        <p className="text-sm text-gray-600 mb-4">
                                                            or drag and drop it here
                                                        </p>
                                                        <div className="bg-gray-100 rounded-lg p-3 inline-block">
                                                            <p className="text-xs text-gray-600">
                                                                <strong>Supported formats:</strong> PDF, DOC, DOCX, ZIP, RAR<br />
                                                                <strong>Images:</strong> JPG, PNG, GIF<br />
                                                                <strong>Videos:</strong> MP4, MOV, AVI<br />
                                                                <strong>Max size:</strong> 50MB
                                                            </p>
                                                        </div>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="border border-green-200 rounded-xl p-6 bg-white">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                                <FileText className="w-6 h-6 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {selectedFile.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                                <p className="text-xs text-green-600 font-medium">
                                                                    ✓ File ready for upload
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={handleFileRemove}
                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {uploadType === 'link' && (
                                        <div className="space-y-4">
                                            <div className="bg-white rounded-xl p-6 border">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Enter the link to your deliverable:
                                                </label>
                                                <input
                                                    type="url"
                                                    value={deliverableLink}
                                                    onChange={handleLinkInput}
                                                    placeholder="https://drive.google.com/file/d/... or https://dropbox.com/s/..."
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors"
                                                />
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-gray-700">
                                                        <strong>💡 Tip:</strong> Make sure your link is publicly accessible.
                                                        For Google Drive, use "Share" → "Anyone with the link can view".
                                                    </p>
                                                </div>
                                                {deliverableLink.trim() && (
                                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <p className="text-sm text-green-700 font-medium">
                                                            ✓ Link ready for upload
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 4: Add Response Message */}
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        {uploadType === 'response' ? '3' : '4'}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Add Your Response</h3>
                                </div>

                                <div className="bg-white rounded-xl p-4 border">
                                    <Textarea
                                        value={adminResponse}
                                        onChange={(e) => setAdminResponse(e.target.value)}
                                        placeholder="Explain what you've done to address the client's request, or provide any additional information..."
                                        className="min-h-[120px] resize-none border-0 focus:ring-0"
                                    />
                                </div>

                                <div className="mt-3 p-3 bg-purple-100 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <strong>💡 Tip:</strong> Be clear and specific about what changes you've made or what you're providing to the client.
                                    </p>
                                </div>
                            </div>

                            {/* Step 5: Review and Submit */}
                            <div className="bg-[#f7e833] bg-opacity-20 border border-[#f7e833] rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-[#f7e833] text-black rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        {uploadType === 'response' ? '4' : '5'}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Review and Submit</h3>
                                </div>

                                <div className="bg-white rounded-xl p-4 border mb-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Response type:</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {uploadType === 'files' && 'File Upload'}
                                                {uploadType === 'link' && 'Link Share'}
                                                {uploadType === 'response' && 'Text Response Only'}
                                            </span>
                                        </div>

                                        {(uploadType === 'files' && selectedFile) && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">File to upload:</span>
                                                <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                                            </div>
                                        )}

                                        {(uploadType === 'link' && deliverableLink.trim()) && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Link to share:</span>
                                                <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                    {deliverableLink.length > 30 ? deliverableLink.substring(0, 30) + '...' : deliverableLink}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Response message:</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {adminResponse ? `${adminResponse.length} characters` : 'No message'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                                    disabled={updatingStatus ||
                                        (uploadType === 'files' && !selectedFile) ||
                                        (uploadType === 'link' && !deliverableLink.trim()) ||
                                        (!selectedRequest.purchase_id || !selectedRequest.feature_name)}
                                    className="w-full bg-[#f7e833] hover:bg-yellow-400 text-black py-4 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updatingStatus ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-3" />
                                            {uploadType === 'response'
                                                ? 'Send Response to Client'
                                                : 'Upload & Send to Client for Review'
                                            }
                                        </>
                                    )}
                                </Button>

                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <strong>📋 What happens next:</strong>
                                        {uploadType === 'response'
                                            ? ' Your response will be sent to the client immediately.'
                                            : ' The new version will be uploaded and sent to the client for review and approval.'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Debug Info - Only show in development */}
                            {import.meta.env.DEV && (
                                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                                    <p className="text-xs font-medium text-gray-700 mb-2">Debug Info:</p>
                                    <p className="text-xs text-gray-600">Purchase ID: {selectedRequest.purchase_id || 'Missing'}</p>
                                    <p className="text-xs text-gray-600">Feature Name: {selectedRequest.feature_name || 'Missing'}</p>
                                    <p className="text-xs text-gray-600">Deliverable ID: {selectedRequest.deliverable_id || 'Missing'}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Version History Modal */}
            <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
                <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Deliverable Version History
                        </DialogTitle>
                    </DialogHeader>

                    {loadingHistory ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center space-x-2">
                                <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
                                <span className="text-gray-600">Loading version history...</span>
                            </div>
                        </div>
                    ) : versionHistory.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No version history found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {versionHistory.map((version) => (
                                <div key={version.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                v{version.version_number}
                                            </Badge>
                                            <Badge className={`${getStatusColor(version.status)} text-white px-2 py-1 rounded-full`}>
                                                {getStatusText(version.status)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(version.uploaded_at)}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Uploaded by:</p>
                                            <p className="text-sm text-gray-600">{version.uploaded_by_name || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {version.deliverable_link ? 'Link:' : 'File:'}
                                            </p>
                                            <p className="text-sm text-gray-600 truncate">
                                                {version.deliverable_link || version.file_path?.split('/').pop() || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {version.admin_notes && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{version.admin_notes}</p>
                                        </div>
                                    )}

                                    {version.client_revision_comment && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-700">Client Revision Request:</p>
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
                                        {(() => {
                                            console.log('Version data for actions:', {
                                                versionId: version.id,
                                                deliverable_link: version.deliverable_link,
                                                file_path: version.file_path,
                                                deliverableType: getDeliverableType(version)
                                            });

                                            if (version.deliverable_link) {
                                                // Link deliverable - show Visit Link button
                                                return (
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-2xl font-semibold transition-all duration-200"
                                                        onClick={() => window.open(version.deliverable_link, '_blank', 'noopener,noreferrer')}
                                                        title="Visit Link"
                                                    >
                                                        <Globe className="w-4 h-4 mr-2" />
                                                        Visit Link
                                                    </Button>
                                                );
                                            } else {
                                                // File deliverable - show Preview, View and Download buttons
                                                return (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex-1 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-3 rounded-2xl font-semibold transition-all duration-200"
                                                            onClick={() => handlePreviewDeliverable(version.file_path, version.feature_name)}
                                                            title="Preview File"
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Preview
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-2xl font-semibold transition-all duration-200"
                                                            onClick={() => handleDownloadDeliverable(version.file_path, version.feature_name)}
                                                            title="Download File"
                                                        >
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    </>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* File Preview Modal */}
            {selectedPreviewFile && (
                <FilePreviewModal
                    isOpen={showPreviewModal}
                    onClose={() => {
                        setShowPreviewModal(false);
                        setSelectedPreviewFile(null);
                    }}
                    filePath={selectedPreviewFile.filePath}
                    fileName={selectedPreviewFile.fileName}
                    deliverableInfo={selectedPreviewFile.deliverableInfo}
                />
            )}
        </div>
    );
}
