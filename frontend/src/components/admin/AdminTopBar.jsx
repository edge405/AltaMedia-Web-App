import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Menu,
    Bell,
    Settings,
    LogOut
} from 'lucide-react';

const sidebarItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "clients", label: "Clients" },
    { id: "activity", label: "Activity Logs" },
    { id: "packages", label: "Packages & Deliverables" },
    { id: "campaigns", label: "Campaigns" },
    { id: "analytics", label: "Analytics" },
    { id: "brandkits", label: "BrandKits" },
];

export default function AdminTopBar({
    activeSection,
    setSidebarOpen,
    onLogout
}) {
    const currentSection = sidebarItems.find(item => item.id === activeSection);

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
                            {currentSection?.label || 'Dashboard'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage your clients and monitor their activities
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
