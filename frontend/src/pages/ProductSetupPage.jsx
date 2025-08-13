import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Package,
    Plus,
    Edit,
    Trash2,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Palette,
    Building2,
    PhilippinePeso,
    Tag,
    FileText,
    Globe,
    ShoppingCart,
    Settings,
    Star
} from 'lucide-react';
import { toast } from 'sonner';
import BrandKitForm from '@/components/form/BrandKitForm';

const ProductSetupPage = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showBrandKit, setShowBrandKit] = useState(false);
    const [currentProductForBrandKit, setCurrentProductForBrandKit] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'product', // 'product' or 'service'
        category: '',
        description: '',
        price: '',
        currency: 'PHP',
        website: '',
        features: '',
        targetAudience: '',
        competitors: ''
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
        } else {
            // If no companies, redirect to company setup
            navigate('/company-setup');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = () => {
        if (!formData.name.trim()) {
            toast.error('Product/Service name is required');
            return;
        }

        if (!selectedCompany) {
            toast.error('Please select a company first');
            return;
        }

        const newProduct = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            brandKitCompleted: false,
            companyId: selectedCompany.id
        };

        // Update companies with new product
        const updatedCompanies = companies.map(company =>
            company.id === selectedCompany.id
                ? { ...company, products: [...(company.products || []), newProduct] }
                : company
        );

        setCompanies(updatedCompanies);
        setSelectedCompany(updatedCompanies.find(c => c.id === selectedCompany.id));

        // Update localStorage
        localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));

        setFormData({
            name: '',
            type: 'product',
            category: '',
            description: '',
            price: '',
            currency: 'PHP',
            website: '',
            features: '',
            targetAudience: '',
            competitors: ''
        });
        setShowAddForm(false);
        toast.success('Product/Service added successfully!');
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData(product);
        setShowAddForm(true);
    };

    const handleUpdateProduct = () => {
        if (!formData.name.trim()) {
            toast.error('Product/Service name is required');
            return;
        }

        const updatedCompanies = companies.map(company =>
            company.id === selectedCompany.id
                ? {
                    ...company,
                    products: company.products.map(product =>
                        product.id === editingProduct.id
                            ? { ...product, ...formData }
                            : product
                    )
                }
                : company
        );

        setCompanies(updatedCompanies);
        setSelectedCompany(updatedCompanies.find(c => c.id === selectedCompany.id));
        localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));

        setFormData({
            name: '',
            type: 'product',
            category: '',
            description: '',
            price: '',
            currency: 'PHP',
            website: '',
            features: '',
            targetAudience: '',
            competitors: ''
        });
        setEditingProduct(null);
        setShowAddForm(false);
        toast.success('Product/Service updated successfully!');
    };

    const handleDeleteProduct = (productId) => {
        const updatedCompanies = companies.map(company =>
            company.id === selectedCompany.id
                ? {
                    ...company,
                    products: company.products.filter(product => product.id !== productId)
                }
                : company
        );

        setCompanies(updatedCompanies);
        setSelectedCompany(updatedCompanies.find(c => c.id === selectedCompany.id));
        localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));
        toast.success('Product/Service deleted successfully!');
    };

    const handleBrandKitComplete = (productId) => {
        const updatedCompanies = companies.map(company =>
            company.id === selectedCompany.id
                ? {
                    ...company,
                    products: company.products.map(product =>
                        product.id === productId
                            ? { ...product, brandKitCompleted: true }
                            : product
                    )
                }
                : company
        );

        setCompanies(updatedCompanies);
        setSelectedCompany(updatedCompanies.find(c => c.id === selectedCompany.id));
        localStorage.setItem('userCompanies', JSON.stringify(updatedCompanies));

        setShowBrandKit(false);
        setCurrentProductForBrandKit(null);
        toast.success('Brand kit completed successfully!');
    };

    const handleContinueToDashboard = () => {
        if (companies.length === 0) {
            toast.error('No companies found');
            return;
        }

        navigate('/company-selection');
    };

    const handleBackToCompanies = () => {
        navigate('/company-setup');
    };

    const getProductTypeIcon = (type) => {
        return type === 'product' ? <Package className="w-4 h-4" /> : <Settings className="w-4 h-4" />;
    };

    const getProductTypeColor = (type) => {
        return type === 'product' ? 'bg-blue-500' : 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Package className="w-12 h-12 text-green-600 dark:text-green-400 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Product/Service Setup
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Add products and services for your companies and complete their brand kits.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">Companies</span>
                        </div>
                        <div className="w-16 h-0.5 bg-green-300 dark:bg-green-600"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                                <Package className="w-4 h-4" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">Products</span>
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

                {/* Company Selector */}
                {companies.length > 1 && (
                    <div className="mb-6">
                        <Card className="bg-white dark:bg-gray-800 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Select Company:
                                    </Label>
                                    <Select value={selectedCompany?.id?.toString()} onValueChange={(value) => {
                                        const company = companies.find(c => c.id.toString() === value);
                                        setSelectedCompany(company);
                                    }}>
                                        <SelectTrigger className="w-64">
                                            <SelectValue placeholder="Select a company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id.toString()}>
                                                    <div className="flex items-center space-x-2">
                                                        <Building2 className="w-4 h-4" />
                                                        <span>{company.name}</span>
                                                        <Badge variant="outline" className="ml-2">
                                                            {(company.products || []).length} products
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Products List */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white dark:bg-gray-800 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedCompany ? `${selectedCompany.name} - Products & Services` : 'Products & Services'}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Manage your products and services for this company
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setShowAddForm(true)}
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={!selectedCompany}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Product/Service
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {!selectedCompany ? (
                                    <div className="text-center py-12">
                                        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            No company selected
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Please select a company to manage its products and services.
                                        </p>
                                    </div>
                                ) : (selectedCompany.products || []).length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            No products or services added yet
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Start by adding your first product or service for {selectedCompany.name}.
                                        </p>
                                        <Button
                                            onClick={() => setShowAddForm(true)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Your First Product/Service
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {(selectedCompany.products || []).map((product) => (
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
                                                                        <PhilippinePeso className="w-4 h-4 mr-2" />
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
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setCurrentProductForBrandKit(product);
                                                                        setShowBrandKit(true);
                                                                    }}
                                                                    className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                >
                                                                    <Palette className="w-4 h-4 mr-1" />
                                                                    Brand Kit
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEditProduct(product)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDeleteProduct(product.id)}
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
                                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            1
                                        </div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Add products/services
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
                                            2
                                        </div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Complete brand kits
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
                                            3
                                        </div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Access dashboard
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                    <Button
                                        onClick={handleContinueToDashboard}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                        Continue to Dashboard
                                    </Button>

                                    <Button
                                        onClick={handleBackToCompanies}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Companies
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Add/Edit Product Form Modal */}
                {showAddForm && (
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
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter product/service name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="product">Product</SelectItem>
                                                <SelectItem value="service">Service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Software, Consulting"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 999.99"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PHP">PHP (₱)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Brief description of your product/service"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="features">Key Features</Label>
                                    <Textarea
                                        id="features"
                                        name="features"
                                        value={formData.features}
                                        onChange={handleInputChange}
                                        placeholder="List key features or benefits"
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="targetAudience">Target Audience</Label>
                                        <Input
                                            id="targetAudience"
                                            name="targetAudience"
                                            value={formData.targetAudience}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Small businesses, Enterprise"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="competitors">Main Competitors</Label>
                                        <Input
                                            id="competitors"
                                            name="competitors"
                                            value={formData.competitors}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Competitor A, Competitor B"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingProduct(null);
                                            setFormData({
                                                name: '',
                                                type: 'product',
                                                category: '',
                                                description: '',
                                                price: '',
                                                currency: 'PHP',
                                                website: '',
                                                features: '',
                                                targetAudience: '',
                                                competitors: ''
                                            });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {editingProduct ? 'Update Product/Service' : 'Add Product/Service'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Brand Kit Form Modal */}
                {showBrandKit && currentProductForBrandKit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Brand Kit for {currentProductForBrandKit.name}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Complete the brand kit to customize your product/service experience
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowBrandKit(false);
                                            setCurrentProductForBrandKit(null);
                                        }}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6">
                                <BrandKitForm
                                    onComplete={() => handleBrandKitComplete(currentProductForBrandKit.id)}
                                    productId={currentProductForBrandKit.id}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSetupPage;
