import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Calendar, 
  TrendingUp, 
  MousePointer, 
  Target 
} from 'lucide-react';

export default function DashboardSection({ clientData, onViewPackage, onViewDeliverables }) {
  return (
    <div className="space-y-8">
      {/* Active Package Card */}
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
            <span>Active Package</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {clientData.activePackage.name}
              </h3>
              <p className="text-lg text-gray-600 font-medium">{clientData.activePackage.price}</p>
            </div>
            <Badge className="bg-[#f7e833] text-black font-bold px-4 py-2 rounded-full text-sm">
              {clientData.activePackage.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Start Date</p>
                <p className="font-bold text-gray-900">{clientData.activePackage.startDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">End Date</p>
                <p className="font-bold text-gray-900">{clientData.activePackage.endDate}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={onViewPackage}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 hover:scale-105"
            >
              View Package Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-200">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Weekly Reach</p>
                <p className="text-3xl font-bold text-gray-900">
                  +{clientData.analytics.weekly.reach.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-200">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                <MousePointer className="w-8 h-8 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">CTR</p>
                <p className="text-3xl font-bold text-gray-900">{clientData.analytics.weekly.ctr}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-200">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Conversions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {clientData.analytics.weekly.conversions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deliverables */}
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-900">Recent Deliverables</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {clientData.deliverables.slice(0, 3).map((deliverable) => (
              <div key={deliverable.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center space-x-4">
                  <img
                    src={deliverable.thumbnail}
                    alt={deliverable.title}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{deliverable.title}</h4>
                    <p className="text-gray-500">{deliverable.type} • {deliverable.fileSize}</p>
                  </div>
                </div>
                <Badge className="bg-[#f7e833] text-black font-bold px-4 py-2 rounded-full">
                  {deliverable.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onViewDeliverables}
              className="w-full border-2 border-black text-black hover:bg-black hover:text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200"
            >
              View All Deliverables
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
