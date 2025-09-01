import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import FormField from "@/components/form/FormField";
import TagInput from "@/components/form/TagInput";
import ColorPicker from "@/components/form/ColorPicker";
import FileUpload from "@/components/form/FileUpload";
import AISuggestion from "@/components/form/AISuggestion";
import ProgressBar from "@/components/form/ProgressBar";

const Forms = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Page 1: Business Type & Email Collection
        whatBuilding: "",

        // Page 2: Welcome & Identity Verification
        businessEmail: "",
        hasProventousId: "",
        proventousId: "",
        fullBusinessName: "",

        // Page 3: About Your Business
        contactNumber: "",
        preferredCommunication: "",
        industryNiche: [],
        yearStarted: "",
        primaryLocation: "",
        whosBehindBrand: "",
        businessDescription: "",
        currentCustomers: [],
        targetAttraction: "",
        teamDescription: "",
        inspirationForStarting: "",

        // Page 4: Audience Clarity - Target Market
        desiredFeeling: "",
        targetInterests: [],
        targetProfessions: [],
        targetReachLocations: [],
        targetAgeGroups: [],

        // Page 4: Audience Clarity - Current Market
        currentCustomerInterests: [],
        currentSpendingHabits: [],
        currentAudienceBehavior: [],
        interactionMethods: [],
        customerChallenges: "",
        customerMotivation: "",
        currentBrandFeeling: "",

        // Page 5: Team Culture
        cultureWords: [],
        teamTraditions: "",

        // Page 6: Brand Identity
        reason1: "",
        reason2: "",
        reason3: "",
        brandSoul: "",
        personalityWords: [],
        brandVoice: [],
        brand1: "",
        brand2: "",
        brand3: "",
        brandAvoidAssociations: "",

        // Page 7: Visual Preferences
        hasLogo: "",
        logoAction: [],
        preferredColors: [],
        colorsToAvoid: [],
        fontStyles: [],
        designStyle: [],
        logoType: [],
        visualImageryStyle: [],
        designInspirationLinks: null,

        // Page 8: Collateral Needs
        brandKitUsage: [],
        brandElementsNeeded: [],
        fileFormatPreferences: [],

        // Page 9: Business Goals & Vision
        primaryGoalThisYear: "",
        shortTermGoals: "",
        threeToFiveYearGoal: "",
        midTermGoals: "",
        longTermVision: "",
        successMetrics: [],

        // Page 10: Mission, Vision & Values (AI Suggestions)
        businessMission: "",
        businessValues: [],
        businessJourneyStage: "",
        spendingType: "",
        otherAudiences: "",

        // Page 11: Wrap-Up
        specialRequirements: "",
        brandKitTimeline: "",
        reviewApprovalPerson: "",

        // Page 12: Uploads & Reference
        referenceMaterials: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalSteps = 12;
    const steps = [
        "Business Type & Email Collection",
        "Welcome & Identity Verification",
        "About Your Business",
        "Audience Clarity",
        "Team Culture",
        "Brand Identity",
        "Visual Preferences",
        "Collateral Needs",
        "Business Goals & Vision",
        "Mission, Vision & Values",
        "Wrap-Up",
        "Uploads & Reference"
    ];

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFieldChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success("Form submitted successfully!");
            navigate('/dashboard');
        } catch (error) {
            toast.error("Failed to submit form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return renderStep1(); // Business Type & Email Collection
            case 2:
                return renderStep2(); // Welcome & Identity Verification
            case 3:
                return renderStep3(); // About Your Business
            case 4:
                return renderStep4(); // Audience Clarity
            case 5:
                return renderStep5(); // Team Culture
            case 6:
                return renderStep6(); // Brand Identity
            case 7:
                return renderStep7(); // Visual Preferences
            case 8:
                return renderStep8(); // Collateral Needs
            case 9:
                return renderStep9(); // Business Goals & Vision
            case 10:
                return renderStep10(); // Mission, Vision & Values (AI Suggestions)
            case 11:
                return renderStep11(); // Wrap-Up
            case 12:
                return renderStep12(); // Uploads & Reference
            default:
                return null;
        }
    };

    // Page 1: Business Type & Email Collection
    const renderStep1 = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">🚀</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                    What are you building?
                </h2>
                <p className="text-gray-600 text-lg">Let's start by understanding your project type</p>
            </div>

            <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    What are you building? *
                </Label>
                <Select
                    value={formData.whatBuilding || ""}
                    onValueChange={(value) => handleFieldChange('whatBuilding', value)}
                >
                    <SelectTrigger className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                        <SelectValue placeholder="Select what you're building" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Business/Company">🏢 Business/Company</SelectItem>
                        <SelectItem value="Specific Product/Service">🎯 Specific Product/Service</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    // Page 2: Welcome & Identity Verification
    const renderStep2 = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">👋</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                    Welcome! Let's verify your identity
                </h2>
                <p className="text-gray-600 text-lg">We'll need some basic information to get started</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        Business Email *
                    </Label>
                    <Input
                        type="email"
                        placeholder="Enter your business email"
                        value={formData.businessEmail || ''}
                        onChange={(e) => handleFieldChange('businessEmail', e.target.value)}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        Do you have a Proventous ID?
                    </Label>
                    <Select value={formData.hasProventousId} onValueChange={(value) => handleFieldChange('hasProventousId', value)}>
                        <SelectTrigger className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Yes">✅ Yes</SelectItem>
                            <SelectItem value="No">❌ No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {formData.hasProventousId === 'Yes' && (
                    <div className="space-y-2">
                        <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                            Proventous ID Number
                        </Label>
                        <Input
                            placeholder="Enter your Proventous ID"
                            value={formData.proventousId || ''}
                            onChange={(e) => handleFieldChange('proventousId', e.target.value)}
                            className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        What's the full name of your business or organization? *
                    </Label>
                    <Input
                        placeholder="Enter your complete business name"
                        value={formData.fullBusinessName || ''}
                        onChange={(e) => handleFieldChange('fullBusinessName', e.target.value)}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                </div>
            </div>
        </div>
    );

    // Step 3: About Your Business
    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Tell us about your business</h2>
                <p className="text-muted-foreground">Help us understand your business better</p>
            </div>

            <FormField label="What's your contact number (with country code if outside PH)?" type="Short Text">
                <Input
                    placeholder="+63 912 345 6789"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                />
            </FormField>

            <FormField label="How do you prefer we reach you?" type="Dropdown">
                <Select value={formData.preferredContactMethod} onValueChange={(value) => handleFieldChange('preferredContactMethod', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select preferred contact method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="messenger">Messenger/WhatsApp</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="What industry or niche does your business belong to?" type="Tags" required>
                <TagInput
                    value={formData.industry || []}
                    onChange={(value) => handleFieldChange('industry', value)}
                    placeholder="Add your industry or niche"
                />
            </FormField>

            <FormField label="What year did your business officially start?" type="Dropdown" required>
                <Select value={formData.yearStarted} onValueChange={(value) => handleFieldChange('yearStarted', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 25 }, (_, i) => 2025 - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Where is your business primarily located?" type="Short Text" required>
                <Input
                    placeholder="City, Province, Country"
                    value={formData.mainLocation || ''}
                    onChange={(e) => handleFieldChange('mainLocation', e.target.value)}
                />
            </FormField>

            <FormField label="What's your mission as a business?" type="Long Text" aiSuggestions>
                <Textarea
                    placeholder="Describe your business mission"
                    value={formData.missionStatement || ''}
                    onChange={(e) => handleFieldChange('missionStatement', e.target.value)}
                    rows={4}
                />
                <AISuggestion
                    fieldName="missionStatement"
                    currentValue={formData.missionStatement}
                    onApplySuggestion={(suggestion) => handleFieldChange('missionStatement', suggestion)}
                />
            </FormField>

            <FormField label="What's your long-term vision?" type="Long Text" aiSuggestions>
                <Textarea
                    placeholder="Describe your long-term vision"
                    value={formData.visionStatement || ''}
                    onChange={(e) => handleFieldChange('visionStatement', e.target.value)}
                    rows={4}
                />
                <AISuggestion
                    fieldName="visionStatement"
                    currentValue={formData.visionStatement}
                    onApplySuggestion={(suggestion) => handleFieldChange('visionStatement', suggestion)}
                />
            </FormField>

            <FormField label="What values drive the way you do business?" type="Tags" aiSuggestions>
                <TagInput
                    value={formData.coreValues || []}
                    onChange={(value) => handleFieldChange('coreValues', value)}
                    placeholder="Add your core values"
                />
                <AISuggestion
                    fieldName="coreValues"
                    currentValue={formData.coreValues?.join(', ')}
                    onApplySuggestion={(suggestion) => handleFieldChange('coreValues', suggestion.split(', '))}
                />
            </FormField>

            <FormField label="Where is your business currently in its journey?" type="Dropdown">
                <Select value={formData.businessStage} onValueChange={(value) => handleFieldChange('businessStage', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select business stage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="startup">Startup/New</SelectItem>
                        <SelectItem value="growing">Growing</SelectItem>
                        <SelectItem value="established">Established</SelectItem>
                        <SelectItem value="mature">Mature</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Describe what your business does in one powerful sentence" type="Short Text" aiSuggestions>
                <Input
                    placeholder="A concise description of your business"
                    value={formData.brandDescription || ''}
                    onChange={(e) => handleFieldChange('brandDescription', e.target.value)}
                />
                <AISuggestion
                    fieldName="brandDescription"
                    currentValue={formData.brandDescription}
                    onApplySuggestion={(suggestion) => handleFieldChange('brandDescription', suggestion)}
                />
            </FormField>

            <FormField label="Who typically buys from you now?" type="Checkbox">
                <div className="space-y-2">
                    {['Male', 'Female', 'Everyone (both)'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.buyerType?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.buyerType || [];
                                    if (checked) {
                                        handleFieldChange('buyerType', [...current, option]);
                                    } else {
                                        handleFieldChange('buyerType', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Who do you want to attract?" type="Long Text" required>
                <Textarea
                    placeholder="Describe your target audience"
                    value={formData.targetAudience || ''}
                    onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
                    rows={4}
                />
            </FormField>

            <FormField label="What's their spending type?" type="Dropdown" required>
                <Select value={formData.spendingType} onValueChange={(value) => handleFieldChange('spendingType', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select spending type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="budget-conscious">Budget-conscious</SelectItem>
                        <SelectItem value="value-seeking">Value-seeking</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            <FormField label="Are there other groups you'd love to attract?" type="Long Text">
                <Textarea
                    placeholder="Describe additional target groups"
                    value={formData.secondaryAudience || ''}
                    onChange={(e) => handleFieldChange('secondaryAudience', e.target.value)}
                    rows={4}
                />
            </FormField>
        </div>
    );

    // Step 4: Audience Clarity
    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Understanding Your Audience</h2>
                <p className="text-muted-foreground">Let's dive deeper into your target market</p>
            </div>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium mb-4">Section A: Target Market (Who do you want to attract?)</h3>

                    <FormField label="How do you want them to feel after experiencing your brand?" type="Dropdown" required>
                        <Select value={formData.desiredFeeling} onValueChange={(value) => handleFieldChange('desiredFeeling', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select desired feeling" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="happy">Happy</SelectItem>
                                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                <SelectItem value="inspired">Inspired</SelectItem>
                                <SelectItem value="satisfied">Satisfied</SelectItem>
                                <SelectItem value="energized">Energized</SelectItem>
                                <SelectItem value="empowered">Empowered</SelectItem>
                                <SelectItem value="safe-secure">Safe & Secure</SelectItem>
                                <SelectItem value="confident">Confident</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField label="What are their main interests or lifestyle?" type="Tags" aiSuggestions>
                        <TagInput
                            value={formData.audienceInterests || []}
                            onChange={(value) => handleFieldChange('audienceInterests', value)}
                            placeholder="Add interests or lifestyle traits"
                        />
                        <AISuggestion
                            fieldName="audienceInterests"
                            currentValue={formData.audienceInterests?.join(', ')}
                            onApplySuggestion={(suggestion) => handleFieldChange('audienceInterests', suggestion.split(', '))}
                        />
                    </FormField>

                    <FormField label="What professions or roles do you want to attract?" type="Tags">
                        <TagInput
                            value={formData.professions || []}
                            onChange={(value) => handleFieldChange('professions', value)}
                            placeholder="Add professions or roles"
                        />
                    </FormField>

                    <FormField label="Where do you want to reach them?" type="Tags">
                        <TagInput
                            value={formData.preferredPlatforms || []}
                            onChange={(value) => handleFieldChange('preferredPlatforms', value)}
                            placeholder="Add platforms or locations"
                        />
                    </FormField>

                    <FormField label="What age groups do you want to target?" type="Checkbox">
                        <div className="space-y-2">
                            {[
                                'Teens (13–19)',
                                'Young Adults (20–29)',
                                'Adults (30–39)',
                                'Mature Adults (40–59)',
                                'Seniors (60+)'
                            ].map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={option}
                                        checked={formData.ageGroups?.includes(option) || false}
                                        onCheckedChange={(checked) => {
                                            const current = formData.ageGroups || [];
                                            if (checked) {
                                                handleFieldChange('ageGroups', [...current, option]);
                                            } else {
                                                handleFieldChange('ageGroups', current.filter(item => item !== option));
                                            }
                                        }}
                                    />
                                    <label htmlFor={option} className="text-sm">{option}</label>
                                </div>
                            ))}
                        </div>
                    </FormField>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Section B: Current Market (Who loves you now?)</h3>

                    <FormField label="What are your current customers' interests?" type="Tags" aiSuggestions>
                        <TagInput
                            value={formData.currentAudienceInterests || []}
                            onChange={(value) => handleFieldChange('currentAudienceInterests', value)}
                            placeholder="Add current customer interests"
                        />
                        <AISuggestion
                            fieldName="currentAudienceInterests"
                            currentValue={formData.currentAudienceInterests?.join(', ')}
                            onApplySuggestion={(suggestion) => handleFieldChange('currentAudienceInterests', suggestion.split(', '))}
                        />
                    </FormField>

                    <FormField label="How would you describe your current customers' spending habits?" type="Tags">
                        <TagInput
                            value={formData.spendingHabits || []}
                            onChange={(value) => handleFieldChange('spendingHabits', value)}
                            placeholder="Add spending habit descriptions"
                        />
                    </FormField>

                    <FormField label="How would you describe your current audience's behavior?" type="Tags" aiSuggestions>
                        <TagInput
                            value={formData.audienceBehaviors || []}
                            onChange={(value) => handleFieldChange('audienceBehaviors', value)}
                            placeholder="Add audience behavior traits"
                        />
                        <AISuggestion
                            fieldName="audienceBehaviors"
                            currentValue={formData.audienceBehaviors?.join(', ')}
                            onApplySuggestion={(suggestion) => handleFieldChange('audienceBehaviors', suggestion.split(', '))}
                        />
                    </FormField>

                    <FormField label="How do people currently interact with your business?" type="Checkbox">
                        <div className="space-y-2">
                            {['Website', 'Social Media', 'Phone', 'Email', 'In-person', 'Mobile App'].map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={option}
                                        checked={formData.interactionModes?.includes(option) || false}
                                        onCheckedChange={(checked) => {
                                            const current = formData.interactionModes || [];
                                            if (checked) {
                                                handleFieldChange('interactionModes', [...current, option]);
                                            } else {
                                                handleFieldChange('interactionModes', current.filter(item => item !== option));
                                            }
                                        }}
                                    />
                                    <label htmlFor={option} className="text-sm">{option}</label>
                                </div>
                            ))}
                        </div>
                    </FormField>

                    <FormField label="What challenges do your customers face that you help solve?" type="Long Text">
                        <Textarea
                            placeholder="Describe customer pain points you address"
                            value={formData.customerPainPoints || ''}
                            onChange={(e) => handleFieldChange('customerPainPoints', e.target.value)}
                            rows={4}
                        />
                    </FormField>

                    <FormField label="What motivates customers to choose you over competitors?" type="Long Text" aiSuggestions>
                        <Textarea
                            placeholder="Describe your competitive advantages"
                            value={formData.purchaseMotivators || ''}
                            onChange={(e) => handleFieldChange('purchaseMotivators', e.target.value)}
                            rows={4}
                        />
                        <AISuggestion
                            fieldName="purchaseMotivators"
                            currentValue={formData.purchaseMotivators}
                            onApplySuggestion={(suggestion) => handleFieldChange('purchaseMotivators', suggestion)}
                        />
                    </FormField>

                    <FormField label="What feeling do people currently get from your brand?" type="Dropdown">
                        <Select value={formData.emotionalGoal} onValueChange={(value) => handleFieldChange('emotionalGoal', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select current brand feeling" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="happy">Happy</SelectItem>
                                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                <SelectItem value="inspired">Inspired</SelectItem>
                                <SelectItem value="satisfied">Satisfied</SelectItem>
                                <SelectItem value="energized">Energized</SelectItem>
                                <SelectItem value="empowered">Empowered</SelectItem>
                                <SelectItem value="safe-secure">Safe & Secure</SelectItem>
                                <SelectItem value="confident">Confident</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>
            </div>
        </div>
    );

    // Step 5: Brand Identity
    const renderStep5 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Your Brand Identity</h2>
                <p className="text-muted-foreground">Let's explore the personality behind your brand</p>
            </div>

            <FormField label="Who's behind the brand?" type="Long Text">
                <Textarea
                    placeholder="Tell us about the people behind your brand"
                    value={formData.brandOwner || ''}
                    onChange={(e) => handleFieldChange('brandOwner', e.target.value)}
                    rows={4}
                />
            </FormField>

            <FormField label="What inspired you to start this business?" type="Long Text" aiSuggestions>
                <Textarea
                    placeholder="Share your inspiration story"
                    value={formData.whyStarted || ''}
                    onChange={(e) => handleFieldChange('whyStarted', e.target.value)}
                    rows={4}
                />
                <AISuggestion
                    fieldName="whyStarted"
                    currentValue={formData.whyStarted}
                    onApplySuggestion={(suggestion) => handleFieldChange('whyStarted', suggestion)}
                />
            </FormField>

            <FormField label="Reason 1" type="Short Text">
                <Input
                    placeholder="First reason for starting"
                    value={formData.reasonsExist1 || ''}
                    onChange={(e) => handleFieldChange('reasonsExist1', e.target.value)}
                />
            </FormField>

            <FormField label="Reason 2" type="Short Text">
                <Input
                    placeholder="Second reason for starting"
                    value={formData.reasonsExist2 || ''}
                    onChange={(e) => handleFieldChange('reasonsExist2', e.target.value)}
                />
            </FormField>

            <FormField label="Reason 3" type="Short Text">
                <Input
                    placeholder="Third reason for starting"
                    value={formData.reasonsExist3 || ''}
                    onChange={(e) => handleFieldChange('reasonsExist3', e.target.value)}
                />
            </FormField>

            <FormField label="If your brand had a soul, how would you describe it?" type="Short Text" aiSuggestions>
                <Input
                    placeholder="Describe your brand's soul"
                    value={formData.brandSoul || ''}
                    onChange={(e) => handleFieldChange('brandSoul', e.target.value)}
                />
                <AISuggestion
                    fieldName="brandSoul"
                    currentValue={formData.brandSoul}
                    onApplySuggestion={(suggestion) => handleFieldChange('brandSoul', suggestion)}
                    formData={formData}
                />
            </FormField>

            <FormField label="Which 3 to 5 words describe your brand's personality best?" type="Tags" aiSuggestions>
                <TagInput
                    value={formData.brandPersonality || []}
                    onChange={(value) => handleFieldChange('brandPersonality', value)}
                    placeholder="Add personality traits"
                />
                <AISuggestion
                    fieldName="brandPersonality"
                    currentValue={formData.brandPersonality?.join(', ')}
                    onApplySuggestion={(suggestion) => handleFieldChange('brandPersonality', suggestion.split(', '))}
                />
            </FormField>

            <FormField label="If your brand spoke like a person, how would it sound?" type="Checkbox">
                <div className="space-y-2">
                    {['Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 'Sophisticated'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.brandVoice?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.brandVoice || [];
                                    if (checked) {
                                        handleFieldChange('brandVoice', [...current, option]);
                                    } else {
                                        handleFieldChange('brandVoice', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Brand 1: Name + Why" type="Long Text">
                <Textarea
                    placeholder="Brand name and why you admire it"
                    value={formData.admireBrand1 || ''}
                    onChange={(e) => handleFieldChange('admireBrand1', e.target.value)}
                    rows={3}
                />
            </FormField>

            <FormField label="Brand 2 (optional): Name + Why" type="Long Text">
                <Textarea
                    placeholder="Second brand name and why you admire it"
                    value={formData.admireBrand2 || ''}
                    onChange={(e) => handleFieldChange('admireBrand2', e.target.value)}
                    rows={3}
                />
            </FormField>

            <FormField label="Brand 3 (optional): Name + Why" type="Long Text">
                <Textarea
                    placeholder="Third brand name and why you admire it"
                    value={formData.admireBrand3 || ''}
                    onChange={(e) => handleFieldChange('admireBrand3', e.target.value)}
                    rows={3}
                />
            </FormField>

            <FormField label="What's something you definitely don't want your brand to be associated with?" type="Long Text">
                <Textarea
                    placeholder="Describe what you want to avoid"
                    value={formData.stylesToAvoid || ''}
                    onChange={(e) => handleFieldChange('stylesToAvoid', e.target.value)}
                    rows={4}
                />
            </FormField>
        </div>
    );

    // Step 6: Visual Preferences
    const renderStep6 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Visual Preferences</h2>
                <p className="text-muted-foreground">Let's explore your visual style preferences</p>
            </div>

            <FormField label="Do you already have a logo?" type="Dropdown" required>
                <Select value={formData.existingLogo} onValueChange={(value) => handleFieldChange('existingLogo', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>

            {formData.existingLogo === 'yes' && (
                <FormField label="If Yes, what do you want done?" type="Checkbox">
                    <div className="space-y-2">
                        {['Keep', 'Improve', 'Redo'].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option}
                                    checked={formData.logoAction?.includes(option) || false}
                                    onCheckedChange={(checked) => {
                                        const current = formData.logoAction || [];
                                        if (checked) {
                                            handleFieldChange('logoAction', [...current, option]);
                                        } else {
                                            handleFieldChange('logoAction', current.filter(item => item !== option));
                                        }
                                    }}
                                />
                                <label htmlFor={option} className="text-sm">{option}</label>
                            </div>
                        ))}
                    </div>
                </FormField>
            )}

            <FormField label="Preferred brand colors" type="Color Picker">
                <ColorPicker
                    value={formData.brandColors}
                    onChange={(value) => handleFieldChange('brandColors', value)}
                    placeholder="Enter your preferred colors"
                />
            </FormField>

            <FormField label="Colors to avoid" type="Color Picker">
                <ColorPicker
                    value={formData.colorsToAvoid}
                    onChange={(value) => handleFieldChange('colorsToAvoid', value)}
                    placeholder="Enter colors you want to avoid"
                />
            </FormField>

            <FormField label="Preferred font styles" type="Checkbox">
                <div className="space-y-2">
                    {['Serif', 'Sans-serif', 'Script', 'Display', 'Monospace'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.fontPreferences?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.fontPreferences || [];
                                    if (checked) {
                                        handleFieldChange('fontPreferences', [...current, option]);
                                    } else {
                                        handleFieldChange('fontPreferences', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Design style" type="Checkbox">
                <div className="space-y-2">
                    {['Minimalist', 'Modern', 'Vintage', 'Bold', 'Elegant', 'Playful', 'Professional'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.designStyle?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.designStyle || [];
                                    if (checked) {
                                        handleFieldChange('designStyle', [...current, option]);
                                    } else {
                                        handleFieldChange('designStyle', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Logo type" type="Checkbox">
                <div className="space-y-2">
                    {['Wordmark', 'Symbol', 'Combination', 'Emblem', 'Lettermark'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.logoStyle?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.logoStyle || [];
                                    if (checked) {
                                        handleFieldChange('logoStyle', [...current, option]);
                                    } else {
                                        handleFieldChange('logoStyle', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Visual imagery style" type="Checkbox">
                <div className="space-y-2">
                    {['Photography', 'Illustration', 'Abstract', 'Geometric', 'Organic', 'Mixed Media'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.imageryStyle?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.imageryStyle || [];
                                    if (checked) {
                                        handleFieldChange('imageryStyle', [...current, option]);
                                    } else {
                                        handleFieldChange('imageryStyle', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Any design inspiration links" type="Upload">
                <FileUpload
                    value={formData.designInspiration}
                    onChange={(value) => handleFieldChange('designInspiration', value)}
                    placeholder="Upload inspiration files or paste links"
                />
            </FormField>
        </div>
    );

    // Step 7: Collateral Needs
    const renderStep7 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Collateral Needs</h2>
                <p className="text-muted-foreground">What brand elements do you need?</p>
            </div>

            <FormField label="Where will the brand kit be used?" type="Checkbox" required>
                <div className="space-y-2">
                    {['Website', 'Social Media', 'Print Materials', 'Business Cards', 'Email Marketing', 'Packaging', 'Signage', 'Apparel'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.usageChannels?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.usageChannels || [];
                                    if (checked) {
                                        handleFieldChange('usageChannels', [...current, option]);
                                    } else {
                                        handleFieldChange('usageChannels', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="Brand elements needed" type="Checkbox" required>
                <div className="space-y-2">
                    {['Logo', 'Color Palette', 'Typography', 'Business Cards', 'Letterhead', 'Social Media Templates', 'Email Signature', 'Brand Guidelines'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.brandElementsNeeded?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.brandElementsNeeded || [];
                                    if (checked) {
                                        handleFieldChange('brandElementsNeeded', [...current, option]);
                                    } else {
                                        handleFieldChange('brandElementsNeeded', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>

            <FormField label="File format preferences" type="Checkbox" required>
                <div className="space-y-2">
                    {['PNG', 'JPG', 'PDF', 'AI', 'EPS', 'SVG'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.fileFormatsNeeded?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.fileFormatsNeeded || [];
                                    if (checked) {
                                        handleFieldChange('fileFormatsNeeded', [...current, option]);
                                    } else {
                                        handleFieldChange('fileFormatsNeeded', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>
        </div>
    );

    // Step 8: Business Goals & Vision
    const renderStep8 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Business Goals & Vision</h2>
                <p className="text-muted-foreground">Let's understand your business objectives</p>
            </div>

            <FormField label="#1 Goal This Year" type="Short Text" required>
                <Input
                    placeholder="Your primary goal for this year"
                    value={formData.goalThisYear || ''}
                    onChange={(e) => handleFieldChange('goalThisYear', e.target.value)}
                />
            </FormField>

            <FormField label="Are there any other short-term goals you'd like to achieve in the next year?" type="Long Text">
                <Textarea
                    placeholder="Additional goals for the next 12 months"
                    value={formData.otherShortTermGoals || ''}
                    onChange={(e) => handleFieldChange('otherShortTermGoals', e.target.value)}
                    rows={4}
                />
            </FormField>

            <FormField label="What's the main thing you want your business to achieve in the next 3–5 years?" type="Short Text">
                <Input
                    placeholder="Your 3-5 year vision"
                    value={formData.threeToFiveYearVision || ''}
                    onChange={(e) => handleFieldChange('threeToFiveYearVision', e.target.value)}
                />
            </FormField>

            <FormField label="Are there additional mid-term goals you're aiming for?" type="Long Text">
                <Textarea
                    placeholder="Additional mid-term goals"
                    value={formData.additionalMidTermGoals || ''}
                    onChange={(e) => handleFieldChange('additionalMidTermGoals', e.target.value)}
                    rows={4}
                />
            </FormField>

            <FormField label="What's your big-picture vision for your brand in the long run?" type="Long Text">
                <Textarea
                    placeholder="Your long-term brand vision"
                    value={formData.longTermVision || ''}
                    onChange={(e) => handleFieldChange('longTermVision', e.target.value)}
                    rows={4}
                />
            </FormField>

            <FormField label="Which key indicators or metrics matter most when measuring your brand's success?" type="Checkbox">
                <div className="space-y-2">
                    {['Revenue Growth', 'Customer Satisfaction', 'Brand Recognition', 'Market Share', 'Social Media Engagement', 'Website Traffic', 'Customer Retention', 'Employee Satisfaction'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={option}
                                checked={formData.keyMetrics?.includes(option) || false}
                                onCheckedChange={(checked) => {
                                    const current = formData.keyMetrics || [];
                                    if (checked) {
                                        handleFieldChange('keyMetrics', [...current, option]);
                                    } else {
                                        handleFieldChange('keyMetrics', current.filter(item => item !== option));
                                    }
                                }}
                            />
                            <label htmlFor={option} className="text-sm">{option}</label>
                        </div>
                    ))}
                </div>
            </FormField>
        </div>
    );

    // Step 9: Team Culture
    const renderStep9 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Team Culture</h2>
                <p className="text-muted-foreground">Tell us about your company culture</p>
            </div>

            <FormField label="If you had to pick just three words to describe your company's culture, what would they be?" type="Tags">
                <TagInput
                    value={formData.companyCulture || []}
                    onChange={(value) => handleFieldChange('companyCulture', value)}
                    placeholder="Add three culture words"
                />
            </FormField>

            <FormField label="How would your team typically describe working at your business?" type="Long Text">
                <Textarea
                    placeholder="Describe the work environment"
                    value={formData.cultureDescription || ''}
                    onChange={(e) => handleFieldChange('cultureDescription', e.target.value)}
                    rows={4}
                />
            </FormField>

            <FormField label="Are there any special traditions, rituals, or fun things your team regularly does that you'd like to highlight?" type="Long Text" aiSuggestions>
                <Textarea
                    placeholder="Share your team traditions and rituals"
                    value={formData.internalRituals || ''}
                    onChange={(e) => handleFieldChange('internalRituals', e.target.value)}
                    rows={4}
                />
                <AISuggestion
                    fieldName="internalRituals"
                    currentValue={formData.internalRituals}
                    onApplySuggestion={(suggestion) => handleFieldChange('internalRituals', suggestion)}
                />
            </FormField>
        </div>
    );

    // Step 10: Mission, Vision & Values (AI Suggestions)
    const renderStep10 = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                    Mission, Vision & Values
                </h2>
                <p className="text-gray-600 text-lg">Let AI help you define your business purpose</p>
            </div>

            <div className="space-y-6">
                <AISuggestion
                    label="What's your mission as a business?"
                    value={formData.businessMission || ""}
                    onChange={(value) => handleFieldChange('businessMission', value)}
                    placeholder="Describe your business mission"
                    suggestion="To empower small businesses with innovative digital solutions that drive growth and success."
                    required
                />

                <AISuggestion
                    label="What's your long-term vision?"
                    value={formData.longTermVision || ""}
                    onChange={(value) => handleFieldChange('longTermVision', value)}
                    placeholder="Describe your long-term vision"
                    suggestion="To become the leading digital partner for small businesses, helping thousands achieve their dreams through technology."
                    required
                />

                <AISuggestion
                    label="What values drive the way you do business?"
                    value={formData.businessValues || []}
                    onChange={(value) => handleFieldChange('businessValues', value)}
                    placeholder="Add your core values"
                    suggestion="Innovation, Integrity, Excellence, Customer-First, Collaboration"
                    required
                />

                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        Where is your business currently in its journey?
                    </Label>
                    <Select value={formData.businessJourneyStage} onValueChange={(value) => handleFieldChange('businessJourneyStage', value)}>
                        <SelectTrigger className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                            <SelectValue placeholder="Select business stage" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Startup">🚀 Startup</SelectItem>
                            <SelectItem value="Growing">📈 Growing</SelectItem>
                            <SelectItem value="Established">🏢 Established</SelectItem>
                            <SelectItem value="Expanding">🌍 Expanding</SelectItem>
                            <SelectItem value="Mature">💎 Mature</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        What's their spending type? *
                    </Label>
                    <Select value={formData.spendingType} onValueChange={(value) => handleFieldChange('spendingType', value)}>
                        <SelectTrigger className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                            <SelectValue placeholder="Select spending type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Budget-conscious">💰 Budget-conscious</SelectItem>
                            <SelectItem value="Value-seeking">⚖️ Value-seeking</SelectItem>
                            <SelectItem value="Premium">💎 Premium</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <AISuggestion
                    label="Are there other groups you'd love to attract?"
                    value={formData.otherAudiences || ""}
                    onChange={(value) => handleFieldChange('otherAudiences', value)}
                    placeholder="Describe other target audiences"
                    suggestion="We'd also like to attract enterprise clients and international markets in the future."
                />
            </div>
        </div>
    );

    // Step 11: Wrap-Up
    const renderStep11 = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">✅</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                    Wrap-Up
                </h2>
                <p className="text-gray-600 text-lg">Final details and timeline</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        Is there anything special or important about your business or preferences we haven't covered yet?
                    </Label>
                    <Textarea
                        placeholder="Any additional information or special requirements"
                        value={formData.specialRequirements || ''}
                        onChange={(e) => handleFieldChange('specialRequirements', e.target.value)}
                        rows={4}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        How soon do you need your brand kit completed?
                    </Label>
                    <Select value={formData.brandKitTimeline} onValueChange={(value) => handleFieldChange('brandKitTimeline', value)}>
                        <SelectTrigger className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                            <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Within 1 month">⏰ Within 1 month</SelectItem>
                            <SelectItem value="1–2 months">📅 1–2 months</SelectItem>
                            <SelectItem value="2–3 months">📆 2–3 months</SelectItem>
                            <SelectItem value="Flexible">🔄 Flexible (no strict deadline)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        Who will be reviewing and approving your brand kit?
                    </Label>
                    <Input
                        placeholder="Name of the decision maker"
                        value={formData.reviewApprovalPerson || ''}
                        onChange={(e) => handleFieldChange('reviewApprovalPerson', e.target.value)}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                </div>
            </div>
        </div>
    );

    // Step 12: Uploads & Reference
    const renderStep12 = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">📁</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                    Uploads & Reference
                </h2>
                <p className="text-gray-600 text-lg">Share any reference materials</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        Reference Materials
                    </Label>
                    <FileUpload
                        value={formData.referenceMaterials}
                        onChange={(value) => handleFieldChange('referenceMaterials', value)}
                        placeholder="Upload reference files or paste links"
                    />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        What to upload:
                    </h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Current logo files (if any)</li>
                        <li>• Brand inspiration images</li>
                        <li>• Competitor examples you like</li>
                        <li>• Existing marketing materials</li>
                        <li>• Color swatches or preferences</li>
                        <li>• Any other reference materials</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="max-w-5xl mx-auto">
                    <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
                        <CardHeader className="bg-blue-600 dark:bg-blue-700 text-white rounded-t-lg">
                            <CardTitle className="text-3xl font-bold text-center">
                                🎨 Brand Kit Form
                            </CardTitle>
                            <p className="text-center text-blue-100 dark:text-blue-200 mt-2">
                                Let's create something amazing together
                            </p>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-8">
                            <ProgressBar
                                currentStep={currentStep}
                                totalSteps={totalSteps}
                                steps={steps}
                            />

                            <form onSubmit={(e) => e.preventDefault()} className="animate-fade-in">
                                <div className="min-h-[400px] animate-slide-in-left">
                                    {renderStep()}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 sm:mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    {/* Back to Dashboard button - always visible */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/dashboard')}
                                        className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                                        aria-label="Return to dashboard"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Back to Dashboard
                                    </Button>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {/* Previous button - only show from step 2 onwards */}
                                        {currentStep > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={prevStep}
                                                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                                                aria-label="Go to previous step"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Previous
                                            </Button>
                                        )}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                toast.success("Form data saved!");
                                            }}
                                            className="flex items-center gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900 hover:border-yellow-300 dark:hover:border-yellow-600 transition-all duration-200"
                                            aria-label="Save form progress"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Progress
                                        </Button>

                                        {currentStep < totalSteps ? (
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                                aria-label="Go to next step"
                                            >
                                                Next Step
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Submit form"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "🎉 Submit Form"
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Forms; 