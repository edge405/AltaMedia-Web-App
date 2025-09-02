import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Globe,
    Target,
    BarChart3,
    RefreshCw,
    Search,
    Eye,
    Calendar,
    Package,
    User,
    Mail
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

    // State for client detail modal
    const [selectedClient, setSelectedClient] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
                // Group packages by user email to get unique clients
                const packages = clientsResponse.data.packages || [];
                const uniqueClients = packages.reduce((acc, pkg) => {
                    const email = pkg.user_email;
                    if (!acc[email]) {
                        acc[email] = {
                            id: pkg.id,
                            user_name: pkg.user_name,
                            user_email: email,
                            packages: []
                        };
                    }
                    acc[email].packages.push(pkg);
                    return acc;
                }, {});

                setClients(Object.values(uniqueClients));
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
            client.user_email?.toLowerCase().includes(searchTerm.toLowerCase());

        // For now, show all clients regardless of status filter since we're grouping by client
        const matchesStatus = filterStatus === 'all';

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

    // Handle client row click to show details
    const handleClientClick = (client) => {
        setSelectedClient(client);
        setIsDetailModalOpen(true);
    };

    // Close detail modal
    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedClient(null);
        setClientDetails(null);
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
                            <option value="all">All Clients</option>
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
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Email</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Total Packages</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Total Spent</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => {
                                        const totalSpent = client.packages.reduce((sum, pkg) =>
                                            sum + parseFloat(pkg.total_amount || 0), 0
                                        );

                                        return (
                                            <tr
                                                key={client.id}
                                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleClientClick(client)}
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {client.user_name || 'Unknown User'}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Client ID: {client.id}
                                                            </p>
                                                        </div>
                                                        <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-gray-900 font-medium">
                                                        {client.user_email || 'No email'}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full">
                                                        {client.packages.length} packages
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-gray-900 font-medium">
                                                        ₱{totalSpent.toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClientClick(client);
                                                        }}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
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

            {/* Client Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            Client Details
                        </DialogTitle>
                    </DialogHeader>

                    {selectedClient && (
                        <div className="space-y-6">
                            {/* Basic Client Information */}
                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-blue-500 rounded-full mr-4">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {selectedClient.user_name || 'Unknown User'}
                                            </h3>
                                            <p className="text-gray-600">
                                                Client ID: {selectedClient.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium text-gray-900">
                                                    {selectedClient.user_email || 'No email provided'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Member Since</p>
                                                <p className="font-medium text-gray-900">
                                                    {formatDate(selectedClient.purchase_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* All Packages */}
                            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-green-500 rounded-full mr-4">
                                            <Package className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">All Purchased Packages</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {selectedClient.packages && selectedClient.packages.length > 0 ? (
                                            selectedClient.packages.map((pkg, index) => (
                                                <div key={index} className="bg-white p-4 rounded-xl border border-green-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {pkg.package_name || 'Unknown Package'}
                                                        </h4>
                                                        <Badge className={`${getStatusColor(pkg.status)} text-white px-3 py-1 rounded-full`}>
                                                            {getStatusText(pkg.status)}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Amount</p>
                                                            <p className="font-medium text-gray-900">
                                                                ₱{parseFloat(pkg.total_amount || 0).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Purchase Date</p>
                                                            <p className="font-medium text-gray-900">
                                                                {formatDate(pkg.purchase_date)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Expiration</p>
                                                            <p className="font-medium text-gray-900">
                                                                {formatDate(pkg.expiration_date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No packages found for this client.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 p-4 bg-white rounded-xl border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total Spent</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                ₱{selectedClient.packages ?
                                                    selectedClient.packages.reduce((sum, pkg) =>
                                                        sum + parseFloat(pkg.total_amount || 0), 0
                                                    ).toLocaleString() : '0'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
