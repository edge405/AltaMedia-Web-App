import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyUserManagement from '@/components/CompanyUserManagement';
import {
    Building2,
    Package,
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
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
    BarChart3,
    TrendingUp,
    Save,
    X,
    Eye
} from 'lucide-react';
import { toast } from 'sonner';

const CompanyPage = () => {
    const navigate = useNavigate();
    const { companyId } = useParams();
    const [companies, setCompanies] = useState([]);
    const [company, setCompany] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showBrandKit, setShowBrandKit] = useState(false);
    const [brandKitTarget, setBrandKitTarget] = useState(null);
    const [loading, setLoading] = useState(true);

    const [companyFormData, setCompanyFormData] = useState({
        name: '', industry: '', phone: '', email: ''
    });

    const [productFormData, setProductFormData] = useState({
        name: '', type: 'product', category: '', description: '', price: '',
        currency: 'PHP', website: '', features: '', targetAudience: '', competitors: ''
    });

    useEffect(() => {
        const savedCompanies = localStorage.getItem('userCompanies');
        if (savedCompanies) {
            const parsedCompanies = JSON.parse(savedCompanies);
            setCompanies(parsedCompanies);
            const foundCompany = parsedCompanies.find(c => c.id.toString() === companyId);
            if (foundCompany) {
                setCompany(foundCompany);
                setCompanyFormData(foundCompany);
            } else {
                toast.error('Company not found');
                navigate('/company-selection');
            }
        } else {
            navigate('/company-selection');
        }
        setLoading(false);
    }, [companyId, navigate]);

    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveCompany = () => {
        if (!companyFormData.name.trim()) {
            toast.error('Company name is required');
            return;
        }

        const updatedCompanies = companies.map(c =>
            c.id.toString() === companyId ? { ...c, ...companyFormData } : c
        );

        setCompanies(updatedCompanies);
        setCompany({ ...company, ...companyFormData });
        localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));
        setIsEditing(false);
        toast.success('Company updated successfully!');
    };

    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setProductFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductSelectChange = (name, value) => {
        setProductFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = () => {
        if (!productFormData.name.trim()) {
            toast.error('Product/Service name is required');
            return;
        }

        const newProduct = {
            id: Date.now(),
            ...productFormData,
            createdAt: new Date().toISOString(),
            brandKitCompleted: false,
            companyId: company.id
        };

        const updatedCompany = {
            ...company,
            products: [...(company.products || []), newProduct]
        };

        const updatedCompanies = companies.map(c =>
            c.id.toString() === companyId ? updatedCompany : c
        );

        setCompany(updatedCompany);
        setCompanies(updatedCompanies);
        localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));

        setProductFormData({
            name: '', type: 'product', category: '', description: '', price: '',
            currency: 'PHP', website: '', features: '', targetAudience: '', competitors: ''
        });
        setShowAddProduct(false);
        toast.success('Product/Service added successfully!');
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductFormData(product);
        setShowAddProduct(true);
    };

    const handleUpdateProduct = () => {
        if (!productFormData.name.trim()) {
            toast.error('Product/Service name is required');
            return;
        }

        const updatedCompany = {
            ...company,
            products: company.products.map(p =>
                p.id === editingProduct.id ? { ...p, ...productFormData } : p
            )
        };

        const updatedCompanies = companies.map(c =>
            c.id.toString() === companyId ? updatedCompany : c
        );

        setCompany(updatedCompany);
        setCompanies(updatedCompanies);
        localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));

        setProductFormData({
            name: '', type: 'product', category: '', description: '', price: '',
            currency: 'PHP', website: '', features: '', targetAudience: '', competitors: ''
        });
        setEditingProduct(null);
        setShowAddProduct(false);
        toast.success('Product/Service updated successfully!');
    };

    const handleDeleteProduct = (productId) => {
        const updatedCompany = {
            ...company,
            products: company.products.filter(p => p.id !== productId)
        };

        const updatedCompanies = companies.map(c =>
            c.id.toString() === companyId ? updatedCompany : c
        );

        setCompany(updatedCompany);
        setCompanies(updatedCompanies);
        localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));
        toast.success('Product/Service deleted successfully!');
    };

    const handleBrandKitComplete = (targetType, targetId) => {
        if (targetType === 'company') {
            const updatedCompany = { ...company, brandKitCompleted: true };
            const updatedCompanies = companies.map(c =>
                c.id.toString() === companyId ? updatedCompany : c
            );
            setCompany(updatedCompany);
            setCompanies(updatedCompanies);
            localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));
        } else if (targetType === 'product') {
            const updatedCompany = {
                ...company,
                products: company.products.map(p =>
                    p.id === targetId ? { ...p, brandKitCompleted: true } : p
                )
            };
            const updatedCompanies = companies.map(c =>
                c.id.toString() === companyId ? updatedCompany : c
            );
            setCompany(updatedCompany);
            setCompanies(updatedCompanies);
            localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));
        }

        setShowBrandKit(false);
        setBrandKitTarget(null);
        toast.success('Brand kit completed successfully!');
    };

    const openBrandKit = (targetType, target = null) => {
        setBrandKitTarget({ type: targetType, data: target });
        setShowBrandKit(true);
    };

    const getCompanyStats = () => {
        const products = company?.products || [];
        const completedBrandKits = products.filter(p => p.brandKitCompleted).length;
        const totalProducts = products.length;

        // Get user count from localStorage
        const savedUsers = localStorage.getItem(`company_users_${company.id}`);
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const totalUsers = users.length;

        return {
            totalProducts,
            completedBrandKits,
            pendingBrandKits: totalProducts - completedBrandKits,
            companyBrandKitCompleted: company?.brandKitCompleted || false,
            completionRate: totalProducts > 0 ? Math.round((completedBrandKits / totalProducts) * 100) : 0,
            totalUsers
        };
    };

    const getProductTypeIcon = (type) => {
        return type === 'product' ? <Package className="w-4 h-4" /> : <Settings className="w-4 h-4" />;
    };

    const getProductTypeColor = (type) => {
        return type === 'product' ? 'bg-blue-500' : 'bg-green-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading company...</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Company not found
                    </h3>
                    <Button onClick={() => navigate('/company-selection')}>
                        Back to Companies
                    </Button>
                </div>
            </div>
        );
    }

    const stats = getCompanyStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button onClick={() => navigate('/company-selection')} variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Companies
                            </Button>


                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {company.name}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {company.industry || 'Company Management'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {!stats.companyBrandKitCompleted && (
                                <Button onClick={() => openBrandKit('company')} variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                                    <Palette className="w-4 h-4 mr-2" />
                                    Company Brand Kit
                                </Button>
                            )}
                            <Button onClick={() => setIsEditing(true)} variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Company
                            </Button>
                            <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Dashboard
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Company Overview</TabsTrigger>
                        <TabsTrigger value="products">Products & Services</TabsTrigger>
                        <TabsTrigger value="users">Team Members</TabsTrigger>
                        <TabsTrigger value="brandkit">Brand Kit Status</TabsTrigger>
                    </TabsList>

                    {/* Company Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Card className="bg-white dark:bg-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalProducts}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                            <Palette className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Brand Kits</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingBrandKits}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.completionRate}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-white dark:bg-gray-800">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Company Information
                                    </CardTitle>
                                    {isEditing ? (
                                        <div className="flex space-x-2">
                                            <Button onClick={handleSaveCompany} size="sm">
                                                <Save className="w-4 h-4 mr-2" />
                                                Save
                                            </Button>
                                            <Button onClick={() => { setIsEditing(false); setCompanyFormData(company); }} variant="outline" size="sm">
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Company Name *</Label>
                                            <Input id="name" name="name" value={companyFormData.name} onChange={handleCompanyInputChange} required />
                                        </div>
                                        <div>
                                            <Label htmlFor="industry">Industry</Label>
                                            <Input id="industry" name="industry" value={companyFormData.industry} onChange={handleCompanyInputChange} />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" name="phone" value={companyFormData.phone} onChange={handleCompanyInputChange} />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" name="email" type="email" value={companyFormData.email} onChange={handleCompanyInputChange} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Company Information</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center">
                                                    <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                                                    <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                                                    <span className="ml-2 text-gray-900 dark:text-gray-100">{company.industry || 'Not specified'}</span>
                                                </div>
                                                {company.phone && (
                                                    <div className="flex items-center">
                                                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                        <span className="text-gray-600 dark:text-gray-400">Phone Number:</span>
                                                        <span className="ml-2 text-gray-900 dark:text-gray-100">{company.phone}</span>
                                                    </div>
                                                )}
                                                {company.email && (
                                                    <div className="flex items-center">
                                                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                                        <span className="text-gray-600 dark:text-gray-400">Email Address:</span>
                                                        <span className="ml-2 text-gray-900 dark:text-gray-100">{company.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Products & Services Tab */}
                    <TabsContent value="products" className="space-y-6">
                        <Card className="bg-white dark:bg-gray-800">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Products & Services
                                    </CardTitle>
                                    <Button onClick={() => setShowAddProduct(true)} className="bg-green-600 hover:bg-green-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Product/Service
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {company.products && company.products.length > 0 ? (
                                    <div className="space-y-4">
                                        {company.products.map((product) => (
                                            <Card key={product.id} className="border-2 hover:border-green-300 dark:hover:border-green-600 transition-colors">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <div className={`w-8 h-8 ${getProductTypeColor(product.type)} rounded-lg flex items-center justify-center`}>
                                                                    {getProductTypeIcon(product.type)}
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                        {product.name}
                                                                    </h3>
                                                                    <div className="flex items-center space-x-2 mt-1">
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                                                                        </Badge>
                                                                        {product.category && (
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                {product.category}
                                                                            </Badge>
                                                                        )}
                                                                        <Badge variant={product.brandKitCompleted ? "default" : "secondary"}>
                                                                            {product.brandKitCompleted ? "Brand Kit Complete" : "Brand Kit Pending"}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                                {product.price && (
                                                                    <div className="flex items-center">
                                                                        <DollarSign className="w-4 h-4 mr-2" />
                                                                        <span>{product.price} {product.currency}</span>
                                                                    </div>
                                                                )}
                                                                {product.website && (
                                                                    <div className="flex items-center">
                                                                        <Globe className="w-4 h-4 mr-2" />
                                                                        <span>{product.website}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {product.description && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                                    {product.description}
                                                                </p>
                                                            )}

                                                            {product.features && (
                                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                    <span className="font-medium">Features:</span> {product.features}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center space-x-2 ml-4">
                                                            {!product.brandKitCompleted && (
                                                                <Button size="sm" variant="outline" onClick={() => openBrandKit('product', product)} className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                                                                    <Palette className="w-4 h-4 mr-1" />
                                                                    Brand Kit
                                                                </Button>
                                                            )}
                                                            <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            No products or services added yet
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Start by adding your first product or service for {company.name}.
                                        </p>
                                        <Button onClick={() => setShowAddProduct(true)} className="bg-green-600 hover:bg-green-700">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Your First Product/Service
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Team Members Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <CompanyUserManagement company={company} onUpdate={() => { }} />
                    </TabsContent>

                    {/* Brand Kit Status Tab */}
                    <TabsContent value="brandkit" className="space-y-6">
                        <Card className="bg-white dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Brand Kit Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Company Brand Kit Status */}
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stats.companyBrandKitCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                                                    }`}>
                                                    <Building2 className={`w-5 h-5 ${stats.companyBrandKitCompleted ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                        Company Brand Kit
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {stats.companyBrandKitCompleted ? 'Completed - Your company brand kit is ready' : 'Pending - Complete your company brand kit'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant={stats.companyBrandKitCompleted ? "default" : "secondary"}>
                                                    {stats.companyBrandKitCompleted ? "Complete" : "Pending"}
                                                </Badge>
                                                {!stats.companyBrandKitCompleted && (
                                                    <Button size="sm" onClick={() => openBrandKit('company')} className="bg-orange-600 hover:bg-orange-700">
                                                        <Palette className="w-4 h-4 mr-2" />
                                                        Complete
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products Brand Kit Status */}
                                    {company.products && company.products.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Product Brand Kits ({stats.completedBrandKits}/{stats.totalProducts} Complete)
                                            </h3>
                                            <div className="space-y-3">
                                                {company.products.map((product) => (
                                                    <div key={product.id} className="p-4 border rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${product.brandKitCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                                                                    }`}>
                                                                    {getProductTypeIcon(product.type)}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {product.name}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {product.brandKitCompleted ? 'Brand kit completed' : 'Brand kit pending'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Badge variant={product.brandKitCompleted ? "default" : "secondary"}>
                                                                    {product.brandKitCompleted ? "Complete" : "Pending"}
                                                                </Badge>
                                                                {!product.brandKitCompleted && (
                                                                    <Button size="sm" onClick={() => openBrandKit('product', product)} className="bg-green-600 hover:bg-green-700">
                                                                        <Palette className="w-4 h-4 mr-2" />
                                                                        Complete
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Add/Edit Product Modal */}
                {showAddProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {editingProduct ? 'Edit Product/Service' : 'Add New Product/Service'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Name *</Label>
                                        <Input id="name" name="name" value={productFormData.name} onChange={handleProductInputChange} required />
                                    </div>
                                    <div>
                                        <Label htmlFor="type">Type</Label>
                                        <select value={productFormData.type} onChange={(e) => handleProductSelectChange('type', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                                            <option value="product">Product</option>
                                            <option value="service">Service</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Input id="category" name="category" value={productFormData.category} onChange={handleProductInputChange} />
                                    </div>
                                    <div>
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" name="price" value={productFormData.price} onChange={handleProductInputChange} />
                                    </div>
                                    <div>
                                        <Label htmlFor="currency">Currency</Label>
                                        <select value={productFormData.currency} onChange={(e) => handleProductSelectChange('currency', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                                            <option value="PHP">PHP (₱)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input id="website" name="website" value={productFormData.website} onChange={handleProductInputChange} />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={productFormData.description} onChange={handleProductInputChange} rows={3} />
                                </div>

                                <div>
                                    <Label htmlFor="features">Key Features</Label>
                                    <Textarea id="features" name="features" value={productFormData.features} onChange={handleProductInputChange} rows={2} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="targetAudience">Target Audience</Label>
                                        <Input id="targetAudience" name="targetAudience" value={productFormData.targetAudience} onChange={handleProductInputChange} />
                                    </div>
                                    <div>
                                        <Label htmlFor="competitors">Main Competitors</Label>
                                        <Input id="competitors" name="competitors" value={productFormData.competitors} onChange={handleProductInputChange} />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button variant="outline" onClick={() => {
                                        setShowAddProduct(false);
                                        setEditingProduct(null);
                                        setProductFormData({
                                            name: '', type: 'product', category: '', description: '', price: '',
                                            currency: 'PHP', website: '', features: '', targetAudience: '', competitors: ''
                                        });
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct} className="bg-green-600 hover:bg-green-700">
                                        {editingProduct ? 'Update Product/Service' : 'Add Product/Service'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Brand Kit Modal */}
                {showBrandKit && brandKitTarget && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Brand Kit for {brandKitTarget.type === 'company' ? company.name : brandKitTarget.data.name}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Complete the brand kit to customize your {brandKitTarget.type === 'company' ? 'company' : 'product'} experience
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={() => { setShowBrandKit(false); setBrandKitTarget(null); }}>
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
                                        onClick={() => handleBrandKitComplete(
                                            brandKitTarget.type,
                                            brandKitTarget.type === 'product' ? brandKitTarget.data.id : null
                                        )}
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

export default CompanyPage;
