import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Download,
  BarChart3,
  MessageSquare,
  Package,
  Palette,
  User,
  LogOut,
  X,
  ChevronRight
} from "lucide-react";

export default function ClientSidebar({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
  profileData,
  formStatuses = {
    knowingYou: { completed: false, currentStep: 0, totalSteps: 11 },
    brandKitQuestionnaire: { completed: false, currentStep: 0, totalSteps: 9 },
    organization: { completed: false, currentStep: 0, totalSteps: 4 }
  },
  isLoadingForms = false,
  logout,
  onProfileClick,
  showProfile
}) {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "package", label: "Package Details", icon: Package },
    { id: "deliverables", label: "Deliverables", icon: Download },
    { id: "brandkit", label: "BrandKit", icon: Palette },
    // { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "support", label: "Support", icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-screen">
          {/* Sidebar Header - Fixed */}
          <div className="flex-shrink-0 flex items-center justify-between p-8 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Alta Media</h2>
                <p className="text-sm text-gray-400">Client Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Client Info - Fixed */}
          <div className="flex-shrink-0 p-8 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#f7e833] ring-opacity-30 bg-gradient-to-br from-[#f7e833] to-yellow-400 flex items-center justify-center">
                <span className="text-lg font-bold text-black">
                  {profileData.fullname ? profileData.fullname.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-lg">{profileData.fullname}</p>
                <p className="text-sm text-gray-400">{profileData.company}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfileClick}
                className={`p-2 rounded-xl transition-all duration-200 ${showProfile
                  ? 'bg-[#f7e833] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                title="Manage Profile"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto sidebar-scroll">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-200 ${activeSection === item.id || (showProfile && item.id === 'dashboard')
                    ? 'bg-[#f7e833] text-black shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105'
                    }`}
                >
                  <Icon className={`w-6 h-6 ${activeSection === item.id || (showProfile && item.id === 'dashboard') ? 'text-black' : 'text-gray-400'}`} />
                  <span className="font-medium text-lg">{item.label}</span>

                  {/* BrandKit Status Indicator */}
                  {item.id === 'brandkit' && !isLoadingForms && formStatuses && formStatuses.knowingYou && formStatuses.brandKitQuestionnaire && formStatuses.organization && (
                    <div className="ml-auto">
                      {(formStatuses.knowingYou.completed || formStatuses.brandKitQuestionnaire.completed || formStatuses.organization.completed) ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      ) : (formStatuses.knowingYou.currentStep > 0 || formStatuses.brandKitQuestionnaire.currentStep > 0 || formStatuses.organization.currentStep > 0) ? (
                        <div className="w-3 h-3 bg-[#f7e833] rounded-full"></div>
                      ) : null}
                    </div>
                  )}

                  {(activeSection === item.id || (showProfile && item.id === 'dashboard')) && (
                    <ChevronRight className="w-5 h-5 ml-auto text-black" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button - Fixed */}
          <div className="flex-shrink-0 p-6 border-t border-gray-800">
            <Button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}