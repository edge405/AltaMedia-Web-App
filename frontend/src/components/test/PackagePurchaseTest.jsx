import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import apiService from "@/utils/api";

export default function PackagePurchaseTest() {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        setTestResults([]);

        const results = [];

        try {
            // Test 1: Get packages
            results.push({ test: "1. Fetch Available Packages", status: "running" });
            const packagesResponse = await apiService.getPackages();
            if (packagesResponse.success && packagesResponse.data?.packages?.length > 0) {
                results.push({ test: "1. Fetch Available Packages", status: "passed", data: packagesResponse.data.packages.length });
            } else {
                results.push({ test: "1. Fetch Available Packages", status: "failed", error: "No packages found" });
            }

            // Test 2: Get user package purchases
            results.push({ test: "2. Fetch User Package Purchases", status: "running" });
            const purchasesResponse = await apiService.getUserPackagePurchases();
            if (purchasesResponse.success) {
                results.push({ test: "2. Fetch User Package Purchases", status: "passed", data: purchasesResponse.data?.package_purchases?.length || 0 });
            } else {
                results.push({ test: "2. Fetch User Package Purchases", status: "failed", error: purchasesResponse.message });
            }

            // Test 3: Check features JSON structure
            if (purchasesResponse.success && purchasesResponse.data?.package_purchases?.length > 0) {
                const purchase = purchasesResponse.data.package_purchases[0];
                results.push({ test: "3. Check Features JSON Structure", status: "running" });

                if (purchase.features && Array.isArray(purchase.features)) {
                    const feature = purchase.features[0];
                    if (feature && feature.feature_id && feature.feature_name && feature.status) {
                        results.push({
                            test: "3. Check Features JSON Structure",
                            status: "passed",
                            data: `Features: ${purchase.features.length}, Sample: ${feature.feature_name} (${feature.status})`
                        });
                    } else {
                        results.push({ test: "3. Check Features JSON Structure", status: "failed", error: "Invalid feature structure" });
                    }
                } else {
                    results.push({ test: "3. Check Features JSON Structure", status: "failed", error: "No features found in purchase" });
                }
            }

            // Test 4: Test feature status update (if we have a purchase with features)
            if (purchasesResponse.success && purchasesResponse.data?.package_purchases?.length > 0) {
                const purchase = purchasesResponse.data.package_purchases[0];
                if (purchase.features && purchase.features.length > 0) {
                    const feature = purchase.features[0];
                    results.push({ test: "4. Test Feature Status Update", status: "running" });

                    try {
                        const updateResponse = await apiService.updatePurchaseFeatureStatus(
                            purchase.package_purchase_id,
                            feature.feature_id,
                            'active'
                        );

                        if (updateResponse.success) {
                            results.push({ test: "4. Test Feature Status Update", status: "passed", data: "Status updated successfully" });
                        } else {
                            results.push({ test: "4. Test Feature Status Update", status: "failed", error: updateResponse.message });
                        }
                    } catch (error) {
                        results.push({ test: "4. Test Feature Status Update", status: "failed", error: error.message });
                    }
                } else {
                    results.push({ test: "4. Test Feature Status Update", status: "skipped", data: "No features to test" });
                }
            }

        } catch (error) {
            results.push({ test: "Test Suite", status: "failed", error: error.message });
        }

        setTestResults(results);
        setLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'passed': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'running': return 'bg-blue-100 text-blue-800';
            case 'skipped': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed': return '✅';
            case 'failed': return '❌';
            case 'running': return '⏳';
            case 'skipped': return '⏭️';
            default: return '❓';
        }
    };

    return (
        <Card className="glass-effect border-slate-200/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                    Package Purchase Features JSON Integration Test
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={runTests}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Running Tests...' : 'Run Integration Tests'}
                </Button>

                {testResults.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-slate-800">Test Results:</h4>
                        {testResults.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <span>{getStatusIcon(result.status)}</span>
                                    <span className="font-medium">{result.test}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(result.status)}>
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

                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">What This Tests:</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Fetching available packages from the API</li>
                        <li>• Retrieving user's package purchases</li>
                        <li>• Verifying features JSON structure in purchases</li>
                        <li>• Testing feature status update functionality</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
