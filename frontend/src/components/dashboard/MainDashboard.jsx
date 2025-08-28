import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Crown,
  BarChart3
} from "lucide-react";

export default function MainDashboard({ client, projects, onProjectCreated }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Week");

  const totalRevenue = 2456; // Mock data to match reference
  const growthPercentage = 20;

  // Get current plan details
  const planDetails = {
    starter: {
      name: "Starter Plan",
      color: "bg-gray-100 text-gray-800",
      tools: ["Basic Templates", "Email Support", "5 Projects/Month"]
    },
    professional: {
      name: "Professional Plan",
      color: "bg-blue-100 text-blue-800",
      tools: ["Premium Templates", "Priority Support", "20 Projects/Month", "Advanced Analytics"]
    },
    enterprise: {
      name: "Enterprise Plan",
      color: "bg-purple-100 text-purple-800",
      tools: ["Custom Templates", "24/7 Support", "Unlimited Projects", "White Label", "API Access"]
    }
  };

  const currentPlan = planDetails[client?.current_plan || "professional"];

  // Mock chart data points to match reference design
  const chartData = [
    { day: 'S', value: 20 },
    { day: 'M', value: 35 },
    { day: 'T', value: 60 },
    { day: 'W', value: 45 },
    { day: 'T', value: 70 },
    { day: 'F', value: 50 },
    { day: 'S', value: 80 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-slate-600" />
            </div>
            Income Tracker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            The true readability of any work is in the editing you do on your work before finishing.
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Week">Week</SelectItem>
            <SelectItem value="Month">Month</SelectItem>
            <SelectItem value="Year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Extended Income Tracker Card */}
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
                <span className="text-2xl font-bold text-slate-800">
                  ${totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl font-bold text-slate-800">+{growthPercentage}%</span>
                <span className="text-slate-500">This week's income is higher than last week's</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex items-end justify-between h-32 mb-6">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className="w-8 bg-slate-200 rounded-full"
                    style={{ height: `${item.value}px` }}
                  ></div>
                  {index === 2 && (
                    <div className="absolute -top-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  {[0, 1, 2, 4, 6].includes(index) && (
                    <div className="absolute -top-2 w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </div>
                <span className="text-xs text-slate-600 font-medium">{item.day}</span>
              </div>
            ))}
          </div>

          {/* Plan Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${currentPlan.color} border-0`}>
                  <Crown className="w-3 h-3 mr-1" />
                  {currentPlan.name}
                </Badge>
              </div>
              <h4 className="font-medium text-slate-800 mb-3">Included Features</h4>
              <div className="space-y-2">
                {currentPlan.tools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-3">Usage Statistics</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Projects Completed</span>
                  <span className="font-medium">{projects?.filter(p => p.status === 'completed').length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Revenue This Month</span>
                  <span className="font-medium">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Active Projects</span>
                  <span className="font-medium">{projects?.filter(p => p.status === 'in_progress').length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Client Satisfaction</span>
                  <span className="font-medium">98%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}