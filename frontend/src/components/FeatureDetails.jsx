import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Star,
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
  CheckCircle
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



  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: "You",
      comment: newComment,
      rating: 5,
      date: "Just now"
    };

    onAddComment(feature.id, comment);
    setNewComment("");
    toast.success("Comment added successfully!");
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
          <Badge className={`${getStatusColor(feature.status)}`}>
            {feature.status}
          </Badge>
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
                          "bg-gray-500"
                      }`}>
                      {output.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{output.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updated: {output.lastUpdated}</span>
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
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Comment</span>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your feedback..."
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Post Comment
                </Button>
              </div>
            </div>

            {/* Existing Comments */}
            <div className="space-y-3">
              {feature.feedback && feature.feedback.length > 0 ? (
                feature.feedback.map((comment) => (
                  <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">{comment.user.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{comment.user}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{comment.comment}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 