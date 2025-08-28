import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Calendar,
  TrendingUp,
  MousePointer,
  Target,
  Loader2
} from 'lucide-react';

export default function DashboardSection({ clientData, onViewPackage, onViewDeliverables }) {
  // Check if packages are loading
  if (clientData.isLoadingPackages) {
    return (
      <div className="space-y-8">
        <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#f7e833]" />
              <span className="text-lg font-medium text-gray-600">Loading package information...</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Information Unavailable</h3>
              <p className="text-gray-600 mb-4">{clientData.packageError}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Try Again
              </Button>
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



  return (
    <div className="space-y-8">
      {/* Package Overview Card */}
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
            <span>Package Overview</span>
          </CardTitle>
          {clientData.userPackages && clientData.userPackages.length > 1 && (
            <p className="text-gray-300 mt-2">
              You have {clientData.userPackages.length} packages. Currently viewing: {clientData.activePackage.name}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {/* Package Selector - Only show if user has multiple packages */}
          {clientData.userPackages && clientData.userPackages.length > 1 && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Switch Package</h3>
                  <p className="text-sm text-gray-600">Select a different package to view:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {clientData.userPackages.map((pkg) => (
                    <Button
                      key={pkg.id}
                      variant={clientData.selectedPackageId === pkg.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => clientData.onPackageSelect(pkg.id)}
                      className={`${clientData.selectedPackageId === pkg.id
                        ? 'bg-[#f7e833] text-black hover:bg-yellow-300'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      {pkg.package_name}
                      {pkg.status === 'active' && (
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                          Active
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {clientData.activePackage.name}
              </h3>
              <p className="text-lg text-gray-600 font-medium">{clientData.activePackage.price}</p>
            </div>
            <Badge className="bg-[#f7e833] hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-full text-sm">
              {clientData.activePackage.status}
            </Badge>
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
          <div className="space-y-4">
            {clientData.activePackage.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-black" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.feature_name}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${feature.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  feature.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
