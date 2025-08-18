import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Eye, 
  Users, 
  MousePointer, 
  Target 
} from 'lucide-react';

export default function AnalyticsSection({ clientData, getStatusColor }) {
  return (
    <div className="space-y-6">
      {/* Weekly Summary */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Weekly Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {clientData.analytics.weekly.reach.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Impressions</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {clientData.analytics.weekly.engagement}
              </p>
              <p className="text-sm text-gray-500">Engagement</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {clientData.analytics.weekly.clicks}
              </p>
              <p className="text-sm text-gray-500">Clicks</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {clientData.analytics.weekly.conversions}
              </p>
              <p className="text-sm text-gray-500">Conversions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Reach</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">CTR</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Conversions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {clientData.analytics.campaigns.map((campaign, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{campaign.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{campaign.reach.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{campaign.ctr}%</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{campaign.conversions}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                        {campaign.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
