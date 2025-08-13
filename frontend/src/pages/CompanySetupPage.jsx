import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  CheckCircle,
  Palette,
  FileText,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  Package,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import BrandKitForm from '@/components/form/BrandKitForm';

const CompanySetupPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCompany = () => {
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    const newCompany = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      brandKitCompleted: false,
      products: []
    };

    setCompanies(prev => [...prev, newCompany]);
    setFormData({
      name: '',
      industry: '',
      phone: '',
      email: ''
    });
    setShowAddForm(false);
    toast.success('Company added successfully!');
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setFormData(company);
    setShowAddForm(true);
  };

  const handleUpdateCompany = () => {
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    setCompanies(prev => prev.map(company =>
      company.id === editingCompany.id
        ? { ...company, ...formData }
        : company
    ));

    setFormData({
      name: '',
      industry: '',
      phone: '',
      email: ''
    });
    setEditingCompany(null);
    setShowAddForm(false);
    toast.success('Company updated successfully!');
  };

  const handleDeleteCompany = (companyId) => {
    setCompanies(prev => prev.filter(company => company.id !== companyId));
    toast.success('Company deleted successfully!');
  };

  const handleBrandKitComplete = (companyId) => {
    setCompanies(prev => prev.map(company =>
      company.id === companyId
        ? { ...company, brandKitCompleted: true }
        : company
    ));
    setShowBrandKit(false);
    setSelectedCompany(null);
    toast.success('Brand kit completed successfully!');
  };

  const handleContinueToProducts = () => {
    if (companies.length === 0) {
      toast.error('Please add at least one company first');
      return;
    }

    // Store companies in localStorage for the next step
    localStorage.setItem('userCompanies', JSON.stringify(companies));
    navigate('/product-setup');
  };

  const handleSkipToDashboard = () => {
    if (companies.length === 0) {
      toast.error('Please add at least one company first');
      return;
    }

    localStorage.setItem('userCompanies', JSON.stringify(companies));
    navigate('/company-selection');
  };

  const handleViewCompany = (company) => {
    navigate(`/company/${company.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Company Setup
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Add your companies and complete their brand kits to get started with Alta Media services.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">Companies</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Products</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Companies List */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Your Companies
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {companies.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No companies added yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start by adding your first company to get started.
                    </p>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Company
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companies.map((company) => (
                      <Card key={company.id} className="border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  {company.name}
                                </h3>
                                <Badge variant={company.brandKitCompleted ? "default" : "secondary"}>
                                  {company.brandKitCompleted ? "Brand Kit Complete" : "Brand Kit Pending"}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                {company.industry && (
                                  <div className="flex items-center">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    <span>{company.industry}</span>
                                  </div>
                                )}
                                {company.website && (
                                  <div className="flex items-center">
                                    <Globe className="w-4 h-4 mr-2" />
                                    <span>{company.website}</span>
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
                                    <span>{company.email}</span>
                                  </div>
                                )}
                              </div>

                              {company.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                  {company.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewCompany(company)}
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {!company.brandKitCompleted && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedCompany(company);
                                    setShowBrandKit(true);
                                  }}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Palette className="w-4 h-4 mr-1" />
                                  Brand Kit
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCompany(company)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCompany(company.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-800 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Add companies (✓ {companies.length})
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Complete brand kits ({companies.filter(c => c.brandKitCompleted).length}/{companies.length})
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Add products/services
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleContinueToProducts}
                    className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
                    disabled={companies.length === 0}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue to Products
                  </Button>

                  <Button
                    onClick={handleSkipToDashboard}
                    variant="outline"
                    className="w-full"
                    disabled={companies.length === 0}
                  >
                    Skip to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add/Edit Company Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {editingCompany ? 'Edit Company' : 'Add New Company'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCompany(null);
                      setFormData({
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
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingCompany ? 'Update Company' : 'Add Company'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Brand Kit Form Modal */}
        {showBrandKit && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Brand Kit for {selectedCompany.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Complete the brand kit to customize your experience
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBrandKit(false);
                      setSelectedCompany(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <BrandKitForm
                  onComplete={() => handleBrandKitComplete(selectedCompany.id)}
                  companyId={selectedCompany.id}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySetupPage;
