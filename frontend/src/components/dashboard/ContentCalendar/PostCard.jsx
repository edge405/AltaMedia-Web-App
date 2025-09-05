import React from 'react';
import { Edit, Trash2, Clock, CheckCircle, FileText, Image, Video, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlatformIcons from './PlatformIcons';

export default function PostCard({ post, onEdit, onDelete, onDragStart, isDragging }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-700 border-gray-300';
            case 'scheduled':
                return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'posted':
                return 'bg-green-100 text-green-700 border-green-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'draft':
                return <FileText className="w-3 h-3" />;
            case 'scheduled':
                return <Clock className="w-3 h-3" />;
            case 'posted':
                return <CheckCircle className="w-3 h-3" />;
            default:
                return <FileText className="w-3 h-3" />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            className={`group relative p-2 rounded-md border cursor-move transition-all duration-200 hover:shadow-md ${getStatusColor(post.status)
                } ${isDragging ? 'opacity-50 scale-95' : ''}`}
        >
            {/* Post Content */}
            <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-medium truncate flex-1">
                        {post.title}
                    </h4>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="h-6 w-6 p-0 hover:bg-white/20"
                        >
                            <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="h-6 w-6 p-0 hover:bg-white/20 text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                </div>

                {/* Description */}
                {post.description && (
                    <p className="text-xs opacity-80 line-clamp-2">
                        {post.description}
                    </p>
                )}

                {/* Media Indicators */}
                {post.media && post.media.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        {post.media.some(m => m.type === 'image') && (
                            <Image className="w-3 h-3 text-blue-600" />
                        )}
                        {post.media.some(m => m.type === 'video') && (
                            <Video className="w-3 h-3 text-red-600" />
                        )}
                        <span className="text-xs opacity-70">
                            {post.media.length} file{post.media.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                {/* Platform Indicators */}
                {post.platforms && Object.values(post.platforms).some(Boolean) && (
                    <div className="flex items-center gap-1 mt-1">
                        <PlatformIcons platforms={post.platforms} size="sm" />
                    </div>
                )}

                {/* Time and Status */}
                <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-xs opacity-70">
                        {formatTime(post.date)}
                    </span>

                    <div className="flex items-center gap-1">
                        {getStatusIcon(post.status)}
                        <span className="text-xs font-medium capitalize">
                            {post.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
