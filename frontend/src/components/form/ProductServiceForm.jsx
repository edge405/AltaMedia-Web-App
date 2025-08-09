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
import TagInput from './TagInput';
import FileUpload from './FileUpload';
import AISuggestion from './AISuggestion';
import CheckboxGroup from './CheckboxGroup';
import { saveFormData, getFormData } from '@/utils/productServiceApi';

const ProductServiceForm = ({ onFormTypeChange = () => { } }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        buildingType: 'product' // Default value
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const totalSteps = 5;
    const steps = [
        'Product Basics',
        'Audience & Market Fit',
        'Brand Style & Identity',
        'Needs & Deliverables',
        'Final Info'
    ];

    // Load existing form data on component mount
    useEffect(() => {
        const loadFormData = async () => {
            if (!user?.id) {
                console.log('❌ No user ID available, starting with empty form');
                setCurrentStep(1);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                console.log('🔄 Loading existing ProductService form data...');
                console.log('👤 User ID:', user.id);
                console.log('🔗 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');

                const response = await getFormData(user.id);

                console.log('📥 API Response:', response);

                if (response.success && response.data.formData) {
                    console.log('✅ Found existing form data, loading...');
                    setFormData(response.data.formData);
                    setCurrentStep(response.data.currentStep || 1);
                } else {
                    console.log('📭 No existing form data found, starting fresh');
                    setFormData({ buildingType: 'product' });
                    setCurrentStep(1);
                }
            } catch (err) {
                console.error('❌ Error loading form data:', err);
                console.error('❌ Error details:', {
                    message: err.message,
                    stack: err.stack,
                    response: err.response?.data
                });
                setError('Failed to load existing form data. Starting fresh.');
                setFormData({ buildingType: 'product' });
                setCurrentStep(1);
            } finally {
                setIsLoading(false);
            }
        };

        loadFormData();
    }, [user?.id]);

    // Log form data changes
    useEffect(() => {
        console.log('=== PRODUCT SERVICE FORM DATA ===');
        console.log('Current Step:', currentStep);
        console.log('Form Data:', formData);
        console.log('Building Type:', formData.buildingType);
        console.log('===============================');
    }, [formData, currentStep]);

    const updateFormData = (field, value) => {
        console.log(`Field change: ${field} =`, value);

        // If building type is changing, notify parent component
        if (field === 'buildingType' && value === 'business' && onFormTypeChange) {
            onFormTypeChange('business');
            return;
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const nextStep = async () => {
        if (!user?.id) {
            console.error('❌ No user ID available');
            toast.error('Please log in to save your progress');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            console.log('=== SAVING STEP DATA ===');
            console.log('Step Number:', currentStep);
            console.log('Step Name:', steps[currentStep - 1]);
            console.log('User ID:', user.id);
            console.log('Form Data:', formData);
            console.log('🔗 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');
            console.log('========================');

            const response = await saveFormData(user.id, formData, currentStep);

            console.log('💾 Save response:', response);

            if (response.success) {
                console.log('✅ Step data saved successfully');
                toast.success(`Step ${currentStep} saved successfully!`);

                if (currentStep < totalSteps) {
                    setCurrentStep(currentStep + 1);
                    console.log(`Moving to step ${currentStep + 1}: ${steps[currentStep]}`);
                }
            } else {
                throw new Error(response.message || 'Failed to save step data');
            }
        } catch (err) {
            console.error('❌ Error saving step data:', err);
            console.error('❌ Error details:', {
                message: err.message,
                stack: err.stack,
                response: err.response?.data
            });
            setError(err.message || 'Failed to save your progress. Please try again.');
            toast.error('Failed to save progress. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            console.log(`Moving back to step ${currentStep - 1}: ${steps[currentStep - 2]}`);
        }
    };

    const handleSubmit = async () => {
        if (!user?.id) {
            console.error('No user ID available');
            toast.error('Please log in to submit your form');
            return;
        }

        console.log('=== COMPLETING PRODUCT SERVICE FORM ===');
        console.log('Final Form Data:', formData);
        console.log('User ID:', user.id);
        console.log('Total Steps Completed:', totalSteps);
        console.log('=====================================');

        setIsSaving(true);
        setError(null);

        try {
            console.log('Completing form with data:', formData);

            const response = await saveFormData(user.id, formData, totalSteps);

            console.log('💾 Final save response:', response);

            if (response.success) {
                console.log('✅ Form completed successfully');
                setIsSubmitted(true);
                toast.success('🎉 Product/Service form completed successfully! Your brand identity is ready.');

                console.log('=== FORM COMPLETED SUCCESSFULLY ===');
                console.log('All data logged above');
                console.log('===============================');
            } else {
                throw new Error(response.message || 'Failed to complete form');
            }
        } catch (err) {
            console.error('❌ Error completing form:', err);
            setError(err.message || 'Failed to submit form. Please try again.');
            toast.error('Failed to submit form. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

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
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="What's the name of your product or service?" type="Short Text" required>
                <Input
                    value={formData.productName || ''}
                    onChange={(e) => updateFormData('productName', e.target.value)}
                    placeholder="Enter your product or service name"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Describe your product or service in one sentence." type="Short Text" required aiSuggestions>
                <div className="space-y-4">
                    <Input
                        value={formData.productDescription || ''}
                        onChange={(e) => updateFormData('productDescription', e.target.value)}
                        placeholder="Describe your product or service in one sentence"
                        className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <AISuggestion
                        fieldName="productDescription"
                        onApplySuggestion={(suggestion) => updateFormData('productDescription', suggestion)}
                        formData={formData}
                    />
                </div>
            </FormField>

            <FormField label="What industry does this belong to?" type="Tags" required>
                <TagInput
                    value={formData.industry || []}
                    onChange={(value) => updateFormData('industry', value)}
                    placeholder="Enter your industry"
                    suggestions={[
                        "Technology", "Health & Wellness", "Food & Beverage", "Fashion",
                        "Education", "Finance", "Entertainment", "Real Estate", "Automotive", "Beauty"
                    ]}
                />
            </FormField>

            <FormField label="Who is this product/service for?" type="Long Text" required>
                <Textarea
                    value={formData.wantToAttract || ''}
                    onChange={(e) => updateFormData('wantToAttract', e.target.value)}
                    placeholder="Describe who this product/service is for"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="What problem are you solving with this product—and what made you want to solve it?" type="Long Text" required aiSuggestions>
                <div className="space-y-4">
                    <Textarea
                        value={formData.missionStory || ''}
                        onChange={(e) => updateFormData('missionStory', e.target.value)}
                        placeholder="Describe the problem you're solving and what inspired you"
                        rows={4}
                        className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <AISuggestion
                        fieldName="missionStory"
                        onApplySuggestion={(suggestion) => updateFormData('missionStory', suggestion)}
                        formData={formData}
                    />
                </div>
            </FormField>

            <FormField label="What kind of emotional response do you want your product to create?" type="Dropdown" required>
                <Select value={formData.desiredEmotion} onValueChange={(value) => updateFormData('desiredEmotion', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select desired emotional response" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        {[
                            "Happy", "Fulfilled", "Inspired", "Satisfied",
                            "Energized", "Empowered", "Safe & Secure", "Confident"
                        ].map(emotion => (
                            <SelectItem key={emotion} value={emotion.toLowerCase()}>{emotion}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Choose a tone of voice that fits your product." type="Dropdown" required>
                <Select value={formData.brandTone} onValueChange={(value) => updateFormData('brandTone', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select tone of voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        {["Friendly", "Premium", "Bold", "Casual", "Professional"].map(tone => (
                            <SelectItem key={tone} value={tone.toLowerCase()}>{tone}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8">
            <FormField label="What types of people are you trying to reach? (e.g., professionals, students, parents)" type="Long Text">
                <Textarea
                    value={formData.targetAudienceProfile || ''}
                    onChange={(e) => updateFormData('targetAudienceProfile', e.target.value)}
                    placeholder="Describe the types of people you're trying to reach"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="What platforms or places do you want to reach them?" type="Tags">
                <TagInput
                    value={formData.reachLocations || []}
                    onChange={(value) => updateFormData('reachLocations', value)}
                    placeholder="Enter platforms or places to reach your audience"
                    suggestions={["Social Media", "Google", "LinkedIn", "Trade Shows", "Online Forums", "Messenger Ads"]}
                />
            </FormField>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-8">
            <FormField label="What 3 words best describe your product's personality?" type="Tags" aiSuggestions>
                <div className="space-y-4">
                    <TagInput
                        value={formData.brandPersonality || []}
                        onChange={(value) => updateFormData('brandPersonality', value)}
                        placeholder="Enter 3 words that describe your product's personality"
                        suggestions={[
                            "Innovative", "Reliable", "Fun", "Professional", "Creative",
                            "Trustworthy", "Bold", "Elegant", "Friendly", "Modern"
                        ]}
                    />
                    <AISuggestion
                        fieldName="brandPersonality"
                        onApplySuggestion={(suggestion) => updateFormData('brandPersonality', suggestion.split(', '))}
                        formData={formData}
                    />
                </div>
            </FormField>

            <FormField label="Describe your preferred visual direction." type="Tags" aiSuggestions>
                <div className="space-y-4">
                    <TagInput
                        value={formData.designStyle || []}
                        onChange={(value) => updateFormData('designStyle', value)}
                        placeholder="Enter your preferred visual direction"
                        suggestions={[
                            "Minimalist", "Bold", "Modern", "Vintage", "Elegant",
                            "Playful", "Professional", "Creative", "Clean", "Dynamic"
                        ]}
                    />
                    <AISuggestion
                        fieldName="designStyle"
                        onApplySuggestion={(suggestion) => updateFormData('designStyle', suggestion.split(', '))}
                        formData={formData}
                    />
                </div>
            </FormField>

            <FormField label="Preferred colors?" type="Tags">
                <TagInput
                    value={formData.preferredColors || []}
                    onChange={(value) => updateFormData('preferredColors', value)}
                    placeholder="Enter your preferred colors"
                    suggestions={["Blue", "Green", "Red", "Yellow", "Purple", "Orange", "Pink", "Black", "White", "Gray"]}
                />
            </FormField>

            <FormField label="Colors you want to avoid?" type="Tags">
                <TagInput
                    value={formData.colorsToAvoid || []}
                    onChange={(value) => updateFormData('colorsToAvoid', value)}
                    placeholder="Enter colors you want to avoid"
                />
            </FormField>

            <FormField label="Any direct competitors or similar products?" type="Long Text">
                <Textarea
                    value={formData.competitors || ''}
                    onChange={(e) => updateFormData('competitors', e.target.value)}
                    placeholder="Describe any direct competitors or similar products"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-8">
            <FormField label="Where will this product appear?" type="Checkbox">
                <CheckboxGroup
                    options={["Website", "Social Media", "Packaging", "Ads", "Email"]}
                    value={formData.brandKitUse || []}
                    onChange={(value) => updateFormData('brandKitUse', value)}
                />
            </FormField>

            <FormField label="What assets do you need us to create?" type="Checkbox">
                <CheckboxGroup
                    options={["Logo", "Labels", "Mockups", "Product Sheet", "Presentation"]}
                    value={formData.brandElements || []}
                    onChange={(value) => updateFormData('brandElements', value)}
                />
            </FormField>

            <FormField label="Preferred file formats?" type="Checkbox">
                <CheckboxGroup
                    options={["PDF", "PNG", "SVG", "AI"]}
                    value={formData.fileFormats || []}
                    onChange={(value) => updateFormData('fileFormats', value)}
                />
            </FormField>

            <FormField label="Other platforms you'd like support with?" type="Checkbox">
                <CheckboxGroup
                    options={["GHL CRM", "Automation Setup", "Landing Page", "Email Setup"]}
                    value={formData.platformSupport || []}
                    onChange={(value) => updateFormData('platformSupport', value)}
                />
            </FormField>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-8">
            <FormField label="When do you need this ready by?" type="Dropdown" required>
                <Select value={formData.timeline} onValueChange={(value) => updateFormData('timeline', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        {["Within 1 month", "1–2 months", "2–3 months", "Flexible"].map(timeline => (
                            <SelectItem key={timeline} value={timeline.toLowerCase().replace(/\s+/g, '-')}>{timeline}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Where are you based?" type="Short Text" required>
                <Input
                    value={formData.primaryLocation || ''}
                    onChange={(e) => updateFormData('primaryLocation', e.target.value)}
                    placeholder="Enter your location"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="How should we reach you?" type="Dropdown" required>
                <Select value={formData.preferredContact} onValueChange={(value) => updateFormData('preferredContact', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        {["Use my email above", "Additional Phone Number", "Additional Email"].map(contact => (
                            <SelectItem key={contact} value={contact.toLowerCase().replace(/\s+/g, '-')}>{contact}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Who else is involved in approvals?" type="Short Text">
                <Input
                    value={formData.approver || ''}
                    onChange={(e) => updateFormData('approver', e.target.value)}
                    placeholder="Enter who else is involved in approvals"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Anything else you'd like us to know?" type="Long Text">
                <Textarea
                    value={formData.specialNotes || ''}
                    onChange={(e) => updateFormData('specialNotes', e.target.value)}
                    placeholder="Any additional information you'd like to share"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Upload any reference materials or inspiration boards (optional)" type="Upload">
                <FileUpload
                    value={formData.referenceMaterials || ''}
                    onChange={(value) => updateFormData('referenceMaterials', value)}
                    placeholder="Upload reference materials or inspiration boards"
                />
            </FormField>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
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
                            🎉 Product/Service Form Completed!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                            Congratulations! Your product/service information has been successfully saved.
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
                        <Button
                            onClick={handleBackToDashboard}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8 py-3 text-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                    Product/Service Brand Kit Form – Alta Media
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Let's create the perfect brand identity for your product or service
                </p>
            </div>

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
                    <Button
                        variant="outline"
                        onClick={handleBackToDashboard}
                        className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="sm:hidden">Dashboard</span>
                    </Button>

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

export default ProductServiceForm;
