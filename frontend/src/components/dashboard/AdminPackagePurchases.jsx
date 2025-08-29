import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Package,
    Calendar,
    DollarSign,
    Users,
    Search,
    Filter,
    Download,
    Eye
} from "lucide-react";
import apiService from "@/utils/api";

export default function AdminPackagePurchases() {
    const [packagePurchases, setPackagePurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchAllPackagePurchases();
    }, []);

    const fetchAllPackagePurchases = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getAllPackagePurchases();

            if (response.success && response.data?.package_purchases) {
                setPackagePurchases(response.data.package_purchases);
            } else {
                setError('Failed to load package purchases');
            }
        } catch (err) {
            console.error('Error fetching package purchases:', err);
            setError(err.message || 'Failed to load package purchases');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'expired':
                return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
            case 'cancelled':
                return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const filteredPurchases = packagePurchases.filter(purchase => {
        const matchesSearch =
            purchase.package_details?.package_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.user_details?.user_email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === "all" ||
            purchase.purchase_info?.status?.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <Card className="glass-effect border-slate-200/50 shadow-lg">
                <CardContent className="p-8">
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="glass-effect border-slate-200/50 shadow-lg">
                <CardContent className="p-8">
                    <div className="text-center text-red-600">
                        <p>Error loading package purchases: {error}</p>
                        <Button onClick={fetchAllPackagePurchases} className="mt-4">
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
                        <Package className="w-5 h-5 text-slate-600" />
                        All Package Purchases
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Manage and monitor all package purchases across the platform
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Search by package name or user email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600">Total Purchases</p>
                                <p className="text-2xl font-bold text-blue-800">{packagePurchases.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Active</p>
                                <p className="text-2xl font-bold text-green-800">
                                    {packagePurchases.filter(p => p.purchase_info?.status === 'active').length}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Expired</p>
                                <p className="text-2xl font-bold text-yellow-800">
                                    {packagePurchases.filter(p => p.purchase_info?.status === 'expired').length}
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-purple-800">
                                    {formatCurrency(packagePurchases.reduce((sum, p) => sum + (p.purchase_info?.total_amount || 0), 0))}
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Package Purchases List */}
            <div className="space-y-4">
                {filteredPurchases.map((purchase) => (
                    <Card key={purchase.package_purchase_id} className="glass-effect border-slate-200/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-semibold text-slate-800">
                                        {purchase.package_details?.package_name}
                                    </CardTitle>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {purchase.package_details?.package_description}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        User: {purchase.user_details?.user_email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(purchase.purchase_info?.status)}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Purchase Info */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-600" />
                                    <div>
                                        <p className="text-xs text-slate-500">Purchase Date</p>
                                        <p className="text-sm font-medium">{formatDate(purchase.purchase_info?.purchase_date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-600" />
                                    <div>
                                        <p className="text-xs text-slate-500">Expires</p>
                                        <p className="text-sm font-medium">{formatDate(purchase.purchase_info?.expiration_date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-600" />
                                    <div>
                                        <p className="text-xs text-slate-500">Amount</p>
                                        <p className="text-sm font-medium">{formatCurrency(purchase.purchase_info?.total_amount)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-slate-600" />
                                    <div>
                                        <p className="text-xs text-slate-500">Features</p>
                                        <p className="text-sm font-medium">{purchase.package_details?.features?.length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Features Preview */}
                            <div>
                                <h4 className="font-medium text-slate-800 mb-3">Package Features</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {purchase.package_details?.features?.slice(0, 4).map((feature) => (
                                        <div key={feature.feature_id} className="p-2 bg-white rounded border border-slate-200">
                                            <p className="text-sm font-medium text-slate-800">{feature.feature_info?.feature_name}</p>
                                            <p className="text-xs text-slate-600">{feature.feature_info?.feature_description}</p>
                                        </div>
                                    ))}
                                    {purchase.package_details?.features?.length > 4 && (
                                        <div className="p-2 bg-slate-50 rounded border border-slate-200">
                                            <p className="text-sm text-slate-600">
                                                +{purchase.package_details.features.length - 4} more features
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Details
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-1" />
                                    Export
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPurchases.length === 0 && (
                <Card className="glass-effect border-slate-200/50 shadow-lg">
                    <CardContent className="p-8">
                        <div className="text-center">
                            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-800 mb-2">No Package Purchases Found</h3>
                            <p className="text-slate-600">
                                {searchTerm || filterStatus !== "all"
                                    ? "Try adjusting your search or filter criteria."
                                    : "No package purchases have been made yet."
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
