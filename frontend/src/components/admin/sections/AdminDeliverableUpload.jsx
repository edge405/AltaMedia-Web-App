import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Upload,
    Users,
    Package,
    FileText,
    Globe,
    Send,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    X,
    Plus,
    Download,
    Eye,
    ArrowRight,
    Clock
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/utils/api';
import { adminDeliverableApi } from '@/utils/adminDeliverableApi';

export default function AdminDeliverableUpload() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [uploadType, setUploadType] = useState('files'); // 'files' or 'link'
    const [selectedFile, setSelectedFile] = useState(null);
    const [deliverableLink, setDeliverableLink] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [recentUploads, setRecentUploads] = useState([]);

    // Fetch all clients with packages
    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await apiService.get('/user-package/admin/all');
            if (response.success) {
                setClients(response.data.packages || []);
            } else {
                throw new Error(response.message || 'Failed to fetch clients');
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Handle client selection
    const handleClientSelect = (clientId) => {
        const client = clients.find(c => c.id === parseInt(clientId));
        setSelectedClient(client);
        setSelectedFeature(null); // Reset feature selection
    };

    // Handle feature selection
    const handleFeatureSelect = (featureName) => {
        setSelectedFeature(featureName);
    };

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (50MB limit)
            if (file.size > 50 * 1024 * 1024) {
                toast.error('File size must be less than 50MB');
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
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Handle link input
    const handleLinkInput = (event) => {
        setDeliverableLink(event.target.value);
    };

    // Handle deliverable upload
    const handleUpload = async () => {
        if (!selectedClient || !selectedFeature) {
            toast.error('Please select a client and feature');
            return;
        }

        if (uploadType === 'files' && !selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }

        if (uploadType === 'link' && !deliverableLink.trim()) {
            toast.error('Please enter a valid link');
            return;
        }

        setUploading(true);

        try {
            let uploadResponse;

            if (uploadType === 'files' && selectedFile) {
                // Use FormData for file uploads
                const formData = new FormData();
                formData.append('purchaseId', selectedClient.id);
                formData.append('featureName', selectedFeature);
                formData.append('uploadType', uploadType);
                formData.append('adminNotes', adminNotes);
                formData.append('files', selectedFile);

                uploadResponse = await adminDeliverableApi.uploadDeliverable(formData);
            } else if (uploadType === 'link' && deliverableLink.trim()) {
                // Use JSON for link uploads
                const linkData = {
                    purchaseId: selectedClient.id,
                    featureName: selectedFeature,
                    uploadType: uploadType,
                    adminNotes: adminNotes,
                    deliverableLink: deliverableLink.trim()
                };

                uploadResponse = await adminDeliverableApi.uploadDeliverableLink(linkData);
            }

            if (uploadResponse.success) {
                const uploadTypeText = uploadType === 'link' ? 'link deliverable' : 'file';
                toast.success(`Deliverable uploaded successfully! (v${uploadResponse.data.versionNumber})`);

                // Add to recent uploads
                const newUpload = {
                    id: uploadResponse.data.id,
                    clientName: selectedClient.user_name || selectedClient.user_email,
                    featureName: selectedFeature,
                    uploadType: uploadType,
                    fileName: selectedFile?.name || 'External Link',
                    versionNumber: uploadResponse.data.versionNumber,
                    uploadedAt: new Date().toISOString()
                };

                setRecentUploads(prev => [newUpload, ...prev.slice(0, 4)]); // Keep last 5

                // Reset form
                setSelectedFile(null);
                setDeliverableLink('');
                setAdminNotes('');
                setSelectedFeature(null);
                const fileInput = document.getElementById('file-upload');
                if (fileInput) {
                    fileInput.value = '';
                }
            } else {
                throw new Error(uploadResponse.message || 'Failed to upload deliverable');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    // Get features from selected client
    const getClientFeatures = () => {
        if (!selectedClient) return [];
        try {
            const features = typeof selectedClient.features === 'string'
                ? JSON.parse(selectedClient.features)
                : selectedClient.features;
            return features || [];
        } catch (error) {
            console.error('Error parsing features:', error);
            return [];
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

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Loading clients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Upload Deliverables</h1>
                <p className="text-gray-600">Upload files or links for your clients' projects</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Upload Form */}
                <div className="xl:col-span-3">
                    <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-white" />
                                </div>
                                New Deliverable
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Client & Feature Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Client</label>
                                    <Select onValueChange={handleClientSelect} value={selectedClient?.id?.toString() || ''}>
                                        <SelectTrigger className="h-12 border-gray-200 rounded-xl bg-white/50">
                                            <SelectValue placeholder="Select client..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">
                                                            {client.user_name || client.user_email}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {client.package_name}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Feature</label>
                                    <Select onValueChange={handleFeatureSelect} value={selectedFeature || ''}>
                                        <SelectTrigger className="h-12 border-gray-200 rounded-xl bg-white/50">
                                            <SelectValue placeholder="Select feature..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getClientFeatures().map((feature) => (
                                                <SelectItem key={feature.feature_id} value={feature.feature_name}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{feature.feature_name}</span>
                                                        <span className="text-sm text-gray-500">
                                                            {feature.description}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Upload Type Toggle */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Upload Type</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setUploadType('files')}
                                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${uploadType === 'files'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Upload className="w-5 h-5" />
                                        <span className="font-medium">Upload File</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadType('link')}
                                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${uploadType === 'link'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Globe className="w-5 h-5" />
                                        <span className="font-medium">External Link</span>
                                    </button>
                                </div>
                            </div>

                            {/* File Upload Area */}
                            {uploadType === 'files' && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">File</label>
                                    {!selectedFile ? (
                                        <div className="relative">
                                            <input
                                                id="file-upload"
                                                type="file"
                                                onChange={handleFileSelect}
                                                accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 bg-white/50"
                                            >
                                                <div className="space-y-4">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                                                        <Upload className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-900 mb-2">
                                                            Drop your file here
                                                        </p>
                                                        <p className="text-gray-500 mb-4">
                                                            or click to browse
                                                        </p>
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                                            <FileText className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm text-gray-600">
                                                                PDF, DOC, ZIP, Images, Videos (max 50MB)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="border border-green-200 rounded-xl p-6 bg-green-50/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-6 h-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {selectedFile.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm text-green-600 font-medium">
                                                                Ready for upload
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={handleFileRemove}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Link Upload Area */}
                            {uploadType === 'link' && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">External Link</label>
                                    <div className="space-y-3">
                                        <input
                                            type="url"
                                            value={deliverableLink}
                                            onChange={handleLinkInput}
                                            placeholder="https://drive.google.com/file/d/..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                                        />
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Globe className="w-4 h-4" />
                                            <span>Google Drive, Dropbox, or any public URL</span>
                                        </div>
                                        {deliverableLink.trim() && (
                                            <div className="flex items-center gap-2 text-sm text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Link ready for upload</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                                <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add any notes or comments about this deliverable..."
                                    className="min-h-[100px] resize-none border border-gray-200 rounded-xl bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleUpload}
                                disabled={uploading ||
                                    (uploadType === 'files' && !selectedFile) ||
                                    (uploadType === 'link' && !deliverableLink.trim())
                                }
                                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-3" />
                                        Upload Deliverable
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Uploads Sidebar */}
                <div className="xl:col-span-1">
                    <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm h-fit">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                Recent Uploads
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentUploads.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-sm">No recent uploads</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentUploads.map((upload) => (
                                        <div key={upload.id} className="p-4 border border-gray-100 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    v{upload.versionNumber}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(upload.uploadedAt)}
                                                </span>
                                            </div>
                                            <p className="font-medium text-gray-900 text-sm mb-1">
                                                {upload.clientName}
                                            </p>
                                            <p className="text-xs text-gray-600 mb-3">
                                                {upload.featureName}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {upload.uploadType === 'link' ? (
                                                    <Globe className="w-3 h-3 text-blue-500" />
                                                ) : (
                                                    <FileText className="w-3 h-3 text-green-500" />
                                                )}
                                                <span className="text-xs text-gray-500 truncate">
                                                    {upload.uploadType === 'link' ? 'External Link' : upload.fileName}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
