import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    RefreshCw,
    Download,
    Palette,
    Eye,
    FileText,
    Users,
    Package,
    Building,
    FileDown,
    MoreHorizontal,
    ClipboardList
} from 'lucide-react';
import apiService from '@/utils/api';
import formExportUtils from '@/utils/formExportUtils';

export default function AdminAllForms({
    brandKits,
    loadingBrandKits,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    fetchBrandKits,
    downloadBrandKit,
    downloadAllBrandKits
}) {
    const [allForms, setAllForms] = useState([]);
    const [loadingAllForms, setLoadingAllForms] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);
    const [showFormDetails, setShowFormDetails] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [brandKitQuestionnaires, setBrandKitQuestionnaires] = useState([]);
    const [organizationForms, setOrganizationForms] = useState([]);
    const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(false);
    const [loadingOrganizations, setLoadingOrganizations] = useState(false);



    // Fetch all form types
    const fetchAllFormTypes = async () => {
        setLoadingAllForms(true);
        setLoadingQuestionnaires(true);
        setLoadingOrganizations(true);

        try {
            // Fetch BrandKit Questionnaires
            const questionnaireResponse = await fetch('/api/brandkit-questionnaire/admin/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const questionnaireData = await questionnaireResponse.json();

            if (questionnaireData.success) {
                setBrandKitQuestionnaires(questionnaireData.data.forms || []);
            } else {
                console.error('❌ BrandKit Questionnaires API error:', questionnaireData);
                setBrandKitQuestionnaires([]);
            }

            // Fetch Organization Forms
            const organizationResponse = await fetch('/api/organization/admin/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const organizationData = await organizationResponse.json();

            if (organizationData.success) {
                setOrganizationForms(organizationData.data.forms || []);
            } else {
                setOrganizationForms([]);
            }

        } catch (error) {
            setBrandKitQuestionnaires([]);
            setOrganizationForms([]);
        } finally {
            setLoadingQuestionnaires(false);
            setLoadingOrganizations(false);
            setLoadingAllForms(false);
        }
    };

    // Use the brandKits data passed from parent and combine with other form types
    useEffect(() => {
        fetchAllFormTypes();
    }, []);

    useEffect(() => {
        if (brandKits && brandKits.length > 0) {
            // Transform brandKits data to match the expected format
            const transformedBrandKits = brandKits.map(brandKit => ({
                ...brandKit,
                form_type: 'brandkit',
                form_name: 'BrandKit Form',
                icon: Palette,
                color: 'bg-blue-500',
                user_email: brandKit.user_email || brandKit.business_email,
                user_fullname: brandKit.user_fullname || brandKit.business_name || 'Unknown User',
                user_id: brandKit.user_id
            }));

            // Transform BrandKit Questionnaires
            const transformedQuestionnaires = brandKitQuestionnaires.map(questionnaire => ({
                ...questionnaire,
                form_type: 'brandkit-questionnaire',
                form_name: 'BrandKit Questionnaire',
                icon: ClipboardList,
                color: 'bg-purple-500',
                user_email: questionnaire.user_email,
                user_fullname: questionnaire.user_name || 'Unknown User',
                user_id: questionnaire.user_id,
                business_name: questionnaire.brand_name || 'No Brand Name',
                progress_percentage: questionnaire.progress_percentage || 0,
                is_completed: questionnaire.is_completed || false
            }));

            // Transform Organization Forms
            const transformedOrganizations = organizationForms.map(organization => ({
                ...organization,
                form_type: 'organization',
                form_name: 'Organization Form',
                icon: Building,
                color: 'bg-green-500',
                user_email: organization.user_email,
                user_fullname: organization.user_name || 'Unknown User',
                user_id: organization.user_id,
                business_name: organization.organization_name || 'No Organization Name',
                progress_percentage: organization.progress_percentage || 0,
                is_completed: organization.is_completed || false
            }));

            // Combine all forms
            const allFormsCombined = [
                ...transformedBrandKits,
                ...transformedQuestionnaires,
                ...transformedOrganizations
            ];

            setAllForms(allFormsCombined);
        } else {
            // Still show other form types even if brandKits is empty
            const transformedQuestionnaires = brandKitQuestionnaires.map(questionnaire => ({
                ...questionnaire,
                form_type: 'brandkit-questionnaire',
                form_name: 'BrandKit Questionnaire',
                icon: ClipboardList,
                color: 'bg-purple-500',
                user_email: questionnaire.user_email,
                user_fullname: questionnaire.user_name || 'Unknown User',
                user_id: questionnaire.user_id,
                business_name: questionnaire.brand_name || 'No Brand Name',
                progress_percentage: questionnaire.progress_percentage || 0,
                is_completed: questionnaire.is_completed || false
            }));

            const transformedOrganizations = organizationForms.map(organization => ({
                ...organization,
                form_type: 'organization',
                form_name: 'Organization Form',
                icon: Building,
                color: 'bg-green-500',
                user_email: organization.user_email,
                user_fullname: organization.user_name || 'Unknown User',
                user_id: organization.user_id,
                business_name: organization.organization_name || 'No Organization Name',
                progress_percentage: organization.progress_percentage || 0,
                is_completed: organization.is_completed || false
            }));

            const allFormsCombined = [
                ...transformedQuestionnaires,
                ...transformedOrganizations
            ];

            setAllForms(allFormsCombined);
        }
    }, [brandKits, brandKitQuestionnaires, organizationForms]);

    const getProgressColor = (progress) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 60) return "bg-blue-500";
        if (progress >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getProgressText = (progress) => {
        if (progress >= 80) return "Almost Complete";
        if (progress >= 60) return "In Progress";
        if (progress >= 40) return "Started";
        return "Just Started";
    };

    const getFormIcon = (formType) => {
        switch (formType) {
            case 'brandkit': return Palette;
            case 'brandkit-questionnaire': return ClipboardList;
            case 'organization': return Building;
            case 'productservice': return Package;
            default: return FileText;
        }
    };

    const getFormColor = (formType) => {
        switch (formType) {
            case 'brandkit': return 'bg-blue-500';
            case 'brandkit-questionnaire': return 'bg-purple-500';
            case 'organization': return 'bg-green-500';
            case 'productservice': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const handleExportForm = async (form, format = 'pdf') => {
        setExporting(true);
        try {
            const filename = `${form.form_type}_${form.user_email || form.user_id}_${new Date().toISOString().split('T')[0]}`;

            if (format === 'pdf') {
                await formExportUtils.generatePDF(form, form.form_type, filename);
            } else if (format === 'json') {
                formExportUtils.exportAsJSON(form, filename);
            } else if (format === 'csv') {
                formExportUtils.exportAsCSV(form, filename);
            }
        } catch (error) {
            console.error('Error exporting form:', error);
        } finally {
            setExporting(false);
        }
    };

    const handleViewFormDetails = (form) => {
        setSelectedForm(form);
        setShowFormDetails(true);
    };

    const filteredForms = allForms.filter(form => {
        const matchesSearch = !searchTerm ||
            form.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.user_fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.contact_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.primary_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.user_id?.toString().includes(searchTerm);

        const matchesFilter = filterStatus === "all" ||
            (filterStatus === "completed" && form.is_completed) ||
            (filterStatus === "in-progress" && form.progress_percentage >= 60 && form.progress_percentage < 80) ||
            (filterStatus === "started" && form.progress_percentage < 60);

        return matchesSearch && matchesFilter;
    });

    const isLoading = loadingBrandKits || loadingAllForms || loadingQuestionnaires || loadingOrganizations;

    return (
        <div className="space-y-8">
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">BrandKit Forms Management</CardTitle>
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => {
                                    fetchBrandKits();
                                    fetchAllFormTypes();
                                }}
                                disabled={isLoading}
                                variant="outline"
                                className="border-2 border-black text-black hover:bg-black hover:text-white px-4 py-2 rounded-2xl"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh All
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search BrandKit forms by client name, email, business, location, industry, or user ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors font-medium"
                        >
                            <option value="all">All Forms</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="started">Started</option>
                        </select>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-[#f7e833] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <RefreshCw className="w-8 h-8 text-black animate-spin" />
                            </div>
                            <p className="text-gray-600 font-medium">Loading All Forms...</p>
                        </div>
                    )}

                    {/* Forms Grid */}
                    {!isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredForms.map((form) => {
                                const FormIcon = getFormIcon(form.form_type);
                                const formColor = getFormColor(form.form_type);

                                return (
                                    <Card key={`${form.form_type}-${form.id}`} className="bg-gray-50 border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`w-12 h-12 ${formColor} rounded-2xl flex items-center justify-center`}>
                                                    <FormIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <Badge className={`${getProgressColor(form.progress_percentage)} text-white px-3 py-1 rounded-full text-xs`}>
                                                    {getProgressText(form.progress_percentage)}
                                                </Badge>
                                            </div>

                                            <h3 className="font-bold text-gray-900 mb-2 text-lg">
                                                {form.form_name}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-3">
                                                {form.user_email || 'No email provided'}
                                            </p>

                                            {/* Client Information Section */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Users className="w-4 h-4 text-blue-600" />
                                                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Client Information</p>
                                                </div>

                                                {/* Show relevant client data based on form type */}
                                                {form.business_name && (
                                                    <div className="mb-2">
                                                        <p className="text-xs text-blue-600 mb-1">
                                                            {form.form_type === 'organization' ? 'Organization Name' :
                                                                form.form_type === 'brandkit-questionnaire' ? 'Brand Name' : 'Business Name'}
                                                        </p>
                                                        <p className="text-sm font-medium text-blue-900">{form.business_name}</p>
                                                    </div>
                                                )}

                                                <div className="mb-2">
                                                    <p className="text-xs text-blue-600 mb-1">Client Name</p>
                                                    <p className="text-sm font-medium text-blue-900">{form.user_fullname || 'Unknown User'}</p>
                                                </div>

                                                {form.contact_number && (
                                                    <div className="mb-2">
                                                        <p className="text-xs text-blue-600 mb-1">Contact Number</p>
                                                        <p className="text-sm font-medium text-blue-900">{form.contact_number}</p>
                                                    </div>
                                                )}

                                                {form.primary_location && (
                                                    <div className="mb-2">
                                                        <p className="text-xs text-blue-600 mb-1">Location</p>
                                                        <p className="text-sm font-medium text-blue-900">{form.primary_location}</p>
                                                    </div>
                                                )}

                                                {form.industry && (
                                                    <div className="mb-2">
                                                        <p className="text-xs text-blue-600 mb-1">Industry</p>
                                                        <p className="text-sm font-medium text-blue-900">
                                                            {Array.isArray(form.industry) ? form.industry.join(', ') : form.industry}
                                                        </p>
                                                    </div>
                                                )}

                                                {form.product_name && (
                                                    <div className="mb-2">
                                                        <p className="text-xs text-blue-600 mb-1">Product/Service</p>
                                                        <p className="text-sm font-medium text-blue-900">{form.product_name}</p>
                                                    </div>
                                                )}

                                                {form.organization_name && (
                                                    <div className="mb-2">
                                                        <p className="text-xs text-blue-600 mb-1">Organization</p>
                                                        <p className="text-sm font-medium text-blue-900">{form.organization_name}</p>
                                                    </div>
                                                )}

                                                {/* User ID for reference */}
                                                <div className="pt-2 border-t border-blue-200">
                                                    <p className="text-xs text-blue-500">User ID: {form.user_id}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Progress</p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`${form.is_completed ? 'bg-green-500' : (form.progress_percentage || 0) > 0 ? 'bg-blue-500' : 'bg-gray-300'} h-2 rounded-full transition-all duration-300`}
                                                            style={{ width: `${form.is_completed ? 100 : (form.progress_percentage || 0)}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {form.is_completed ? 'Completed' : (form.progress_percentage || 0) > 0 ? 'In Progress' : 'Not Started'}
                                                    </p>
                                                </div>

                                                {/* Show relevant form-specific data */}
                                                {form.business_name && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            {form.form_type === 'organization' ? 'Organization' :
                                                                form.form_type === 'brandkit-questionnaire' ? 'Brand' : 'Business'}
                                                        </p>
                                                        <p className="text-sm text-gray-700">{form.business_name}</p>
                                                    </div>
                                                )}

                                                {form.product_name && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Product</p>
                                                        <p className="text-sm text-gray-700">{form.product_name}</p>
                                                    </div>
                                                )}

                                                {form.organization_name && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Organization</p>
                                                        <p className="text-sm text-gray-700">{form.organization_name}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                <span>Created: {new Date(form.created_at).toLocaleDateString()}</span>
                                                <span>Updated: {new Date(form.updated_at).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white rounded-xl"
                                                    onClick={() => handleExportForm(form, 'pdf')}
                                                    disabled={exporting}
                                                >
                                                    <Download className="w-4 h-4 mr-1" />
                                                    PDF
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-2 border-[#f7e833] text-[#f7e833] hover:bg-[#f7e833] hover:text-black rounded-xl"
                                                    onClick={() => handleViewFormDetails(form)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredForms.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium mb-2">No Forms Found</p>
                            <p className="text-gray-500 text-sm">No forms have been submitted yet or match your search criteria.</p>
                        </div>
                    )}

                    {/* Stats Summary */}
                    {!isLoading && allForms.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-gray-900">{allForms.length}</p>
                                <p className="text-sm text-gray-600">Total Forms</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {allForms.filter(f => f.is_completed).length}
                                </p>
                                <p className="text-sm text-gray-600">Completed</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {allForms.filter(f => f.progress_percentage >= 60 && f.progress_percentage < 80).length}
                                </p>
                                <p className="text-sm text-gray-600">In Progress</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {allForms.filter(f => f.progress_percentage < 60).length}
                                </p>
                                <p className="text-sm text-gray-600">Started</p>
                            </div>
                        </div>
                    )}

                    {/* Form Type Breakdown */}
                    {!isLoading && allForms.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {allForms.filter(f => f.form_type === 'brandkit').length}
                                </p>
                                <p className="text-sm text-blue-600">BrandKit Forms</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-purple-600">
                                    {allForms.filter(f => f.form_type === 'brandkit-questionnaire').length}
                                </p>
                                <p className="text-sm text-purple-600">BrandKit Questionnaires</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-2xl text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {allForms.filter(f => f.form_type === 'organization').length}
                                </p>
                                <p className="text-sm text-green-600">Organization Forms</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Form Details Modal */}
            {showFormDetails && selectedForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedForm.form_name} Details
                                </h2>
                                <Button
                                    onClick={() => setShowFormDetails(false)}
                                    variant="outline"
                                    className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">User Email</p>
                                        <p className="text-gray-900 font-medium">{selectedForm.user_email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Form Type</p>
                                        <p className="text-gray-900 font-medium">{selectedForm.form_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Progress</p>
                                        <p className="text-gray-900 font-medium">
                                            {selectedForm.is_completed ? 'Completed' : (selectedForm.progress_percentage || 0) > 0 ? 'In Progress' : 'Not Started'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Status</p>
                                        <p className="text-gray-900 font-medium">
                                            {selectedForm.is_completed ? 'Completed' : 'In Progress'}
                                        </p>
                                    </div>
                                </div>

                                {/* Client Information Section */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                                        Client Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 rounded-2xl p-4">
                                        <div>
                                            <p className="text-sm text-blue-600 mb-1">Client Name</p>
                                            <p className="text-gray-900 font-medium">{selectedForm.user_fullname || 'Unknown User'}</p>
                                        </div>
                                        {selectedForm.business_name && (
                                            <div>
                                                <p className="text-sm text-blue-600 mb-1">
                                                    {selectedForm.form_type === 'organization' ? 'Organization Name' :
                                                        selectedForm.form_type === 'brandkit-questionnaire' ? 'Brand Name' : 'Business Name'}
                                                </p>
                                                <p className="text-gray-900 font-medium">{selectedForm.business_name}</p>
                                            </div>
                                        )}
                                        {selectedForm.contact_number && (
                                            <div>
                                                <p className="text-sm text-blue-600 mb-1">Contact Number</p>
                                                <p className="text-gray-900 font-medium">{selectedForm.contact_number}</p>
                                            </div>
                                        )}
                                        {selectedForm.primary_location && (
                                            <div>
                                                <p className="text-sm text-blue-600 mb-1">Location</p>
                                                <p className="text-gray-900 font-medium">{selectedForm.primary_location}</p>
                                            </div>
                                        )}
                                        {selectedForm.industry && (
                                            <div>
                                                <p className="text-sm text-blue-600 mb-1">Industry</p>
                                                <p className="text-gray-900 font-medium">
                                                    {Array.isArray(selectedForm.industry) ? selectedForm.industry.join(', ') : selectedForm.industry}
                                                </p>
                                            </div>
                                        )}
                                        {selectedForm.product_name && (
                                            <div>
                                                <p className="text-sm text-blue-600 mb-1">Product/Service</p>
                                                <p className="text-gray-900 font-medium">{selectedForm.product_name}</p>
                                            </div>
                                        )}
                                        {selectedForm.organization_name && (
                                            <div>
                                                <p className="text-sm text-blue-600 mb-1">Organization</p>
                                                <p className="text-gray-900 font-medium">{selectedForm.organization_name}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-blue-600 mb-1">User ID</p>
                                            <p className="text-gray-900 font-medium">{selectedForm.user_id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Data</h3>
                                    <div className="bg-gray-50 rounded-2xl p-4 max-h-96 overflow-y-auto">
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {JSON.stringify(selectedForm, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                <div className="flex space-x-3 pt-6 border-t">
                                    <Button
                                        onClick={() => handleExportForm(selectedForm, 'pdf')}
                                        disabled={exporting}
                                        className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Export PDF
                                    </Button>
                                    <Button
                                        onClick={() => handleExportForm(selectedForm, 'json')}
                                        disabled={exporting}
                                        variant="outline"
                                        className="border-2 border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-2xl font-semibold"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Export JSON
                                    </Button>
                                    <Button
                                        onClick={() => handleExportForm(selectedForm, 'csv')}
                                        disabled={exporting}
                                        variant="outline"
                                        className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100 px-6 py-3 rounded-2xl font-semibold"
                                    >
                                        <FileDown className="w-4 h-4 mr-2" />
                                        Export CSV
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
