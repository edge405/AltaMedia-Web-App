import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function PackageDetailsSection({ clientData, packageDetails }) {
  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
            <span>{clientData.activePackage.name}</span>
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Track the progress of your package deliverables
          </p>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {packageDetails && packageDetails.deliverables.map((deliverable, index) => (
            <div key={index} className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{deliverable.name}</h4>
                  <p className="text-gray-600">{deliverable.description}</p>
                </div>
                <Badge className="bg-[#f7e833] text-black font-bold px-4 py-2 rounded-full">
                  {deliverable.status}
                </Badge>
              </div>

              {deliverable.total > 1 ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">Progress: {deliverable.completed}/{deliverable.total}</span>
                    <span className="font-bold text-gray-900">{Math.round((deliverable.completed / deliverable.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#f7e833] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(deliverable.completed / deliverable.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {deliverable.status === "Completed" ? (
                    <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  ) : deliverable.status === "In Progress" ? (
                    <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-black" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  )}
                  <span className="font-semibold text-gray-900">
                    {deliverable.status}
                  </span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
