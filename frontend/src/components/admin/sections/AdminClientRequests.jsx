import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Eye,
  Edit,
  RefreshCw,
  X,
  Send,
  Filter,
  Users,
  Calendar,
  Mail,
  ArrowRight,
  Zap,
  Shield
} from 'lucide-react';
import apiService from '@/utils/api';

export default function AdminClientRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    fetchClientRequests();
  }, []);

  const fetchClientRequests = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllClientRequests();
      if (response.success) {
        setRequests(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch client requests');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching client requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus, responseText = '') => {
    try {
      setIsUpdating(true);
      const response = await apiService.updateClientRequest(requestId, {
        status: newStatus,
        admin_response: responseText
      });

      if (response.success) {
        fetchClientRequests();
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(prev => ({ ...prev, status: newStatus, admin_response: responseText }));
        }
      } else {
        setError(response.message || 'Failed to update request');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating request:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setAdminResponse(request.admin_response || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setAdminResponse('');
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedRequest) return;
    await updateRequestStatus(selectedRequest.id, newStatus, adminResponse);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#f7e833] text-black';
      case 'in_progress':
        return 'bg-black text-[#f7e833]';
      case 'resolved':
        return 'bg-[#f7e833] text-black';
      case 'closed':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-600 text-white';
      case 'medium':
        return 'bg-[#f7e833] text-black';
      case 'low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <Zap className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Target className="w-4 h-4" />;
      case 'low':
        return <Shield className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <Target className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return formatDate(dateString);
  };

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#f7e833] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="bg-white shadow-lg border border-gray-200 rounded-xl max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Error</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button onClick={fetchClientRequests} className="bg-[#f7e833] hover:bg-yellow-400 text-black">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Client Requests</h1>
            <p className="text-gray-600">Manage and respond to client support requests</p>
          </div>
          <Button onClick={fetchClientRequests} variant="outline" className="hover:bg-[#f7e833] hover:text-black">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search requests, clients, or messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#f7e833] focus:ring-[#f7e833] focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="bg-white shadow-lg border border-gray-200 rounded-xl hover:shadow-xl transition-all cursor-pointer"
              onClick={() => openModal(request)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(request.priority)}
                      <Badge className={`${getPriorityColor(request.priority)} px-2 py-1 rounded-full text-xs`}>
                        {request.priority}
                      </Badge>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {request.subject}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-medium">{request.fullname || 'Unknown'}</span>
                        <span>•</span>
                        <span>{request.email}</span>
                        <span>•</span>
                        <span>{getTimeAgo(request.created_at)}</span>
                      </div>
                      {request.admin_response ? (
                        <p className="text-xs text-green-600 mt-1">✓ Response sent</p>
                      ) : (
                        <p className="text-xs text-orange-600 mt-1">⚠ Needs response</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStatusColor(request.status)} px-3 py-1 rounded-full text-xs`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status.replace('_', ' ')}</span>
                    </Badge>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f7e833] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">
                  {requests.length === 0
                    ? "No client requests have been submitted yet."
                    : "No requests match your current filters."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Request Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Respond to Client</h2>
                    <p className="text-gray-500 text-sm">Request #{selectedRequest.id} • {selectedRequest.subject}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeModal} className="hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(selectedRequest.status)} px-3 py-1 rounded-full text-sm`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-1">{selectedRequest.status.replace('_', ' ')}</span>
                  </Badge>
                  <Badge className={`${getPriorityColor(selectedRequest.priority)} px-3 py-1 rounded-full text-sm`}>
                    {getPriorityIcon(selectedRequest.priority)}
                    <span className="ml-1">{selectedRequest.priority}</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Information */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#f7e833] rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedRequest.fullname || 'Unknown'}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{selectedRequest.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(selectedRequest.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Request Message */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Request Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Send Response */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Send Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Enter your response to the client..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#f7e833] focus:ring-[#f7e833] focus:outline-none resize-none"
                    rows={4}
                  />
                  <div className="flex flex-wrap gap-3 mt-4">
                    {/* Send Response Only - Always Available */}
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.status)}
                      variant="outline"
                      className="border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black"
                      disabled={isUpdating}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isUpdating ? 'Sending...' : 'Send Response Only'}
                    </Button>

                    {/* Status-Specific Actions */}
                    {selectedRequest.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate('in_progress')}
                          className="bg-black hover:bg-gray-800 text-[#f7e833]"
                          disabled={isUpdating}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          {isUpdating ? 'Updating...' : 'Send & Start Work'}
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate('resolved')}
                          className="bg-[#f7e833] hover:bg-yellow-400 text-black"
                          disabled={isUpdating}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {isUpdating ? 'Updating...' : 'Send & Mark Resolved'}
                        </Button>
                      </>
                    )}

                    {selectedRequest.status === 'in_progress' && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate('resolved')}
                          className="bg-[#f7e833] hover:bg-yellow-400 text-black"
                          disabled={isUpdating}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {isUpdating ? 'Updating...' : 'Send & Mark Resolved'}
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate('pending')}
                          variant="outline"
                          className="border-gray-500 text-gray-700 hover:bg-gray-100"
                          disabled={isUpdating}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {isUpdating ? 'Updating...' : 'Send & Back to Pending'}
                        </Button>
                      </>
                    )}

                    {selectedRequest.status === 'resolved' && (
                      <Button
                        onClick={() => handleStatusUpdate('closed')}
                        className="bg-gray-800 hover:bg-gray-700 text-white"
                        disabled={isUpdating}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isUpdating ? 'Updating...' : 'Send & Close Request'}
                      </Button>
                    )}

                    {selectedRequest.status === 'closed' && (
                      <Button
                        onClick={() => handleStatusUpdate('resolved')}
                        className="bg-[#f7e833] hover:bg-yellow-400 text-black"
                        disabled={isUpdating}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {isUpdating ? 'Updating...' : 'Send & Reopen'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
