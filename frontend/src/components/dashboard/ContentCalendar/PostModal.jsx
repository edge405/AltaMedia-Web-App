import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image, Video, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';

export default function PostModal({ isOpen, onClose, post, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        status: 'draft',
        media: []
    });

    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Initialize form data when editing
    useEffect(() => {
        if (post) {
            const postDate = new Date(post.date);
            setFormData({
                title: post.title || '',
                description: post.description || '',
                date: postDate.toISOString().split('T')[0],
                time: postDate.toTimeString().slice(0, 5),
                status: post.status || 'draft',
                media: post.media || []
            });
        } else {
            // Set default values for new post
            const now = new Date();
            setFormData({
                title: '',
                description: '',
                date: now.toISOString().split('T')[0],
                time: now.toTimeString().slice(0, 5),
                status: 'draft',
                media: []
            });
        }
        setErrors({});
    }, [post, isOpen]);



    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };



    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        setIsUploading(true);

        try {
            const newMedia = await Promise.all(
                files.map(async (file) => {
                    // Simulate file upload - in real app, upload to server/cloud storage
                    const reader = new FileReader();
                    return new Promise((resolve) => {
                        reader.onload = (e) => {
                            resolve({
                                id: Date.now() + Math.random(),
                                name: file.name,
                                type: file.type.startsWith('image/') ? 'image' : 'video',
                                url: e.target.result,
                                size: file.size,
                                uploadedAt: new Date().toISOString()
                            });
                        };
                        reader.readAsDataURL(file);
                    });
                })
            );

            setFormData(prev => ({
                ...prev,
                media: [...prev.media, ...newMedia]
            }));


        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('Failed to upload files');
        } finally {
            setIsUploading(false);
        }
    };

    const removeMedia = (mediaId) => {
        setFormData(prev => ({
            ...prev,
            media: prev.media.filter(media => media.id !== mediaId)
        }));


    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };



    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        if (!formData.time) {
            newErrors.time = 'Time is required';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Combine date and time
        const dateTime = new Date(`${formData.date}T${formData.time}`);

        const postData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            date: dateTime.toISOString(),
            status: formData.status,
            media: formData.media
        };

        onSave(postData);
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            status: 'draft',
            media: []
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {post ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter post title"
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter post description"
                            rows={3}
                        />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className={errors.date ? 'border-red-500' : ''}
                            />
                            {errors.date && (
                                <p className="text-sm text-red-600">{errors.date}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Time *</Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                                className={errors.time ? 'border-red-500' : ''}
                            />
                            {errors.time && (
                                <p className="text-sm text-red-600">{errors.time}</p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="posted">Posted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-2">
                        <Label>Media Files</Label>
                        <div className="space-y-3">
                            {/* Upload Button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={triggerFileUpload}
                                disabled={isUploading}
                                className="w-full"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {isUploading ? 'Uploading...' : 'Upload Images/Videos'}
                            </Button>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            {/* Media Preview */}
                            {formData.media.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {formData.media.map((media) => (
                                        <div key={media.id} className="relative group">
                                            {media.type === 'image' ? (
                                                <img
                                                    src={media.url}
                                                    alt={media.name}
                                                    className="w-full h-24 object-cover rounded-md"
                                                />
                                            ) : (
                                                <video
                                                    src={media.url}
                                                    className="w-full h-24 object-cover rounded-md"
                                                    muted
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeMedia(media.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="absolute bottom-1 left-1">
                                                {media.type === 'image' ? (
                                                    <Image className="w-3 h-3 text-white" />
                                                ) : (
                                                    <Video className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Modal Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {post ? 'Update Post' : 'Create Post'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
