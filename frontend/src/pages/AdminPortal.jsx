import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Icons
import {
    Search,
    RefreshCw,
    Download,
    Palette,
    Eye,
    FileText,
    Users,
    Package,
    Building,
    FileDown,
    MoreHorizontal,
    Users as UsersIcon,
    Target,
    DollarSign,
    Globe,
    BarChart3,
    CheckCircle,
    Upload,
    Image,
    Video,
    Trash2,
    Filter,
    Edit,
    UserPlus,
    MousePointer,
    Clock,
    Plus
} from 'lucide-react';

// Import separated components
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import AdminDashboard from '@/components/admin/sections/AdminDashboard';
import AdminPackagesAndClients from '@/components/admin/sections/AdminPackagesAndClients';
import AdminActivityLogs from '@/components/admin/sections/AdminActivityLogs';
import AdminBrandKits from '@/components/admin/sections/AdminBrandKits';
import AdminRevisions from '@/components/admin/sections/AdminRevisions';
import AdminClientRequests from '@/components/admin/sections/AdminClientRequests';
import UploadDeliverable from '@/components/admin/UploadDeliverable';

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
            package: "Website Development - Standard",
            status: "Active",
            progress: 90,
            lastActivity: "3 hours ago",
            budget: 25000,
            budgetUsed: 22000,
            projectManager: "Sarah Johnson"
        },
        {
            id: 4,
            name: "Lisa Chen",
            company: "Chen Consulting",
            email: "lisa@chen.com",
            phone: "+63 945 678 9012",
            package: "Google Ads - Premium",
            status: "Pending",
            progress: 0,
            lastActivity: "1 week ago",
            budget: 30000,
            budgetUsed: 0,
            projectManager: "Mike Chen"
        },
        {
            id: 5,
            name: "Robert Wilson",
            company: "Wilson & Co",
            email: "robert@wilson.com",
            phone: "+63 956 789 0123",
            package: "META Marketing - Premium",
            status: "Active",
            progress: 60,
            lastActivity: "5 hours ago",
            budget: 35000,
            budgetUsed: 21000,
            projectManager: "Sarah Johnson"
        }
    ],
    recentActivity: [
        {
            id: 1,
            type: "package_purchased",
            client: "John Smith",
            description: "Purchased META Marketing - Basic package",
            timestamp: "2024-02-01T10:30:00Z",
            amount: 6999
        },
        {
            id: 2,
            type: "deliverable_uploaded",
            client: "Maria Garcia",
            description: "Uploaded brand kit deliverables",
            timestamp: "2024-02-01T09:15:00Z"
        },
        {
            id: 3,
            type: "revision_requested",
            client: "David Lee",
            description: "Requested website design revisions",
            timestamp: "2024-02-01T08:45:00Z"
        },
        {
            id: 4,
            type: "campaign_launched",
            client: "Lisa Chen",
            description: "Launched Google Ads campaign",
            timestamp: "2024-02-01T07:20:00Z"
        },
        {
            id: 5,
            type: "payment_received",
            client: "Robert Wilson",
            description: "Received payment for Premium package",
            timestamp: "2024-02-01T06:30:00Z",
            amount: 17999
        }
    ],
    campaigns: [
        {
            id: 1,
            client: "John Smith",
            platform: "Facebook",
            status: "Active",
            budget: 20000,
            spent: 12500,
            impressions: 45000,
            clicks: 1200,
            conversions: 45,
            ctr: 2.67,
            cpc: 10.42,
            cpm: 277.78
        },
        {
            id: 2,
            client: "Maria Garcia",
            platform: "Instagram",
            status: "Active",
            budget: 15000,
            spent: 8000,
            impressions: 32000,
            clicks: 950,
            conversions: 32,
            ctr: 2.97,
            cpc: 8.42,
            cpm: 250.00
        },
        {
            id: 3,
            client: "David Lee",
            platform: "Google Ads",
            status: "Active",
            budget: 25000,
            spent: 22000,
            impressions: 28000,
            clicks: 1800,
            conversions: 78,
            ctr: 6.43,
            cpc: 12.22,
            cpm: 785.71
        },
        {
            id: 4,
            client: "Lisa Chen",
            platform: "Facebook",
            status: "Paused",
            budget: 30000,
            spent: 15000,
            impressions: 35000,
            clicks: 1100,
            conversions: 38,
            ctr: 3.14,
            cpc: 13.64,
            cpm: 428.57
        },
        {
            id: 5,
            client: "Robert Wilson",
            platform: "Instagram",
            status: "Active",
            budget: 35000,
            spent: 21000,
            impressions: 55000,
            clicks: 2200,
            conversions: 88,
            ctr: 4.00,
            cpc: 9.55,
            cpm: 381.82
        }
    ],
    analytics: {
        totalRevenue: 1250000,
        monthlyGrowth: 15.5,
        activeClients: 24,
        totalCampaigns: 45,
        averageCtr: 3.8,
        averageCpc: 11.2,
        totalImpressions: 195000,
        totalClicks: 7250,
        totalConversions: 281,
        conversionRate: 3.87
    },
    performanceMetrics: [
        {
            month: "Jan",
            revenue: 98000,
            clients: 18,
            campaigns: 32,
            conversions: 12
        },
        {
            month: "Feb",
            revenue: 125000,
            clients: 24,
            campaigns: 45,
            conversions: 18
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
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [brandKits, setBrandKits] = useState([]);
    const [loadingBrandKits, setLoadingBrandKits] = useState(false);
    const [revisionRequests, setRevisionRequests] = useState([]);
    const [loadingRevisions, setLoadingRevisions] = useState(false);

    // BrandKits state management

    // Fetch brandkits when component mounts or when brandkits section is active
    useEffect(() => {
        fetchBrandKits();
        fetchRevisionRequests();
    }, []);

    useEffect(() => {
        if (activeSection === "brandkits") {
            fetchBrandKits();
        }
        if (activeSection === "revisions") {
            fetchRevisionRequests();
        }
    }, [activeSection]);

    const handleLogout = () => {
        // Clear all auth data
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        toast.success("Admin logged out successfully");
        navigate("/admin/login");
    };

    const fetchBrandKits = async () => {
        setLoadingBrandKits(true);
        try {
            const response = await fetch('/api/brandkit/admin/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setBrandKits(data.data.forms || []);
            }
        } catch (error) {
            // Error handled by loading state
        } finally {
            setLoadingBrandKits(false);
        }
    };

    const fetchRevisionRequests = async () => {
        setLoadingRevisions(true);
        try {
            const response = await fetch('/api/admin/revision-requests', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setRevisionRequests(data.data || []);
            }
        } catch (error) {
            // Error handled by loading state
        } finally {
            setLoadingRevisions(false);
        }
    };

    const downloadBrandKit = async (brandKit) => {
        try {

            // Fetch all form types for this user
            const [brandKitData, organizationData] = await Promise.allSettled([
                // BrandKit data (already available)
                Promise.resolve(brandKit),



                // Organization data
                fetch(`/api/organization/admin/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(res => res.json()).then(data =>
                    data.success ? data.data.forms.find(form => form.user_id === brandKit.user_id) : null
                )
            ]);

            // Create comprehensive form data object
            const comprehensiveFormData = {
                // Metadata
                exportInfo: {
                    exportDate: new Date().toISOString(),
                    clientName: brandKit.business_name || 'Unknown Client',
                    clientEmail: brandKit.business_email || 'No email provided',
                    userId: brandKit.user_id,
                    formsCompleted: {
                        brandKit: brandKitData.status === 'fulfilled' && brandKitData.value,
                        organization: organizationData.status === 'fulfilled' && organizationData.value
                    }
                },

                // BrandKit Form (Knowing You Form)
                brandKitForm: brandKitData.status === 'fulfilled' ? {
                    formType: 'BrandKit (Knowing You Form)',
                    status: brandKit.is_completed ? 'Completed' : 'In Progress',
                    progressPercentage: brandKit.progress_percentage || 0,
                    data: {
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
                        updatedAt: brandKit.updated_at
                    }
                } : {
                    formType: 'BrandKit (Knowing You Form)',
                    status: 'Not Started',
                    progressPercentage: 0,
                    data: null,
                    error: brandKitData.reason?.message || 'Failed to fetch data'
                },



                // Organization Form
                organizationForm: organizationData.status === 'fulfilled' && organizationData.value ? {
                    formType: 'Organization Form',
                    status: organizationData.value.is_completed ? 'Completed' : 'In Progress',
                    progressPercentage: organizationData.value.progress_percentage || 0,
                    data: {
                        buildingType: organizationData.value.building_type,
                        organizationName: organizationData.value.organization_name,
                        socialMediaGoals: organizationData.value.social_media_goals,
                        brandUniqueness: organizationData.value.brand_uniqueness,
                        desiredEmotion: organizationData.value.desired_emotion,
                        targetPlatforms: organizationData.value.target_platforms,
                        contentTypes: organizationData.value.content_types,
                        deliverables: organizationData.value.deliverables,
                        timeline: organizationData.value.timeline,
                        mainContact: organizationData.value.main_contact,
                        additionalInfo: organizationData.value.additional_info,
                        referenceMaterials: organizationData.value.reference_materials,
                        createdAt: organizationData.value.created_at,
                        updatedAt: organizationData.value.updated_at
                    }
                } : {
                    formType: 'Organization Form',
                    status: 'Not Started',
                    progressPercentage: 0,
                    data: null,
                    error: organizationData.status === 'rejected' ? organizationData.reason?.message : 'No data found'
                }
            };

            // Create the download file
            const blob = new Blob([JSON.stringify(comprehensiveFormData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Complete_Forms_${brandKit.business_name || 'Client'}_${brandKit.user_id}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('✅ Complete form data downloaded successfully!');

        } catch (error) {
            toast.error('Failed to download form data. Please try again.');
        }
    };

    const downloadAllBrandKits = async () => {
        try {

            // Fetch all form types for all users
            const [allBrandKits, allOrganizations] = await Promise.allSettled([
                // All BrandKit data (already available)
                Promise.resolve(brandKits),

                // All Organization data
                fetch(`/api/organization/admin/all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(res => res.json()).then(data => data.success ? data.data.forms : [])
            ]);

            // Create comprehensive bulk export data
            const comprehensiveBulkData = {
                exportInfo: {
                    exportDate: new Date().toISOString(),
                    totalUsers: brandKits.length,
                    formsSummary: {
                        brandKits: allBrandKits.status === 'fulfilled' ? allBrandKits.value.length : 0,
                        organizations: allOrganizations.status === 'fulfilled' ? allOrganizations.value.length : 0
                    },
                    exportType: 'Comprehensive Bulk Export - All Form Types'
                },

                // Process each user's complete form data
                users: brandKits.map(brandKit => {
                    const userId = brandKit.user_id;

                    // Find corresponding Organization forms for this user

                    const organizationForm = allOrganizations.status === 'fulfilled'
                        ? allOrganizations.value.find(form => form.user_id === userId)
                        : null;

                    return {
                        userId: userId,
                        clientName: brandKit.business_name || 'Unknown Client',
                        clientEmail: brandKit.business_email || 'No email provided',
                        formsCompleted: {
                            brandKit: !!brandKit,
                            organization: !!organizationForm
                        },
                        totalFormsCompleted: [brandKit, organizationForm].filter(Boolean).length,

                        // BrandKit Form (Knowing You Form)
                        brandKitForm: {
                            formType: 'BrandKit (Knowing You Form)',
                            status: brandKit.is_completed ? 'Completed' : 'In Progress',
                            progressPercentage: brandKit.progress_percentage || 0,
                            data: {
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
                                updatedAt: brandKit.updated_at
                            }
                        },



                        // Organization Form
                        organizationForm: organizationForm ? {
                            formType: 'Organization Form',
                            status: organizationForm.is_completed ? 'Completed' : 'In Progress',
                            progressPercentage: organizationForm.progress_percentage || 0,
                            data: {
                                buildingType: organizationForm.building_type,
                                organizationName: organizationForm.organization_name,
                                socialMediaGoals: organizationForm.social_media_goals,
                                brandUniqueness: organizationForm.brand_uniqueness,
                                desiredEmotion: organizationForm.desired_emotion,
                                targetPlatforms: organizationForm.target_platforms,
                                contentTypes: organizationForm.content_types,
                                deliverables: organizationForm.deliverables,
                                timeline: organizationForm.timeline,
                                mainContact: organizationForm.main_contact,
                                additionalInfo: organizationForm.additional_info,
                                referenceMaterials: organizationForm.reference_materials,
                                createdAt: organizationForm.created_at,
                                updatedAt: organizationForm.updated_at
                            }
                        } : {
                            formType: 'Organization Form',
                            status: 'Not Started',
                            progressPercentage: 0,
                            data: null
                        }
                    };
                }),

                // Summary statistics
                summary: {
                    totalUsers: brandKits.length,
                    completedBrandKits: brandKits.filter(bk => bk.is_completed).length,
                    completedOrganizations: allOrganizations.status === 'fulfilled'
                        ? allOrganizations.value.filter(org => org.is_completed).length
                        : 0,
                    usersWithAllForms: brandKits.filter(bk => {
                        const userId = bk.user_id;
                        const hasOrganization = allOrganizations.status === 'fulfilled'
                            ? allOrganizations.value.some(org => org.user_id === userId)
                            : false;
                        return hasOrganization;
                    }).length
                }
            };

            // Create the download file
            const blob = new Blob([JSON.stringify(comprehensiveBulkData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Complete_Forms_Bulk_Export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success(`✅ Bulk export completed! ${comprehensiveBulkData.users.length} users processed.`);

        } catch (error) {
            toast.error('Failed to download bulk form data. Please try again.');
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
                            <option value="package_purchased">Package Purchased</option>
                            <option value="deliverable_uploaded">Deliverable Uploaded</option>
                            <option value="revision_requested">Revision Requested</option>
                            <option value="campaign_launched">Campaign Launched</option>
                            <option value="payment_received">Payment Received</option>
                        </select>
                    </div>

                    {/* Activity Logs */}
                    <div className="space-y-4">
                        {adminData.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                                        {activity.type === "package_purchased" && <CheckCircle className="w-6 h-6 text-black" />}
                                        {activity.type === "deliverable_uploaded" && <Upload className="w-6 h-6 text-black" />}
                                        {activity.type === "revision_requested" && <RefreshCw className="w-6 h-6 text-black" />}
                                        {activity.type === "campaign_launched" && <Eye className="w-6 h-6 text-black" />}
                                        {activity.type === "payment_received" && <DollarSign className="w-6 h-6 text-black" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            <span className="text-[#f7e833]">{activity.client}</span> {activity.description}
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

            {/* Upload Deliverable Section */}
            <UploadDeliverable />

            {/* Deliverables Management */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Complete Forms Management</CardTitle>
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
                                        <p className="text-gray-900">Website Development - Standard</p>
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
                                            Active
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-600">3 hours ago</p>
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
                                            <p className="font-semibold text-gray-900">Lisa Chen</p>
                                            <p className="text-sm text-gray-500">Chen Consulting</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">Google Ads - Premium</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                                            Ad Creatives
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">3 files</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                            Pending
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-600">1 week ago</p>
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
                                            <p className="font-semibold text-gray-900">Robert Wilson</p>
                                            <p className="text-sm text-gray-500">Wilson & Co</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">META Marketing - Premium</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                                            Branding Materials
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">4 files</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                            Active
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-600">5 hours ago</p>
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

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return (
                    <AdminDashboard
                        setActiveSection={setActiveSection}
                    />
                );
            case "packages":
                return (
                    <AdminPackagesAndClients
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />
                );
            case "activity":
                return <AdminActivityLogs adminData={adminData} />;
            case "brandkits":
                return (
                    <AdminBrandKits
                        brandKits={brandKits}
                        loadingBrandKits={loadingBrandKits}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        fetchBrandKits={fetchBrandKits}
                        downloadBrandKit={downloadBrandKit}
                        downloadAllBrandKits={downloadAllBrandKits}
                    />
                );
            case "revisions":
                return <AdminRevisions />;
            case "deliverable-upload":
                return <UploadDeliverable />;
            case "client-requests":
                return <AdminClientRequests />;
            default:
                return (
                    <AdminDashboard
                        setActiveSection={setActiveSection}
                    />
                );
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
            <AdminSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50 lg:ml-72">
                {/* Top Bar */}
                <AdminTopBar
                    activeSection={activeSection}
                    setSidebarOpen={setSidebarOpen}
                    onLogout={handleLogout}
                />

                {/* Page Content */}
                <div className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
