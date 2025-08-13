import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Package,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  CheckCircle,
  Palette,
  Globe,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Settings,
  Star,
  TrendingUp,
  BarChart3,
  Eye,
  X,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

const CompanySelectionPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [selectedCompanyForBrandKit, setSelectedCompanyForBrandKit] = useState(null);

  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    industry: '',
    phone: '',
    email: ''
  });

  // Load companies from localStorage
  useEffect(() => {
    const savedCompanies = localStorage.getItem('userCompanies');

    if (savedCompanies) {
      const parsedCompanies = JSON.parse(savedCompanies);
      setCompanies(parsedCompanies);
      if (parsedCompanies.length > 0) {
        setSelectedCompany(parsedCompanies[0]);
      }
    }
    setLoading(false);
  }, []);



  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCompany = () => {
    if (!companyFormData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    const newCompany = {
      id: Date.now(),
      ...companyFormData,
      createdAt: new Date().toISOString(),
      brandKitCompleted: false,
      products: []
    };

    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    setSelectedCompany(newCompany); // Set the new company as selected
    localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));

    // Reset form data and close modal
    setCompanyFormData({
      name: '',
      industry: '',
      phone: '',
      email: ''
    });
    setShowAddCompanyModal(false);
    setEditingCompany(null); // Ensure editing state is reset


    toast.success('Company added successfully!');
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setCompanyFormData(company);
    setShowAddCompanyModal(true);
  };

  const handleUpdateCompany = () => {
    if (!companyFormData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    const updatedCompany = { ...editingCompany, ...companyFormData };
    const updatedCompanies = companies.map(company =>
      company.id === editingCompany.id ? updatedCompany : company
    );

    setCompanies(updatedCompanies);

    // Update selected company if it's the one being edited
    if (selectedCompany && selectedCompany.id === editingCompany.id) {
      setSelectedCompany(updatedCompany);
    }

    localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));

    setCompanyFormData({
      name: '',
      industry: '',
      description: '',
      website: '',
      phone: '',
      email: '',
      address: '',
      employeeCount: '',
      foundedYear: ''
    });
    setEditingCompany(null);
    setShowAddCompanyModal(false);
    toast.success('Company updated successfully!');
  };

  const handleDeleteCompany = (companyId) => {
    const updatedCompanies = companies.filter(company => company.id !== companyId);
    setCompanies(updatedCompanies);

    // If the deleted company was selected, select the first available company or null
    if (selectedCompany && selectedCompany.id === companyId) {
      if (updatedCompanies.length > 0) {
        setSelectedCompany(updatedCompanies[0]);
      } else {
        setSelectedCompany(null);
      }
    }

    localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));
    toast.success('Company deleted successfully!');
  };

  const handleBrandKitComplete = (companyId) => {
    const updatedCompanies = companies.map(company =>
      company.id === companyId
        ? { ...company, brandKitCompleted: true }
        : company
    );

    setCompanies(updatedCompanies);
    localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));
    setShowBrandKit(false);
    setSelectedCompanyForBrandKit(null);
    toast.success('Brand kit completed successfully!');
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    toast.success(`Selected ${company.name}`);
  };

  const handleViewDashboard = () => {
    if (!selectedCompany) {
      toast.error('Please select a company first');
      return;
    }

    // Store selected company in localStorage for dashboard
    localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
    navigate('/dashboard');
  };

  const handleViewCompany = (company) => {
    navigate(`/company/${company.id}`);
  };

  const getCompanyStats = (company) => {
    const products = company.products || [];
    const completedBrandKits = products.filter(p => p.brandKitCompleted).length;
    const totalProducts = products.length;

    return {
      totalProducts,
      completedBrandKits,
      pendingBrandKits: totalProducts - completedBrandKits,
      completionRate: totalProducts > 0 ? Math.round((completedBrandKits / totalProducts) * 100) : 0
    };
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCompletionBgColor = (rate) => {
    if (rate >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (rate >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">


        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-12 h-12 text-purple-600 dark:text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Select Your Company
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose a company to view its dashboard and manage its packages, products, and services.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          <Button
            onClick={() => setShowAddCompanyModal(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Company
          </Button>


        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {companies.map((company) => {
            const stats = getCompanyStats(company);
            const isSelected = selectedCompany?.id === company.id;

            return (
              <Card
                key={company.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${isSelected
                  ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                onClick={() => handleCompanySelect(company)}
                onDoubleClick={() => handleViewCompany(company)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {company.name}
                        </CardTitle>
                        {company.industry && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {company.industry}
                          </p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Company Info */}
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {company.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        <span className="truncate">{company.website}</span>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{company.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {stats.totalProducts}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Products
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {stats.completedBrandKits}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Brand Kits
                      </div>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div className={`p-3 rounded-lg ${getCompletionBgColor(stats.completionRate)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Completion Rate
                      </span>
                      <span className={`text-sm font-bold ${getCompletionColor(stats.completionRate)}`}>
                        {stats.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${stats.completionRate >= 80 ? 'bg-green-500' :
                          stats.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${stats.completionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={company.brandKitCompleted ? "default" : "secondary"}>
                      {company.brandKitCompleted ? "Brand Kit Complete" : "Brand Kit Pending"}
                    </Badge>
                    {stats.totalProducts > 0 && (
                      <Badge variant="outline">
                        {stats.totalProducts} Products
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCompany(company);
                      }}
                      className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {!company.brandKitCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompanyForBrandKit(company);
                          setShowBrandKit(true);
                        }}
                        className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        <Palette className="w-4 h-4 mr-1" />
                        Brand Kit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCompany(company);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompany(company.id);
                      }}
                      className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Company Dashboard Preview */}
        {selectedCompany && (
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-2 border-purple-200 dark:border-purple-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedCompany.name} - Dashboard Preview
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Quick overview of your selected company's status and packages
                  </p>
                </div>
                <Button
                  onClick={() => handleViewCompany(selectedCompany)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Company Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Package Status */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Package Status</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active Packages:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Next Billing:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Apr 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">₱10,999</span>
                    </div>
                  </div>
                </div>

                {/* Products Overview */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Products & Services</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Products:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getCompanyStats(selectedCompany).totalProducts}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Brand Kits:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getCompanyStats(selectedCompany).completedBrandKits} completed
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pending:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getCompanyStats(selectedCompany).pendingBrandKits}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Members Overview */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Team Members</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Members:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {(() => {
                          const savedUsers = localStorage.getItem(`company_users_${selectedCompany.id}`);
                          const users = savedUsers ? JSON.parse(savedUsers) : [];
                          return users.length;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {(() => {
                          const savedUsers = localStorage.getItem(`company_users_${selectedCompany.id}`);
                          const users = savedUsers ? JSON.parse(savedUsers) : [];
                          return users.filter(u => u.isActive).length;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Roles:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {(() => {
                          const savedUsers = localStorage.getItem(`company_users_${selectedCompany.id}`);
                          const users = savedUsers ? JSON.parse(savedUsers) : [];
                          const roles = [...new Set(users.map(u => u.role))];
                          return roles.length;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
                  </div>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleViewCompany(selectedCompany)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Manage Company
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        handleViewCompany(selectedCompany);
                        // Navigate directly to users tab
                        setTimeout(() => {
                          const usersTab = document.querySelector('[data-value="users"]');
                          if (usersTab) usersTab.click();
                        }, 100);
                      }}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Team
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate('/know-your-form')}
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Complete Brand Kit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleViewDashboard}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Companies State */}
        {companies.length === 0 && (
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No companies found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't added any companies yet. Start by adding your first company.
              </p>
              <Button
                onClick={() => setShowAddCompanyModal(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Company
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Company Modal */}
        {showAddCompanyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {editingCompany ? 'Edit Company' : 'Add New Company'}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddCompanyModal(false);
                      setEditingCompany(null);
                      setCompanyFormData({
                        name: '',
                        industry: '',
                        description: '',
                        website: '',
                        phone: '',
                        email: '',
                        address: '',
                        employeeCount: '',
                        foundedYear: ''
                      });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={companyFormData.name}
                      onChange={handleCompanyInputChange}
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={companyFormData.industry}
                      onChange={handleCompanyInputChange}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={companyFormData.phone}
                      onChange={handleCompanyInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={companyFormData.email}
                      onChange={handleCompanyInputChange}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddCompanyModal(false);
                      setEditingCompany(null);
                      setCompanyFormData({
                        name: '',
                        industry: '',
                        phone: '',
                        email: ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingCompany ? handleUpdateCompany : handleAddCompany}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingCompany ? 'Update Company' : 'Add Company'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Brand Kit Modal */}
        {showBrandKit && selectedCompanyForBrandKit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Brand Kit for {selectedCompanyForBrandKit.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Complete the brand kit to customize your company experience
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBrandKit(false);
                      setSelectedCompanyForBrandKit(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <Palette className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Brand Kit Form
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This would integrate with your existing BrandKitForm component
                  </p>
                  <Button
                    onClick={() => handleBrandKitComplete(selectedCompanyForBrandKit.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Complete Brand Kit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySelectionPage;
