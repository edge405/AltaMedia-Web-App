import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminAllForms from '../admin/sections/AdminBrandKits';
import formExportUtils from '@/utils/formExportUtils';

export default function AdminFormsTest() {
    const [testResults, setTestResults] = useState([]);

    const addTestResult = (test, result, details = '') => {
        setTestResults(prev => [...prev, {
            test,
            result,
            details,
            timestamp: new Date().toISOString()
        }]);
    };

    const testPDFGeneration = async () => {
        try {
            const testData = {
                business_name: 'Test Business',
                business_email: 'test@example.com',
                industry: ['Technology', 'SaaS'],
                mission_statement: 'This is a test mission statement for the business.',
                progress_percentage: 85,
                is_completed: true
            };

            await formExportUtils.generatePDF(testData, 'brandkit', 'test_export');
            addTestResult('PDF Generation', 'PASS', 'PDF generated successfully');
        } catch (error) {
            addTestResult('PDF Generation', 'FAIL', error.message);
        }
    };

    const testJSONExport = () => {
        try {
            const testData = {
                business_name: 'Test Business',
                business_email: 'test@example.com',
                industry: ['Technology', 'SaaS']
            };

            formExportUtils.exportAsJSON(testData, 'test_json_export');
            addTestResult('JSON Export', 'PASS', 'JSON file exported successfully');
        } catch (error) {
            addTestResult('JSON Export', 'FAIL', error.message);
        }
    };

    const testCSVExport = () => {
        try {
            const testData = {
                business_name: 'Test Business',
                business_email: 'test@example.com',
                industry: ['Technology', 'SaaS']
            };

            formExportUtils.exportAsCSV(testData, 'test_csv_export');
            addTestResult('CSV Export', 'PASS', 'CSV file exported successfully');
        } catch (error) {
            addTestResult('CSV Export', 'FAIL', error.message);
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="space-y-8 p-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Admin Forms Management Test Suite
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div className="flex space-x-4">
                            <Button
                                onClick={testPDFGeneration}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold"
                            >
                                Test PDF Generation
                            </Button>
                            <Button
                                onClick={testJSONExport}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold"
                            >
                                Test JSON Export
                            </Button>
                            <Button
                                onClick={testCSVExport}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-semibold"
                            >
                                Test CSV Export
                            </Button>
                            <Button
                                onClick={clearResults}
                                variant="outline"
                                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100 px-6 py-3 rounded-2xl font-semibold"
                            >
                                Clear Results
                            </Button>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {testResults.length === 0 ? (
                                    <p className="text-gray-500">No tests run yet. Click the buttons above to run tests.</p>
                                ) : (
                                    testResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-2xl border-2 ${result.result === 'PASS'
                                                ? 'border-green-200 bg-green-50'
                                                : 'border-red-200 bg-red-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className={`font-semibold ${result.result === 'PASS' ? 'text-green-800' : 'text-red-800'
                                                        }`}>
                                                        {result.test}: {result.result}
                                                    </p>
                                                    {result.details && (
                                                        <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(result.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AdminBrandKits Component Test */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        AdminAllForms Component Test
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <AdminAllForms
                        brandKits={[]}
                        loadingBrandKits={false}
                        searchTerm=""
                        setSearchTerm={() => { }}
                        filterStatus="all"
                        setFilterStatus={() => { }}
                        fetchBrandKits={() => { }}
                        downloadBrandKit={() => { }}
                        downloadAllBrandKits={() => { }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}








