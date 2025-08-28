import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  User,
  X,
  Tag,
  Flag
} from 'lucide-react';

export default function ClientRequestModal({ request, isOpen, onClose }) {
  if (!request) return null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  const categoryLabels = {
    general: 'General Inquiry',
    technical: 'Technical Issue',
    billing: 'Billing Question',
    feature_request: 'Feature Request',
    bug_report: 'Bug Report',
    other: 'Other'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <span>Request Details</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {request.subject}
                </h2>
                <div className="flex items-center space-x-3">
                  <Badge className={statusColors[request.status]}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">
                      {request.status.replace('_', ' ')}
                    </span>
                  </Badge>
                  <Badge className={priorityColors[request.priority]}>
                    <Flag className="w-3 h-3 mr-1" />
                    {request.priority}
                  </Badge>
                  <Badge variant="outline">
                    <Tag className="w-3 h-3 mr-1" />
                    {categoryLabels[request.category]}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(request.created_at)}</span>
                <span className="text-gray-400">({getTimeAgo(request.created_at)})</span>
              </div>
              {request.updated_at && request.updated_at !== request.created_at && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {formatDate(request.updated_at)}</span>
                </div>
              )}
              {request.resolved_at && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolved: {formatDate(request.resolved_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Client Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{request.fullname || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{request.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Request Message */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Request Message</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {request.message}
              </p>
            </div>
          </div>

          {/* Admin Response */}
          {request.admin_response && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Admin Response</h3>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <p className="text-blue-800 whitespace-pre-wrap leading-relaxed">
                  {request.admin_response}
                </p>
                {request.resolved_at && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolved on {formatDate(request.resolved_at)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Status Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">Request Submitted</span>
                    <Badge className="bg-green-100 text-green-700">Completed</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(request.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  request.status === 'pending' ? 'bg-yellow-500' : 
                  request.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">Under Review</span>
                    <Badge className={
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }>
                      {request.status === 'pending' ? 'Current' :
                       request.status === 'in_progress' ? 'Current' : 'Completed'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.status === 'pending' ? 'Awaiting admin review' :
                     request.status === 'in_progress' ? 'Admin is working on this request' :
                     'Review completed'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  request.status === 'resolved' || request.status === 'closed' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">Resolution</span>
                    <Badge className={
                      request.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      request.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                      'bg-gray-100 text-gray-700'
                    }>
                      {request.status === 'resolved' ? 'Current' :
                       request.status === 'closed' ? 'Current' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.status === 'resolved' ? 'Request has been resolved' :
                     request.status === 'closed' ? 'Request has been closed' :
                     'Awaiting resolution'}
                  </p>
                  {request.resolved_at && (
                    <p className="text-sm text-gray-600">
                      {formatDate(request.resolved_at)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
