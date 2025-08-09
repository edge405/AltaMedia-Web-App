import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  MessageSquare,
  Upload,
  Settings,
  LogOut,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  Paperclip,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock data for companies
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "TechCorp Solutions",
      email: "contact@techcorp.com",
      package: "Core Package",
      status: "active",
      progress: 75,
      lastActivity: "2024-01-15",
      features: ["Logo Design", "Brand Guidelines", "Business Cards"],
      messages: [
        { id: 1, from: "client", message: "When will the logo be ready?", timestamp: "2024-01-15 10:30" },
        { id: 2, from: "admin", message: "Logo will be ready by Friday", timestamp: "2024-01-15 11:00" }
      ]
    },
    {
      id: 2,
      name: "GreenLeaf Marketing",
      email: "hello@greenleaf.com",
      package: "Core Package",
      status: "pending",
      progress: 45,
      lastActivity: "2024-01-14",
      features: ["Logo Design", "Social Media Templates"],
      messages: [
        { id: 1, from: "client", message: "Can we add more colors?", timestamp: "2024-01-14 15:20" }
      ]
    },
    {
      id: 3,
      name: "InnovateHub",
      email: "team@innovatehub.com",
      package: "Core Package",
      status: "completed",
      progress: 100,
      lastActivity: "2024-01-13",
      features: ["Logo Design", "Brand Guidelines", "Business Cards", "Email Signature"],
      messages: []
    }
  ]);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || company.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <Clock className="w-4 h-4" />;
      case "pending": return <AlertCircle className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Companies</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{companies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {companies.filter(c => c.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Messages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {companies.reduce((acc, c) => acc + c.messages.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {companies.filter(c => c.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Companies List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Companies with Core Package
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Companies List */}
                <div className="space-y-4">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${selectedCompany?.id === company.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                        }`}
                      onClick={() => setSelectedCompany(company)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {company.name}
                            </h3>
                            <Badge className={getStatusColor(company.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(company.status)}
                                {company.status}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {company.email}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {company.package}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {company.messages.length} messages
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle view details
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{company.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${company.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Details Panel */}
          <div className="lg:col-span-1">
            {selectedCompany ? (
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedCompany.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Company Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Email:</span> {selectedCompany.email}</p>
                      <p><span className="font-medium">Package:</span> {selectedCompany.package}</p>
                      <p><span className="font-medium">Status:</span>
                        <Badge className={`ml-2 ${getStatusColor(selectedCompany.status)}`}>
                          {selectedCompany.status}
                        </Badge>
                      </p>
                      <p><span className="font-medium">Last Activity:</span> {selectedCompany.lastActivity}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Project Features</h4>
                    <div className="space-y-2">
                      {selectedCompany.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm">{feature}</span>
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Section */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Client Communication</h4>
                    <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                      {selectedCompany.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${message.from === "admin"
                              ? "bg-blue-100 dark:bg-blue-900 ml-4"
                              : "bg-gray-100 dark:bg-gray-700 mr-4"
                            }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        className="flex-1 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Deliverables
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardContent className="p-6 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a Company
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a company from the list to view details and manage their project.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 