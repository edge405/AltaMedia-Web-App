import React, { useState, useReducer, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Check, Building2, Palette, Target, Users, Globe, FileText, Image, Settings, Zap } from 'lucide-react';
import FormField from './FormField';
import ProgressBar from './ProgressBar';
import ColorPicker from './ColorPicker';
import TagInput from './TagInput';
import FileUpload from './FileUpload';
import AISuggestion from './AISuggestion';
import CheckboxGroup from './CheckboxGroup';
import MapPicker from './MapPicker';

// Initial form state - using the same fields as KnowingYouForm
const initialFormState = {
    // Step 1: Business Basics
    buildingType: '',
    businessEmail: '',
    hasProventousId: '',
    proventousId: '',
    businessName: '',

    // Step 2: About Your Business
    contactNumber: '',
    preferredContact: '',
    industry: [],
    yearStarted: '',
    primaryLocation: '',
    behindBrand: '',
    currentCustomers: [],
    wantToAttract: '',
    teamDescription: '',

    // Step 3: Audience Clarity
    desiredEmotion: '',
    targetProfessions: [],
    reachLocations: [],
    ageGroups: [],
    spendingHabits: [],
    interactionMethods: [],
    customerChallenges: '',

    // Step 4: Team & Culture
    cultureWords: [],
    teamTraditions: '',

    // Step 5: Brand Identity
    reason1: '',
    reason2: '',
    reason3: '',
    brandSoul: '',
    brandTone: [],
    brand1: '',
    brand2: '',
    brand3: '',
    brandAvoid: '',

    // Step 6: Visual Direction
    hasLogo: '',
    logoAction: [],
    preferredColors: '',
    colorsToAvoid: '',
    fontStyles: [],
    designStyle: [],
    logoType: [],
    imageryStyle: [],
    inspirationLinks: '',

    // Step 7: Collateral Needs
    brandKitUse: [],
    brandElements: [],
    fileFormats: [],

    // Step 8: Business Goals
    primaryGoal: '',
    shortTermGoals: '',
    longTermGoal: '',
    midTermGoals: '',
    bigPictureVision: '',
    successMetrics: [],

    // Step 9: AI-Powered Insights
    businessDescription: '',
    inspiration: '',
    targetInterests: [],
    currentInterests: [],
    audienceBehavior: [],
    customerChoice: '',
    missionStatement: '',
    longTermVision: '',
    coreValues: [],
    brandPersonality: [],
    teamHighlights: '',

    // Step 10: Wrap-Up
    specialNotes: '',
    timeline: '',
    approver: '',

    // Step 11: Upload References
    referenceMaterials: ''
};

// Form reducer for state management
const formReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.field]: action.value
            };
        case 'UPDATE_STEP':
            return {
                ...state,
                ...action.stepData
            };
        case 'RESET_FORM':
            return initialFormState;
        default:
            return state;
    }
};

const BrandKitForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, dispatch] = useReducer(formReducer, initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debug: Monitor form data changes
    useEffect(() => {
        console.log('Form data updated:', formData);
    }, [formData]);

    // Debug: Component mount
    useEffect(() => {
        alert('BrandKitForm MOUNTED - Component is loading');
        console.log('BrandKitForm component mounted');
        console.log('Initial form data:', formData);
        console.error('TEST ERROR LOG');
        console.warn('TEST WARNING LOG');
        console.info('TEST INFO LOG');
    }, []);

    // Handle field updates
    const handleFieldChange = (field, value) => {
        console.log(`Field change: ${field} =`, value);
        dispatch({ type: 'UPDATE_FIELD', field, value });
    };

    // Handle step navigation
    const handleNext = () => {
        // Multiple logging approaches to ensure we see something
        alert(`Step ${currentStep} - Starting data collection...`);

        console.log('handleNext called for step:', currentStep);
        console.error('ERROR LOG - Step:', currentStep);
        console.warn('WARNING LOG - Step:', currentStep);
        console.info('INFO LOG - Step:', currentStep);

        // Create a visible log on the page
        const logDiv = document.createElement('div');
        logDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; border: 2px solid red; z-index: 9999; max-width: 300px; font-size: 12px;';
        logDiv.innerHTML = `
      <strong>Step ${currentStep} Data:</strong><br>
      <pre>${JSON.stringify(formData, null, 2)}</pre>
    `;
        document.body.appendChild(logDiv);

        // Remove the log after 10 seconds
        setTimeout(() => {
            if (logDiv.parentNode) {
                logDiv.parentNode.removeChild(logDiv);
            }
        }, 10000);

        if (currentStep < 11) {
            console.log(`Moving from step ${currentStep} to step ${currentStep + 1}`);
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Reached final step, calling handleSubmit');
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        console.log('Final Form Submission:', formData);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert('BrandKit form submitted successfully! Check console for data.');
        }, 2000);
    };

    // Step rendering functions - using exact same structure as KnowingYouForm
    const renderStep1 = () => (
        <div className="space-y-8">
            <FormField label="What are you building?" type="Dropdown" required>
                <Select value={formData.buildingType} onValueChange={(value) => handleFieldChange('buildingType', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select what you're building" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="business">Business/Company</SelectItem>
                        <SelectItem value="product">Specific Product/Service</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Business Email" type="Short Text" required>
                <Input
                    type="email"
                    value={formData.businessEmail || ''}
                    onChange={(e) => handleFieldChange('businessEmail', e.target.value)}
                    placeholder="Enter your business email"
                    className="w-full border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Do you have a Proventous ID?" type="Dropdown">
                <Select value={formData.hasProventousId} onValueChange={(value) => handleFieldChange('hasProventousId', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            {formData.hasProventousId === 'yes' && (
                <FormField label="Proventous ID Number" type="Short Text">
                    <Input
                        value={formData.proventousId || ''}
                        onChange={(e) => handleFieldChange('proventousId', e.target.value)}
                        placeholder="Enter your Proventous ID"
                        className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </FormField>
            )}

            <FormField label="Full Name of Business/Organization" type="Short Text" required>
                <Input
                    value={formData.businessName || ''}
                    onChange={(e) => handleFieldChange('businessName', e.target.value)}
                    placeholder="Enter your business name"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8">
            <FormField label="Contact Number" type="Short Text">
                <Input
                    type="tel"
                    value={formData.contactNumber || ''}
                    onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
                    placeholder="Enter your contact number"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Preferred Contact Method" type="Dropdown">
                <Select value={formData.preferredContact} onValueChange={(value) => handleFieldChange('preferredContact', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select preferred contact method" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="messenger">Messenger/WhatsApp</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Industry or Niche" type="Tags" required>
                <TagInput
                    value={formData.industry || []}
                    onChange={(value) => handleFieldChange('industry', value)}
                    placeholder="Enter your industry or niche"
                    suggestions={['Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Manufacturing', 'Consulting', 'Creative']}
                />
            </FormField>

            <FormField label="Year Officially Started" type="Dropdown" required>
                <Select value={formData.yearStarted} onValueChange={(value) => handleFieldChange('yearStarted', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Primary Location" type="Map" required>
                <MapPicker
                    value={formData.primaryLocation || ''}
                    onChange={(value) => handleFieldChange('primaryLocation', value)}
                    placeholder="Enter your primary location"
                />
            </FormField>

            <FormField label="Who's Behind the Brand?" type="Long Text">
                <Textarea
                    value={formData.behindBrand || ''}
                    onChange={(e) => handleFieldChange('behindBrand', e.target.value)}
                    placeholder="Tell us about the people behind your brand"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Who Typically Buys from You Now?" type="Checkbox">
                <CheckboxGroup
                    options={['Male', 'Female', 'Everyone']}
                    value={formData.currentCustomers || []}
                    onChange={(value) => handleFieldChange('currentCustomers', value)}
                />
            </FormField>

            <FormField label="Who Do You Want to Attract?" type="Long Text" required>
                <Textarea
                    value={formData.wantToAttract || ''}
                    onChange={(e) => handleFieldChange('wantToAttract', e.target.value)}
                    placeholder="Describe your ideal target audience"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="How Would Your Team Describe Working at Your Business?" type="Long Text">
                <Textarea
                    value={formData.teamDescription || ''}
                    onChange={(e) => handleFieldChange('teamDescription', e.target.value)}
                    placeholder="Describe your company culture from your team's perspective"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>
        </div>
    );

    // Simplified step functions for now
    const renderStep3 = () => <div className="space-y-8"><p>Step 3: Audience Clarity</p></div>;
    const renderStep4 = () => <div className="space-y-8"><p>Step 4: Team & Culture</p></div>;
    const renderStep5 = () => <div className="space-y-8"><p>Step 5: Brand Identity</p></div>;
    const renderStep6 = () => <div className="space-y-8"><p>Step 6: Visual Direction</p></div>;
    const renderStep7 = () => <div className="space-y-8"><p>Step 7: Collateral Needs</p></div>;
    const renderStep8 = () => <div className="space-y-8"><p>Step 8: Business Goals</p></div>;
    const renderStep9 = () => <div className="space-y-8"><p>Step 9: AI-Powered Insights</p></div>;
    const renderStep10 = () => <div className="space-y-8"><p>Step 10: Wrap-Up</p></div>;
    const renderStep11 = () => <div className="space-y-8"><p>Step 11: Upload References</p></div>;

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            case 6: return renderStep6();
            case 7: return renderStep7();
            case 8: return renderStep8();
            case 9: return renderStep9();
            case 10: return renderStep10();
            case 11: return renderStep11();
            default: return null;
        }
    };

    const stepTitles = [
        'Business Basics',
        'About Your Business',
        'Audience Clarity',
        'Team & Culture',
        'Brand Identity',
        'Visual Direction',
        'Collateral Needs',
        'Business Goals',
        'AI-Powered Insights',
        'Wrap-Up',
        'Upload References'
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
                        BrandKit Form - Step {currentStep} of 11
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-6 sm:p-8">
                    {/* Progress Bar */}
                    <ProgressBar
                        currentStep={currentStep}
                        totalSteps={11}
                        steps={stepTitles}
                    />

                    <Separator className="my-6" />

                    {/* Step Content */}
                    <div className="min-h-[400px]">
                        {renderCurrentStep()}
                    </div>

                    <Separator className="my-6" />

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Step {currentStep} of 11
                            </span>
                        </div>

                        <Button
                            onClick={() => {
                                alert('NEXT BUTTON CLICKED!');
                                console.log('NEXT BUTTON CLICKED!');
                                console.error('NEXT BUTTON ERROR LOG');
                                console.warn('NEXT BUTTON WARNING LOG');
                                console.info('NEXT BUTTON INFO LOG');
                                handleNext();
                            }}
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            {currentStep === 11 ? (
                                <>
                                    {isSubmitting ? 'Submitting...' : 'Submit Form'}
                                    <Check className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Success Alert */}
                    {currentStep === 11 && (
                        <Alert className="mt-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                You're almost done! Review your information and click Submit to complete your BrandKit form.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BrandKitForm; 