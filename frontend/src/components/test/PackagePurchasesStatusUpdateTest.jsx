import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Clock } from "lucide-react";
import apiService from "@/utils/api";

export default function PackagePurchasesStatusUpdateTest() {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [packagePurchases, setPackagePurchases] = useState([]);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const runTests = async () => {
        setLoading(true);
        setTestResults([]);

        const results = [];

        try {
            // Test 1: Get user package purchases
            results.push({ test: "1. Fetch User Package Purchases", status: "running" });
            const packagePurchasesResponse = await apiService.getUserPackagePurchases();

            if (packagePurchasesResponse.success) {
                results.push({
                    test: "1. Fetch User Package Purchases",
                    status: "passed",
                    data: `Found ${packagePurchasesResponse.data?.total_package_purchases || 0} package purchases`
                });

                setPackagePurchases(packagePurchasesResponse.data?.package_purchases || []);
            } else {
                results.push({ test: "1. Fetch User Package Purchases", status: "failed", error: packagePurchasesResponse.message });
            }

            // Test 2: Check if package purchases have features
            if (packagePurchasesResponse.success && packagePurchasesResponse.data?.package_purchases?.length > 0) {
                const purchase = packagePurchasesResponse.data.package_purchases[0];
                results.push({ test: "2. Check Features in Package Purchase", status: "running" });

                if (purchase.package_details?.features && Array.isArray(purchase.package_details.features)) {
                    results.push({
                        test: "2. Check Features in Package Purchase",
                        status: "passed",
                        data: `Package has ${purchase.package_details.features.length} features`
                    });
                } else {
                    results.push({ test: "2. Check Features in Package Purchase", status: "failed", error: "No features found in package" });
                }
            }

            // Test 3: Test status update functionality
            if (packagePurchasesResponse.success && packagePurchasesResponse.data?.package_purchases?.length > 0) {
                const purchase = packagePurchasesResponse.data.package_purchases[0];
                const feature = purchase.package_details?.features?.[0];

                if (feature) {
                    results.push({ test: "3. Test Status Update API", status: "running" });

                    const newStatus = feature.feature_info.status === 'pending' ? 'active' : 'pending';
                    const updateResponse = await apiService.updatePurchaseFeatureStatus(
                        purchase.package_purchase_id,
                        feature.feature_id,
                        newStatus
                    );

                    if (updateResponse.success) {
                        results.push({
                            test: "3. Test Status Update API",
                            status: "passed",
                            data: `Successfully updated feature ${feature.feature_info.feature_name} to ${newStatus}`
                        });
                    } else {
                        results.push({ test: "3. Test Status Update API", status: "failed", error: updateResponse.message });
                    }
                }
            }

        } catch (error) {
            results.push({ test: "Test Suite", status: "failed", error: error.message });
        }

        setTestResults(results);
        setLoading(false);
    };

    const handleUpdateFeatureStatus = async (purchaseId, featureId, newStatus) => {
        try {
            setUpdatingStatus(true);
            const response = await apiService.updatePurchaseFeatureStatus(purchaseId, featureId, newStatus);

            if (response.success) {
                // Refresh package purchases to get updated data
                const refreshResponse = await apiService.getUserPackagePurchases();
                if (refreshResponse.success) {
                    setPackagePurchases(refreshResponse.data?.package_purchases || []);
                }
            }
        } catch (err) {
            console.error('Error updating feature status:', err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getFeatureStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'deprecated':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card className="glass-effect border-slate-200/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                    Package Purchases Status Update Test
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button
                    onClick={runTests}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Running Tests...' : 'Test Status Update Functionality'}
                </Button>

                {testResults.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-slate-800">Test Results:</h4>
                        {testResults.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <span>{result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏳'}</span>
                                    <span className="font-medium">{result.test}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={result.status === 'passed' ? 'bg-green-100 text-green-800' : result.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                                        {result.status}
                                    </Badge>
                                    {result.data && (
                                        <span className="text-sm text-slate-600">{result.data}</span>
                                    )}
                                    {result.error && (
                                        <span className="text-sm text-red-600">{result.error}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Package Purchases Display with Status Management */}
                {packagePurchases.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-medium text-slate-800">Package Purchases with Status Management:</h4>
                        {packagePurchases.map((purchase) => (
                            <Card key={purchase.package_purchase_id} className="bg-white rounded-lg border border-slate-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-medium text-slate-800">{purchase.package_details.package_name}</h3>
                                            <p className="text-sm text-slate-600">{purchase.package_details.package_description}</p>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800">
                                            {purchase.purchase_info.status}
                                        </Badge>
                                    </div>

                                    {/* Purchase Info */}
                                    <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-slate-500">Purchase Date</p>
                                            <p className="text-sm font-medium">{formatDate(purchase.purchase_info.purchase_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Expires</p>
                                            <p className="text-sm font-medium">{formatDate(purchase.purchase_info.expiration_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Amount</p>
                                            <p className="text-sm font-medium">${purchase.purchase_info.total_amount}</p>
                                        </div>
                                    </div>

                                    {/* Features with Status Management */}
                                    <div>
                                        <h4 className="font-medium text-slate-800 mb-3">Features:</h4>
                                        <div className="space-y-2">
                                            {purchase.package_details?.features?.map((feature) => (
                                                <div key={feature.feature_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h5 className="font-medium text-slate-800">{feature.feature_info.feature_name}</h5>
                                                            <Badge className={getFeatureStatusColor(feature.feature_info.status)}>
                                                                {feature.feature_info.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-600">{feature.feature_info.feature_description || 'No description'}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Select
                                                            value={feature.feature_info.status}
                                                            onValueChange={(newStatus) =>
                                                                handleUpdateFeatureStatus(purchase.package_purchase_id, feature.feature_id, newStatus)
                                                            }
                                                            disabled={updatingStatus}
                                                        >
                                                            <SelectTrigger className="w-32">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="active">Active</SelectItem>
                                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="deprecated">Deprecated</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">What This Tests:</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Fetching package purchases from /api/package-purchases endpoint</li>
                        <li>• Verifying features structure in package_details</li>
                        <li>• Testing status update API functionality</li>
                        <li>• Real-time status management with dropdown selectors</li>
                        <li>• Automatic refresh after status updates</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
