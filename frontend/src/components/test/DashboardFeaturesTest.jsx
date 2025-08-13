import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Package } from "lucide-react";
import apiService from "@/utils/api";
import dashboardService from "@/services/dashboardService";

export default function DashboardFeaturesTest() {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [simulatedFeatures, setSimulatedFeatures] = useState([]);

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

            // Test 2: Get user purchases
            results.push({ test: "2. Fetch User Purchases", status: "running" });
            const purchasesResponse = await apiService.getUserPurchases();
            if (purchasesResponse.success) {
                results.push({ test: "2. Fetch User Purchases", status: "passed", data: purchasesResponse.data?.total_purchases || 0 });
            } else {
                results.push({ test: "2. Fetch User Purchases", status: "failed", error: purchasesResponse.message });
            }

            // Test 3: Check features JSON structure
            if (purchasesResponse.success && purchasesResponse.data?.purchases?.length > 0) {
                const purchase = purchasesResponse.data.purchases[0];
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

            // Test 4: Test dashboard service integration
            results.push({ test: "4. Test Dashboard Service Integration", status: "running" });

            // Simulate features JSON structure
            const mockFeatures = [
                {
                    feature_id: 16,
                    feature_name: "Dashboard",
                    feature_description: "Analytics dashboard access",
                    status: "pending",
                    is_active: true,
                    created_at: "2025-08-06T04:38:32.123496",
                    purchase_date: "2025-08-11T04:58:59.587Z"
                },
                {
                    feature_id: 17,
                    feature_name: "Website",
                    feature_description: "Website development",
                    status: "active",
                    is_active: true,
                    created_at: "2025-08-06T04:38:32.123496",
                    purchase_date: "2025-08-11T04:58:59.587Z"
                },
                {
                    feature_id: 18,
                    feature_name: "Content/Ad Management",
                    feature_description: "Content and ad management",
                    status: "inactive",
                    is_active: true,
                    created_at: "2025-08-06T04:38:32.123496",
                    purchase_date: "2025-08-11T04:58:59.587Z"
                }
            ];

            // Test dashboard service functions
            const transformedFeatures = dashboardService.transformPackageFeatures(mockFeatures);
            const projectFeatures = dashboardService.generateProjectFeatures({ features: transformedFeatures });

            if (projectFeatures.length > 0) {
                results.push({
                    test: "4. Test Dashboard Service Integration",
                    status: "passed",
                    data: `Generated ${projectFeatures.length} project features with statuses`
                });

                // Store simulated features for display
                setSimulatedFeatures(projectFeatures);
            } else {
                results.push({ test: "4. Test Dashboard Service Integration", status: "failed", error: "No features generated" });
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
                    Dashboard Features JSON Integration Test
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button
                    onClick={runTests}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Running Tests...' : 'Run Dashboard Integration Tests'}
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

                {/* Simulated Dashboard Features Display */}
                {simulatedFeatures.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-medium text-slate-800">Simulated Dashboard Features:</h4>
                        <div className="space-y-2">
                            {simulatedFeatures.map((feature, index) => (
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
                        <li>• Fetching packages and purchases from API</li>
                        <li>• Verifying features JSON structure in purchases</li>
                        <li>• Testing dashboard service integration</li>
                        <li>• Simulating dashboard features display with statuses</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
