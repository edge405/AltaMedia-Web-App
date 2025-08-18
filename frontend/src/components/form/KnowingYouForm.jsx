import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { brandKitApi, transformToDatabaseFormat, transformToFrontendFormat } from '@/utils/brandKitApi';
import ProgressBar from './ProgressBar';
import FormField from './FormField';
import TagInput from './TagInput';
import ColorPicker from './ColorPicker';
import FileUpload from './FileUpload';
import AISuggestion from './AISuggestion';
import CheckboxGroup from './CheckboxGroup';
import MapPicker from './MapPicker';
import ProductServiceForm from './ProductServiceForm';
import OrganizationForm from './OrganizationForm';

const KnowingYouForm = ({ onFormTypeChange = () => { }, initialFormType = null, embedded = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    buildingType: initialFormType || ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 11;
  const steps = [
    'Business Basics',
    'About Your Business',
    'Audience Clarity',
    'Team & Culture',
    'Brand Identity',
    'Visual Direction',
    'Collateral Needs',
    'Business Goals and Vision',
    'Mission, Vision & Values',
    'Wrap-Up',
    'Upload References'
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
        } else if (initialFormType) {
          // If no existing data but we have an initial form type, set it
          console.log('No existing data, setting initial form type:', initialFormType);
          setFormData({ buildingType: initialFormType });
        } else {
          console.log('No existing data and no initial form type');
        }
      } catch (err) {
        console.error('Error loading form data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [user?.id, initialFormType]);

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
  };

  const handleFieldChange = (field, value) => {
    updateFormData(field, value);
  };

  // Debug: Log when buildingType changes
  useEffect(() => {
    console.log('Building type changed to:', formData.buildingType);
    console.log('Initial form type:', initialFormType);
    console.log('Current form data:', formData);
  }, [formData.buildingType, initialFormType, formData]);

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
          // Scroll to top when moving to next step
          window.scrollTo({ top: 10, behavior: 'smooth' });
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
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

      // Save the final step data (step 11)
      const response = await brandKitApi.saveFormData(userId, finalData, 11);

      if (response.success) {
        console.log('Form completed successfully:', response.data);
        setIsSubmitted(true);
        // Show success message
        toast.success('🎉 BrandKit form completed successfully! Your brand identity is ready.');
        // Automatically redirect to client-portal after a short delay
        setTimeout(() => {
          navigate('/client-portal');
        }, 2000);
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
    if (embedded) {
      // If embedded, notify parent to go back to forms selection
      onFormTypeChange && onFormTypeChange(null);
    } else {
      navigate('/client-portal');
    }
  };

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

  // If building type is "product", render the ProductServiceForm component
  if (formData.buildingType === 'product') {
    return <ProductServiceForm onFormTypeChange={(type) => {
      updateFormData('buildingType', type);
      setCurrentStep(1); // Reset to first step
    }} />;
  }

  // If building type is "organization", render the OrganizationForm component
  if (formData.buildingType === 'organization') {
    return <OrganizationForm onFormTypeChange={(type) => {
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

      <FormField label="Business Email" type="Short Text" required>
        <Input
          type="email"
          value={formData.businessEmail || ''}
          onChange={(e) => updateFormData('businessEmail', e.target.value)}
          placeholder="Enter your business email"
          className="w-full border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Do you have a Proventous ID?" type="Dropdown">
        <Select value={formData.hasProventousId} onValueChange={(value) => updateFormData('hasProventousId', value)}>
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
            onChange={(e) => updateFormData('proventousId', e.target.value)}
            placeholder="Enter your Proventous ID"
            className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </FormField>
      )}
      <FormField label="Full Name of Business/Organization" type="Short Text" required>
        <Input
          value={formData.businessName || ''}
          onChange={(e) => updateFormData('businessName', e.target.value)}
          placeholder="Enter your business name"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>


    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Common fields for both business and product */}
      <FormField label="Contact Number" type="Short Text">
        <Input
          type="tel"
          value={formData.contactNumber || ''}
          onChange={(e) => updateFormData('contactNumber', e.target.value)}
          placeholder="Enter your contact number"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Preferred Contact Method" type="Dropdown">
        <Select value={formData.preferredContact} onValueChange={(value) => updateFormData('preferredContact', value)}>
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
          onChange={(value) => updateFormData('industry', value)}
          placeholder="Enter your industry or niche"
          suggestions={['Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Manufacturing', 'Consulting', 'Creative']}
        />
      </FormField>

      <FormField label="Year Officially Started" type="Dropdown" required>
        <Select value={formData.yearStarted} onValueChange={(value) => updateFormData('yearStarted', value)}>
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
          onChange={(value) => updateFormData('primaryLocation', value)}
          placeholder="Enter your primary location"
        />
      </FormField>

      <FormField label="Where is your business currently in its journey?" type="Dropdown">
        <Select value={formData.businessStage} onValueChange={(value) => updateFormData('businessStage', value)}>
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
          onChange={(e) => updateFormData('brandDescription', e.target.value)}
        />
        <AISuggestion
          fieldName="brandDescription"
          currentValue={formData.brandDescription}
          onApplySuggestion={(suggestion) => updateFormData('brandDescription', suggestion)}
          formData={formData}
        />
      </FormField>

      <FormField label="Do you have social media accounts for your business?" type="Dropdown">
        <Select value={formData.hasSocialMedia} onValueChange={(value) => updateFormData('hasSocialMedia', value)}>
          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {formData.hasSocialMedia === 'yes' && (
        <>
          <FormField label="Which social media platforms do you currently use?" type="Checkbox">
            <CheckboxGroup
              options={['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest', 'Snapchat', 'Other']}
              value={formData.socialMediaPlatforms || []}
              onChange={(value) => updateFormData('socialMediaPlatforms', value)}
            />
          </FormField>

          {formData.socialMediaPlatforms && formData.socialMediaPlatforms.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Please provide links to your social media accounts:</h4>

              {formData.socialMediaPlatforms.includes('Facebook') && (
                <FormField label="Facebook URL" type="Short Text">
                  <Input
                    type="url"
                    value={formData.facebookUrl || ''}
                    onChange={(e) => updateFormData('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}

              {formData.socialMediaPlatforms.includes('Instagram') && (
                <FormField label="Instagram URL" type="Short Text">
                  <Input
                    type="url"
                    value={formData.instagramUrl || ''}
                    onChange={(e) => updateFormData('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}

              {formData.socialMediaPlatforms.includes('Twitter/X') && (
                <FormField label="Twitter/X URL" type="Short Text">
                  <Input
                    type="url"
                    value={formData.twitterUrl || ''}
                    onChange={(e) => updateFormData('twitterUrl', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}

              {formData.socialMediaPlatforms.includes('LinkedIn') && (
                <FormField label="LinkedIn URL" type="Short Text">
                  <Input
                    type="url"
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => updateFormData('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}

              {formData.socialMediaPlatforms.includes('TikTok') && (
                <FormField label="TikTok URL" type="Short Text">
                  <Input
                    type="url"
                    value={formData.tiktokUrl || ''}
                    onChange={(e) => updateFormData('tiktokUrl', e.target.value)}
                    placeholder="https://tiktok.com/@yourhandle"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}

              {formData.socialMediaPlatforms.includes('YouTube') && (
                <FormField label="YouTube URL" type="Short Text">
                  <Input
                    type="url"
                    value={formData.youtubeUrl || ''}
                    onChange={(e) => updateFormData('youtubeUrl', e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}

              {formData.socialMediaPlatforms.includes('Pinterest') && (
                <FormField label="Pinterest URL" type="Short Text">
                  <Input
                    type="url"
                    value={formData.pinterestUrl || ''}
                    onChange={(e) => updateFormData('pinterestUrl', e.target.value)}
                    placeholder="https://pinterest.com/yourprofile"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}

              {formData.socialMediaPlatforms.includes('Snapchat') && (
                <FormField label="Snapchat Username" type="Short Text">
                  <Input
                    value={formData.snapchatUsername || ''}
                    onChange={(e) => updateFormData('snapchatUsername', e.target.value)}
                    placeholder="your_snapchat_username"
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}

              {formData.socialMediaPlatforms.includes('Other') && (
                <FormField label="Other Social Media URLs" type="Long Text">
                  <Textarea
                    value={formData.otherSocialMediaUrls || ''}
                    onChange={(e) => updateFormData('otherSocialMediaUrls', e.target.value)}
                    placeholder="Please list any other social media platforms and their URLs (one per line)"
                    rows={3}
                    className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormField>
              )}
            </div>
          )}
        </>
      )}

      {formData.hasSocialMedia === 'no' && (
        <FormField label="Would you like to create social media accounts for your business?" type="Dropdown">
          <Select value={formData.wantToCreateSocialMedia} onValueChange={(value) => updateFormData('wantToCreateSocialMedia', value)}>
            <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectItem value="yes">Yes, I'd like to create social media accounts</SelectItem>
              <SelectItem value="no">No, not interested at this time</SelectItem>
              <SelectItem value="maybe">Maybe, I'm not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      )}

      {formData.wantToCreateSocialMedia === 'yes' && (
        <FormField label="Which social media platforms would you like to create?" type="Checkbox">
          <CheckboxGroup
            options={['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest', 'Snapchat', 'Other']}
            value={formData.desiredSocialMediaPlatforms || []}
            onChange={(value) => updateFormData('desiredSocialMediaPlatforms', value)}
          />
        </FormField>
      )}

      {/* Business-specific fields */}
      {formData.buildingType === 'business' && (
        <>
          <FormField label="Who Typically Buys from You Now?" type="Checkbox">
            <CheckboxGroup
              options={['Male', 'Female', 'Everyone']}
              value={formData.currentCustomers || []}
              onChange={(value) => updateFormData('currentCustomers', value)}
            />
          </FormField>

          <FormField label="Who Do You Want to Attract?" type="Long Text" required>
            <Textarea
              value={formData.wantToAttract || ''}
              onChange={(e) => updateFormData('wantToAttract', e.target.value)}
              placeholder="Describe your ideal target audience"
              rows={4}
              className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </FormField>

          <FormField label="What's their spending type?" type="Dropdown" required>
            <Select value={formData.spendingType} onValueChange={(value) => updateFormData('spendingType', value)}>
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
              value={formData.secondaryAudience || ''}
              onChange={(e) => updateFormData('secondaryAudience', e.target.value)}
              placeholder="Describe additional target groups"
              rows={4}
              className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </FormField>

          {/* <FormField label="How Would Your Team Describe Working at Your Business?" type="Long Text">
            <Textarea
              value={formData.teamDescription || ''}
              onChange={(e) => updateFormData('teamDescription', e.target.value)}
              placeholder="Describe your company culture from your team's perspective"
              rows={4}
              className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </FormField> */}
        </>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Business-specific content */}
      {formData.buildingType === 'business' && (
        <>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Target Market</h3>

            <FormField label="Desired Emotional Response" type="Dropdown" required>
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

            <FormField label="What are their main interests or lifestyle?" type="Tags" aiSuggestions>
              <TagInput
                value={formData.targetInterests || []}
                onChange={(value) => updateFormData('targetInterests', value)}
                placeholder="Add interests or lifestyle traits"
                suggestions={['Technology', 'Fitness', 'Travel', 'Food', 'Fashion', 'Business', 'Education', 'Entertainment']}
              />
              <AISuggestion
                fieldName="targetInterests"
                currentValue={formData.targetInterests?.join(', ')}
                onApplySuggestion={(suggestion) => updateFormData('targetInterests', suggestion.split(', '))}
                formData={formData}
              />
            </FormField>

            <FormField label="Professions or Roles to Attract" type="Tags">
              <TagInput
                value={formData.targetProfessions || []}
                onChange={(value) => updateFormData('targetProfessions', value)}
                placeholder="Enter professions or roles"
                suggestions={['Entrepreneurs', 'Managers', 'Professionals', 'Students', 'Parents', 'Seniors']}
              />
            </FormField>

            <FormField label="Where to Reach Them" type="Tags">
              <TagInput
                value={formData.reachLocations || []}
                onChange={(value) => updateFormData('reachLocations', value)}
                placeholder="Enter locations or platforms"
                suggestions={['Social Media', 'LinkedIn', 'Google', 'Trade Shows', 'Networking Events', 'Online Forums']}
              />
            </FormField>

            <FormField label="Age Groups" type="Checkbox">
              <CheckboxGroup
                options={['Teens (13–19)', 'Young Adults (20–29)', 'Adults (30–39)', 'Mature Adults (40–59)', 'Seniors (60+)']}
                value={formData.ageGroups || []}
                onChange={(value) => updateFormData('ageGroups', value)}
              />
            </FormField>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Current Market</h3>

            <FormField label="What are your current customers' interests?" type="Tags" aiSuggestions>
              <TagInput
                value={formData.currentInterests || []}
                onChange={(value) => updateFormData('currentInterests', value)}
                placeholder="Add current customer interests"
                suggestions={['Technology', 'Fitness', 'Travel', 'Food', 'Fashion', 'Business', 'Education', 'Entertainment']}
              />
              <AISuggestion
                fieldName="currentInterests"
                currentValue={formData.currentInterests?.join(', ')}
                onApplySuggestion={(suggestion) => updateFormData('currentInterests', suggestion.split(', '))}
                formData={formData}
              />
            </FormField>

            <FormField label="Describe Current Customers' Spending Habits" type="Tags">
              <TagInput
                value={formData.spendingHabits || []}
                onChange={(value) => updateFormData('spendingHabits', value)}
                placeholder="Enter spending habits"
                suggestions={['Premium', 'Budget-conscious', 'Value-focused', 'Luxury', 'Practical', 'Impulse buyers']}
              />
            </FormField>

            <FormField label="How would you describe your current audience's behavior?" type="Tags" aiSuggestions>
              <TagInput
                value={formData.audienceBehavior || []}
                onChange={(value) => updateFormData('audienceBehavior', value)}
                placeholder="Add audience behavior traits"
                suggestions={['Online shopping', 'Social media active', 'Mobile-first', 'Research-oriented', 'Impulse buyers', 'Value-conscious']}
              />
              <AISuggestion
                fieldName="audienceBehavior"
                currentValue={formData.audienceBehavior?.join(', ')}
                onApplySuggestion={(suggestion) => updateFormData('audienceBehavior', suggestion.split(', '))}
                formData={formData}
              />
            </FormField>

            <FormField label="How Do People Interact With Your Business?" type="Checkbox">
              <CheckboxGroup
                options={['Website', 'Social Media', 'Phone', 'Email', 'In-person', 'Mobile App']}
                value={formData.interactionMethods || []}
                onChange={(value) => updateFormData('interactionMethods', value)}
              />
            </FormField>

            <FormField label="Challenges Customers Face That You Solve" type="Long Text">
              <Textarea
                value={formData.customerChallenges || ''}
                onChange={(e) => updateFormData('customerChallenges', e.target.value)}
                placeholder="Describe the problems your customers face that your business solves"
                rows={4}
              />
            </FormField>

            <FormField label="What motivates customers to choose you over competitors?" type="Long Text" aiSuggestions>
              <Textarea
                value={formData.purchaseMotivators || ''}
                onChange={(e) => updateFormData('purchaseMotivators', e.target.value)}
                placeholder="Describe your competitive advantages"
                rows={4}
              />
              <AISuggestion
                fieldName="purchaseMotivators"
                currentValue={formData.purchaseMotivators}
                onApplySuggestion={(suggestion) => updateFormData('purchaseMotivators', suggestion)}
                formData={formData}
              />
            </FormField>

            <FormField label="What feeling do people currently get from your brand?" type="Dropdown">
              <Select value={formData.emotionalGoal} onValueChange={(value) => updateFormData('emotionalGoal', value)}>
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
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <FormField label="3 Words to Describe Your Company Culture" type="Tags" aiSuggestions>
        <TagInput
          value={formData.cultureWords || []}
          onChange={(value) => updateFormData('cultureWords', value)}
          placeholder="Enter 3 words that describe your company culture"
          suggestions={['Innovative', 'Collaborative', 'Professional', 'Fun', 'Fast-paced', 'Relaxed', 'Creative', 'Structured']}
        />
        <AISuggestion
          fieldName="cultureWords"
          currentValue={formData.cultureWords?.join(', ')}
          onApplySuggestion={(suggestion) => updateFormData('cultureWords', suggestion.split(', '))}
          formData={formData}
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

      <FormField label="Any Traditions, Rituals, or Fun Things Your Team Does?" type="Long Text">
        <Textarea
          value={formData.teamTraditions || ''}
          onChange={(e) => updateFormData('teamTraditions', e.target.value)}
          placeholder="Describe any traditions, rituals, or fun activities your team enjoys"
          rows={4}
        />
      </FormField>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8">
      <FormField label="Who's Behind the Brand?" type="Long Text">
        <Textarea
          value={formData.behindBrand || ''}
          onChange={(e) => updateFormData('behindBrand', e.target.value)}
          placeholder="Tell us about the people behind your brand"
          rows={4}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="What inspired you to start this business?" type="Long Text" aiSuggestions>
        <Textarea
          placeholder="Share your inspiration story"
          value={formData.inspiration || ''}
          onChange={(e) => updateFormData('inspiration', e.target.value)}
          rows={4}
        />
        <AISuggestion
          fieldName="inspiration"
          currentValue={formData.inspiration}
          onApplySuggestion={(suggestion) => updateFormData('inspiration', suggestion)}
          formData={formData}
        />
      </FormField>

      <FormField label="Reason 1" type="Short Text">
        <Input
          value={formData.reason1 || ''}
          onChange={(e) => updateFormData('reason1', e.target.value)}
          placeholder="Enter your first reason"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Reason 2" type="Short Text">
        <Input
          value={formData.reason2 || ''}
          onChange={(e) => updateFormData('reason2', e.target.value)}
          placeholder="Enter your second reason"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Reason 3" type="Short Text">
        <Input
          value={formData.reason3 || ''}
          onChange={(e) => updateFormData('reason3', e.target.value)}
          placeholder="Enter your third reason"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="If Your Brand Had a Soul, How would you describe it?" type="Short Text">
        <Input
          value={formData.brandSoul || ''}
          onChange={(e) => updateFormData('brandSoul', e.target.value)}
          placeholder="What would your brand's soul be like?"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField
        label="Which 3 to 5 words describe your brand's personality best?"
        type="Tags"
        aiSuggestions
      >
        <TagInput
          value={formData.brandPersonality || []}
          onChange={(value) => updateFormData('brandPersonality', value)}
          placeholder="Add personality traits"
          suggestions={[
            'Friendly',
            'Professional',
            'Innovative',
            'Playful',
            'Trustworthy',
            'Bold',
            'Creative',
            'Elegant'
          ]}
        />
        <AISuggestion
          fieldName="brandPersonality"
          currentValue={formData.brandPersonality?.join(', ')}
          onApplySuggestion={(suggestion) =>
            updateFormData('brandPersonality', suggestion.split(', '))
          }
          formData={formData}
        />
      </FormField>

      <FormField label="If Your Brand Spoke Like a Person" type="Checkbox">
        <CheckboxGroup
          options={['Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 'Sophisticated']}
          value={formData.brandTone || []}
          onChange={(value) => updateFormData('brandTone', value)}
        />
      </FormField>

      <FormField label="Brand 1: Name + Why" type="Long Text">
        <Textarea
          value={formData.brand1 || ''}
          onChange={(e) => updateFormData('brand1', e.target.value)}
          placeholder="Describe your first brand idea and why it works"
          rows={4}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Brand 2 (Optional)" type="Long Text">
        <Textarea
          value={formData.brand2 || ''}
          onChange={(e) => updateFormData('brand2', e.target.value)}
          placeholder="Describe your second brand idea (optional)"
          rows={4}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Brand 3 (Optional)" type="Long Text">
        <Textarea
          value={formData.brand3 || ''}
          onChange={(e) => updateFormData('brand3', e.target.value)}
          placeholder="Describe your third brand idea (optional)"
          rows={4}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Something You Don't Want Your Brand Associated With" type="Long Text">
        <Textarea
          value={formData.brandAvoid || ''}
          onChange={(e) => updateFormData('brandAvoid', e.target.value)}
          placeholder="What should your brand avoid being associated with?"
          rows={4}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-8">
      <FormField label="Do You Already Have a Logo?" type="Dropdown" required>
        <Select value={formData.hasLogo} onValueChange={(value) => updateFormData('hasLogo', value)}>
          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {formData.hasLogo === 'yes' && (
        <FormField label="If Yes, What Do You Want Done?" type="Checkbox">
          <CheckboxGroup
            options={['Keep', 'Improve', 'Redo']}
            value={formData.logoAction || []}
            onChange={(value) => updateFormData('logoAction', value)}
          />
        </FormField>
      )}

      <FormField label="Preferred Brand Colors" type="Color Picker">
        <ColorPicker
          value={formData.preferredColors || ''}
          onChange={(value) => updateFormData('preferredColors', value)}
          placeholder="Enter your preferred brand colors"
        />
      </FormField>

      <FormField label="Colors to Avoid" type="Color Picker">
        <ColorPicker
          value={formData.colorsToAvoid || ''}
          onChange={(value) => updateFormData('colorsToAvoid', value)}
          placeholder="Enter colors you want to avoid"
        />
      </FormField>

      <FormField label="Preferred Font Styles" type="Checkbox">
        <CheckboxGroup
          options={['Serif', 'Sans-serif', 'Script', 'Display', 'Monospace']}
          value={formData.fontStyles || []}
          onChange={(value) => updateFormData('fontStyles', value)}
        />
      </FormField>

      <FormField label="Design Style" type="Checkbox">
        <CheckboxGroup
          options={['Minimalist', 'Modern', 'Vintage', 'Bold', 'Elegant', 'Playful', 'Professional']}
          value={formData.designStyle || []}
          onChange={(value) => updateFormData('designStyle', value)}
        />
      </FormField>

      <FormField label="Logo Type" type="Checkbox">
        <CheckboxGroup
          options={['Wordmark', 'Symbol', 'Combination', 'Emblem', 'Lettermark']}
          value={formData.logoType || []}
          onChange={(value) => updateFormData('logoType', value)}
        />
      </FormField>

      <FormField label="Visual Imagery Style" type="Checkbox">
        <CheckboxGroup
          options={['Photography', 'Illustration', 'Abstract', 'Geometric', 'Organic', 'Mixed Media']}
          value={formData.imageryStyle || []}
          onChange={(value) => updateFormData('imageryStyle', value)}
        />
      </FormField>

      <FormField label="Any Design Inspiration" type="Upload">
        <FileUpload
          value={formData.inspirationLinks || ''}
          onChange={(value) => updateFormData('inspirationLinks', value)}
          placeholder="Upload inspiration files or paste links"
        />
      </FormField>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-8">
      <FormField label="Where Will the Brand Kit Be Used?" type="Checkbox" required>
        <CheckboxGroup
          options={['Website', 'Social Media', 'Print Materials', 'Business Cards', 'Email Marketing', 'Packaging', 'Signage', 'Apparel']}
          value={formData.brandKitUse || []}
          onChange={(value) => updateFormData('brandKitUse', value)}
        />
      </FormField>

      <FormField label="Brand Elements Needed" type="Checkbox" required>
        <CheckboxGroup
          options={['Logo', 'Color Palette', 'Typography', 'Business Cards', 'Letterhead', 'Social Media Templates', 'Email Signature', 'Brand Guidelines']}
          value={formData.brandElements || []}
          onChange={(value) => updateFormData('brandElements', value)}
        />
      </FormField>

      <FormField label="File Format Preferences" type="Checkbox" required>
        <CheckboxGroup
          options={['PNG', 'JPG', 'PDF', 'AI', 'EPS', 'SVG']}
          value={formData.fileFormats || []}
          onChange={(value) => updateFormData('fileFormats', value)}
        />
      </FormField>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-8">
      <FormField label="#1 Goal This Year" type="Short Text" required>
        <Input
          value={formData.primaryGoal || ''}
          onChange={(e) => updateFormData('primaryGoal', e.target.value)}
          placeholder="What's your main goal this year?"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Are there any other short-term goals you'd like to achieve in the next year?" type="Long Text">
        <Textarea
          value={formData.shortTermGoals || ''}
          onChange={(e) => updateFormData('shortTermGoals', e.target.value)}
          placeholder="Additional goals for the next 12 months"
          rows={4}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="What's the main thing you want your business to achieve in the next 3–5 years?" type="Short Text">
        <Input
          value={formData.longTermGoal || ''}
          onChange={(e) => updateFormData('longTermGoal', e.target.value)}
          placeholder="Your 3-5 year vision"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="Are there additional mid-term goals you're aiming for?" type="Long Text">
        <Textarea
          value={formData.midTermGoals || ''}
          onChange={(e) => updateFormData('midTermGoals', e.target.value)}
          placeholder="Additional mid-term goals"
          rows={4}
        />
      </FormField>

      <FormField label="What's your big-picture vision for your brand in the long run?" type="Long Text">
        <Textarea
          value={formData.bigPictureVision || ''}
          onChange={(e) => updateFormData('bigPictureVision', e.target.value)}
          placeholder="Your long-term brand vision"
          rows={4}
        />
      </FormField>

      <FormField label="Which key indicators or metrics matter most when measuring your brand's success?" type="Checkbox">
        <CheckboxGroup
          options={['Revenue Growth', 'Customer Satisfaction', 'Brand Recognition', 'Market Share', 'Social Media Engagement', 'Website Traffic', 'Customer Retention', 'Employee Satisfaction']}
          value={formData.successMetrics || []}
          onChange={(value) => updateFormData('successMetrics', value)}
        />
      </FormField>
    </div>
  );

  const renderStep9 = () => (
    <div className="space-y-8">

      <FormField label="What's your mission as a business?" type="Long Text" aiSuggestions>
        <Textarea
          placeholder="Describe your business mission"
          value={formData.missionStatement || ''}
          onChange={(e) => updateFormData('missionStatement', e.target.value)}
          rows={4}
        />
        <AISuggestion
          fieldName="missionStatement"
          currentValue={formData.missionStatement}
          onApplySuggestion={(suggestion) => updateFormData('missionStatement', suggestion)}
          formData={formData}
        />
      </FormField>

      <FormField label="What's your long-term vision?" type="Long Text" aiSuggestions>
        <Textarea
          placeholder="Describe your long-term vision"
          value={formData.visionStatement || ''}
          onChange={(e) => updateFormData('visionStatement', e.target.value)}
          rows={4}
        />
        <AISuggestion
          fieldName="visionStatement"
          currentValue={formData.visionStatement}
          onApplySuggestion={(suggestion) => updateFormData('visionStatement', suggestion)}
          formData={formData}
        />
      </FormField>

      <FormField label="What values drive the way you do business?" type="Tags" aiSuggestions>
        <TagInput
          value={formData.coreValues || []}
          onChange={(value) => updateFormData('coreValues', value)}
          placeholder="Add your core values"
          suggestions={['Innovation', 'Integrity', 'Excellence', 'Customer-First', 'Collaboration', 'Transparency', 'Sustainability']}
        />
        <AISuggestion
          fieldName="coreValues"
          currentValue={formData.coreValues?.join(', ')}
          onApplySuggestion={(suggestion) => updateFormData('coreValues', suggestion.split(', '))}
          formData={formData}
        />
      </FormField>

    </div>
  );

  const renderStep10 = () => (
    <div className="space-y-8">
      <FormField label="Is there anything special or important about your business or preferences we haven't covered yet?" type="Long Text">
        <Textarea
          value={formData.specialNotes || ''}
          onChange={(e) => updateFormData('specialNotes', e.target.value)}
          placeholder="Any additional information or special requirements"
          rows={4}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>

      <FormField label="How soon do you need your brand kit completed?" type="Dropdown">
        <Select value={formData.timeline} onValueChange={(value) => updateFormData('timeline', value)}>
          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectItem value="Within 1 month">⏰ Within 1 month</SelectItem>
            <SelectItem value="1–2 months">📅 1–2 months</SelectItem>
            <SelectItem value="2–3 months">📆 2–3 months</SelectItem>
            <SelectItem value="Flexible">🔄 Flexible (no strict deadline)</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Who will be reviewing and approving your brand kit?" type="Short Text">
        <Input
          value={formData.approver || ''}
          onChange={(e) => updateFormData('approver', e.target.value)}
          placeholder="Name of the decision maker"
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </FormField>
    </div>
  );

  const renderStep11 = () => (
    <div className="space-y-8">
      <FormField label="Reference Materials" type="Upload">
        <FileUpload
          value={formData.referenceMaterials || ''}
          onChange={(value) => updateFormData('referenceMaterials', value)}
          placeholder="Upload reference files or paste links"
        />
      </FormField>

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
      case 10: return renderStep10();
      case 11: return renderStep11();
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
              🎉 BrandKit Form Completed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Congratulations! Your brand identity information has been successfully saved.
              <br />
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Redirecting to dashboard in 2 seconds...
              </span>
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
            Knowing You Form – Alta Media
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Let's get to know your business and create the perfect brand identity
          </p>
        </div>
      )}

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

export default KnowingYouForm; 