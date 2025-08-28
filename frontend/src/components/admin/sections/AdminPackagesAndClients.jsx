import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Globe,
    Target,
    BarChart3,
    RefreshCw,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Users
} from 'lucide-react';
import { toast } from 'sonner';
import { userPackageApi } from '@/utils/userPackageApi';

export default function AdminPackagesAndClients({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus
}) {
    // State for packages and clients
    const [packages, setPackages] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch packages and clients data
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [packagesResponse, clientsResponse] = await Promise.all([
                userPackageApi.getAllUserPackages(),
                userPackageApi.getAllUserPackages()
            ]);

            if (packagesResponse.success) {
                setPackages(packagesResponse.data.packages || []);
            }

            if (clientsResponse.success) {
                setClients(clientsResponse.data.packages || []);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate package statistics
    const calculatePackageStats = () => {
        const stats = {
            metaMarketing: { active: 0, total: 0 },
            aiMarketing: { active: 0, total: 0 },
            websiteDev: { active: 0, total: 0 },
            googleAds: { active: 0, total: 0 }
        };

        packages.forEach(pkg => {
            const packageName = pkg.package_name?.toLowerCase() || '';
            const isActive = pkg.status === 'active';

            if (packageName.includes('meta') || packageName.includes('social')) {
                stats.metaMarketing.total++;
                if (isActive) stats.metaMarketing.active++;
            } else if (packageName.includes('ai') || packageName.includes('artificial')) {
                stats.aiMarketing.total++;
                if (isActive) stats.aiMarketing.active++;
            } else if (packageName.includes('website') || packageName.includes('web') || packageName.includes('development')) {
                stats.websiteDev.total++;
                if (isActive) stats.websiteDev.active++;
            } else if (packageName.includes('google') || packageName.includes('ads') || packageName.includes('ppc')) {
                stats.googleAds.total++;
                if (isActive) stats.googleAds.active++;
            }
        });

        return stats;
    };

    // Calculate overall progress for a client based on their features
    const calculateProgress = (features) => {
        if (!features || features.length === 0) return 0;

        const completedFeatures = features.filter(feature =>
            feature.status === 'completed' || feature.progress === 100
        );

        return Math.round((completedFeatures.length / features.length) * 100);
    };

    // Get status color based on package status
    const getStatusColor = (status) => {
        if (status === 'active') return "bg-green-500";
        if (status === 'expired') return "bg-red-500";
        if (status === 'pending') return "bg-gray-500";
        return "bg-gray-500";
    };

    // Get status text based on package status and progress
    const getStatusText = (status, progress = 0) => {
        if (status === 'active') {
            return "Active";
        }
        if (status === 'expired') return "Expired";
        if (status === 'pending') return "Pending";
        return status;
    };

    // Filter clients based on search term and status
    const filteredClients = clients.filter(client => {
        const matchesSearch =
            client.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.package_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ||
            getStatusText(client.status, calculateProgress(client.features)) === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchData();
    };

    const packageStats = calculatePackageStats();

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-600">Loading data...</p>
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
                            <Button onClick={handleRefresh} variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Packages Section */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">Packages & Deliverables</CardTitle>
                        <div className="flex space-x-3">
                            <Button
                                onClick={handleRefresh}
                                variant="outline"
                                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-2xl"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Package Types */}
                    <div className="flex justify-center mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500 rounded-2xl">
                                        <Globe className="w-6 h-6 text-white" />
                                    </div>
                                    <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full">
                                        {packageStats.metaMarketing.active}/{packageStats.metaMarketing.total}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">META Marketing</h3>
                                <p className="text-gray-600 text-sm">Social media advertising and management</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-3xl border border-purple-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-500 rounded-2xl">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <Badge className="bg-purple-500 text-white px-3 py-1 rounded-full">
                                        {packageStats.aiMarketing.active}/{packageStats.aiMarketing.total}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Marketing</h3>
                                <p className="text-gray-600 text-sm">AI-powered marketing automation</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-3xl border border-green-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-500 rounded-2xl">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <Badge className="bg-green-500 text-white px-3 py-1 rounded-full">
                                        {packageStats.websiteDev.active}/{packageStats.websiteDev.total}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Website Development</h3>
                                <p className="text-gray-600 text-sm">Custom website design and development</p>
                            </div>

                            {/* <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-3xl border border-orange-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-orange-500 rounded-2xl">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full">
                                        {packageStats.googleAds.active}/{packageStats.googleAds.total}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Google Ads</h3>
                                <p className="text-gray-600 text-sm">PPC advertising and campaign management</p>
                            </div> */}
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Clients Section */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">Client Management</CardTitle>
                            <p className="text-gray-600 mt-1">
                                {filteredClients.length} of {clients.length} clients
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                onClick={handleRefresh}
                                variant="outline"
                                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
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
                                placeholder="Search clients by name, email, or package..."
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
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>

                    {/* Client Table */}
                    <div className="overflow-x-auto">
                        {filteredClients.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {clients.length === 0 ? 'No clients found' : 'No clients match your search criteria'}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Client Name</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Package</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Purchase Date</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Expiration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => {
                                        const statusText = getStatusText(client.status);
                                        const statusColor = getStatusColor(client.status);

                                        return (
                                            <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {client.user_name || 'Unknown User'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {client.user_email || 'No email'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="text-gray-900 font-medium">
                                                            {client.package_name || 'Unknown Package'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            ₱{parseFloat(client.total_amount || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className={`${statusColor} text-white px-3 py-1 rounded-full`}>
                                                        {statusText}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-gray-600">
                                                        {formatDate(client.purchase_date)}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-gray-600">
                                                        {formatDate(client.expiration_date)}
                                                    </p>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
