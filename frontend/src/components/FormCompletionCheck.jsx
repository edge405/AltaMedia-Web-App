import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, ArrowRight, FileText, Package, Building, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import APIs
import { brandKitApi } from '@/utils/brandKitApi';
import { brandKitQuestionnaireApi } from '@/utils/brandKitQuestionnaireApi';
import { organizationApi } from '@/utils/organizationApi';

// Import form components
import KnowingYouForm from '@/components/form/KnowingYouForm';
import BrandKitQuestionnaire from '@/components/form/BrandKitQuestionnaire';
import OrganizationForm from '@/components/form/OrganizationForm';

export default function FormCompletionCheck({ onFormsComplete }) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [formStatuses, setFormStatuses] = useState({
        knowingYou: { completed: false, currentStep: 0, totalSteps: 11 },
        brandKitQuestionnaire: { completed: false, currentStep: 0, totalSteps: 9 },
        organization: { completed: false, currentStep: 0, totalSteps: 4 }
    });
    const [currentForm, setCurrentForm] = useState(null);
    const [error, setError] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Check all form statuses
    useEffect(() => {
        const checkAllFormStatuses = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const userId = user.id;
                const newFormStatuses = { ...formStatuses };

                // Check Knowing You Form (BrandKit)
                try {
                    const knowingYouResponse = await brandKitApi.getFormData(userId);
                    if (knowingYouResponse.success && knowingYouResponse.data) {
                        newFormStatuses.knowingYou = {
                            completed: knowingYouResponse.data.currentStep === 11,
                            currentStep: knowingYouResponse.data.currentStep || 0,
                            totalSteps: 11
                        };
                    }
                } catch (error) {
                    console.error('Error checking Knowing You Form status:', error);
                }

                // Check BrandKit Questionnaire Form
                try {
                    const brandKitQuestionnaireResponse = await brandKitQuestionnaireApi.getFormData(userId);
                    if (brandKitQuestionnaireResponse.success && brandKitQuestionnaireResponse.data) {
                        const isCompleted = brandKitQuestionnaireResponse.data.isCompleted || brandKitQuestionnaireResponse.data.currentStep === 9;
                        const currentStep = brandKitQuestionnaireResponse.data.currentStep || 0;

                        newFormStatuses.brandKitQuestionnaire = {
                            completed: isCompleted,
                            currentStep: isCompleted ? 9 : currentStep, // Force to 9 if completed
                            totalSteps: 9
                        };

                        console.log('📊 BrandKit Questionnaire status:', {
                            isCompleted,
                            currentStep,
                            status: isCompleted ? 'Completed' : currentStep > 0 ? 'In Progress' : 'Not Started'
                        });
                    } else {
                        // No form data found, set as not started
                        newFormStatuses.brandKitQuestionnaire = {
                            completed: false,
                            currentStep: 0,
                            totalSteps: 9
                        };
                    }
                } catch (error) {
                    console.error('Error checking BrandKit Questionnaire Form status:', error);
                    // Set as not started on error
                    newFormStatuses.brandKitQuestionnaire = {
                        completed: false,
                        currentStep: 0,
                        totalSteps: 9
                    };
                }



                // Check Organization Form
                try {
                    const organizationResponse = await organizationApi.getFormData();
                    if (organizationResponse.success && organizationResponse.data) {
                        newFormStatuses.organization = {
                            completed: organizationResponse.data.currentStep === 4,
                            currentStep: organizationResponse.data.currentStep || 0,
                            totalSteps: 4
                        };
                    } else {
                        // No form data found, set as not started
                        newFormStatuses.organization = {
                            completed: false,
                            currentStep: 0,
                            totalSteps: 4
                        };
                    }
                } catch (error) {
                    console.error('Error checking Organization Form status:', error);
                    // Set as not started on error
                    newFormStatuses.organization = {
                        completed: false,
                        currentStep: 0,
                        totalSteps: 4
                    };
                }

                console.log('📈 Initial form statuses:', newFormStatuses);
                setFormStatuses(newFormStatuses);

                // Check if all forms are completed
                const allCompleted = Object.values(newFormStatuses).every(form => form.completed);
                console.log('✅ All forms completed initially:', allCompleted);

                if (allCompleted) {
                    // All forms completed, allow access to dashboard
                    console.log('🎊 All forms already completed! Allowing dashboard access...');
                    onFormsComplete();
                } else {
                    // Find the first incomplete form and redirect to it
                    console.log('🔄 Redirecting to first incomplete form...');
                    if (!newFormStatuses.knowingYou.completed) {
                        console.log('📝 Redirecting to Knowing You Form');
                        setCurrentForm('business');
                    } else if (!newFormStatuses.brandKitQuestionnaire.completed) {
                        console.log('📦 Redirecting to Product/Service Form');
                        setCurrentForm('product');
                    } else if (!newFormStatuses.organization.completed) {
                        console.log('🏢 Redirecting to Organization Form');
                        setCurrentForm('organization');
                    }
                }

            } catch (error) {
                console.error('Error checking form statuses:', error);
                setError('Failed to check form completion status');
                toast.error('Failed to check form completion status');
            } finally {
                setIsLoading(false);
            }
        };

        checkAllFormStatuses();
    }, [user?.id]);

    const handleFormComplete = () => {
        console.log('🎉 Form completed! Re-checking all form statuses...');
        setIsTransitioning(true);

        // Re-check all form statuses after a form is completed
        const checkCompletion = async () => {
            try {
                const userId = user?.id;
                console.log('🔍 Re-checking forms for user ID:', userId);

                // Add a small delay to ensure the form data is saved
                await new Promise(resolve => setTimeout(resolve, 1000));

                const newFormStatuses = { ...formStatuses };

                // Re-check all forms
                const knowingYouResponse = await brandKitApi.getFormData(userId);
                const brandKitQuestionnaireResponse = await brandKitQuestionnaireApi.getFormData(userId);
                const organizationResponse = await organizationApi.getFormData();

                console.log('📊 Form status responses:', {
                    knowingYou: knowingYouResponse,
                    brandKitQuestionnaire: brandKitQuestionnaireResponse,
                    organization: organizationResponse
                });

                if (knowingYouResponse.success && knowingYouResponse.data) {
                    newFormStatuses.knowingYou = {
                        completed: knowingYouResponse.data.currentStep === 11,
                        currentStep: knowingYouResponse.data.currentStep || 0,
                        totalSteps: 11
                    };
                }

                if (brandKitQuestionnaireResponse.success && brandKitQuestionnaireResponse.data) {
                    const isCompleted = brandKitQuestionnaireResponse.data.isCompleted || brandKitQuestionnaireResponse.data.currentStep === 9;
                    const currentStep = brandKitQuestionnaireResponse.data.currentStep || 0;

                    newFormStatuses.brandKitQuestionnaire = {
                        completed: isCompleted,
                        currentStep: isCompleted ? 9 : currentStep, // Force to 9 if completed
                        totalSteps: 9
                    };

                    console.log('📊 BrandKit Questionnaire status (refresh):', {
                        isCompleted,
                        currentStep,
                        status: isCompleted ? 'Completed' : currentStep > 0 ? 'In Progress' : 'Not Started'
                    });
                } else {
                    // No form data found, set as not started
                    newFormStatuses.brandKitQuestionnaire = {
                        completed: false,
                        currentStep: 0,
                        totalSteps: 9
                    };
                }

                if (organizationResponse.success && organizationResponse.data) {
                    newFormStatuses.organization = {
                        completed: organizationResponse.data.currentStep === 4,
                        currentStep: organizationResponse.data.currentStep || 0,
                        totalSteps: 4
                    };
                } else {
                    // No form data found, set as not started
                    newFormStatuses.organization = {
                        completed: false,
                        currentStep: 0,
                        totalSteps: 4
                    };
                }

                console.log('📈 Updated form statuses:', newFormStatuses);
                setFormStatuses(newFormStatuses);

                // Check if all forms are now completed
                const allCompleted = Object.values(newFormStatuses).every(form => form.completed);
                console.log('✅ All forms completed:', allCompleted);

                if (allCompleted) {
                    console.log('🎊 All forms completed! Redirecting to dashboard...');
                    toast.success('All forms completed! Redirecting to dashboard...');
                    onFormsComplete();
                }
                // Note: We don't redirect to next form here because the individual forms handle their own redirects
            } catch (error) {
                console.error('❌ Error re-checking form completion:', error);
                toast.error('Error checking form completion. Please try again.');
            } finally {
                setIsTransitioning(false);
            }
        };

        checkCompletion();
    };

    const handleFormTypeChange = (type) => {
        setCurrentForm(type);
    };

    // If a specific form is selected, render that form
    if (currentForm) {
        const formComponents = {
            'business': <KnowingYouForm onFormTypeChange={handleFormTypeChange} initialFormType="business" embedded={true} onComplete={handleFormComplete} />,
            'product': <BrandKitQuestionnaire onFormTypeChange={handleFormTypeChange} embedded={true} onComplete={handleFormComplete} />,
            'organization': <OrganizationForm onFormTypeChange={handleFormTypeChange} embedded={true} onComplete={handleFormComplete} />
        };

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    {/* Form Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Complete Your BrandKit Forms
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Please complete all required forms to access your dashboard
                        </p>
                        {currentForm && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                                <p className="text-blue-800 font-medium">
                                    {currentForm === 'business' && 'Currently completing: Knowing You Form'}
                                    {currentForm === 'product' && 'Currently completing: Product/Service Form'}
                                    {currentForm === 'organization' && 'Currently completing: Organization Form'}
                                </p>
                                <p className="text-blue-600 text-sm mt-1">
                                    Complete this form to proceed to the next one
                                </p>
                                <div className="mt-3 text-xs text-blue-600">
                                    <p>Form sequence: Knowing You → Product/Service → Organization</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress Overview */}
                    <Card className="mb-8 bg-white shadow-lg border-0 rounded-2xl">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${formStatuses.knowingYou.completed ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                        {formStatuses.knowingYou.completed ? (
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <FileText className="w-6 h-6 text-blue-600" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Knowing You Form</h3>
                                    <p className="text-sm text-gray-500">
                                        {formStatuses.knowingYou.completed ? 'Completed' : formStatuses.knowingYou.currentStep > 0 ? 'In Progress' : 'Not Started'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${formStatuses.brandKitQuestionnaire.completed ? 'bg-green-100' : 'bg-purple-100'
                                        }`}>
                                        {formStatuses.brandKitQuestionnaire.completed ? (
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <Package className="w-6 h-6 text-purple-600" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Product/Service Form</h3>
                                    <p className="text-sm text-gray-500">
                                        {formStatuses.brandKitQuestionnaire.completed ? 'Completed' : formStatuses.brandKitQuestionnaire.currentStep > 0 ? 'In Progress' : 'Not Started'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${formStatuses.organization.completed ? 'bg-green-100' : 'bg-orange-100'
                                        }`}>
                                        {formStatuses.organization.completed ? (
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <Building className="w-6 h-6 text-orange-600" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Organization Form</h3>
                                    <p className="text-sm text-gray-500">
                                        {formStatuses.organization.completed ? 'Completed' : formStatuses.organization.currentStep > 0 ? 'In Progress' : 'Not Started'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Current Form */}
                    {formComponents[currentForm]}
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#f7e833]" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking Form Status</h2>
                    <p className="text-gray-600">Please wait while we verify your form completion...</p>
                </div>
            </div>
        );
    }

    // Transition loading state
    if (isTransitioning) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#f7e833]" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Completed!</h2>
                    <p className="text-gray-600">Preparing next form...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} className="bg-[#f7e833] text-black hover:bg-[#e6d700]">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // This should not be reached, but just in case
    return null;
}
