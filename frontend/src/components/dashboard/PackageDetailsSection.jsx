import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';

export default function PackageDetailsSection({ clientData, packageDetails }) {
  // Check if packages are loading
  if (clientData.isLoadingPackages) {
    return (
      <div className="space-y-8">
        <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#f7e833]" />
              <span className="text-lg font-medium text-gray-600">Loading package details...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if there's an error
  if (clientData.packageError) {
    return (
      <div className="space-y-8">
        <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Details Unavailable</h3>
              <p className="text-gray-600 mb-4">{clientData.packageError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if no active package
  if (!clientData.activePackage) {
    return (
      <div className="space-y-8">
        <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Package</h3>
              <p className="text-gray-600">You don't have any active packages at the moment.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get features from API data
  const features = clientData.activePackage.features || [];

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  // Helper function to format status for display
  const formatStatus = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
            <span>{clientData.activePackage.name}</span>
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Track the progress of your package features and deliverables
          </p>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
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

          {/* Package Information */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Package Price</p>
                <p className="text-2xl font-bold text-gray-900">{clientData.activePackage.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Status</p>
                {clientData.activePackage.status === "Active" ? (
                  <Badge className="bg-[#f7e833] hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-full text-sm">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-full text-sm hover:bg-gray-300">
                    {clientData.activePackage.status}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Expiration Date</p>
                <p className="text-lg font-semibold text-gray-900">{clientData.activePackage.endDate}</p>
              </div>
            </div>
          </div>

          {/* Features List */}
          {features.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Package Features</h3>
              {features.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{feature.feature_name}</h4>
                      {feature.description && (
                        <p className="text-gray-600 mt-1">{feature.description}</p>
                      )}
                    </div>
                    <Badge className={`px-4 py-2 rounded-full font-medium ${getStatusColor(feature.status)}`}>
                      {formatStatus(feature.status)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  {/* {feature.progress !== undefined && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold text-gray-900">{feature.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#f7e833] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${feature.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )} */}

                  {/* Status Icon */}
                  <div className="flex items-center space-x-3 mt-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${feature.status === 'completed' ? 'bg-green-100' :
                      feature.status === 'in_progress' ? 'bg-blue-100' :
                        'bg-yellow-100'
                      }`}>
                      {getStatusIcon(feature.status)}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatStatus(feature.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Features Available</h3>
              <p className="text-gray-600">This package doesn't have any features defined yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
