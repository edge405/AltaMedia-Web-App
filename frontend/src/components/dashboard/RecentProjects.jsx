
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  DollarSign,
  MoreHorizontal,
  Palette,
  Megaphone,
  Sparkles,
  Briefcase
} from "lucide-react";
import { format } from "date-fns";

export default function RecentProjects({ projects }) {
  const statusConfig = {
    draft: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800",
      icon: Clock
    },
    in_progress: {
      label: "In Progress", 
      color: "bg-blue-100 text-blue-800",
      icon: Clock
    },
    review: {
      label: "In Review",
      color: "bg-orange-100 text-orange-800", 
      icon: AlertCircle
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle
    }
  };

  const typeIcons = {
    branding: { icon: Palette, color: "text-pink-600" },
    campaign: { icon: Megaphone, color: "text-blue-600" },
    creative_services: { icon: Sparkles, color: "text-purple-600" }
  };

  const recentProjects = projects?.slice(0, 6) || [];

  return (
    <Card className="glass-effect border-slate-200/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold text-slate-800">Recent Projects</CardTitle>
          <p className="text-sm text-slate-600 mt-1">Track your ongoing and completed work</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {recentProjects.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No projects yet</p>
            <p className="text-sm text-slate-400">Start your first project above</p>
          </div>
        ) : (
          recentProjects.map((project) => {
            const status = statusConfig[project.status];
            const typeConfig = typeIcons[project.project_type];
            const StatusIcon = status.icon;
            const TypeIcon = typeConfig?.icon || Briefcase;
            
            return (
              <div
                key={project.id}
                className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                      <TypeIcon className={`w-5 h-5 ${typeConfig?.color || "text-slate-600"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800 group-hover:text-slate-900">
                        {project.project_name}
                      </h3>
                      <p className="text-sm text-slate-500 capitalize">
                        {project.project_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={`${status.color} border-0`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium text-slate-800">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      {project.deadline && (
                        <div className="flex items-center space-x-1 text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(project.deadline), "MMM d")}</span>
                        </div>
                      )}
                      {project.budget_allocated && (
                        <div className="flex items-center space-x-1 text-slate-500">
                          <DollarSign className="w-4 h-4" />
                          <span>${project.budget_allocated.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
