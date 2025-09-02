import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Send, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { brandKitQuestionnaireApi, transformToDatabaseFormat, transformToFrontendFormat } from '@/utils/brandKitQuestionnaireApi';
import ProgressBar from './ProgressBar';
import FormField from './FormField';
import TagInput from './TagInput';
import ColorPicker from './ColorPicker';
import FileUpload from './FileUpload';
import AISuggestion from './AISuggestion';
import CheckboxGroup from './CheckboxGroup';

const BrandKitQuestionnaire = ({ embedded = false, onComplete = null, onFormTypeChange = null, onRefreshStatuses = null }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    // Load existing form data on component mount
    useEffect(() => {
        const loadFormData = async () => {
            // For testing, use a default user ID if not authenticated
            const userId = user?.id || 1;

            if (!user?.id) {
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await brandKitQuestionnaireApi.getFormData(userId);

                if (response.success && response.data?.formData) {
                    const frontendData = transformToFrontendFormat(response.data.formData);
                    setFormData(frontendData);
                    setCurrentStep(response.data.currentStep || 1);
                } else {
                }
            } catch (err) {
                console.error('Error loading BrandKit Questionnaire form data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadFormData();
    }, [user?.id]);

    const totalSteps = 9;
    const steps = [
        'Brand Identity',
        'Target Audience & Positioning',
        'Competitive Landscape',
        'Applications & Use Cases',
        'Brand Voice & Personality',
        'Visual Preferences',
        'Technical Deliverables',
        'Inspiration & References',
        'Closing Information'
    ];

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Validation function for current step - temporarily disabled
    const validateCurrentStep = () => {
        // Return empty array to allow proceeding without validation
        return [];
    };

    const nextStep = async () => {
        const errors = validateCurrentStep();

        if (errors.length > 0) {
            setValidationErrors(errors);
            toast.error('Please fill in all required fields before proceeding');
            return;
        }

        setValidationErrors([]);

        // For testing, use a default user ID if not authenticated
        const userId = user?.id || 1;

        if (!user?.id) {
        }

        setIsSaving(true);
        setError(null);

        try {

            // Save current step data (pass original formData, not transformed)
            const response = await brandKitQuestionnaireApi.saveFormData(userId, formData, currentStep);

            if (response.success) {

                if (currentStep < totalSteps) {
                    const nextStepNumber = currentStep + 1;

                    // Update UI immediately for real-time experience
                    setCurrentStep(nextStepNumber);

                    // Immediately refresh form statuses to update the UI
                    if (onRefreshStatuses) {
                        onRefreshStatuses();
                    }

                    // Note: Removed duplicate saveFormData call to prevent file duplication
                    // Progress is already tracked in the main saveFormData call

                    // Scroll to top when moving to next step
                    window.scrollTo({ top: 10, behavior: 'smooth' });
                }
            } else {
                setError('Failed to save BrandKit Questionnaire form data');
            }
        } catch (err) {
            console.error('Error saving BrandKit Questionnaire form data:', err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        const userId = user?.id || 1;

        if (!user?.id) {
        }

        setIsSaving(true);
        setError(null);

        try {

            // Save the final step data (step 9) - pass original formData
            const response = await brandKitQuestionnaireApi.saveFormData(userId, formData, 9);

            if (response.success) {

                // Mark form as completed
                await brandKitQuestionnaireApi.completeForm(userId);

                // Don't show completion screen, redirect to next form
                if (onFormTypeChange) {
                    // Redirect to OrganizationForm (the next form in the flow)
                    onFormTypeChange('organization');

                    // Trigger refresh after redirect to update status
                    if (onRefreshStatuses) {
                        setTimeout(() => {
                            onRefreshStatuses();
                        }, 500);
                    }
                } else if (onComplete) {
                    onComplete();
                } else {
                    // Fallback: Navigate to dashboard
                    navigate('/dashboard');
                }
            } else {
                setError('Failed to complete BrandKit Questionnaire form');
            }
        } catch (err) {
            console.error('Error completing BrandKit Questionnaire form:', err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBackToDashboard = () => {
        if (embedded) {
            onComplete && onComplete();
        } else {
            navigate('/dashboard');
        }
    };

    // Step 1: Brand Identity
    const renderStep1 = () => (
        <div className="space-y-8">
            <FormField label="What is the name of your product/brand?" type="Short Text">
                <Input
                    value={formData.brandName || ''}
                    onChange={(e) => updateFormData('brandName', e.target.value)}
                    placeholder="Enter your brand name"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="In one sentence, how would you describe your brand?" type="Short Text" aiSuggestions>
                <Input
                    value={formData.brandDescription || ''}
                    onChange={(e) => updateFormData('brandDescription', e.target.value)}
                    placeholder="Describe your brand in one sentence"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <AISuggestion
                    fieldName="brandDescription"
                    currentValue={formData.brandDescription}
                    onApplySuggestion={(suggestion) => updateFormData('brandDescription', suggestion)}
                    formData={formData}
                />
            </FormField>
        </div>
    );

    // Step 2: Target Audience & Positioning
    const renderStep2 = () => (
        <div className="space-y-8">
            <FormField label="Who are your primary customers? (demographics, psychographics, behaviors)" type="Long Text">
                <Textarea
                    value={formData.primaryCustomers || ''}
                    onChange={(e) => updateFormData('primaryCustomers', e.target.value)}
                    placeholder="Describe your primary customers in detail"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="How do you want your audience to feel when they interact with your brand?" type="Dropdown">
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

            <FormField label="What makes your product unique vs. competitors? (your 'unfair advantage')" type="Long Text">
                <Textarea
                    value={formData.unfairAdvantage || ''}
                    onChange={(e) => updateFormData('unfairAdvantage', e.target.value)}
                    placeholder="Describe what makes your product unique"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="If your brand disappeared tomorrow, what would your customers miss most?" type="Long Text">
                <Textarea
                    value={formData.customerMiss || ''}
                    onChange={(e) => updateFormData('customerMiss', e.target.value)}
                    placeholder="What would customers miss if your brand disappeared?"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="What problem does your product solve for them?" type="Long Text" aiSuggestions>
                <Textarea
                    value={formData.problemSolved || ''}
                    onChange={(e) => updateFormData('problemSolved', e.target.value)}
                    placeholder="Describe the problem your product solves"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <AISuggestion
                    fieldName="problemSolved"
                    currentValue={formData.problemSolved}
                    onApplySuggestion={(suggestion) => updateFormData('problemSolved', suggestion)}
                    formData={formData}
                />
            </FormField>
        </div>
    );

    // Step 3: Competitive Landscape
    const renderStep3 = () => (
        <div className="space-y-8">
            <FormField label="Who are your top 3 competitors?" type="Tags">
                <TagInput
                    value={formData.competitors || []}
                    onChange={(value) => updateFormData('competitors', value)}
                    placeholder="Enter your top 3 competitors"
                    suggestions={['Apple', 'Google', 'Microsoft', 'Amazon', 'Facebook', 'Netflix', 'Tesla', 'Nike']}
                />
            </FormField>

            <FormField label="What do you like about their branding?" type="Long Text">
                <Textarea
                    value={formData.competitorLikes || ''}
                    onChange={(e) => updateFormData('competitorLikes', e.target.value)}
                    placeholder="What aspects of competitor branding do you admire?"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />

            </FormField>

            <FormField label="What do you dislike about their branding?" type="Long Text">
                <Textarea
                    value={formData.competitorDislikes || ''}
                    onChange={(e) => updateFormData('competitorDislikes', e.target.value)}
                    placeholder="What aspects of competitor branding do you dislike?"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="How should your brand stand apart?" type="Long Text">
                <Textarea
                    value={formData.brandDifferentiation || ''}
                    onChange={(e) => updateFormData('brandDifferentiation', e.target.value)}
                    placeholder="How should your brand differentiate itself?"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>
        </div>
    );

    // Step 4: Applications & Use Cases
    const renderStep4 = () => (
        <div className="space-y-8">
            <FormField label="Where will your brand kit primarily be used?" type="Checkbox">
                <CheckboxGroup
                    options={['Website', 'Social Media', 'Packaging', 'Presentations', 'Merchandise', 'Business Cards', 'Email Marketing', 'Print Materials']}
                    value={formData.brandKitUse || []}
                    onChange={(value) => updateFormData('brandKitUse', value)}
                />
            </FormField>

            <FormField label="Do you need templates?" type="Checkbox">
                <CheckboxGroup
                    options={['Social Posts', 'Business Cards', 'Email Signatures', 'Pitch Decks', 'Letterhead', 'Social Media Templates']}
                    value={formData.templates || []}
                    onChange={(value) => updateFormData('templates', value)}
                />
            </FormField>

            <FormField label="Do you need assets for internal use as well?" type="Checkbox">
                <CheckboxGroup
                    options={['Recruitment Materials', 'Pitch Decks', 'HR Handbooks', 'Internal Communications', 'Training Materials']}
                    value={formData.internalAssets || []}
                    onChange={(value) => updateFormData('internalAssets', value)}
                />
            </FormField>

            <FormField label="Any specific formats or sizes you want included?" type="Checkbox">
                <CheckboxGroup
                    options={['PNG', 'JPG', 'PDF', 'EPS', 'SVG', 'Figma', 'PSD']}
                    value={formData.fileFormats || []}
                    onChange={(value) => updateFormData('fileFormats', value)}
                />
            </FormField>

            <FormField label="Should the kit adapt across languages or cultural markets?" type="Dropdown">
                <Select value={formData.culturalAdaptation} onValueChange={(value) => updateFormData('culturalAdaptation', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="maybe">Maybe in the future</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>
        </div>
    );

    // Step 5: Brand Voice & Personality
    const renderStep5 = () => (
        <div className="space-y-8">
            <FormField label="If your brand were a person, how would it speak?" type="Checkbox">
                <CheckboxGroup
                    options={['Formal', 'Casual', 'Witty', 'Professional', 'Playful', 'Authoritative', 'Friendly', 'Sophisticated']}
                    value={formData.brandVoice || []}
                    onChange={(value) => updateFormData('brandVoice', value)}
                />
            </FormField>

            <FormField label="Which brands do you admire for their tone of voice, and why?" type="Long Text">
                <Textarea
                    value={formData.admiredBrands || ''}
                    onChange={(e) => updateFormData('admiredBrands', e.target.value)}
                    placeholder="Which brands do you admire for their tone of voice?"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="Do you have an inspiration brand that you can import here?" type="Short Text">
                <Input
                    value={formData.inspirationBrand || ''}
                    onChange={(e) => updateFormData('inspirationBrand', e.target.value)}
                    placeholder="Enter brand name or URL"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="How do you want your audience to perceive your communications?" type="Checkbox">
                <CheckboxGroup
                    options={['Authoritative', 'Friendly', 'Quirky', 'Luxurious', 'Approachable', 'Professional', 'Innovative', 'Trustworthy']}
                    value={formData.communicationPerception || []}
                    onChange={(value) => updateFormData('communicationPerception', value)}
                />
            </FormField>
        </div>
    );

    // Step 6: Visual Preferences
    const renderStep6 = () => (
        <div className="space-y-8">
            <FormField label="Upload brand logo, if any." type="Upload">
                <FileUpload
                    value={formData.brandLogo || ''}
                    onChange={(value) => updateFormData('brandLogo', value)}
                    placeholder="Upload your brand logo"
                />
            </FormField>

            {formData.brandLogo && (
                <FormField label="Do you want it redesigned or refreshed?" type="Dropdown">
                    <Select value={formData.logoRedesign} onValueChange={(value) => updateFormData('logoRedesign', value)}>
                        <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="maybe">Maybe</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
            )}

            <FormField label="Do you already have existing brand colors?" type="Dropdown">
                <Select value={formData.hasExistingColors} onValueChange={(value) => updateFormData('hasExistingColors', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            {formData.hasExistingColors === 'yes' && (
                <FormField label="If yes, what are they?" type="Color Picker">
                    <ColorPicker
                        value={formData.existingColors || ''}
                        onChange={(value) => updateFormData('existingColors', value)}
                        placeholder="Enter your existing brand colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        💡 Examples: "Navy Blue (#1E40AF)", "Primary: Navy, Secondary: Green", or "Dark Navy, Sage Green"
                    </p>
                </FormField>
            )}

            {formData.hasExistingColors === 'no' && (
                <FormField label="If no, what colors feel right?" type="Color Picker">
                    <ColorPicker
                        value={formData.preferredColors || ''}
                        onChange={(value) => updateFormData('preferredColors', value)}
                        placeholder="Enter colors that feel right for your brand"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        💡 Examples: "Navy Blue", "#1E40AF", "Professional blues", or "Deep ocean blue"
                    </p>
                </FormField>
            )}

            <FormField label="Are there colors you absolutely want to avoid?" type="Color Picker">
                <ColorPicker
                    value={formData.colorsToAvoid || ''}
                    onChange={(value) => updateFormData('colorsToAvoid', value)}
                    placeholder="Enter colors you want to avoid"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Examples: "Neon Pink", "Bright Yellow", "Pastels", or "Anything too flashy"
                </p>
            </FormField>

            <FormField label="What kind of imagery/photography style fits your brand?" type="Tags">
                <TagInput
                    value={formData.imageryStyle || []}
                    onChange={(value) => updateFormData('imageryStyle', value)}
                    placeholder="Enter imagery/photography styles"
                    suggestions={['Minimalist', 'Vibrant', 'Nostalgic', 'Futuristic', 'Natural', 'Bold', 'Elegant', 'Playful', 'Professional']}
                />
            </FormField>

            <FormField label="Do you prefer serif or sans-serif fonts?" type="Checkbox">
                <CheckboxGroup
                    options={['Serif', 'Sans-serif', 'Script', 'Display', 'Monospace']}
                    value={formData.fontTypes || []}
                    onChange={(value) => updateFormData('fontTypes', value)}
                    enableCustomInput={true}
                    customInputPlaceholder="e.g., Roboto, Open Sans, Playfair Display, Comic Sans..."
                    fontBasedStyling={true}
                />
            </FormField>

            <FormField label="Font style preference?" type="Checkbox">
                <CheckboxGroup
                    options={['Modern', 'Classic', 'Playful', 'Professional', 'Elegant']}
                    value={formData.fontStyles || []}
                    onChange={(value) => updateFormData('fontStyles', value)}
                    enableCustomInput={true}
                    customInputPlaceholder="Add custom font style..."
                />
            </FormField>

            <FormField label="Are there any brand compliance or legal considerations?" type="Long Text">
                <Textarea
                    value={formData.legalConsiderations || ''}
                    onChange={(e) => updateFormData('legalConsiderations', e.target.value)}
                    placeholder="e.g., trademarked colors, restricted iconography"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>
        </div>
    );

    // Step 7: Technical Deliverables
    const renderStep7 = () => (
        <div className="space-y-8">
            <FormField label="Do you need source files delivered?" type="Checkbox">
                <CheckboxGroup
                    options={['PSD', 'Figma', 'Sketch', 'XD']}
                    value={formData.sourceFiles || []}
                    onChange={(value) => updateFormData('sourceFiles', value)}
                />
            </FormField>

            <FormField label="Any specific file formats required?" type="Checkbox">
                <CheckboxGroup
                    options={['PNG', 'SVG', 'PDF', 'JPG', 'EPS', 'TIFF']}
                    value={formData.requiredFormats || []}
                    onChange={(value) => updateFormData('requiredFormats', value)}
                />
            </FormField>
        </div>
    );

    // Step 8: Inspiration & References
    const renderStep8 = () => (
        <div className="space-y-8">
            <FormField label="Do you have moodboards, Pinterest boards, or reference images?" type="Upload">
                <FileUpload
                    value={formData.referenceMaterials || ''}
                    onChange={(value) => updateFormData('referenceMaterials', value)}
                    placeholder="Upload moodboards, Pinterest links, or reference images"
                />
            </FormField>

            <FormField label="Are there brands outside your industry that inspire you?" type="Long Text">
                <Textarea
                    value={formData.inspirationBrands || ''}
                    onChange={(e) => updateFormData('inspirationBrands', e.target.value)}
                    placeholder="Which brands outside your industry inspire you?"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
            </FormField>

            <FormField label="What's the 'vibe' you're chasing?" type="Tags">
                <TagInput
                    value={formData.brandVibe || []}
                    onChange={(value) => updateFormData('brandVibe', value)}
                    placeholder="Enter the vibe you're chasing"
                    suggestions={['Luxury', 'Eco-friendly', 'Tech-forward', 'Approachable', 'Youthful', 'Professional', 'Creative', 'Minimalist', 'Bold']}
                />
            </FormField>
        </div>
    );

    // Step 9: Closing Information (All AI-assisted)
    const renderStep9 = () => (
        <div className="space-y-8">
            <FormField label="What 3 words should people use to describe your brand?" type="Tags" aiSuggestions>
                <TagInput
                    value={formData.brandWords || []}
                    onChange={(value) => updateFormData('brandWords', value)}
                    placeholder="Enter 3 words people should use to describe your brand"
                    suggestions={['Innovative', 'Trustworthy', 'Creative', 'Professional', 'Friendly', 'Bold', 'Elegant', 'Reliable']}
                />
                <AISuggestion
                    fieldName="brandWords"
                    currentValue={formData.brandWords?.join(', ')}
                    onApplySuggestion={(suggestion) => updateFormData('brandWords', suggestion.split(', '))}
                    formData={formData}
                />
            </FormField>

            <FormField label="What 3 words should people never use to describe your brand?" type="Tags" aiSuggestions>
                <TagInput
                    value={formData.brandAvoidWords || []}
                    onChange={(value) => updateFormData('brandAvoidWords', value)}
                    placeholder="Enter 3 words people should never use to describe your brand"
                    suggestions={['Cheap', 'Unreliable', 'Boring', 'Unprofessional', 'Confusing', 'Outdated']}
                />
                <AISuggestion
                    fieldName="brandAvoidWords"
                    currentValue={formData.brandAvoidWords?.join(', ')}
                    onApplySuggestion={(suggestion) => updateFormData('brandAvoidWords', suggestion.split(', '))}
                    formData={formData}
                />
            </FormField>

            <FormField label="Do you have a tagline or slogan (existing or aspirational)?" type="Short Text" aiSuggestions>
                <Input
                    value={formData.tagline || ''}
                    onChange={(e) => updateFormData('tagline', e.target.value)}
                    placeholder="Enter your tagline or slogan"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <AISuggestion
                    fieldName="tagline"
                    currentValue={formData.tagline}
                    onApplySuggestion={(suggestion) => updateFormData('tagline', suggestion)}
                    formData={formData}
                />
            </FormField>

            <FormField label="What is your brand's mission?" type="Long Text" aiSuggestions>
                <Textarea
                    value={formData.mission || ''}
                    onChange={(e) => updateFormData('mission', e.target.value)}
                    placeholder="What is your brand's mission?"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <AISuggestion
                    fieldName="mission"
                    currentValue={formData.mission}
                    onApplySuggestion={(suggestion) => updateFormData('mission', suggestion)}
                    formData={formData}
                />
            </FormField>

            <FormField label="What is your long-term vision?" type="Long Text" aiSuggestions>
                <Textarea
                    value={formData.vision || ''}
                    onChange={(e) => updateFormData('vision', e.target.value)}
                    placeholder="What is your long-term vision?"
                    rows={4}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <AISuggestion
                    fieldName="vision"
                    currentValue={formData.vision}
                    onApplySuggestion={(suggestion) => updateFormData('vision', suggestion)}
                    formData={formData}
                />
            </FormField>

            <FormField label="What core values should always be reflected in your brand?" type="Tags" aiSuggestions>
                <TagInput
                    value={formData.coreValues || []}
                    onChange={(value) => updateFormData('coreValues', value)}
                    placeholder="Enter your core values"
                    suggestions={['Innovation', 'Integrity', 'Excellence', 'Customer-First', 'Collaboration', 'Transparency', 'Sustainability']}
                />
                <AISuggestion
                    fieldName="coreValues"
                    currentValue={formData.coreValues?.join(', ')}
                    onApplySuggestion={(suggestion) => updateFormData('coreValues', suggestion.split(', '))}
                    formData={formData}
                />
            </FormField>

            <FormField label="Does your brand have a web page?" type="Dropdown">
                <Select value={formData.hasWebPage} onValueChange={(value) => updateFormData('hasWebPage', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            {formData.hasWebPage === 'yes' && (
                <FormField label="If yes, upload here" type="Upload">
                    <FileUpload
                        value={formData.webPageUpload || ''}
                        onChange={(value) => updateFormData('webPageUpload', value)}
                        placeholder="Upload your web page or provide URL"
                    />
                </FormField>
            )}

            {formData.hasWebPage === 'no' && (
                <FormField label="If no, do you want to have a compelling web page or sales funnel?" type="Dropdown">
                    <Select value={formData.wantWebPage} onValueChange={(value) => updateFormData('wantWebPage', value)}>
                        <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <SelectItem value="web-page">Yes, I want a web page</SelectItem>
                            <SelectItem value="sales-funnel">Yes, I want a sales funnel</SelectItem>
                            <SelectItem value="no">No, not at this time</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
            )}
        </div>
    );

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
            default: return null;
        }
    };

    // Show loading state while initializing
    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-600 dark:text-gray-300">Loading your BrandKit Questionnaire form data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20 shadow-lg">
                    <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            🎉 Brand Kit Questionnaire Completed!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                            Congratulations! Your brand kit questionnaire has been successfully submitted.
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
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8 py-3 text-lg"
                            >
                                Return to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            {!embedded && (
                <div className="mb-6 sm:mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Brand Kit Questionnaire – Alta Media
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        Let's create the perfect brand identity for your business
                    </p>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                                Please fix the following errors:
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                                {validationErrors.map((error, index) => (
                                    <li key={index} className="text-red-700 dark:text-red-300 text-sm">
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
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

export default BrandKitQuestionnaire;
