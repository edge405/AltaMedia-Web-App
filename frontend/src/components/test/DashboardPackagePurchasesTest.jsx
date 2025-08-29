import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Package } from "lucide-react";
import apiService from "@/utils/api";
import dashboardService from "@/services/dashboardService";

export default function DashboardPackagePurchasesTest() {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actualFeatures, setActualFeatures] = useState([]);
    const [rawData, setRawData] = useState(null);

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

                // Store raw data for inspection
                setRawData(packagePurchasesResponse.data);
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

            // Test 3: Test dashboard service integration with real data
            results.push({ test: "3. Test Dashboard Service with Real Data", status: "running" });

            if (packagePurchasesResponse.success && packagePurchasesResponse.data?.package_purchases?.length > 0) {
                const purchase = packagePurchasesResponse.data.package_purchases[0];

                // Transform using dashboard service
                const packageDetails = dashboardService.transformPackageDetails(purchase);
                const projectFeatures = dashboardService.generateProjectFeatures(packageDetails, []);

                if (projectFeatures.length > 0) {
                    results.push({
                        test: "3. Test Dashboard Service with Real Data",
                        status: "passed",
                        data: `Generated ${projectFeatures.length} project features from real package purchase data`
                    });

                    // Store actual features for display
                    setActualFeatures(projectFeatures);
                } else {
                    results.push({ test: "3. Test Dashboard Service with Real Data", status: "failed", error: "No features generated from real data" });
                }
            }

            // Test 4: Verify features have correct status
            if (actualFeatures.length > 0) {
                results.push({ test: "4. Verify Feature Statuses", status: "running" });

                const featuresWithStatus = actualFeatures.filter(f => f.status);
                if (featuresWithStatus.length > 0) {
                    results.push({
                        test: "4. Verify Feature Statuses",
                        status: "passed",
                        data: `${featuresWithStatus.length} features have status: ${featuresWithStatus.map(f => f.status).join(', ')}`
                    });
                } else {
                    results.push({ test: "4. Verify Feature Statuses", status: "failed", error: "No features have status" });
                }
            }

            // Test 5: Check feature structure
            if (actualFeatures.length > 0) {
                results.push({ test: "5. Check Feature Structure", status: "running" });

                const feature = actualFeatures[0];
                const hasRequiredFields = feature.title && feature.status && feature.description !== undefined;

                if (hasRequiredFields) {
                    results.push({
                        test: "5. Check Feature Structure",
                        status: "passed",
                        data: `Feature has required fields: title, status, description`
                    });
                } else {
                    results.push({ test: "5. Check Feature Structure", status: "failed", error: "Missing required fields in feature structure" });
                }
            }

        } catch (error) {
            results.push({ test: "Test Suite", status: "failed", error: error.message });
        }

        setTestResults(results);
        setLoading(false);
    };

    const getStatusColor = (status) => {
        return dashboardService.getStatusColor(status);
    };

    const getIconComponent = (iconName) => {
        const iconMap = {
            "BarChart3": "📊",
            "Globe": "🌐",
            "Package": "📦",
            "FileText": "📄",
            "Calendar": "📅",
            "Play": "▶️",
            "Zap": "⚡"
        };
        return iconMap[iconName] || "📦";
    };

    return (
        <Card className="glass-effect border-slate-200/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                    Dashboard Package Purchases Test
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button
                    onClick={runTests}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Running Tests...' : 'Test Features Display from /api/package-purchases'}
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

                {/* Raw Data Inspection */}
                {rawData && (
                    <div className="space-y-4">
                        <h4 className="font-medium text-slate-800">Raw Package Purchase Data:</h4>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <pre className="text-xs text-slate-600 overflow-auto max-h-40">
                                {JSON.stringify(rawData, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Actual Features Display */}
                {actualFeatures.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-medium text-slate-800">Actual Features from Dashboard Service:</h4>
                        <div className="space-y-2">
                            {actualFeatures.map((feature, index) => (
                                <Card key={feature.id} className="bg-white rounded-lg border border-slate-200">
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3 flex-1">
                                                <div className="mt-0.5">
                                                    <div className={`w-7 h-7 rounded flex items-center justify-center ${getStatusColor(feature.status)}`}>
                                                        <span className="text-white text-sm">{getIconComponent(feature.icon)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                                                            <h3 className="font-medium text-slate-800 text-sm leading-tight break-words">{feature.title}</h3>
                                                        </div>
                                                        <Badge className={`text-xs whitespace-nowrap flex-shrink-0 ${getStatusColor(feature.status)}`}>
                                                            {feature.status}
                                                        </Badge>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="text-xs text-slate-600 mb-1">
                                                        <span>{feature.description}</span>
                                                    </div>

                                                    {/* Output Status */}
                                                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                                        <span className="truncate">{feature.output}</span>
                                                    </div>

                                                    {/* Time */}
                                                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{feature.time}</span>
                                                    </div>

                                                    {/* Feature Details */}
                                                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                                                        <span>ID: {feature.id}</span>
                                                        {feature.feature_status && <span>| Status: {feature.feature_status}</span>}
                                                        {feature.packageFeatureId && <span>| Package Feature ID: {feature.packageFeatureId}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">What This Tests:</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Package purchase functionality (endpoint removed)</li>
                        <li>• Dashboard service with package purchase data</li>
                        <li>• Displaying features with statuses from the database</li>
                        <li>• Checking feature structure includes title, status, and description</li>
                        <li>• UI components for package management</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
