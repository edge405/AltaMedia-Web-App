import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProgressBar from './ProgressBar';
import FormField from './FormField';
import FileUpload from './FileUpload';
import AISuggestion from './AISuggestion';
import CheckboxGroup from './CheckboxGroup';
import { brandKitApi, transformToDatabaseFormat, transformToFrontendFormat } from '@/utils/brandKitApi';
import KnowingYouForm from './KnowingYouForm';
import ProductServiceForm from './ProductServiceForm';

const OrganizationForm = ({ onFormTypeChange = () => { } }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        buildingType: 'organization' // Default value
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const totalSteps = 4;
    const steps = [
        'Core Brand & Campaign Info',
        'Platform & Content Focus',
        'Deliverables & Timeline',
        'Collaboration & Wrap-Up'
    ];

    // Load existing form data on component mount
    useEffect(() => {
        const loadFormData = async () => {
            // For testing, use a default user ID if not authenticated
            const userId = user?.id || 1;

            if (!user?.id) {
                console.log('No authenticated user, using test user ID:', userId);
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await brandKitApi.getFormData(userId);

                if (response.success && response.data?.formData) {
                    const frontendData = transformToFrontendFormat(response.data.formData);
                    setFormData(frontendData);
                    setCurrentStep(response.data.currentStep || 1);
                    console.log('Loaded existing form data:', frontendData);
                }
            } catch (err) {
                console.error('Error loading form data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadFormData();
    }, [user?.id]);

    const updateFormData = (field, value) => {
        console.log(`Field change: ${field} =`, value);

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // If building type is changing, notify parent component
        if (field === 'buildingType' && onFormTypeChange) {
            onFormTypeChange(value);
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const nextStep = async () => {
        console.log('User object:', user);
        console.log('User ID:', user?.id);

        // For testing, use a default user ID if not authenticated
        const userId = user?.id || 1;

        if (!user?.id) {
            console.log('No authenticated user, using test user ID:', userId);
        }

        setIsSaving(true);
        setError(null);

        try {
            // Transform form data to database format
            const stepData = transformToDatabaseFormat(formData);

            console.log('Saving form data for step:', currentStep);
            console.log('User ID:', user.id);
            console.log('Step data:', stepData);

            // Save current step data
            const response = await brandKitApi.saveFormData(userId, stepData, currentStep);

            if (response.success) {
                console.log('Form data saved successfully:', response.data);

                if (currentStep < totalSteps) {
                    setCurrentStep(currentStep + 1);
                }
            } else {
                setError('Failed to save form data');
            }
        } catch (err) {
            console.error('Error saving form data:', err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        // For testing, use a default user ID if not authenticated
        const userId = user?.id || 1;

        if (!user?.id) {
            console.log('No authenticated user, using test user ID:', userId);
        }

        setIsSaving(true);
        setError(null);

        try {
            // Transform form data to database format
            const finalData = transformToDatabaseFormat(formData);

            console.log('Completing form with data:', finalData);

            // Save the final step data (step 4)
            const response = await brandKitApi.saveFormData(userId, finalData, 4);

            if (response.success) {
                console.log('Form completed successfully:', response.data);
                setIsSubmitted(true);
                // Show success message
                toast.success('🎉 Organization form completed successfully! Your social media strategy is ready.');
            } else {
                setError('Failed to complete form');
            }
        } catch (err) {
            console.error('Error completing form:', err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    // If building type is "business", render the KnowingYouForm component
    if (formData.buildingType === 'business') {
        return <KnowingYouForm onFormTypeChange={(type) => {
            updateFormData('buildingType', type);
            setCurrentStep(1); // Reset to first step
        }} />;
    }

    // If building type is "product", render the ProductServiceForm component
    if (formData.buildingType === 'product') {
        return <ProductServiceForm onFormTypeChange={(type) => {
            updateFormData('buildingType', type);
            setCurrentStep(1); // Reset to first step
        }} />;
    }

    const renderStep1 = () => (
        <div className="space-y-8">
            <FormField label="What are you building?" type="Dropdown" required>
                <Select value={formData.buildingType} onValueChange={(value) => updateFormData('buildingType', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select what you're building" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="business">Business/Company</SelectItem>
                        <SelectItem value="product">Specific Product/Service</SelectItem>
                        <SelectItem value="organization">Organization/Brand/Page</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="What's the name of your organization, brand, or page?" type="Short Text" required>
                <Input
                    value={formData.organizationName || ''}
                    onChange={(e) => updateFormData('organizationName', e.target.value)}
                    placeholder="Enter your organization, brand, or page name"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Briefly describe your social media goals and who you want to reach." type="Long Text" required aiSuggestions>
                <Textarea
                    placeholder="e.g., raise awareness among young professionals, drive sales to moms, build community for hobbyists"
                    value={formData.socialMediaGoals || ''}
                    onChange={(e) => updateFormData('socialMediaGoals', e.target.value)}
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <AISuggestion
                    fieldName="socialMediaGoals"
                    currentValue={formData.socialMediaGoals}
                    onApplySuggestion={(suggestion) => updateFormData('socialMediaGoals', suggestion)}
                    formData={formData}
                />
            </FormField>

            <FormField label="What makes your brand unique, and how should it sound online? (tone/style)" type="Long Text" required aiSuggestions>
                <Textarea
                    placeholder="Describe your brand's unique qualities and online voice"
                    value={formData.brandUniqueness || ''}
                    onChange={(e) => updateFormData('brandUniqueness', e.target.value)}
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <AISuggestion
                    fieldName="brandUniqueness"
                    currentValue={formData.brandUniqueness}
                    onApplySuggestion={(suggestion) => updateFormData('brandUniqueness', suggestion)}
                    formData={formData}
                />
            </FormField>

            <FormField label="What feeling do you want your audience to have after engaging with your content?" type="Dropdown" required>
                <Select value={formData.desiredEmotion} onValueChange={(value) => updateFormData('desiredEmotion', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select desired emotional response" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        {['Happy', 'Fulfilled', 'Inspired', 'Satisfied', 'Energized', 'Empowered', 'Safe & Secure', 'Confident'].map(emotion => (
                            <SelectItem key={emotion} value={emotion.toLowerCase()}>{emotion}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8">
            <FormField label="Which platforms should we focus on?" type="Checkbox" required>
                <CheckboxGroup
                    options={['Facebook', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn']}
                    value={formData.targetPlatforms || []}
                    onChange={(value) => updateFormData('targetPlatforms', value)}
                />
            </FormField>

            <FormField label="What types of content should we prioritize?" type="Checkbox" aiSuggestions>
                <CheckboxGroup
                    options={['Short Videos/Reels', 'Static Graphics', 'Carousel Posts', 'Motion Graphics', 'Long-Form Videos']}
                    value={formData.contentTypes || []}
                    onChange={(value) => updateFormData('contentTypes', value)}
                />
                <AISuggestion
                    fieldName="contentTypes"
                    currentValue={formData.contentTypes?.join(', ')}
                    onApplySuggestion={(suggestion) => updateFormData('contentTypes', suggestion.split(', '))}
                    formData={formData}
                />
            </FormField>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-8">
            <FormField label="What do you need us to create?" type="Checkbox" required>
                <CheckboxGroup
                    options={[
                        'Social Media Calendar',
                        'Ad Creatives',
                        'Caption Writing + Hashtags',
                        'Video Editing',
                        'Graphics Design',
                        'Platform Setup/Optimization',
                        'Performance Reports'
                    ]}
                    value={formData.deliverables || []}
                    onChange={(value) => updateFormData('deliverables', value)}
                />
            </FormField>

            <FormField label="When do you want the first batch ready by?" type="Dropdown" required>
                <Select value={formData.timeline} onValueChange={(value) => updateFormData('timeline', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="within-2-weeks">Within 2 weeks</SelectItem>
                        <SelectItem value="within-1-month">Within 1 month</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-8">
            <FormField label="Who will be our main point of contact?" type="Short Text" required>
                <Input
                    value={formData.mainContact || ''}
                    onChange={(e) => updateFormData('mainContact', e.target.value)}
                    placeholder="Enter main point of contact name"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Anything else we should know? Upload any references here." type="Long Text + Upload">
                <div className="space-y-4">
                    <Textarea
                        value={formData.additionalInfo || ''}
                        onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                        placeholder="Any additional information or special requirements"
                        rows={4}
                        className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <FileUpload
                        value={formData.referenceMaterials || ''}
                        onChange={(value) => updateFormData('referenceMaterials', value)}
                        placeholder="Upload reference files or paste links"
                    />
                </div>
            </FormField>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            default: return null;
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20 shadow-lg">
                    <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            🎉 Organization Form Completed!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                            Congratulations! Your organization information has been successfully saved.
                        </p>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border mb-8 shadow-sm">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-lg">All Submitted Data:</h3>
                            <div className="text-left space-y-3 text-sm text-gray-600 dark:text-gray-300 max-h-96 overflow-y-auto">
                                {Object.entries(formData).map(([key, value]) => (
                                    <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {Array.isArray(value)
                                                ? value.join(', ')
                                                : typeof value === 'object' && value !== null
                                                    ? JSON.stringify(value, null, 2)
                                                    : value || 'Not provided'
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                onClick={handleBackToDashboard}
                                className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8 py-3 text-lg"
                            >
                                Return to Dashboard
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show loading state while initializing
    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-600 dark:text-gray-300">Loading your form data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            <div className="mb-6 sm:mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Organization Form – Alta Media
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Let's create the perfect social media strategy for your organization
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
            )}

            <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
                steps={steps}
            />

            <div className="rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Step {currentStep}: {steps[currentStep - 1]}
                    </h2>
                </div>
                <div className="p-4 sm:p-6">
                    {renderCurrentStep()}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">

                    {currentStep > 1 && (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-full sm:w-auto"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </Button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium text-center sm:text-left">
                        Step {currentStep} of {totalSteps}
                    </span>

                    {currentStep === totalSteps ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Form
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={nextStep}
                            disabled={currentStep === totalSteps || isSaving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizationForm;
