import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';

export default function TopBar({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeSection, 
  sidebarItems, 
  showProfile, 
  profileData, 
  clientData 
}) {
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
              Welcome back, {profileData.fullname}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 text-sm">
            <span className="text-gray-500">Package:</span>
            <Badge className="bg-[#f7e833] text-black font-semibold px-3 py-1 rounded-full border-0">
              {clientData.activePackage.name}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
