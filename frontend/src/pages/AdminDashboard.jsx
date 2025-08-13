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
  AlertCircle,
  Building2,
  Palette,
  UserPlus,
  FileText,
  Star,
  TrendingUp,
  BarChart3,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  RefreshCw,
  FileDown,
  FileText as FileTextIcon,
  Image,
  Link
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
  const [activeTab, setActiveTab] = useState("overview");

  // Real data from client-side localStorage
  const [companies, setCompanies] = useState([]);
  const [allClientData, setAllClientData] = useState({});

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    loadClientData();
  }, []);

  const loadClientData = () => {
    try {
      // Load all companies from localStorage
      const savedCompanies = localStorage.getItem('userCompanies');
      if (savedCompanies) {
        const parsedCompanies = JSON.parse(savedCompanies);
        setCompanies(parsedCompanies);
      }

      // Load all client data for comprehensive view
      const clientData = {};
      const keys = Object.keys(localStorage);

      keys.forEach(key => {
        if (key.startsWith('company_users_') || key.includes('brandkit') || key.includes('comment')) {
          try {
            clientData[key] = JSON.parse(localStorage.getItem(key));
          } catch (e) {
            clientData[key] = localStorage.getItem(key);
          }
        }
      });

      setAllClientData(clientData);
    } catch (error) {
      console.error('Error loading client data:', error);
      toast.error('Failed to load client data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || getCompanyStatus(company) === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getCompanyStatus = (company) => {
    // Determine status based on brand kit completion and activity
    if (company.brandKitCompleted && getCompanyProgress(company) === 100) {
      return "completed";
    } else if (company.brandKitCompleted || getCompanyProgress(company) > 0) {
      return "active";
    } else {
      return "pending";
    }
  };

  const getCompanyProgress = (company) => {
    const products = company.products || [];
    if (products.length === 0) {
      return company.brandKitCompleted ? 100 : 0;
    }

    const completedBrandKits = products.filter(p => p.brandKitCompleted).length;
    const companyBrandKit = company.brandKitCompleted ? 1 : 0;
    const totalItems = products.length + 1; // +1 for company brand kit
    const completedItems = completedBrandKits + companyBrandKit;

    return Math.round((completedItems / totalItems) * 100);
  };

  const getCompanyUsers = (companyId) => {
    const users = allClientData[`company_users_${companyId}`] || [];
    return users;
  };

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

  const getTotalStats = () => {
    const totalCompanies = companies.length;
    const activeCompanies = companies.filter(c => getCompanyStatus(c) === "active").length;
    const completedCompanies = companies.filter(c => getCompanyStatus(c) === "completed").length;
    const totalUsers = companies.reduce((acc, company) => {
      return acc + getCompanyUsers(company.id).length;
    }, 0);

    return {
      totalCompanies,
      activeCompanies,
      completedCompanies,
      totalUsers
    };
  };

  // Brand Kit Download Functions
  const downloadBrandKitData = (company, type = 'company') => {
    try {
      // Create brand kit data object
      const brandKitData = {
        company: {
          id: company.id,
          name: company.name,
          email: company.email,
          industry: company.industry,
          website: company.website,
          phone: company.phone,
          createdAt: company.createdAt,
          brandKitCompleted: company.brandKitCompleted
        },
        brandKitType: type,
        downloadDate: new Date().toISOString(),
        products: company.products || [],
        teamMembers: getCompanyUsers(company.id),
        brandKitProgress: getCompanyProgress(company)
      };

      // Convert to JSON string
      const jsonData = JSON.stringify(brandKitData, null, 2);

      // Create and download file
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${company.name}_${type}_brandkit_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} brand kit data downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading brand kit data:', error);
      toast.error('Failed to download brand kit data');
    }
  };

  const downloadBrandKitPDF = (company, type = 'company') => {
    try {
      // Create a simple HTML content for PDF generation
      const htmlContent = `
        <html>
          <head>
            <title>${company.name} - ${type.charAt(0).toUpperCase() + type.slice(1)} Brand Kit</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              .info-row { margin-bottom: 10px; }
              .label { font-weight: bold; }
              .progress { background: #f0f0f0; border-radius: 10px; padding: 10px; margin: 10px 0; }
              .progress-bar { background: #007bff; height: 20px; border-radius: 10px; width: ${getCompanyProgress(company)}%; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${company.name}</h1>
              <h2>${type.charAt(0).toUpperCase() + type.slice(1)} Brand Kit Report</h2>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="section">
              <h3>Company Information</h3>
              <div class="info-row"><span class="label">Name:</span> ${company.name}</div>
              <div class="info-row"><span class="label">Email:</span> ${company.email || 'Not provided'}</div>
              <div class="info-row"><span class="label">Industry:</span> ${company.industry || 'Not specified'}</div>
              <div class="info-row"><span class="label">Website:</span> ${company.website || 'Not provided'}</div>
              <div class="info-row"><span class="label">Phone:</span> ${company.phone || 'Not provided'}</div>
              <div class="info-row"><span class="label">Created:</span> ${new Date(company.createdAt).toLocaleDateString()}</div>
            </div>
            
            <div class="section">
              <h3>Brand Kit Progress</h3>
              <div class="progress">
                <div class="progress-bar"></div>
              </div>
              <p>Completion: ${getCompanyProgress(company)}%</p>
              <p>Status: ${company.brandKitCompleted ? 'Completed' : 'In Progress'}</p>
            </div>
            
            <div class="section">
              <h3>Products & Services</h3>
              ${(company.products || []).map(product => `
                <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 5px;">
                  <strong>${product.name}</strong><br>
                  Type: ${product.type}<br>
                  Category: ${product.category || 'Not specified'}<br>
                  Brand Kit: ${product.brandKitCompleted ? 'Completed' : 'Pending'}
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h3>Team Members</h3>
              ${getCompanyUsers(company.id).map(user => `
                <div style="margin: 5px 0;">
                  <strong>${user.name}</strong> - ${user.email} (${user.role})
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;

      // Create and download HTML file (can be converted to PDF by browser)
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${company.name}_${type}_brandkit_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} brand kit PDF downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading brand kit PDF:', error);
      toast.error('Failed to download brand kit PDF');
    }
  };

  const downloadBrandKitFiles = (company) => {
    try {
      // This would typically connect to your backend to get actual file URLs
      // For now, we'll create a file list and download links
      const fileList = {
        company: company.name,
        files: [
          {
            name: 'Brand Guidelines',
            type: 'PDF',
            url: '#', // Would be actual file URL
            description: 'Complete brand guidelines document'
          },
          {
            name: 'Logo Files',
            type: 'ZIP',
            url: '#', // Would be actual file URL
            description: 'All logo variations and formats'
          },
          {
            name: 'Color Palette',
            type: 'PDF',
            url: '#', // Would be actual file URL
            description: 'Brand color specifications'
          },
          {
            name: 'Typography Guide',
            type: 'PDF',
            url: '#', // Would be actual file URL
            description: 'Font specifications and usage guidelines'
          }
        ]
      };

      // Create a file list document
      const fileListContent = `
Brand Kit Files for ${company.name}
Generated on: ${new Date().toLocaleDateString()}

Files Available:
${fileList.files.map(file => `
- ${file.name} (${file.type})
  Description: ${file.description}
  URL: ${file.url}
`).join('')}

Note: This is a file list. Actual file downloads would be implemented with backend integration.
      `;

      const blob = new Blob([fileListContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${company.name}_brandkit_files_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Brand kit file list downloaded successfully!');
    } catch (error) {
      console.error('Error downloading brand kit files:', error);
      toast.error('Failed to download brand kit files');
    }
  };

  const stats = getTotalStats();

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
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Companies</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCompanies}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCompanies}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedCompanies}</p>
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
                    Client Companies
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      onClick={loadClientData}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search companies, industries, or emails..."
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
                  {filteredCompanies.map((company) => {
                    const status = getCompanyStatus(company);
                    const progress = getCompanyProgress(company);
                    const users = getCompanyUsers(company.id);

                    return (
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
                              <Badge className={getStatusColor(status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(status)}
                                  {status}
                                </span>
                              </Badge>
                              {company.brandKitCompleted && (
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                  <Palette className="w-3 h-3 mr-1" />
                                  Brand Kit
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {company.email} • {company.industry || 'No industry'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {company.products?.length || 0} products
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {users.length} users
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(company.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCompany(company);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Brand Kit Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredCompanies.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No companies found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm || filterStatus !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "No client companies have been created yet"
                      }
                    </p>
                  </div>
                )}
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
                  {/* Tabs */}
                  <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === "overview"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("products")}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === "products"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      Products
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === "users"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      Users
                    </button>
                    <button
                      onClick={() => setActiveTab("brandkit")}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === "brandkit"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      Brand Kit
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      {/* Company Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Company Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCompany.email || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCompany.industry || 'Not specified'}</span>
                          </div>
                          {selectedCompany.website && (
                            <div className="flex items-center">
                              <Globe className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">Website:</span>
                              <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCompany.website}</span>
                            </div>
                          )}
                          {selectedCompany.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                              <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedCompany.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Created:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                              {new Date(selectedCompany.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Brand Kit Status */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Brand Kit Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="text-sm">Company Brand Kit</span>
                            <Badge variant={selectedCompany.brandKitCompleted ? "default" : "secondary"}>
                              {selectedCompany.brandKitCompleted ? "Complete" : "Pending"}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Overall Progress: {getCompanyProgress(selectedCompany)}%
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {selectedCompany.products?.length || 0}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">Products</div>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {getCompanyUsers(selectedCompany.id).length}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">Users</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "products" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Products & Services</h4>
                      {selectedCompany.products && selectedCompany.products.length > 0 ? (
                        <div className="space-y-3">
                          {selectedCompany.products.map((product) => (
                            <div key={product.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">{product.name}</h5>
                                <Badge variant={product.brandKitCompleted ? "default" : "secondary"}>
                                  {product.brandKitCompleted ? "Brand Kit Complete" : "Brand Kit Pending"}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <div>Type: {product.type}</div>
                                {product.category && <div>Category: {product.category}</div>}
                                {product.price && <div>Price: {product.price} {product.currency}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          <Package className="w-8 h-8 mx-auto mb-2" />
                          <p>No products added yet</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "users" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Team Members</h4>
                      {getCompanyUsers(selectedCompany.id).length > 0 ? (
                        <div className="space-y-2">
                          {getCompanyUsers(selectedCompany.id).map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                              </div>
                              <Badge variant="outline">{user.role}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          <Users className="w-8 h-8 mx-auto mb-2" />
                          <p>No team members assigned</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "brandkit" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Brand Kit Downloads</h4>

                      {/* Company Brand Kit Downloads */}
                      <div className="space-y-3">
                        <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Company Brand Kit</h5>
                          <div className="space-y-2">
                            <Button
                              onClick={() => downloadBrandKitData(selectedCompany, 'company')}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <FileTextIcon className="w-4 h-4 mr-2" />
                              Download Data (JSON)
                            </Button>
                            <Button
                              onClick={() => downloadBrandKitPDF(selectedCompany, 'company')}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <FileDown className="w-4 h-4 mr-2" />
                              Download Report (PDF)
                            </Button>
                            <Button
                              onClick={() => downloadBrandKitFiles(selectedCompany)}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Image className="w-4 h-4 mr-2" />
                              Download Files
                            </Button>
                          </div>
                        </div>

                        {/* Product Brand Kit Downloads */}
                        {selectedCompany.products && selectedCompany.products.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-gray-900 dark:text-white">Product Brand Kits</h5>
                            {selectedCompany.products.map((product) => (
                              <div key={product.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-gray-900 dark:text-white">{product.name}</h6>
                                  <Badge variant={product.brandKitCompleted ? "default" : "secondary"}>
                                    {product.brandKitCompleted ? "Complete" : "Pending"}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <Button
                                    onClick={() => downloadBrandKitData(selectedCompany, 'product')}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    disabled={!product.brandKitCompleted}
                                  >
                                    <FileTextIcon className="w-4 h-4 mr-2" />
                                    Download Data (JSON)
                                  </Button>
                                  <Button
                                    onClick={() => downloadBrandKitPDF(selectedCompany, 'product')}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    disabled={!product.brandKitCompleted}
                                  >
                                    <FileDown className="w-4 h-4 mr-2" />
                                    Download Report (PDF)
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Brand Kit Status Summary */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Brand Kit Summary</h5>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div>Company Brand Kit: {selectedCompany.brandKitCompleted ? '✅ Complete' : '⏳ Pending'}</div>
                          <div>Products with Brand Kits: {selectedCompany.products?.filter(p => p.brandKitCompleted).length || 0} / {selectedCompany.products?.length || 0}</div>
                          <div>Overall Progress: {getCompanyProgress(selectedCompany)}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardContent className="p-6 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a Company
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a company from the list to view detailed information and manage their data.
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