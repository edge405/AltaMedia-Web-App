import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Edit, Save, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/utils/api';

export default function AdminFeatureManagement({ packageId }) {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFeature, setEditingFeature] = useState(null);
    const [newFeature, setNewFeature] = useState({
        feature_name: '',
        feature_description: '',
        status: 'active'
    });

    useEffect(() => {
        if (packageId) {
            fetchFeatures();
        }
    }, [packageId]);

    const fetchFeatures = async () => {
        try {
            setLoading(true);
            const response = await apiService.getPackageFeatures(packageId);
            if (response.success) {
                setFeatures(response.data.features);
            } else {
                toast.error('Failed to fetch features');
            }
        } catch (error) {
            console.error('Error fetching features:', error);
            toast.error('Error loading features');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (featureId, newStatus) => {
        try {
            const response = await apiService.updateFeatureStatus(featureId, newStatus);
            if (response.success) {
                toast.success('Feature status updated successfully');
                fetchFeatures(); // Refresh the list
            } else {
                toast.error('Failed to update feature status');
            }
        } catch (error) {
            console.error('Error updating feature status:', error);
            toast.error('Error updating feature status');
        }
    };

    const handleCreateFeature = async () => {
        if (!newFeature.feature_name.trim()) {
            toast.error('Feature name is required');
            return;
        }

        try {
            const response = await apiService.createFeature({
                package_id: packageId,
                ...newFeature
            });
            if (response.success) {
                toast.success('Feature created successfully');
                setNewFeature({
                    feature_name: '',
                    feature_description: '',
                    status: 'active'
                });
                fetchFeatures(); // Refresh the list
            } else {
                toast.error('Failed to create feature');
            }
        } catch (error) {
            console.error('Error creating feature:', error);
            toast.error('Error creating feature');
        }
    };

    const handleUpdateFeature = async (featureId, updatedData) => {
        try {
            const response = await apiService.updateFeature(featureId, updatedData);
            if (response.success) {
                toast.success('Feature updated successfully');
                setEditingFeature(null);
                fetchFeatures(); // Refresh the list
            } else {
                toast.error('Failed to update feature');
            }
        } catch (error) {
            console.error('Error updating feature:', error);
            toast.error('Error updating feature');
        }
    };

    const handleDeleteFeature = async (featureId) => {
        if (!confirm('Are you sure you want to delete this feature?')) {
            return;
        }

        try {
            const response = await apiService.deleteFeature(featureId);
            if (response.success) {
                toast.success('Feature deleted successfully');
                fetchFeatures(); // Refresh the list
            } else {
                toast.error('Failed to delete feature');
            }
        } catch (error) {
            console.error('Error deleting feature:', error);
            toast.error('Error deleting feature');
        }
    };

    const getStatusColor = (status) => {
        const colorMap = {
            'active': 'bg-green-500 text-white',
            'inactive': 'bg-gray-500 text-white',
            'pending': 'bg-orange-500 text-white',
            'deprecated': 'bg-red-500 text-white'
        };
        return colorMap[status] || 'bg-gray-500 text-white';
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">Loading features...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Package Features Management</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Create New Feature */}
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <h3 className="font-semibold mb-3">Add New Feature</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                            type="text"
                            placeholder="Feature name"
                            value={newFeature.feature_name}
                            onChange={(e) => setNewFeature({ ...newFeature, feature_name: e.target.value })}
                            className="px-3 py-2 border rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newFeature.feature_description}
                            onChange={(e) => setNewFeature({ ...newFeature, feature_description: e.target.value })}
                            className="px-3 py-2 border rounded-md"
                        />
                        <Select
                            value={newFeature.status}
                            onValueChange={(value) => setNewFeature({ ...newFeature, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="deprecated">Deprecated</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleCreateFeature} className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Add Feature</span>
                        </Button>
                    </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                    <h3 className="font-semibold">Existing Features</h3>
                    {features.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No features found for this package.
                        </div>
                    ) : (
                        features.map((feature) => (
                            <div key={feature.feature_id} className="border rounded-lg p-4">
                                {editingFeature === feature.feature_id ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Feature name"
                                                defaultValue={feature.feature_info.feature_name}
                                                className="px-3 py-2 border rounded-md"
                                                id={`name-${feature.feature_id}`}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                defaultValue={feature.feature_info.feature_description}
                                                className="px-3 py-2 border rounded-md"
                                                id={`desc-${feature.feature_id}`}
                                            />
                                            <Select
                                                defaultValue={feature.feature_info.status}
                                                onValueChange={(value) => {
                                                    const nameInput = document.getElementById(`name-${feature.feature_id}`);
                                                    const descInput = document.getElementById(`desc-${feature.feature_id}`);
                                                    handleUpdateFeature(feature.feature_id, {
                                                        feature_name: nameInput.value,
                                                        feature_description: descInput.value,
                                                        status: value
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="deprecated">Deprecated</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() => setEditingFeature(null)}
                                                variant="outline"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h4 className="font-medium">{feature.feature_info.feature_name}</h4>
                                                <Badge className={getStatusColor(feature.feature_info.status)}>
                                                    {feature.feature_info.status}
                                                </Badge>
                                            </div>
                                            {feature.feature_info.feature_description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {feature.feature_info.feature_description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() => setEditingFeature(feature.feature_id)}
                                                variant="outline"
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleDeleteFeature(feature.feature_id)}
                                                variant="outline"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
