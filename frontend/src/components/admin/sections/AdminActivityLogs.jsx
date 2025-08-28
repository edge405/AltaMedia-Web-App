import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Download,
    CheckCircle,
    RefreshCw,
    Eye,
    Upload,
    DollarSign
} from 'lucide-react';

export default function AdminActivityLogs({ adminData }) {
    return (
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
                                        <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <Badge className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                    {activity.type.replace('_', ' ')}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
