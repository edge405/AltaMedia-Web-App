import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Home,
    Users,
    Activity,
    Package,
    BarChart3,
    MessageSquare,
    Menu,
    X,
    ChevronRight,
    Search,
    Filter,
    Download,
    Upload,
    Eye,
    Edit,
    MoreHorizontal,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    UserPlus,
    Settings,
    Bell,
    Mail,
    Phone,
    Building,
    ExternalLink,
    FileText,
    Image,
    Video,
    Globe,
    Target,
    MousePointer,
    Users as UsersIcon,
    PieChart,
    LineChart,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Plus,
    Trash2,
    Archive,
    RefreshCw,
    Star,
    StarOff,
    Palette
} from 'lucide-react';

// Mock admin data
const adminData = {
    overview: {
        totalClients: 24,
        activePackages: {
            meta: 12,
            ai: 8,
            website: 6,
            googleAds: 10
        },
        totalCampaigns: 45,
        totalBudget: 1250000
    },
    clients: [
        {
            id: 1,
            name: "John Smith",
            company: "Smith Enterprises",
            email: "john@smith.com",
            phone: "+63 912 345 6789",
            package: "META Marketing - Basic",
            status: "Active",
            progress: 75,
            lastActivity: "2 hours ago",
            budget: 20000,
            budgetUsed: 12500,
            projectManager: "Sarah Johnson"
        },
        {
            id: 2,
            name: "Maria Garcia",
            company: "Garcia Solutions",
            email: "maria@garcia.com",
            phone: "+63 923 456 7890",
            package: "AI Marketing",
            status: "Active",
            progress: 45,
            lastActivity: "1 day ago",
            budget: 15000,
            budgetUsed: 8000,
            projectManager: "Mike Chen"
        },
        {
            id: 3,
            name: "David Lee",
            company: "Lee Technologies",
            email: "david@lee.com",
            phone: "+63 934 567 8901",
            package: "Website Development",
            status: "Pending",
            progress: 20,
            lastActivity: "3 days ago",
            budget: 25000,
            budgetUsed: 5000,
            projectManager: "Sarah Johnson"
        }
    ],
    activityLogs: [
        {
            id: 1,
            client: "John Smith",
            action: "approved 2 graphics",
            timestamp: "2 hours ago",
            type: "approval"
        },
        {
            id: 2,
            client: "Maria Garcia",
            action: "requested revisions on a reel",
            timestamp: "1 day ago",
            type: "revision"
        },
        {
            id: 3,
            client: "David Lee",
            action: "viewed analytics dashboard",
            timestamp: "3 days ago",
            type: "view"
        },
        {
            id: 4,
            client: "John Smith",
            action: "downloaded deliverables",
            timestamp: "4 days ago",
            type: "download"
        }
    ],
    campaigns: [
        {
            id: 1,
            client: "John Smith",
            name: "Brand Awareness Campaign",
            status: "Active",
            reach: 15000,
            ctr: 3.2,
            conversions: 45,
            budgetUsed: 8500
        },
        {
            id: 2,
            client: "Maria Garcia",
            name: "Product Launch",
            status: "Active",
            reach: 12000,
            ctr: 2.8,
            conversions: 32,
            budgetUsed: 6200
        },
        {
            id: 3,
            client: "David Lee",
            name: "Lead Generation",
            status: "Paused",
            reach: 8000,
            ctr: 2.1,
            conversions: 18,
            budgetUsed: 4200
        }
    ],
    supportTickets: [
        {
            id: 1,
            client: "John Smith",
            title: "Request for additional revisions",
            status: "Open",
            priority: "Medium",
            assignedTo: "Sarah Johnson",
            createdAt: "2024-02-01"
        },
        {
            id: 2,
            client: "Maria Garcia",
            title: "Question about ad performance",
            status: "In Progress",
            priority: "Low",
            assignedTo: "Mike Chen",
            createdAt: "2024-01-28"
        }
    ],
    globalAnalytics: {
        totalReach: 125000,
        totalEngagement: 8900,
        totalCtr: 2.9,
        totalConversions: 450
    }
};

export default function AdminPortal() {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [brandKits, setBrandKits] = useState([]);
    const [loadingBrandKits, setLoadingBrandKits] = useState(false);

    const sidebarItems = [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "clients", label: "Clients", icon: Users },
        { id: "activity", label: "Activity Logs", icon: Activity },
        { id: "packages", label: "Packages & Deliverables", icon: Package },
        { id: "campaigns", label: "Campaigns", icon: BarChart3 },
        { id: "analytics", label: "Analytics", icon: PieChart },
        { id: "brandkits", label: "BrandKits", icon: Palette },
        { id: "support", label: "Support", icon: MessageSquare },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-500";
            case "Pending":
                return "bg-yellow-500";
            case "Suspended":
                return "bg-red-500";
            case "Completed":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    // Fetch brandkits when component mounts or when brandkits section is active
    React.useEffect(() => {
        fetchBrandKits();
    }, []);

    React.useEffect(() => {
        if (activeSection === "brandkits") {
            fetchBrandKits();
        }
    }, [activeSection]);

    const fetchBrandKits = async () => {
        setLoadingBrandKits(true);
        try {
            const response = await fetch('/api/brandkit/all/mariadb');
            const data = await response.json();
            if (data.success) {
                setBrandKits(data.data.forms || []);
            }
        } catch (error) {
            console.error('Error fetching brandkits:', error);
        } finally {
            setLoadingBrandKits(false);
        }
    };

    const downloadBrandKit = async (brandKit) => {
        try {
            // Create a formatted JSON file with the brandkit data
            const brandKitData = {
                businessName: brandKit.business_name,
                businessEmail: brandKit.business_email,
                contactNumber: brandKit.contact_number,
                industry: brandKit.industry,
                yearStarted: brandKit.year_started,
                primaryLocation: brandKit.primary_location,
                missionStatement: brandKit.mission_statement,
                coreValues: brandKit.core_values,
                brandDescription: brandKit.brand_description,
                targetAudience: brandKit.target_audience,
                desiredFeeling: brandKit.desired_feeling,
                brandPersonality: brandKit.brand_personality,
                brandVoice: brandKit.brand_voice,
                preferredColors: brandKit.preferred_colors,
                colorsToAvoid: brandKit.colors_to_avoid,
                fontStyles: brandKit.font_styles,
                designStyle: brandKit.design_style,
                logoType: brandKit.logo_type,
                imageryStyle: brandKit.imagery_style,
                brandKitUse: brandKit.brand_kit_use,
                brandElements: brandKit.brand_elements,
                fileFormats: brandKit.file_formats,
                primaryGoal: brandKit.primary_goal,
                shortTermGoals: brandKit.short_term_goals,
                longTermGoal: brandKit.long_term_goal,
                successMetrics: brandKit.success_metrics,
                specialNotes: brandKit.special_notes,
                timeline: brandKit.timeline,
                approver: brandKit.approver,
                referenceMaterials: brandKit.reference_materials,
                inspirationLinks: brandKit.inspiration_links,
                createdAt: brandKit.created_at,
                updatedAt: brandKit.updated_at,
                progressPercentage: brandKit.progress_percentage,
                isCompleted: brandKit.is_completed
            };

            const blob = new Blob([JSON.stringify(brandKitData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${brandKit.business_name || 'BrandKit'}_${brandKit.id}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading brandkit:', error);
        }
    };

    const downloadAllBrandKits = async () => {
        try {
            const allBrandKitsData = {
                exportDate: new Date().toISOString(),
                totalBrandKits: brandKits.length,
                brandKits: brandKits.map(brandKit => ({
                    id: brandKit.id,
                    businessName: brandKit.business_name,
                    businessEmail: brandKit.business_email,
                    contactNumber: brandKit.contact_number,
                    industry: brandKit.industry,
                    yearStarted: brandKit.year_started,
                    primaryLocation: brandKit.primary_location,
                    missionStatement: brandKit.mission_statement,
                    coreValues: brandKit.core_values,
                    brandDescription: brandKit.brand_description,
                    targetAudience: brandKit.target_audience,
                    desiredFeeling: brandKit.desired_feeling,
                    brandPersonality: brandKit.brand_personality,
                    brandVoice: brandKit.brand_voice,
                    preferredColors: brandKit.preferred_colors,
                    colorsToAvoid: brandKit.colors_to_avoid,
                    fontStyles: brandKit.font_styles,
                    designStyle: brandKit.design_style,
                    logoType: brandKit.logo_type,
                    imageryStyle: brandKit.imagery_style,
                    brandKitUse: brandKit.brand_kit_use,
                    brandElements: brandKit.brand_elements,
                    fileFormats: brandKit.file_formats,
                    primaryGoal: brandKit.primary_goal,
                    shortTermGoals: brandKit.short_term_goals,
                    longTermGoal: brandKit.long_term_goal,
                    successMetrics: brandKit.success_metrics,
                    specialNotes: brandKit.special_notes,
                    timeline: brandKit.timeline,
                    approver: brandKit.approver,
                    referenceMaterials: brandKit.reference_materials,
                    inspirationLinks: brandKit.inspiration_links,
                    createdAt: brandKit.created_at,
                    updatedAt: brandKit.updated_at,
                    progressPercentage: brandKit.progress_percentage,
                    isCompleted: brandKit.is_completed
                }))
            };

            const blob = new Blob([JSON.stringify(allBrandKitsData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `All_BrandKits_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading all brandkits:', error);
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 60) return "bg-blue-500";
        if (progress >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getProgressText = (progress) => {
        if (progress >= 80) return "Almost Complete";
        if (progress >= 60) return "In Progress";
        if (progress >= 40) return "Started";
        return "Just Started";
    };

    const renderDashboard = () => (
        <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-black text-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Total Clients</p>
                                <p className="text-3xl font-bold">{adminData.overview.totalClients}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                                <UsersIcon className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black text-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Active Packages</p>
                                <p className="text-3xl font-bold">{Object.values(adminData.overview.activePackages).reduce((a, b) => a + b, 0)}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black text-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Total Campaigns</p>
                                <p className="text-3xl font-bold">{adminData.overview.totalCampaigns}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black text-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Total Budget</p>
                                <p className="text-3xl font-bold">₱{(adminData.overview.totalBudget / 1000000).toFixed(1)}M</p>
                            </div>
                            <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Package Distribution */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-gray-900">Package Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 text-black" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{adminData.overview.activePackages.meta}</p>
                            <p className="text-gray-600 font-medium">META Marketing</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-black" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{adminData.overview.activePackages.ai}</p>
                            <p className="text-gray-600 font-medium">AI Marketing</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 text-black" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{adminData.overview.activePackages.website}</p>
                            <p className="text-gray-600 font-medium">Website Dev</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="w-8 h-8 text-black" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{adminData.overview.activePackages.googleAds}</p>
                            <p className="text-gray-600 font-medium">Google Ads</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Client Activity Feed */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-gray-900">Client Activity Feed</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-4">
                        {adminData.activityLogs.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                                    {activity.type === "approval" && <CheckCircle className="w-5 h-5 text-black" />}
                                    {activity.type === "revision" && <RefreshCw className="w-5 h-5 text-black" />}
                                    {activity.type === "view" && <Eye className="w-5 h-5 text-black" />}
                                    {activity.type === "download" && <Download className="w-5 h-5 text-black" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">
                                        <span className="text-[#f7e833]">{activity.client}</span> {activity.action}
                                    </p>
                                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Global Performance */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-gray-900">Global Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <Eye className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{adminData.globalAnalytics.totalReach.toLocaleString()}</p>
                            <p className="text-gray-600 font-medium">Total Reach</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <Users className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{adminData.globalAnalytics.totalEngagement.toLocaleString()}</p>
                            <p className="text-gray-600 font-medium">Engagement</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <MousePointer className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{adminData.globalAnalytics.totalCtr}%</p>
                            <p className="text-gray-600 font-medium">CTR</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <Target className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{adminData.globalAnalytics.totalConversions}</p>
                            <p className="text-gray-600 font-medium">Conversions</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* BrandKit Summary */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">BrandKit Overview</CardTitle>
                        <Button
                            onClick={() => setActiveSection("brandkits")}
                            className="bg-[#f7e833] hover:bg-yellow-400 text-black px-4 py-2 rounded-2xl font-semibold"
                        >
                            View All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <Palette className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{brandKits.length}</p>
                            <p className="text-gray-600 font-medium">Total BrandKits</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-600">
                                {brandKits.filter(bk => bk.is_completed).length}
                            </p>
                            <p className="text-gray-600 font-medium">Completed</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-blue-600">
                                {brandKits.filter(bk => bk.progress_percentage >= 60 && bk.progress_percentage < 80).length}
                            </p>
                            <p className="text-gray-600 font-medium">In Progress</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-yellow-600">
                                {brandKits.filter(bk => bk.progress_percentage < 60).length}
                            </p>
                            <p className="text-gray-600 font-medium">Started</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderClients = () => (
        <div className="space-y-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Client Management</CardTitle>
                        <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold">
                            <UserPlus className="w-5 h-5 mr-2" />
                            Add Client
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search clients..."
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
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>

                    {/* Client Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Client Name</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Package</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Progress</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Last Activity</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminData.clients.map((client) => (
                                    <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{client.name}</p>
                                                <p className="text-sm text-gray-500">{client.company}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-900">{client.package}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={`${getStatusColor(client.status)} text-white px-3 py-1 rounded-full`}>
                                                {client.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="w-24">
                                                <Progress value={client.progress} className="h-2" />
                                                <p className="text-sm text-gray-500 mt-1">{client.progress}%</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-600">{client.lastActivity}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black rounded-xl">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderActivityLogs = () => (
        <div className="space-y-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Client Activity Monitoring</CardTitle>
                        <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold">
                            <Download className="w-5 h-5 mr-2" />
                            Export Logs
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors"
                            />
                        </div>
                        <select className="px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors font-medium">
                            <option value="all">All Actions</option>
                            <option value="approval">Approvals</option>
                            <option value="revision">Revisions</option>
                            <option value="view">Views</option>
                            <option value="download">Downloads</option>
                        </select>
                    </div>

                    {/* Activity Logs */}
                    <div className="space-y-4">
                        {adminData.activityLogs.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                                        {activity.type === "approval" && <CheckCircle className="w-6 h-6 text-black" />}
                                        {activity.type === "revision" && <RefreshCw className="w-6 h-6 text-black" />}
                                        {activity.type === "view" && <Eye className="w-6 h-6 text-black" />}
                                        {activity.type === "download" && <Download className="w-6 h-6 text-black" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            <span className="text-[#f7e833]">{activity.client}</span> {activity.action}
                                        </p>
                                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                                    </div>
                                </div>
                                <Badge className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                    {activity.type}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderPackages = () => (
        <div className="space-y-8">
            {/* Package Types Overview */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Packages & Deliverables</CardTitle>
                        <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold">
                            <Plus className="w-5 h-5 mr-2" />
                            Assign Package
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Package Types */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-200">
                            <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center mb-4">
                                <Globe className="w-6 h-6 text-black" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">META Marketing</h3>
                            <p className="text-sm text-gray-600 mb-3">Basic ₱6,999 → Premium ₱17,999</p>
                            <Badge className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">12 Active</Badge>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-200">
                            <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-black" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">AI Marketing</h3>
                            <p className="text-sm text-gray-600 mb-3">₱7,999</p>
                            <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">8 Active</Badge>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-200">
                            <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center mb-4">
                                <Globe className="w-6 h-6 text-black" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Website Development</h3>
                            <p className="text-sm text-gray-600 mb-3">₱5,999–₱27,999</p>
                            <Badge className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">6 Active</Badge>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-200">
                            <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6 text-black" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Google Ads</h3>
                            <p className="text-sm text-gray-600 mb-3">₱4,999–₱11,999</p>
                            <Badge className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">10 Active</Badge>
                        </div>
                    </div>

                    {/* Deliverables Tracking */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Deliverables</h3>
                        {adminData.clients.slice(0, 3).map((client) => (
                            <div key={client.id} className="p-6 border border-gray-200 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{client.name}</h4>
                                        <p className="text-sm text-gray-500">{client.package}</p>
                                    </div>
                                    <Badge className="bg-[#f7e833] text-black px-3 py-1 rounded-full">
                                        {client.progress}% Complete
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Layout Graphics</span>
                                        <span className="text-green-600">✓ Delivered</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Reels</span>
                                        <span className="text-yellow-600">🔄 In Review</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Ads</span>
                                        <span className="text-gray-600">⏳ Pending</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Deliverables Upload Section */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Upload Deliverables</CardTitle>
                        <Button className="bg-[#f7e833] hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold">
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Files
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Upload Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Client & Package Selection */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Select Client</label>
                                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors">
                                    <option value="">Choose a client...</option>
                                    {adminData.clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} - {client.package}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Deliverable Type</label>
                                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors">
                                    <option value="">Select deliverable type...</option>
                                    <option value="graphics">Layout Graphics</option>
                                    <option value="reels">Reels & Videos</option>
                                    <option value="ads">Ad Creatives</option>
                                    <option value="campaigns">Campaign Materials</option>
                                    <option value="website">Website Assets</option>
                                    <option value="branding">Branding Materials</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Package Features</label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <input type="checkbox" className="w-4 h-4 text-[#f7e833] border-gray-300 rounded focus:ring-[#f7e833]" />
                                        <span className="text-sm text-gray-700">Social Media Graphics (12 pieces)</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <input type="checkbox" className="w-4 h-4 text-[#f7e833] border-gray-300 rounded focus:ring-[#f7e833]" />
                                        <span className="text-sm text-gray-700">Instagram Reels (8 videos)</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <input type="checkbox" className="w-4 h-4 text-[#f7e833] border-gray-300 rounded focus:ring-[#f7e833]" />
                                        <span className="text-sm text-gray-700">Facebook Ads (6 creatives)</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <input type="checkbox" className="w-4 h-4 text-[#f7e833] border-gray-300 rounded focus:ring-[#f7e833]" />
                                        <span className="text-sm text-gray-700">Campaign Strategy</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Upload Area */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Upload Files</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-[#f7e833] transition-colors">
                                    <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-8 h-8 text-black" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to upload</p>
                                    <p className="text-sm text-gray-500 mb-4">Supports: JPG, PNG, MP4, MOV, PDF (Max 50MB each)</p>
                                    <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold">
                                        Choose Files
                                    </Button>
                                </div>
                            </div>

                            {/* Uploaded Files Preview */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Uploaded Files</label>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-[#f7e833] rounded-xl flex items-center justify-center">
                                                <Image className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">brand_graphics_01.jpg</p>
                                                <p className="text-sm text-gray-500">2.4 MB</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-[#f7e833] rounded-xl flex items-center justify-center">
                                                <Video className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">product_reel_01.mp4</p>
                                                <p className="text-sm text-gray-500">15.2 MB</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Delivery Options</label>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <input type="radio" name="delivery" className="w-4 h-4 text-[#f7e833] border-gray-300 focus:ring-[#f7e833]" />
                                        <span className="text-sm text-gray-700">Send to client for review</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <input type="radio" name="delivery" className="w-4 h-4 text-[#f7e833] border-gray-300 focus:ring-[#f7e833]" />
                                        <span className="text-sm text-gray-700">Mark as completed</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <input type="radio" name="delivery" className="w-4 h-4 text-[#f7e833] border-gray-300 focus:ring-[#f7e833]" />
                                        <span className="text-sm text-gray-700">Schedule for later delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                        <Button variant="outline" className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-2xl font-semibold">
                            Save Draft
                        </Button>
                        <Button className="bg-[#f7e833] hover:bg-yellow-400 text-black px-8 py-3 rounded-2xl font-semibold">
                            Send to Client
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Deliverables Management */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Deliverables Management</CardTitle>
                        <div className="flex space-x-3">
                            <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white px-4 py-2 rounded-2xl">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black px-4 py-2 rounded-2xl">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Deliverables Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Client</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Package</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Deliverable Type</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Files</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Uploaded</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">John Smith</p>
                                            <p className="text-sm text-gray-500">Smith Enterprises</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">META Marketing - Basic</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            Layout Graphics
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">3 files</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                            Delivered
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-600">2 hours ago</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black rounded-xl">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">Maria Garcia</p>
                                            <p className="text-sm text-gray-500">Garcia Solutions</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">AI Marketing</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                            Reels & Videos
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">2 files</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                            In Review
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-600">1 day ago</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black rounded-xl">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">David Lee</p>
                                            <p className="text-sm text-gray-500">Lee Technologies</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">Website Development</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                            Website Assets
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">5 files</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                            Pending
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-600">3 days ago</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black rounded-xl">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderCampaigns = () => (
        <div className="space-y-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Campaign & Budget Control</CardTitle>
                        <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Campaign
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Campaign Table */}
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Client</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Campaign Name</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Reach</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">CTR</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Conversions</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Budget Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminData.campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <p className="font-semibold text-gray-900">{campaign.client}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-900">{campaign.name}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={`${getStatusColor(campaign.status)} text-white px-3 py-1 rounded-full`}>
                                                {campaign.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-900">{campaign.reach.toLocaleString()}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-900">{campaign.ctr}%</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-900">{campaign.conversions}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-900">₱{campaign.budgetUsed.toLocaleString()}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Budget Tracker */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gray-50 rounded-3xl">
                            <h3 className="font-bold text-gray-900 mb-4">Per Client Budget</h3>
                            {adminData.clients.slice(0, 3).map((client) => (
                                <div key={client.id} className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{client.name}</span>
                                        <span>₱{client.budgetUsed.toLocaleString()} / ₱{client.budget.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#f7e833] h-2 rounded-full"
                                            style={{ width: `${(client.budgetUsed / client.budget) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl">
                            <h3 className="font-bold text-gray-900 mb-4">Global Spending</h3>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-900">₱{(adminData.overview.totalBudget / 1000000).toFixed(1)}M</p>
                                <p className="text-sm text-gray-500">Total Budget Managed</p>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl">
                            <h3 className="font-bold text-gray-900 mb-4">Overspending Alerts</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span>David Lee - 80% used</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span>Maria Garcia - 65% used</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Analytics & Reporting</CardTitle>
                        <div className="flex space-x-3">
                            <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white px-4 py-2 rounded-2xl">
                                <Download className="w-4 h-4 mr-2" />
                                Export PDF
                            </Button>
                            <Button variant="outline" className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black px-4 py-2 rounded-2xl">
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Global Analytics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <Eye className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{adminData.globalAnalytics.totalReach.toLocaleString()}</p>
                            <p className="text-gray-600 font-medium">Total Reach</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <Users className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{adminData.globalAnalytics.totalEngagement.toLocaleString()}</p>
                            <p className="text-gray-600 font-medium">Engagement</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <MousePointer className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{adminData.globalAnalytics.totalCtr}%</p>
                            <p className="text-gray-600 font-medium">CTR</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-3xl">
                            <Target className="w-8 h-8 text-[#f7e833] mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{adminData.globalAnalytics.totalConversions}</p>
                            <p className="text-gray-600 font-medium">Conversions</p>
                        </div>
                    </div>

                    {/* Top Performing Campaigns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gray-50 rounded-3xl">
                            <h3 className="font-bold text-gray-900 mb-4">Top Performing Campaigns</h3>
                            <div className="space-y-3">
                                {adminData.campaigns.slice(0, 3).map((campaign, index) => (
                                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-white rounded-2xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-[#f7e833] rounded-full flex items-center justify-center">
                                                <span className="text-black font-bold text-sm">{index + 1}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{campaign.name}</p>
                                                <p className="text-sm text-gray-500">{campaign.client}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{campaign.ctr}% CTR</p>
                                            <p className="text-sm text-gray-500">{campaign.conversions} conversions</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl">
                            <h3 className="font-bold text-gray-900 mb-4">Underperforming Campaigns</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white rounded-2xl border-l-4 border-red-500">
                                    <div>
                                        <p className="font-semibold text-gray-900">Lead Generation</p>
                                        <p className="text-sm text-gray-500">David Lee</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-red-600">2.1% CTR</p>
                                        <p className="text-sm text-gray-500">18 conversions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderBrandKits = () => (
        <div className="space-y-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">BrandKit Management</CardTitle>
                        <div className="flex space-x-3">
                            <Button
                                onClick={fetchBrandKits}
                                disabled={loadingBrandKits}
                                variant="outline"
                                className="border-2 border-black text-black hover:bg-black hover:text-white px-4 py-2 rounded-2xl"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loadingBrandKits ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                onClick={downloadAllBrandKits}
                                disabled={brandKits.length === 0}
                                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Export All
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search brandkits..."
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
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="started">Started</option>
                        </select>
                    </div>

                    {/* Loading State */}
                    {loadingBrandKits && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <RefreshCw className="w-8 h-8 text-black animate-spin" />
                            </div>
                            <p className="text-gray-600 font-medium">Loading BrandKits...</p>
                        </div>
                    )}

                    {/* BrandKits Grid */}
                    {!loadingBrandKits && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {brandKits
                                .filter(brandKit => {
                                    const matchesSearch = !searchTerm ||
                                        brandKit.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        brandKit.business_email?.toLowerCase().includes(searchTerm.toLowerCase());

                                    const matchesFilter = filterStatus === "all" ||
                                        (filterStatus === "completed" && brandKit.is_completed) ||
                                        (filterStatus === "in-progress" && brandKit.progress_percentage >= 60 && brandKit.progress_percentage < 80) ||
                                        (filterStatus === "started" && brandKit.progress_percentage < 60);

                                    return matchesSearch && matchesFilter;
                                })
                                .map((brandKit) => (
                                    <Card key={brandKit.id} className="bg-gray-50 border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                                                    <Palette className="w-6 h-6 text-black" />
                                                </div>
                                                <Badge className={`${getProgressColor(brandKit.progress_percentage)} text-white px-3 py-1 rounded-full text-xs`}>
                                                    {getProgressText(brandKit.progress_percentage)}
                                                </Badge>
                                            </div>

                                            <h3 className="font-bold text-gray-900 mb-2 text-lg">
                                                {brandKit.business_name || 'Unnamed Business'}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-3">
                                                {brandKit.business_email || 'No email provided'}
                                            </p>

                                            <div className="space-y-3 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Progress</p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`${getProgressColor(brandKit.progress_percentage)} h-2 rounded-full transition-all duration-300`}
                                                            style={{ width: `${brandKit.progress_percentage || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">{brandKit.progress_percentage || 0}% Complete</p>
                                                </div>

                                                {brandKit.industry && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Industry</p>
                                                        <p className="text-sm text-gray-700">
                                                            {Array.isArray(brandKit.industry) ? brandKit.industry.join(', ') : brandKit.industry}
                                                        </p>
                                                    </div>
                                                )}

                                                {brandKit.mission_statement && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Mission</p>
                                                        <p className="text-sm text-gray-700 line-clamp-2">
                                                            {brandKit.mission_statement}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                <span>Created: {new Date(brandKit.created_at).toLocaleDateString()}</span>
                                                <span>Updated: {new Date(brandKit.updated_at).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white rounded-xl"
                                                    onClick={() => downloadBrandKit(brandKit)}
                                                >
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Download
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black rounded-xl"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loadingBrandKits && brandKits.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Palette className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium mb-2">No BrandKits Found</p>
                            <p className="text-gray-500 text-sm">No brandkit forms have been submitted yet.</p>
                        </div>
                    )}

                    {/* Stats Summary */}
                    {!loadingBrandKits && brandKits.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-gray-900">{brandKits.length}</p>
                                <p className="text-sm text-gray-600">Total BrandKits</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {brandKits.filter(bk => bk.is_completed).length}
                                </p>
                                <p className="text-sm text-gray-600">Completed</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {brandKits.filter(bk => bk.progress_percentage >= 60 && bk.progress_percentage < 80).length}
                                </p>
                                <p className="text-sm text-gray-600">In Progress</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {brandKits.filter(bk => bk.progress_percentage < 60).length}
                                </p>
                                <p className="text-sm text-gray-600">Started</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    const renderSupport = () => (
        <div className="space-y-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Support & Communication</CardTitle>
                        <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold">
                            <Plus className="w-5 h-5 mr-2" />
                            New Ticket
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Ticket System */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 bg-gray-50 rounded-3xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Open</h3>
                                    <p className="text-2xl font-bold text-red-600">5</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">In Progress</h3>
                                    <p className="text-2xl font-bold text-yellow-600">3</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Resolved</h3>
                                    <p className="text-2xl font-bold text-green-600">12</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Tickets */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Tickets</h3>
                        {adminData.supportTickets.map((ticket) => (
                            <div key={ticket.id} className="p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                                        <p className="text-sm text-gray-500">Client: {ticket.client}</p>
                                    </div>
                                    <Badge className={`${getStatusColor(ticket.status)} text-white px-3 py-1 rounded-full`}>
                                        {ticket.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Assigned to: {ticket.assignedTo}</span>
                                    <span>Created: {ticket.createdAt}</span>
                                </div>
                                <div className="flex space-x-2 mt-4">
                                    <Button size="sm" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl">
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black rounded-xl">
                                        <Edit className="w-4 h-4 mr-1" />
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return renderDashboard();
            case "clients":
                return renderClients();
            case "activity":
                return renderActivityLogs();
            case "packages":
                return renderPackages();
            case "campaigns":
                return renderCampaigns();
            case "analytics":
                return renderAnalytics();
            case "brandkits":
                return renderBrandKits();
            case "support":
                return renderSupport();
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-screen">
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
                            <div className="flex items-center space-x-3">
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
                {/* Top Bar */}
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
                                    {sidebarItems.find(item => item.id === activeSection)?.label}
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Manage your clients and monitor their activities
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100">
                                <Bell className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100">
                                <Settings className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
