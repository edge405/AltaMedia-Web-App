import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye, AlertCircle, CheckCircle, Clock, History, RefreshCw, Globe, Package, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { deliverableApi } from '@/utils/deliverableApi';
import RevisionRequestModal from './RevisionRequestModal';
import EditRevisionRequestModal from './EditRevisionRequestModal';
import DeliverableHistoryModal from './DeliverableHistoryModal';
import FilePreviewModal from './FilePreviewModal';

export default function DeliverablesSection({
  clientData,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filteredDeliverables
}) {
  const [deliverables, setDeliverables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showEditRevisionModal, setShowEditRevisionModal] = useState(false);
  const [selectedRevisionRequest, setSelectedRevisionRequest] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryDeliverable, setSelectedHistoryDeliverable] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load deliverables from API
  const loadDeliverables = async (showLoading = true) => {
    if (!clientData?.activePackage?.id) {
      if (showLoading) setIsLoading(false);
      return;
    }

    if (showLoading) {
      setIsLoading(true);
      setError(null);
    }

    try {
      // Use the purchase ID from the active package
      const response = await deliverableApi.getClientDeliverables(clientData.activePackage.id);

      if (response && response.success && response.data) {
        setDeliverables(response.data);
      } else if (response && Array.isArray(response)) {
        // Fallback: if response is directly an array
        setDeliverables(response);
      } else {
        setDeliverables([]);
      }
    } catch (error) {
      setError('Failed to load deliverables');
      if (showLoading) {
        toast.error('Failed to load deliverables');
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDeliverables(false);
    setRefreshing(false);
    toast.success('Deliverables refreshed');
  };

  // Initial load
  useEffect(() => {
    loadDeliverables();
  }, [clientData?.activePackage?.id]);

  // Periodic refresh every 30 seconds to keep status updated
  useEffect(() => {
    if (!clientData?.activePackage?.id) return;

    const interval = setInterval(() => {
      loadDeliverables(false);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [clientData?.activePackage?.id]);

  // Filter deliverables based on search and status
  const filteredApiDeliverables = deliverables.filter(deliverable => {
    const matchesSearch = deliverable.feature_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || deliverable.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Handle revision request
  const handleRequestRevision = async (deliverableId, requestReason) => {
    try {
      const response = await deliverableApi.requestRevision(deliverableId, requestReason);
      if (response.success) {
        // Refresh deliverables to show updated status
        await loadDeliverables(false);
        toast.success('Revision request submitted successfully');
      }
    } catch (error) {
      throw error;
    }
  };

  // Handle edit revision request
  const handleEditRevisionRequest = async (deliverable) => {
    try {
      // Get the revision request for this deliverable
      const revisionRequestsResponse = await deliverableApi.getRevisionRequests();
      if (revisionRequestsResponse.success && revisionRequestsResponse.data) {
        const revisionRequest = revisionRequestsResponse.data.find(
          req => req.deliverable_id === deliverable.id && req.status === 'pending'
        );

        if (revisionRequest) {
          setSelectedRevisionRequest(revisionRequest);
          setShowEditRevisionModal(true);
        } else {
          toast.error('No pending revision request found for this deliverable');
        }
      }
    } catch (error) {
      console.error('Error loading revision request:', error);
      toast.error('Failed to load revision request details');
    }
  };

  // Handle revision request update success
  const handleRevisionUpdateSuccess = async () => {
    await loadDeliverables(false);
  };

  // Handle deliverable approval
  const handleApproveDeliverable = async (deliverableId) => {
    try {
      const response = await deliverableApi.approveDeliverable(deliverableId);
      if (response.success) {
        toast.success('Deliverable approved successfully');
        // Refresh deliverables to show updated status
        await loadDeliverables(false);
      }
    } catch (error) {
      console.error('Error approving deliverable:', error);
      toast.error(error.response?.data?.message || 'Failed to approve deliverable');
    }
  };

  // Handle view history
  const handleViewHistory = (deliverable) => {
    setSelectedHistoryDeliverable(deliverable);
    setShowHistoryModal(true);
  };

  // Handle file preview
  const handlePreview = (deliverable) => {
    const fileName = deliverable.file_path?.split('/').pop() || 'deliverable';
    setSelectedPreviewFile({
      filePath: deliverable.file_path,
      fileName: fileName,
      deliverableInfo: deliverable
    });
    setShowPreviewModal(true);
  };

  // Handle link click
  const handleLinkClick = (url) => {
    if (!url) {
      toast.error('No link available');
      return;
    }

    try {
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening link:', error);
      toast.error('Failed to open link');
    }
  };

  // Handle file download with progress - FORCE DOWNLOAD TO LOCAL MACHINE
  const handleDownload = async (filePath, fileName) => {
    if (!filePath) {
      toast.error('No file available for download');
      return;
    }

    try {
      const downloadUrl = deliverableApi.downloadFile(filePath);

      // Fetch the file as a blob to force download behavior
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        }
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Convert to blob and force download
      const blob = await response.blob();
      // Override the blob type to force download
      const downloadBlob = new Blob([blob], { type: 'application/octet-stream' });

      // Create blob URL and trigger download
      const blobUrl = URL.createObjectURL(downloadBlob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'deliverable';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    } catch (error) {
      // Fallback: Try XMLHttpRequest method
      try {

        const downloadUrl = deliverableApi.downloadFile(filePath);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', downloadUrl, true);
        xhr.responseType = 'blob';

        xhr.onload = function () {
          if (xhr.status === 200) {
            const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'deliverable';
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          } else {
            throw new Error(`XHR failed: ${xhr.status}`);
          }
        };

        xhr.onerror = function () {
          throw new Error('XHR request failed');
        };

        xhr.send();

      } catch (fallbackError) {
        // Final fallback: Direct link method
        try {
          const downloadUrl = deliverableApi.downloadFile(filePath);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName || 'deliverable';
          link.target = '_self';
          link.rel = 'noopener noreferrer';
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

        } catch (finalError) {
          toast.error('Failed to download file. Please try again or contact support.');
        }
      }
    }
  };

  // Handle image load error
  const handleImageError = (deliverableId, imageUrl) => {
    console.error('Image failed to load:', imageUrl);
    setImageLoadErrors(prev => new Set([...prev, deliverableId]));
  };

  // Handle successful image load
  const handleImageLoad = (deliverableId, imageUrl) => {
    setImageLoadErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(deliverableId);
      return newSet;
    });
  };

  // Get status badge color and icon
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-500',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Approved'
        };
      case 'pending':
        return {
          color: 'bg-yellow-500',
          icon: <Clock className="w-4 h-4" />,
          text: 'Pending Review'
        };
      case 'revision_requested':
        return {
          color: 'bg-orange-500',
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Revision Requested'
        };
      default:
        return {
          color: 'bg-gray-500',
          icon: <Clock className="w-4 h-4" />,
          text: status
        };
    }
  };

  // Get file type icon or check if it's an image
  const getFileDisplay = (fileName, filePath) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);

    if (isImage && filePath) {
      const imageUrl = deliverableApi.downloadFile(filePath);
      return {
        type: 'image',
        url: imageUrl,
        fileName: fileName
      };
    }

    // Return icon for non-image files
    switch (extension) {
      case 'pdf':
        return { type: 'icon', content: '📄' };
      case 'doc':
      case 'docx':
        return { type: 'icon', content: '📝' };
      case 'zip':
      case 'rar':
        return { type: 'icon', content: '📦' };
      default:
        return { type: 'icon', content: '📎' };
    }
  };

  // Get deliverable display info (file or link)
  const getDeliverableDisplay = (deliverable) => {
    // Check if it's a link deliverable
    if (deliverable.deliverable_link) {
      return {
        type: 'link',
        url: deliverable.deliverable_link,
        icon: '🔗',
        label: 'External Link'
      };
    }

    // File deliverable
    const fileName = deliverable.file_path?.split('/').pop() || 'deliverable';
    const fileDisplay = getFileDisplay(fileName, deliverable.file_path);

    return {
      type: 'file',
      fileName: fileName,
      filePath: deliverable.file_path,
      display: fileDisplay
    };
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
              <Search className="w-6 h-6 text-black" />
            </div>
            <span>Deliverables Gallery</span>
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Review and download your project deliverables
          </p>
        </CardHeader>
        <CardContent className="p-8">
          {/* Package Selector - Only show if user has multiple packages */}
          {clientData.userPackages && clientData.userPackages.length > 1 && (
            <div className="mb-6">
              <Select
                onValueChange={(val) => clientData.onPackageSelect(parseInt(val))}
                value={clientData.selectedPackageId ? clientData.selectedPackageId.toString() : ''}
              >
                <SelectTrigger className="w-full h-10 border border-gray-300 bg-white text-gray-900 focus:border-[#f7e833] focus:ring-1 focus:ring-[#f7e833]">
                  <SelectValue placeholder="Switch Package" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {clientData.userPackages.map((pkg) => (
                    <SelectItem
                      key={pkg.id}
                      value={pkg.id.toString()}
                      className="hover:bg-[#f7e833] focus:bg-[#f7e833] data-[highlighted]:bg-[#f7e833] text-gray-900 hover:text-black focus:text-black data-[highlighted]:text-black"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{pkg.package_name}</span>
                        {pkg.status === 'active' && (
                          <span className="text-xs bg-[#f7e833] text-black px-2 py-0.5 rounded-full ml-2 font-medium">Active</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search deliverables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors font-medium"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
              <option value="revision_requested">In Revision</option>
            </select>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-6 py-4 bg-[#f7e833] hover:bg-yellow-400 text-black border-2 border-[#f7e833] rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f7e833]"></div>
              <span className="ml-3 text-gray-600">Loading deliverables...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#f7e833] hover:bg-yellow-400 text-black"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredApiDeliverables.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No deliverables found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No deliverables have been uploaded yet for this package."
                }
              </p>
            </div>
          )}

          {/* Deliverables Grid */}
          {!isLoading && !error && filteredApiDeliverables.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredApiDeliverables.map((deliverable) => {
                const statusBadge = getStatusBadge(deliverable.status);
                const deliverableDisplay = getDeliverableDisplay(deliverable);
                const hasImageError = imageLoadErrors.has(deliverable.id);

                return (
                  <div key={deliverable.id} className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      {/* Deliverable Type Display */}
                      <div className="w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative">
                        {deliverableDisplay.type === 'link' ? (
                          // Link deliverable display
                          <div className="text-center p-6">
                            <div className="text-6xl mb-4">🔗</div>
                            <div className="text-lg font-semibold text-gray-700 mb-2">External Link</div>
                            <div className="text-sm text-gray-500 break-all">
                              {deliverableDisplay.url.length > 50
                                ? deliverableDisplay.url.substring(0, 50) + '...'
                                : deliverableDisplay.url
                              }
                            </div>
                          </div>
                        ) : deliverableDisplay.display.type === 'image' && !hasImageError ? (
                          // Image file display
                          <div className="w-full h-full relative">
                            <img
                              src={deliverableDisplay.display.url}
                              alt={deliverable.feature_name}
                              className="w-full h-full object-cover"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                              crossOrigin="anonymous"
                              onError={() => handleImageError(deliverable.id, deliverableDisplay.display.url)}
                              onLoad={() => handleImageLoad(deliverable.id, deliverableDisplay.display.url)}
                            />
                          </div>
                        ) : (
                          // File icon display
                          <div className="text-6xl flex items-center justify-center w-full h-full">
                            {deliverableDisplay.display.type === 'image' ? '🖼️' : deliverableDisplay.display.content}
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className={`${statusBadge.color} text-white font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                          {statusBadge.icon}
                          {statusBadge.text}
                        </Badge>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={`${deliverableDisplay.type === 'link' ? 'bg-blue-500' : 'bg-green-500'} text-white font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                          {deliverableDisplay.type === 'link' ? '🔗' : '📁'}
                          {deliverableDisplay.type === 'link' ? 'Link' : 'File'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900 text-lg">{deliverable.feature_name}</h4>
                          <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            v{deliverable.version_number || 1}
                          </Badge>
                          {deliverable.version_number > 1 && (
                            <Badge className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                              Revision
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Uploaded: {new Date(deliverable.uploaded_at).toLocaleDateString()}
                        </p>
                        {deliverable.admin_notes && (
                          <p className="text-sm text-gray-500 mt-2 italic">
                            "{deliverable.admin_notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        {deliverableDisplay.type === 'link' ? (
                          // Link deliverable actions
                          <Button
                            size="sm"
                            className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-2xl font-semibold transition-all duration-200"
                            onClick={() => handleLinkClick(deliverableDisplay.url)}
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Visit Link
                          </Button>
                        ) : (
                          // File deliverable actions
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white py-3 rounded-2xl font-semibold transition-all duration-200"
                              onClick={() => handlePreview(deliverable)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-2xl font-semibold transition-all duration-200"
                              onClick={() => handleDownload(deliverableDisplay.filePath, deliverableDisplay.fileName)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white py-3 rounded-2xl font-semibold transition-all duration-200"
                          onClick={() => handleViewHistory(deliverable)}
                          title="View Version History"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Action buttons based on status */}
                      {deliverable.status === "pending" && (
                        <div className="flex space-x-3 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-[#f7e833] hover:bg-yellow-400 text-black py-3 rounded-2xl font-semibold transition-all duration-200"
                            onClick={() => handleApproveDeliverable(deliverable.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 py-3 rounded-2xl font-semibold transition-all duration-200"
                            onClick={() => {
                              setSelectedDeliverable(deliverable);
                              setShowRevisionModal(true);
                            }}
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Request Revision
                          </Button>
                        </div>
                      )}

                      {deliverable.status === "revision_requested" && (
                        <div className="pt-2 space-y-3">
                          <Badge className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                            Revision requested - waiting for admin response
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 py-3 rounded-2xl font-semibold transition-all duration-200"
                            onClick={() => handleEditRevisionRequest(deliverable)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Revision Request
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revision Request Modal */}
      <RevisionRequestModal
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        deliverableId={selectedDeliverable?.id}
        deliverableName={selectedDeliverable?.feature_name}
        onSubmitRevision={handleRequestRevision}
      />

      {/* Edit Revision Request Modal */}
      <EditRevisionRequestModal
        isOpen={showEditRevisionModal}
        onClose={() => setShowEditRevisionModal(false)}
        revisionRequestId={selectedRevisionRequest?.id}
        deliverableName={selectedRevisionRequest?.feature_name}
        onUpdateSuccess={handleRevisionUpdateSuccess}
      />

      {/* Deliverable History Modal */}
      <DeliverableHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        purchaseId={clientData.activePackage?.id}
        featureName={selectedHistoryDeliverable?.feature_name}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        filePath={selectedPreviewFile?.filePath}
        fileName={selectedPreviewFile?.fileName}
        deliverableInfo={selectedPreviewFile?.deliverableInfo}
      />
    </div>
  );
}