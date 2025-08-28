import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Package, ExternalLink } from 'lucide-react';

export default function TopBar({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  sidebarItems,
  showProfile,
  profileData,
  clientData
}) {
  // Get package name safely
  const getPackageName = () => {
    if (clientData?.activePackage?.package_name) {
      return clientData.activePackage.package_name;
    }
    if (clientData?.activePackage?.name) {
      return clientData.activePackage.name;
    }
    return 'Loading...';
  };

  // Check if packages are loading
  const isLoading = clientData?.isLoadingPackages;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-black hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {showProfile ? 'Profile Management' : sidebarItems.find(item => item.id === activeSection)?.label}
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {profileData?.fullname || 'User'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 text-sm">
            <span className="text-gray-500">Package:</span>
            <Badge className={`font-semibold px-3 py-1 rounded-full border-0 ${isLoading
              ? 'bg-gray-200 text-gray-600'
              : 'bg-[#f7e833] text-black hover:bg-yellow-300'
              }`}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                getPackageName()
              )}
            </Badge>
          </div>

          {/* Back to Store Button */}
          <Button
            variant="default"
            size="sm"
            onClick={() => window.open('https://store.altamedia.ai/', '_blank')}
            className="flex items-center space-x-2 bg-[#f7e833] hover:bg-yellow-500 text-black font-medium shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
            <span className="sm:hidden">Store</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
