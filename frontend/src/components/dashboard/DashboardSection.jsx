import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Download,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Loader2
} from 'lucide-react';
import { deliverableApi } from '@/utils/deliverableApi';

export default function DashboardSection({ clientData, onViewPackage, onViewDeliverables }) {
  const [recentDeliverables, setRecentDeliverables] = useState([]);
  const [isLoadingDeliverables, setIsLoadingDeliverables] = useState(true);
  const [deliverablesError, setDeliverablesError] = useState(null);

  console.log("package status: ", clientData.activePackage?.status);


  // Load recent deliverables
  useEffect(() => {
    const loadRecentDeliverables = async () => {
      if (!clientData?.activePackage?.id) {
        setIsLoadingDeliverables(false);
        return;
      }

      try {
        setIsLoadingDeliverables(true);
        setDeliverablesError(null);

        const response = await deliverableApi.getClientDeliverables(clientData.activePackage.id);

        if (response && response.success && response.data) {
          // Take the 3 most recent deliverables
          const recent = response.data.slice(0, 3);
          setRecentDeliverables(recent);
        } else if (response && Array.isArray(response)) {
          // Fallback: if response is directly an array
          const recent = response.slice(0, 3);
          setRecentDeliverables(recent);
        } else {
          setRecentDeliverables([]);
        }
      } catch (error) {
        console.error('Error loading recent deliverables:', error);
        setDeliverablesError('Failed to load recent deliverables');
        setRecentDeliverables([]);
      } finally {
        setIsLoadingDeliverables(false);
      }
    };

    loadRecentDeliverables();
  }, [clientData?.activePackage?.id]);

  // Get file type icon based on file extension
  const getFileTypeIcon = (fileName) => {
    if (!fileName) return FileText;

    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return Image;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
        return Video;
      case 'mp3':
      case 'wav':
      case 'flac':
        return Music;
      case 'zip':
      case 'rar':
      case '7z':
        return Archive;
      default:
        return FileText;
    }
  };

  // Get status badge styling
  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'revision requested':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Active Package Card */}
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="text-2xl">Active Package</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {clientData.activePackage ? (
            <div className="space-y-6">
              {/* Package Selector - Only show if user has multiple packages */}
              {clientData.userPackages && clientData.userPackages.length > 1 && (
                <div className="mb-4">
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

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {clientData.activePackage.name}
                  </h3>
                  <p className="text-lg text-gray-600 font-medium">{clientData.activePackage.price}</p>
                </div>
                {clientData.activePackage.status === "Active" ? (
                  <Badge className="bg-[#f7e833] hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-full text-sm animate-pulse">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-full text-sm hover:bg-gray-300">
                    {clientData.activePackage.status}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Start Date</p>
                    <p className="font-bold text-gray-900">{clientData.activePackage.startDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">End Date</p>
                    <p className="font-bold text-gray-900">{clientData.activePackage.endDate}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Button
                  onClick={onViewPackage}
                  className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 hover:scale-105"
                >
                  View Package Details
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active package found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Deliverables */}
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl">Recent Deliverables</span>
            <Button
              onClick={onViewDeliverables}
              variant="outline"
              className="bg-[#f7e833] border-[#f7e833] text-black hover:bg-yellow-300 hover:text-black"
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {isLoadingDeliverables ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading recent deliverables...</span>
            </div>
          ) : deliverablesError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{deliverablesError}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="bg-[#f7e833] border-[#f7e833] text-black hover:bg-yellow-300 hover:text-black"
              >
                Retry
              </Button>
            </div>
          ) : recentDeliverables.length === 0 ? (
            <div className="text-center py-8">
              <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No deliverables uploaded yet</p>
              <p className="text-sm text-gray-400">Your project deliverables will appear here once uploaded by the admin</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDeliverables.map((deliverable, index) => {
                const FileIcon = getFileTypeIcon(deliverable.file_path);
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{deliverable.feature_name}</h4>
                        <p className="text-sm text-gray-600">
                          {deliverable.admin_notes || 'No description available'}
                        </p>
                        {deliverable.upload_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {new Date(deliverable.upload_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(deliverable.status)}`}>
                      {deliverable.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
