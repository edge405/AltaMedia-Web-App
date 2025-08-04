import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText, CheckCircle, Package, DollarSign, Calendar, Globe, BarChart3, Play, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StatsOverview({ isDarkMode }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Current");

  const packageDetails = {
    name: "Core Package",
    price: "P10,999",
    period: "month",
    status: "Active",
    features: [
      { name: "Dashboard", cost: "Free", included: true },
      { name: "Website", cost: "P5,000", included: true },
      { name: "Content/Ad Management", cost: "P4,000", included: true },
      { name: "Content Calendar/Creation (30 days)", cost: "P4,000", included: true },
      { name: "Demo", cost: "P500", included: true },
      { name: "Pin4MS", cost: "P1,000", included: true }
    ],
    totalCost: "P14,500",
    sellingPrice: "P10,999",
    savings: "P3,501"
  };

  const getFeatureIcon = (featureName) => {
    const iconMap = {
      "Dashboard": <BarChart3 className="w-4 h-4" />,
      "Website": <Globe className="w-4 h-4" />,
      "Content/Ad Management": <FileText className="w-4 h-4" />,
      "Content Calendar/Creation (30 days)": <Calendar className="w-4 h-4" />,
      "Demo": <Play className="w-4 h-4" />,
      "Pin4MS": <Zap className="w-4 h-4" />
    };
    return iconMap[featureName] || <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} col-span-2`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Package className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Current Package
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {selectedPeriod}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedPeriod("Current")}>
                Current
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Previous")}>
                Previous
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Package Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {packageDetails.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  Complete multimedia automation solution for your business
                </p>
              </div>
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                {packageDetails.status}
              </Badge>
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Monthly Price
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {packageDetails.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Original Value
                  </p>
                  <p className={`text-lg font-semibold line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {packageDetails.totalCost}
                  </p>
                  <p className={`text-sm font-medium text-green-600 dark:text-green-400`}>
                    Save {packageDetails.savings}
                  </p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h4 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Package Features
              </h4>
              <div className="space-y-2">
                {packageDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        {getFeatureIcon(feature.name)}
                      </div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                        {feature.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {feature.cost}
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Package Value
          </CardTitle>
          <DollarSign className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {packageDetails.savings}
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Total savings this month
          </p>
        </CardContent>
      </Card>

      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Features Active
          </CardTitle>
          <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {packageDetails.features.length}
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            All features included
          </p>
        </CardContent>
      </Card>
    </div>
  );
}