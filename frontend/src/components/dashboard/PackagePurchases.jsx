import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Package,
  Calendar,
  DollarSign,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import apiService from "@/utils/api";

export default function PackagePurchases({ client }) {
  const [packagePurchases, setPackagePurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showCommentDialog, setShowCommentDialog] = useState(false);

  useEffect(() => {
    fetchPackagePurchases();
  }, []);

  const fetchPackagePurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserPackagePurchases();

      if (response.success && response.data?.package_purchases) {
        setPackagePurchases(response.data.package_purchases);
      } else {
        setError('Failed to load package purchases');
      }
    } catch (err) {
      console.error('Error fetching package purchases:', err);
      setError(err.message || 'Failed to load package purchases');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (featureId, userId) => {
    try {
      const response = await apiService.getCommentsByFeatureAndUser(featureId, userId);
      if (response.success) {
        setComments(response.data.comments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedFeature) return;

    try {
      const userId = client?.id;
      const response = await apiService.createFeatureComment(
        selectedFeature.feature_id,
        userId,
        newComment
      );

      if (response.success) {
        setNewComment("");
        // Refresh comments
        await fetchComments(selectedFeature.feature_id, userId);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await apiService.deleteComment(commentId);
      if (response.success) {
        // Refresh comments
        await fetchComments(selectedFeature.feature_id, client?.id);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <p>Error loading package purchases: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (packagePurchases.length === 0) {
    return (
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No Package Purchases</h3>
            <p className="text-slate-600 mb-4">
              You haven't purchased any packages yet. Explore our available packages to get started.
            </p>
            <Button className="bg-slate-800 hover:bg-slate-700">
              Browse Packages
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
            <Package className="w-5 h-5 text-slate-600" />
            My Package Purchases
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage your purchased packages and their features
          </p>
        </div>
      </div>

      {packagePurchases.map((purchase) => (
        <Card key={purchase.package_purchase_id} className="glass-effect border-slate-200/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  {purchase.package_details.package_name}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  {purchase.package_details.package_description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(purchase.purchase_info.status)}>
                  {getStatusIcon(purchase.purchase_info.status)}
                  <span className="ml-1 capitalize">{purchase.purchase_info.status}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purchase Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Purchase Date</p>
                  <p className="text-sm font-medium">{formatDate(purchase.purchase_info.purchase_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Expires</p>
                  <p className="text-sm font-medium">{formatDate(purchase.purchase_info.expiration_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Total Amount</p>
                  <p className="text-sm font-medium">${purchase.purchase_info.total_amount}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-medium text-slate-800 mb-3">Package Features</h4>
              <div className="space-y-3">
                {purchase.package_details.features.map((feature) => (
                  <div key={feature.feature_id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <h5 className="font-medium text-slate-800">{feature.feature_info.feature_name}</h5>
                      <p className="text-sm text-slate-600">{feature.feature_info.feature_description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFeature(feature);
                              fetchComments(feature.feature_id, client?.id);
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Comments
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Comments for {feature.feature_info.feature_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Comments List */}
                            <div className="max-h-60 overflow-y-auto space-y-3">
                              {comments.map((comment) => (
                                <div key={comment.id} className="p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-800">
                                      {comment.users?.fullname || 'Anonymous'}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteComment(comment.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-slate-600">{comment.comment_text}</p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {formatDate(comment.created_at)}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Add Comment */}
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <Button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="w-full"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
