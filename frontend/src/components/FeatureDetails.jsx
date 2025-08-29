import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    ExternalLink,
    MessageSquare,
    FileText,
    Eye,
    ThumbsUp,
    BarChart3,
    Globe,
    Calendar,
    Play,
    Zap,
    Package,
    PhilippinePeso,
    CheckCircle,
    X,
    AlertCircle,
    FileEdit
} from 'lucide-react';
import { toast } from 'sonner';

export default function FeatureDetails({
    feature,
    onBack,
    isDarkMode = false,
    onAddComment,
    newComment,
    setNewComment
}) {
    const getIconComponent = (iconName) => {
        const iconMap = {
            "BarChart3": <BarChart3 className="w-4 h-4 text-white" />,
            "Globe": <Globe className="w-4 h-4 text-white" />,
            "FileText": <FileText className="w-4 h-4 text-white" />,
            "Calendar": <Calendar className="w-4 h-4 text-white" />,
            "Play": <Play className="w-4 h-4 text-white" />,
            "Zap": <Zap className="w-4 h-4 text-white" />,
            "Package": <Package className="w-4 h-4 text-white" />,
            "PhilippinePeso": <PhilippinePeso className="w-4 h-4 text-white" />
        };
        return iconMap[iconName] || <CheckCircle className="w-4 h-4 text-white" />;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed": return "bg-green-500 hover:bg-green-600";
            case "In Progress": return "bg-blue-500 hover:bg-blue-600";
            case "Pending": return "bg-gray-500 hover:bg-gray-600";
            case "Active": return "bg-green-500 hover:bg-green-600";
            default: return "bg-yellow-500 hover:bg-yellow-600";
        }
    };



    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        // Call the parent component's handleAddComment function
        // which will handle the API call and state updates
        await onAddComment(feature.id, newComment.trim());
    };

    const handleOutputConfirmation = async (outputId, action) => {
        try {
            // This would typically call an API to update the output status
            // For now, we'll show a toast notification
            if (action === 'approved') {
                toast.success('Output approved successfully!');
            } else if (action === 'rejected') {
                toast.error('Output rejected. Admin will be notified for revisions.');
            }

            // Here you would typically update the output status via API
            // await apiService.updateOutputStatus(outputId, action);

        } catch (error) {
            console.error('Error updating output status:', error);
            toast.error('Failed to update output status. Please try again.');
        }
    };

    const handleRequestRevision = async (outputId) => {
        try {
            // This would typically open a modal or form to request revision
            toast.info('Revision request sent to admin. They will review your feedback.');

            // Here you would typically send a revision request via API
            // await apiService.requestRevision(outputId, revisionNotes);

        } catch (error) {
            console.error('Error requesting revision:', error);
            toast.error('Failed to send revision request. Please try again.');
        }
    };

    return (
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Package
                        </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${feature.status === "Completed" ? "bg-green-500" :
                        feature.status === "In Progress" ? "bg-blue-500" :
                            feature.status === "Pending" ? "bg-gray-500" :
                                feature.status === "Active" ? "bg-green-500" :
                                    "bg-yellow-500"
                        }`}>
                        {typeof feature.icon === 'string' ? getIconComponent(feature.icon) : feature.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {feature.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {feature.description}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Status Section */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                        <Badge className={`${getStatusColor(feature.status)}`}>
                            {feature.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.output}
                    </p>
                </div>

                {/* Outputs Section */}
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Outputs & Deliverables</h4>
                    <div className="space-y-3">
                        {feature.outputs && feature.outputs.length > 0 ? (
                            feature.outputs.map((output) => (
                                <div key={output.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100">{output.title}</h5>
                                        <Badge className={`text-xs ${output.status === "Live" ? "bg-green-500" :
                                            output.status === "Scheduled" ? "bg-blue-500" :
                                                output.status === "In Development" ? "bg-yellow-500" :
                                                    output.status === "Pending Approval" ? "bg-orange-500" :
                                                        output.status === "Approved" ? "bg-green-500" :
                                                            output.status === "Rejected" ? "bg-red-500" :
                                                                "bg-gray-500"
                                            }`}>
                                            {output.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{output.description}</p>

                                    {/* Confirmation Section - Show only for outputs that need approval */}
                                    {output.status === "Pending Approval" && (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                    Admin has sent an output for your review
                                                </span>
                                            </div>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                                                Please review the output and confirm if it meets your requirements.
                                            </p>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-xs"
                                                    onClick={() => handleOutputConfirmation(output.id, 'approved')}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 px-4 py-1 text-xs"
                                                    onClick={() => handleOutputConfirmation(output.id, 'rejected')}
                                                >
                                                    <X className="w-3 h-3 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Approval Status Display */}
                                    {output.status === "Approved" && (
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                                    Output approved on {output.approvedDate || 'recently'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {output.status === "Rejected" && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                                    Output rejected on {output.rejectedDate || 'recently'}
                                                </span>
                                            </div>
                                            {output.rejectionReason && (
                                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                                    Reason: {output.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Updated: {output.lastUpdated}</span>
                                        <div className="flex items-center space-x-2">
                                            {output.url && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                    onClick={() => window.open(output.url, '_blank')}
                                                >
                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                    View
                                                </Button>
                                            )}
                                            {output.status === "Pending Approval" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                                    onClick={() => handleRequestRevision(output.id)}
                                                >
                                                    <FileEdit className="w-3 h-3 mr-1" />
                                                    Request Revision
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No outputs available yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feedback Section */}
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Feedback & Comments</h4>
                    <div className="space-y-3">
                        {/* Add Comment */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center space-x-2 mb-3">
                                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-base font-semibold text-gray-800 dark:text-gray-200">Add Your Feedback</span>
                            </div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts, suggestions, or feedback about this feature..."
                                className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                            />
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {newComment.length}/500 characters
                                </span>
                                <Button
                                    size="sm"
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim() || newComment.length > 500}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                                >
                                    Post Comment
                                </Button>
                            </div>
                        </div>

                        {/* Existing Comments */}
                        <div className="space-y-4">
                            {feature.feedback && feature.feedback.length > 0 ? (
                                feature.feedback.map((comment) => (
                                    <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-sm text-white font-medium">{comment.user.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{comment.user}</span>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{comment.date}</div>
                                            </div>
                                        </div>
                                        <div className="ml-11">
                                            <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{comment.comment}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                    <p className="text-base">No comments yet</p>
                                    <p className="text-sm mt-1">Be the first to share your feedback!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 