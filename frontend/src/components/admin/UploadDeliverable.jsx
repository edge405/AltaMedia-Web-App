import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Link, X, FileText, Globe } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/utils/api';
import { adminDeliverableApi } from '@/utils/adminDeliverableApi';

export default function UploadDeliverable() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedFeature, setSelectedFeature] = useState('');
    const [uploadType, setUploadType] = useState('files'); // 'files' or 'link'
    const [selectedFile, setSelectedFile] = useState(null);
    const [deliverableLink, setDeliverableLink] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch clients on component mount
    useEffect(() => {
        fetchClients();
    }, []);

    // Reset feature selection when client changes
    useEffect(() => {
        setSelectedFeature('');
    }, [selectedClient]);

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

    // Get features from selected client
    const getClientFeatures = () => {
        if (!selectedClient) return [];
        const client = clients.find(c => c.id === parseInt(selectedClient));
        if (!client || !client.features) return [];



        // Handle different feature data structures
        if (Array.isArray(client.features)) {
            // If features is an array of objects with feature_name property
            return client.features.map(feature => {
                if (typeof feature === 'string') {
                    return feature;
                } else if (feature && typeof feature === 'object') {
                    return feature.feature_name || feature.name || feature;
                }
                return feature;
            });
        } else if (typeof client.features === 'object') {
            // If features is an object with feature objects
            return Object.values(client.features).map(feature => {
                if (typeof feature === 'string') {
                    return feature;
                } else if (feature && typeof feature === 'object') {
                    return feature.feature_name || feature.name || feature;
                }
                return feature;
            });
        }

        return [];
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
            toast.success(`File "${file.name}" selected`);
        }
    };

    // Handle file removal
    const handleFileRemove = () => {
        setSelectedFile(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Handle upload
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
                const formData = new FormData();
                formData.append('purchaseId', selectedClient);
                formData.append('featureName', selectedFeature);
                formData.append('uploadType', uploadType);
                formData.append('adminNotes', adminNotes);
                formData.append('files', selectedFile);

                uploadResponse = await adminDeliverableApi.uploadDeliverable(formData);
            } else if (uploadType === 'link' && deliverableLink.trim()) {
                const linkData = {
                    purchaseId: selectedClient,
                    featureName: selectedFeature,
                    uploadType: uploadType,
                    adminNotes: adminNotes,
                    deliverableLink: deliverableLink.trim()
                };

                uploadResponse = await adminDeliverableApi.uploadDeliverableLink(linkData);
            }

            if (uploadResponse.success) {
                toast.success(`Deliverable uploaded successfully! (v${uploadResponse.data.versionNumber})`);

                // Reset form
                setSelectedFile(null);
                setDeliverableLink('');
                setAdminNotes('');
                setSelectedFeature('');
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

    return (
        <Card className="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader className="p-6 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-black">Upload Deliverable</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-5">
                    {/* Client Selection */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Client</label>
                        <Select value={selectedClient} onValueChange={setSelectedClient}>
                            <SelectTrigger className="w-full border-gray-300 focus:border-[#f7e833] focus:ring-[#f7e833]">
                                <SelectValue placeholder="Select a client..." />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                        {client.user_name || client.user_email} - {client.package_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Feature Selection */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Feature</label>
                        <Select
                            value={selectedFeature}
                            onValueChange={setSelectedFeature}
                            disabled={!selectedClient}
                        >
                            <SelectTrigger className={`w-full border-gray-300 focus:border-[#f7e833] focus:ring-[#f7e833] ${!selectedClient ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                                <SelectValue placeholder={selectedClient ? "Select a feature..." : "Select a client first..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {getClientFeatures().map((feature) => (
                                    <SelectItem key={feature} value={feature}>
                                        {feature}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Upload Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-3">Upload Type</label>
                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant={uploadType === 'files' ? 'default' : 'outline'}
                                onClick={() => setUploadType('files')}
                                className={`flex-1 h-10 ${uploadType === 'files'
                                    ? 'bg-[#f7e833] hover:bg-yellow-400 text-black border-[#f7e833]'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Files
                            </Button>
                            <Button
                                type="button"
                                variant={uploadType === 'link' ? 'default' : 'outline'}
                                onClick={() => setUploadType('link')}
                                className={`flex-1 h-10 ${uploadType === 'link'
                                    ? 'bg-[#f7e833] hover:bg-yellow-400 text-black border-[#f7e833]'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Link className="w-4 h-4 mr-2" />
                                Link
                            </Button>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    {uploadType === 'files' && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">File</label>
                            {!selectedFile ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#f7e833] transition-colors">
                                    <div className="w-10 h-10 bg-[#f7e833] rounded-lg flex items-center justify-center mx-auto mb-2">
                                        <Upload className="w-5 h-5 text-black" />
                                    </div>
                                    <p className="text-sm font-medium text-black mb-1">Drop file here or click to upload</p>
                                    <p className="text-xs text-gray-500 mb-3">Max 50MB - PDF, DOC, ZIP, Images, Videos</p>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => document.getElementById('file-upload').click()}
                                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Choose File
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-[#f7e833] rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-black" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-black text-sm">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleFileRemove}
                                        size="sm"
                                        variant="outline"
                                        className="border-red-300 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Link Input Section */}
                    {uploadType === 'link' && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">External Link</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="url"
                                    placeholder="https://example.com/deliverable"
                                    value={deliverableLink}
                                    onChange={(e) => setDeliverableLink(e.target.value)}
                                    className="pl-10 border-gray-300 focus:border-[#f7e833] focus:ring-[#f7e833]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Admin Notes */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Admin Notes (Optional)</label>
                        <Textarea
                            placeholder="Add any notes about this deliverable..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="resize-none border-gray-300 focus:border-[#f7e833] focus:ring-[#f7e833]"
                            rows={3}
                        />
                    </div>

                    {/* Upload Button */}
                    <Button
                        onClick={handleUpload}
                        disabled={uploading || !selectedClient || !selectedFeature ||
                            (uploadType === 'files' && !selectedFile) ||
                            (uploadType === 'link' && !deliverableLink.trim())}
                        className="w-full bg-[#f7e833] hover:bg-yellow-400 text-black font-medium py-2.5 rounded-lg disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        {uploading ? 'Uploading...' : 'Upload Deliverable'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
