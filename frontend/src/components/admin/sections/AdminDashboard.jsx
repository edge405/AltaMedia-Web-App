import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users as UsersIcon,
    Package,
    Target,
    DollarSign,
    Globe,
    Eye,
    CheckCircle,
    RefreshCw,
    Download,
    MousePointer,
    Palette,
    Clock,
    BarChart3,
    Upload,
    TrendingUp,
    Activity,
    FileText,
    MessageSquare,
    AlertTriangle
} from 'lucide-react';
import { userPackageApi } from '@/utils/userPackageApi';

export default function AdminDashboard({ setActiveSection }) {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await userPackageApi.getAdminDashboardStats();
            setDashboardData(response.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-600">Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={fetchDashboardData} variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="space-y-8">
                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="text-center">
                            <p className="text-gray-600">No dashboard data available</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Get package distribution data
    const packageDistribution = dashboardData.overview?.package_distribution || {};
    const metaCount = packageDistribution.meta || 0;
    const aiCount = packageDistribution.ai || 0;
    const websiteCount = packageDistribution.website || 0;
    const googleAdsCount = packageDistribution.googleads || 0;

    // Get brandkit data
    const brandkitData = dashboardData.brandkits || {};
    const brandkitBreakdown = brandkitData.breakdown || {};

    // Get client requests data
    const clientRequestsData = dashboardData.client_requests || {};

    return (
        <div className="space-y-8">
            {/* Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardData.overview?.total_packages || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Brandkits</p>
                                <p className="text-3xl font-bold text-purple-600">{dashboardData.overview?.total_brandkits || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Client Requests</p>
                                <p className="text-3xl font-bold text-orange-600">{clientRequestsData.total_requests || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Brandkit Completion</p>
                                <p className="text-3xl font-bold text-green-600">{dashboardData.overview?.brandkit_completion_rate || 0}%</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Button
                            onClick={() => setActiveSection("deliverable-upload")}
                            className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-200 hover:scale-105"
                        >
                            <Upload className="w-8 h-8" />
                            <span className="font-semibold">Upload Deliverables</span>
                            <span className="text-sm opacity-90">Add files or links for clients</span>
                        </Button>

                        <Button
                            onClick={() => setActiveSection("revisions")}
                            className="h-24 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-200 hover:scale-105"
                        >
                            <RefreshCw className="w-8 h-8" />
                            <span className="font-semibold">Revision Requests</span>
                            <span className="text-sm opacity-90">Handle client feedback</span>
                        </Button>

                        <Button
                            onClick={() => setActiveSection("client-requests")}
                            className="h-24 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-200 hover:scale-105"
                        >
                            <MessageSquare className="w-8 h-8" />
                            <span className="font-semibold">Client Requests</span>
                            <span className="text-sm opacity-90">Support & inquiries</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Brandkit Statistics */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Brandkit Forms Overview</CardTitle>
                        <Button
                            onClick={() => setActiveSection("brandkits")}
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            View All Brandkits
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="text-center p-6 bg-purple-50 rounded-3xl">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{brandkitData.total_forms || 0}</p>
                            <p className="text-gray-600 font-medium">Total Forms</p>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-3xl">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{brandkitData.completed_forms || 0}</p>
                            <p className="text-gray-600 font-medium">Completed</p>
                        </div>
                        <div className="text-center p-6 bg-yellow-50 rounded-3xl">
                            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{brandkitData.pending_forms || 0}</p>
                            <p className="text-gray-600 font-medium">Pending</p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-3xl">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{brandkitData.completion_rate || 0}%</p>
                            <p className="text-gray-600 font-medium">Completion Rate</p>
                        </div>
                    </div>

                    {/* Brandkit Form Types Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <h4 className="font-semibold text-gray-900 mb-2">Brandkit Forms</h4>
                            <p className="text-2xl font-bold text-purple-600">{brandkitBreakdown.brandkit_forms?.total || 0}</p>
                            <p className="text-sm text-gray-600">{brandkitBreakdown.brandkit_forms?.completed || 0} completed</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <h4 className="font-semibold text-gray-900 mb-2">Questionnaires</h4>
                            <p className="text-2xl font-bold text-blue-600">{brandkitBreakdown.questionnaire_forms?.total || 0}</p>
                            <p className="text-sm text-gray-600">{brandkitBreakdown.questionnaire_forms?.completed || 0} completed</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <h4 className="font-semibold text-gray-900 mb-2">Organization Forms</h4>
                            <p className="text-2xl font-bold text-green-600">{brandkitBreakdown.organization_forms?.total || 0}</p>
                            <p className="text-sm text-gray-600">{brandkitBreakdown.organization_forms?.completed || 0} completed</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Client Requests Statistics */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Client Requests Overview</CardTitle>
                        <Button
                            onClick={() => setActiveSection("client-requests")}
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View All Requests
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="text-center p-6 bg-orange-50 rounded-3xl">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{clientRequestsData.total_requests || 0}</p>
                            <p className="text-gray-600 font-medium">Total Requests</p>
                        </div>
                        <div className="text-center p-6 bg-yellow-50 rounded-3xl">
                            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{clientRequestsData.pending_requests || 0}</p>
                            <p className="text-gray-600 font-medium">Pending</p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-3xl">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Activity className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{clientRequestsData.in_progress_requests || 0}</p>
                            <p className="text-gray-600 font-medium">In Progress</p>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-3xl">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {parseInt(clientRequestsData.resolved_requests || 0) + parseInt(clientRequestsData.closed_requests || 0)}
                            </p>
                            <p className="text-gray-600 font-medium">Resolved</p>
                        </div>
                    </div>

                    {/* Priority Requests */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-red-900 mb-1">Urgent Requests</h4>
                                    <p className="text-2xl font-bold text-red-600">{clientRequestsData.urgent_requests || 0}</p>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-orange-900 mb-1">High Priority</h4>
                                    <p className="text-2xl font-bold text-orange-600">{clientRequestsData.high_priority_requests || 0}</p>
                                </div>
                                <Target className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
