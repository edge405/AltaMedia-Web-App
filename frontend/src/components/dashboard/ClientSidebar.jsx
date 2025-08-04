import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  ArrowUpRight, 
  Briefcase, 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp
} from "lucide-react";

export default function ClientSidebar({ client, projects }) {
  const planDetails = {
    starter: {
      name: "Starter Plan",
      color: "bg-gray-100 text-gray-800",
      features: ["5 Projects", "Basic Support", "Standard Templates"]
    },
    professional: {
      name: "Professional Plan", 
      color: "bg-blue-100 text-blue-800",
      features: ["20 Projects", "Priority Support", "Custom Templates", "Analytics"]
    },
    enterprise: {
      name: "Enterprise Plan",
      color: "bg-purple-100 text-purple-800", 
      features: ["Unlimited Projects", "24/7 Support", "White Label", "API Access"]
    }
  };

  const currentPlan = planDetails[client?.current_plan || "starter"];
  const completedProjects = projects?.filter(p => p.status === "completed").length || 0;
  const activeProjects = projects?.filter(p => p.status === "in_progress").length || 0;

  return (
    <div className="w-80 space-y-6">
      {/* Client Profile Card */}
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
                {client?.company_name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800">
                {client?.company_name || "Your Company"}
              </h3>
              <p className="text-sm text-slate-500">
                {client?.contact_person || "Contact Person"}
              </p>
              <Badge className={`mt-2 ${currentPlan.color} border-0`}>
                <Crown className="w-3 h-3 mr-1" />
                {currentPlan.name}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{client?.industry || "Technology"}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{client?.phone || "+1 (555) 123-4567"}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">client@company.com</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Onboarding Progress</span>
              <span className="text-sm text-slate-500">{client?.onboarding_progress || 0}%</span>
            </div>
            <Progress value={client?.onboarding_progress || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          {client?.current_plan !== "enterprise" && (
            <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
              <div className="text-xs text-green-700">Completed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeProjects}</div>
              <div className="text-xs text-blue-700">Active</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">This Month</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">+15%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">Add-ons Available</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="font-medium text-sm text-slate-800">Rush Delivery</div>
            <div className="text-xs text-slate-500">48-hour turnaround</div>
            <div className="text-sm font-semibold text-blue-600 mt-1">+$299</div>
          </div>
          
          <div className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="font-medium text-sm text-slate-800">Premium Review</div>
            <div className="text-xs text-slate-500">Extra revision rounds</div>
            <div className="text-sm font-semibold text-blue-600 mt-1">+$149</div>
          </div>
          
          <Button variant="outline" className="w-full text-sm">
            View All Add-ons
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}