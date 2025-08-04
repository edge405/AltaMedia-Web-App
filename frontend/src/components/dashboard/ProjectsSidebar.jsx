import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronUp,
  ChevronDown,
  Calendar,
  MapPin,
  MoreHorizontal,
  Plus
} from "lucide-react";

export default function ProjectsSidebar({ projects }) {
  const [isAddonsVisible, setIsAddonsVisible] = useState(false);
  
  // Current plan tools to match the reference design
  const planTools = [
    {
      name: "Web Development Project",
      description: "$10/hour",
      status: "Paid",
      statusColor: "bg-blue-600",
      icon: "W",
      badges: ["Remote", "Part-time"],
      location: "Germany",
      time: "2h ago"
    },
    {
      name: "Copyright Project", 
      description: "$10/hour",
      status: "Not Paid",
      statusColor: "bg-gray-400",
      icon: "C",
      badges: ["Remote", "Full-time"],
      location: "USA",
      time: "1 day ago"
    },
    {
      name: "Web Design Project",
      description: "$10/hour", 
      status: "Paid",
      statusColor: "bg-blue-600",
      icon: "W",
      badges: ["Remote", "Contract"],
      location: "Canada",
      time: "3 days ago"
    }
  ];

  // Add-ons data
  const addonsData = [
    { label: "Proposals sent", value: 64, color: "bg-slate-300" },
    { label: "Interviews", value: 14, color: "bg-orange-400" },
    { label: "Hires", value: 10, color: "bg-slate-800" }
  ];

  return (
    <div className="space-y-6">
      {/* Recent Projects */}
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">Your Recent Projects</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600">
            See all Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {planTools.map((tool, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {tool.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{tool.name}</p>
                    <p className="text-sm text-slate-500">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${
                    tool.status === 'Paid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  } border-0`}>
                    {tool.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    {index === 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                {tool.badges.map((badge, badgeIndex) => (
                  <Badge key={badgeIndex} variant="outline" className="text-xs">{badge}</Badge>
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                This project involves implementing both frontend and backend functionalities, as well as integrating with third-party APIs.
              </p>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{tool.location}</span>
                </div>
                <span>{tool.time}</span>
              </div>

              {index < planTools.length - 1 && <div className="border-b border-slate-100"></div>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Proposal Progress Dropdown */}
      <Card className="glass-effect border-slate-200/50 shadow-lg">
        <CardHeader 
          className="flex flex-row items-center justify-between cursor-pointer"
          onClick={() => setIsAddonsVisible(!isAddonsVisible)}
        >
          <CardTitle className="text-lg font-semibold text-slate-800">Proposal Progress</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>April 13, 2025</span>
            </div>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              {isAddonsVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {isAddonsVisible && (
          <CardContent>
            <div className="space-y-6">
              {addonsData.map((addon, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{addon.label}</span>
                    <span className="text-2xl font-bold text-slate-900">{addon.value}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${addon.color}`}
                        style={{ width: `${(addon.value / 70) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="w-px h-2 bg-slate-200"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}