import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Home,
    Users,
    Activity,
    Package,
    BarChart3,
    MessageSquare,
    X,
    ChevronRight,
    PieChart,
    Palette,
    LogOut,
    RefreshCw,
    Upload
} from 'lucide-react';

const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "packages", label: "Packages & Clients", icon: Package },
    { id: "deliverable-upload", label: "Upload Deliverables", icon: Upload },
    { id: "revisions", label: "Revision Requests", icon: RefreshCw },
    { id: "brandkits", label: "BrandKit Forms", icon: Palette },
    { id: "client-requests", label: "Client Requests", icon: MessageSquare },
];

export default function AdminSidebar({
    activeSection,
    setActiveSection,
    sidebarOpen,
    setSidebarOpen,
    onLogout
}) {
    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
                {/* Sidebar Header - Fixed */}
                <div className="flex-shrink-0 flex items-center justify-between p-8 border-b border-gray-800">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-black font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Alta Media</h2>
                            <p className="text-sm text-gray-400">Admin Portal</p>
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

                {/* Navigation - Scrollable within sidebar only */}
                <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-200 ${activeSection === item.id
                                    ? 'bg-[#f7e833] text-black shadow-lg transform scale-105'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105'
                                    }`}
                            >
                                <Icon className={`w-6 h-6 ${activeSection === item.id ? 'text-black' : 'text-gray-400'}`} />
                                <span className="font-medium text-lg">{item.label}</span>
                                {activeSection === item.id && (
                                    <ChevronRight className="w-5 h-5 ml-auto text-black" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Admin Info - Fixed */}
                <div className="flex-shrink-0 p-6 border-t border-gray-800">
                    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                        <p className="text-xs text-gray-400 mb-3 font-medium">Admin Account</p>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#f7e833] ring-opacity-30">
                                <div className="w-full h-full bg-[#f7e833] flex items-center justify-center">
                                    <span className="text-black font-bold">A</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Admin User</p>
                                <p className="text-xs text-[#f7e833] font-medium">Super Admin</p>
                            </div>
                        </div>
                        <Button
                            onClick={onLogout}
                            variant="outline"
                            size="sm"
                            className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
