import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building,
    TrendingUp,
    Package,
    FileText,
    Target,
    Lightbulb,
    Heart,
    Star,
    Palette,
    Type,
    Image,
    Globe,
    Award,
    Download,
    FileText as FileTextIcon,
    FileDown,
    Eye,
    MessageSquare,
    Zap,
    Shield,
    Layers,
    Clock,
    CheckCircle,
    AlertCircle,
    Briefcase,
    Smile,
    Compass,
    Camera,
    Video,
    Music,
    BookOpen,
    Flag,
    DollarSign,
    BarChart3,
    Users2,
    Sparkles,
    Target as TargetIcon,
    Palette as PaletteIcon,
    FileImage,
    Link,
    Hash,
    AtSign,
    Play,
    Mic,
    PenTool,
    Layout,
    Smartphone,
    Monitor,
    Printer,
    Gift,
    Mail as MailIcon,
    File,
    Settings,
    Zap as ZapIcon,
    Award as AwardIcon,
    TrendingUp as TrendingUpIcon,
    Calendar as CalendarIcon,
    MapPin as MapPinIcon,
    Phone as PhoneIcon,
    Building as BuildingIcon,
    Globe as GlobeIcon,
    Heart as HeartIcon,
    Star as StarIcon,
    Lightbulb as LightbulbIcon,
    Target as TargetIcon2,
    FileText as FileTextIcon2,
    Users as UsersIcon,
    Palette as PaletteIcon2,
    Image as ImageIcon,
    Clock as ClockIcon,
    Award as AwardIcon2,
    Globe as GlobeIcon2,
    Download as DownloadIcon,
    FileText as FileTextIcon3,
    FileDown as FileDownIcon,
    Locate
} from 'lucide-react';

// Helper function to format arrays and handle empty values
const formatArray = (value) => {
    if (!value) return 'Not specified';

    // If it's already an array, process it
    if (Array.isArray(value)) {
        if (value.length === 0) return 'Not specified';
        if (value.length === 1) return value[0];
        return value.join(', ');
    }

    // If it's a string that looks like an array, parse it
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                if (parsed.length === 0) return 'Not specified';
                if (parsed.length === 1) return parsed[0];
                return parsed.join(', ');
            }
        } catch (e) {
            // If parsing fails, treat as regular string
            return value;
        }
    }

    return value;
};

// Helper function to format yes/no values
const formatYesNo = (value) => {
    if (!value) return 'Not specified';
    return value.toLowerCase() === 'yes' ? 'Yes' : value.toLowerCase() === 'no' ? 'No' : value;
};

// Helper function to format dates
const formatDate = (date) => {
    if (!date) return 'Not provided';
    try {
        return new Date(date).toLocaleDateString();
    } catch (e) {
        return date;
    }
};

// Helper function to format URLs
const formatUrl = (url) => {
    if (!url) return 'Not provided';
    return url.startsWith('http') ? url : `https://${url}`;
};

// Helper function to format file uploads with download buttons
const formatFileUpload = (files) => {
    if (!files) return 'No files uploaded';

    // Debug logging
    console.log('formatFileUpload - Raw files data:', files);
    console.log('formatFileUpload - Type:', typeof files);
    console.log('formatFileUpload - Is Array:', Array.isArray(files));

    // Detect environment and set appropriate base URL
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://builder.altamedia.ai';

    // Handle JSON string that needs to be parsed
    if (typeof files === 'string') {
        if (files.trim() === '') return 'No files uploaded';

        // Try to parse as JSON array first
        try {
            const parsedFiles = JSON.parse(files);
            if (Array.isArray(parsedFiles)) {
                console.log('formatFileUpload - Parsed JSON array:', parsedFiles);
                if (parsedFiles.length === 0) return 'No files uploaded';

                return (
                    <div className="space-y-2">
                        {parsedFiles.map((file, index) => (
                            <div key={index}>
                                {createFileDownloadButton(file, baseUrl)}
                            </div>
                        ))}
                    </div>
                );
            }
        } catch (e) {
            console.log('formatFileUpload - Not a JSON string, treating as single file path');
        }

        // If not JSON, treat as single file path
        return createFileDownloadButton(files, baseUrl);
    }

    // Handle array of files
    if (Array.isArray(files)) {
        console.log('formatFileUpload - Processing array with', files.length, 'files');
        if (files.length === 0) return 'No files uploaded';

        // Always create separate buttons for each file, even if only one
        return (
            <div className="space-y-2">
                {files.map((file, index) => {
                    console.log(`formatFileUpload - Processing file ${index}:`, file);
                    return (
                        <div key={index}>
                            {createFileDownloadButton(file, baseUrl)}
                        </div>
                    );
                })}
            </div>
        );
    }

    console.log('formatFileUpload - Unknown file format, returning as-is');
    return files;
};

// Helper function to create a download button for a file
const createFileDownloadButton = (filePath, baseUrl) => {
    if (!filePath || filePath.trim() === '') return 'No file';

    console.log('createFileDownloadButton - Processing file path:', filePath);

    // Normalize path separators (convert backslashes to forward slashes)
    const normalizedPath = filePath.replace(/\\/g, '/');
    console.log('createFileDownloadButton - Normalized path:', normalizedPath);

    // Extract filename from path (handle both forward and back slashes)
    const fileName = normalizedPath.split('/').pop() || filePath.split('\\').pop() || filePath;
    console.log('createFileDownloadButton - Extracted filename:', fileName);

    // Determine if it's a URL or a local file path
    const isUrl = filePath.startsWith('http') || filePath.startsWith('//');
    const downloadUrl = isUrl ? filePath : `${baseUrl}/${normalizedPath}`;

    // Handle download click with robust download logic from FilePreviewModal
    const handleDownload = async (e) => {
        e.preventDefault();

        try {
            // Fetch the file as a blob to force download behavior
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/octet-stream',
                }
            });

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status} ${response.statusText}`);
            }

            // Create blob and force download
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

        } catch (error) {
            console.error('Download error:', error);

            // Fallback: Try XMLHttpRequest method
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', downloadUrl, true);
                xhr.responseType = 'blob';

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
                        const blobUrl = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = fileName;
                        link.style.display = 'none';

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                    } else {
                        throw new Error(`XHR failed: ${xhr.status}`);
                    }
                };

                xhr.onerror = function () {
                    throw new Error('XHR request failed');
                };

                xhr.send();

            } catch (fallbackError) {
                // Final fallback: Direct link method
                try {
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = fileName;
                    link.target = '_self';
                    link.rel = 'noopener noreferrer';
                    link.style.display = 'none';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (finalError) {
                    console.error('All download methods failed:', finalError);
                    // Last resort: open in new tab
                    window.open(downloadUrl, '_blank');
                }
            }
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded-lg transition-colors duration-200 cursor-pointer"
            >
                <FileDown className="w-4 h-4" />
                <span className="truncate max-w-[200px]" title={fileName}>
                    {fileName}
                </span>
            </button>
        </div>
    );
};

// Helper function to format data for better readability
const formatFormData = (form) => {
    // Get form type first - check both snake_case and camelCase versions
    const formType = form.building_type || form.buildingType || form.form_type;
    console.log('Form type: ', formType);

    // Helper function to format yes/no values
    const formatYesNo = (value) => {
        if (!value) return 'Not specified';
        return value.toLowerCase() === 'yes' ? 'Yes' :
            value.toLowerCase() === 'no' ? 'No' : value;
    };

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Helper function to format URLs
    const formatUrl = (url) => {
        if (!url) return 'Not provided';
        return url.startsWith('http') ? url : `https://${url}`;
    };


    // Form-specific field mappings based on actual form structures
    const getFormSections = (formType) => {
        console.log('Getting sections for form type:', formType);
        if (formType === 'business') {
            console.log('Using KnowingYouForm sections');
            return getKnowingYouFormSections(form);
        } else if (formType === 'brandkit-questionnaire') {
            console.log('Using BrandKitQuestionnaire sections');
            return getBrandKitQuestionnaireSections(form);
        } else if (formType === 'organization') {
            console.log('Using OrganizationForm sections');
            return getOrganizationFormSections(form);
        } else {
            console.log('Using fallback sections');
            return {
                ...getKnowingYouFormSections(form),
                ...getBrandKitQuestionnaireSections(form),
                ...getOrganizationFormSections(form)
            };
        }
    };

    // KnowingYouForm specific sections (business type)
    const getKnowingYouFormSections = (form) => ({
        // Basic Contact Information
        contactInfo: {
            title: "Contact Information",
            icon: Users,
            color: "bg-blue-50 border-blue-200",
            fields: [
                {
                    label: "Client Name",
                    value: form.user_fullname || 'Not provided',
                    icon: Users,
                    description: "The person who submitted this form"
                },
                {
                    label: "Business Email",
                    value: form.business_email || form.user_email || 'No email provided',
                    icon: Mail,
                    description: "Primary contact email"
                },
                {
                    label: "Contact Number",
                    value: form.contact_number || 'Not provided',
                    icon: Phone,
                    description: "Contact phone number"
                },
                {
                    label: "Preferred Contact Method",
                    value: form.preferred_contact || 'Not specified',
                    icon: MessageSquare,
                    description: "Preferred way to be contacted"
                },
                {
                    label: "Primary Location",
                    value: form.primary_location || 'Not specified',
                    icon: MapPin,
                    description: "Primary business location"
                },
                {
                    label: "Form Submitted",
                    value: formatDate(form.created_at),
                    icon: Calendar,
                    description: "When this form was completed"
                }
            ]
        },

        // Business Information
        businessInfo: {
            title: "Business Details",
            icon: Building,
            color: "bg-green-50 border-green-200",
            fields: [
                {
                    label: "What Are You Building",
                    value: form.building_type === 'business' ? 'Business/Company' : form.building_type || 'Not specified',
                    icon: Building,
                    description: "Type of entity being built"
                },
                {
                    label: "Business Name",
                    value: form.business_name || 'Not provided',
                    icon: Building,
                    description: "Official business name"
                },
                {
                    label: "Proventous ID",
                    value: form.has_proventous_id === 'yes' ? (form.proventous_id || 'ID not provided') : 'No Proventous ID',
                    icon: Shield,
                    description: "Proventous identification number"
                },
                {
                    label: "Industry or Niche",
                    value: formatArray(form.industry),
                    icon: TrendingUp,
                    description: "Business industry or sector"
                },
                {
                    label: "Location",
                    value: formatArray(form.primary_location),
                    icon: Locate,
                    description: "Business location"
                },
                {
                    label: "Year Officially Started",
                    value: form.year_started || 'Not specified',
                    icon: Calendar,
                    description: "When the business was founded"
                },
                {
                    label: "Business Stage",
                    value: form.business_stage || 'Not specified',
                    icon: TrendingUp,
                    description: "Current stage of business development"
                },
                {
                    label: "Business Description",
                    value: form.business_description || 'Not provided',
                    icon: FileText,
                    isLongText: true,
                    description: "One-sentence description of the business"
                }
            ]
        },

        // Target Audience & Market
        targetAudience: {
            title: "Target Audience & Market",
            icon: Target,
            color: "bg-orange-50 border-orange-200",
            fields: [
                {
                    label: "Current Customers",
                    value: formatArray(form.current_customers),
                    icon: Users,
                    description: "Who typically buys from you now"
                },
                {
                    label: "Who Do You Want to Attract",
                    value: form.want_to_attract || 'Not provided',
                    icon: Target,
                    isLongText: true,
                    description: "Ideal target audience description"
                },
                {
                    label: "Spending Type",
                    value: form.spending_type || 'Not specified',
                    icon: DollarSign,
                    description: "Target customer spending behavior"
                },
                {
                    label: "Secondary Audience",
                    value: form.secondary_audience || 'Not provided',
                    icon: Users2,
                    isLongText: true,
                    description: "Additional target groups"
                },
                {
                    label: "Desired Emotional Response",
                    value: form.desired_emotion || 'Not specified',
                    icon: Heart,
                    description: "How customers should feel about the brand"
                },
                {
                    label: "Target Interests",
                    value: formatArray(form.target_interests),
                    icon: Target,
                    description: "Interests and preferences of target audience"
                },
                {
                    label: "Target Professions",
                    value: formatArray(form.target_professions),
                    icon: Briefcase,
                    description: "Professional roles of target customers"
                },
                {
                    label: "Reach Locations",
                    value: formatArray(form.reach_locations),
                    icon: MapPin,
                    description: "Where to reach target audience"
                },
                {
                    label: "Age Groups",
                    value: formatArray(form.age_groups),
                    icon: Users,
                    description: "Target age demographics"
                },
                {
                    label: "Current Customer Interests",
                    value: formatArray(form.current_interests),
                    icon: Target,
                    description: "Interests of current customers"
                },
                {
                    label: "Spending Habits",
                    value: formatArray(form.spending_habits),
                    icon: DollarSign,
                    description: "Current customer spending patterns"
                },
                {
                    label: "Audience Behavior",
                    value: formatArray(form.audience_behavior),
                    icon: BarChart3,
                    description: "How current audience behaves"
                },
                {
                    label: "Interaction Methods",
                    value: formatArray(form.interaction_methods),
                    icon: MessageSquare,
                    description: "How people interact with the business"
                },
                {
                    label: "Customer Challenges",
                    value: form.customer_challenges || 'Not provided',
                    icon: AlertCircle,
                    isLongText: true,
                    description: "Problems customers face that the business solves"
                },
                {
                    label: "Purchase Motivators",
                    value: form.purchase_motivators || 'Not provided',
                    icon: Zap,
                    isLongText: true,
                    description: "What motivates customers to choose this business"
                },
                {
                    label: "Current Brand Feeling",
                    value: form.emotional_goal || 'Not specified',
                    icon: Smile,
                    description: "How people currently feel about the brand"
                }
            ]
        },

        // Team & Culture
        teamCulture: {
            title: "Team & Culture",
            icon: Users,
            color: "bg-indigo-50 border-indigo-200",
            fields: [
                {
                    label: "Company Culture Words",
                    value: formatArray(form.culture_words),
                    icon: Heart,
                    description: "Three words that describe company culture"
                },
                {
                    label: "Culture Description",
                    value: form.culture_description || 'Not provided',
                    icon: FileText,
                    isLongText: true,
                    description: "How team describes working at the business"
                },
                {
                    label: "Team Traditions",
                    value: form.team_traditions || 'Not provided',
                    icon: Users,
                    isLongText: true,
                    description: "Traditions, rituals, or fun team activities"
                },
                {
                    label: "Who's Behind the Brand",
                    value: form.behind_brand || 'Not provided',
                    icon: Users,
                    isLongText: true,
                    description: "People behind the brand"
                },
                {
                    label: "Business Inspiration",
                    value: form.inspiration || 'Not provided',
                    icon: Lightbulb,
                    isLongText: true,
                    description: "What inspired starting this business"
                },
                {
                    label: "Reason 1",
                    value: form.reason1 || 'Not provided',
                    icon: Star,
                    description: "First reason for starting the business"
                },
                {
                    label: "Reason 2",
                    value: form.reason2 || 'Not provided',
                    icon: Star,
                    description: "Second reason for starting the business"
                },
                {
                    label: "Reason 3",
                    value: form.reason3 || 'Not provided',
                    icon: Star,
                    description: "Third reason for starting the business"
                },
                {
                    label: "Brand Soul",
                    value: form.brand_soul || 'Not provided',
                    icon: Heart,
                    description: "If the brand had a soul, how would it be described"
                }
            ]
        },

        // Brand Identity & Personality
        brandIdentity: {
            title: "Brand Identity & Personality",
            icon: Star,
            color: "bg-yellow-50 border-yellow-200",
            fields: [
                {
                    label: "Brand Personality",
                    value: formatArray(form.brand_personality),
                    icon: Smile,
                    description: "3-5 words that describe brand personality"
                },
                {
                    label: "Brand Tone",
                    value: formatArray(form.brand_tone),
                    icon: MessageSquare,
                    description: "How the brand speaks like a person"
                },
                {
                    label: "Brand 1: Name + Why",
                    value: form.brand1 || 'Not provided',
                    icon: Star,
                    isLongText: true,
                    description: "First brand idea and why it works"
                },
                {
                    label: "Brand 2 (Optional)",
                    value: form.brand2 || 'Not provided',
                    icon: Star,
                    isLongText: true,
                    description: "Second brand idea (optional)"
                },
                {
                    label: "Brand 3 (Optional)",
                    value: form.brand3 || 'Not provided',
                    icon: Star,
                    isLongText: true,
                    description: "Third brand idea (optional)"
                },
                {
                    label: "Something You Don't Want Associated",
                    value: form.brand_avoid || 'Not provided',
                    icon: AlertCircle,
                    isLongText: true,
                    description: "What the brand should avoid being associated with"
                }
            ]
        },

        // Visual Design Preferences
        visualPreferences: {
            title: "Visual Design Preferences",
            icon: Palette,
            color: "bg-pink-50 border-pink-200",
            fields: [
                {
                    label: "Has Logo",
                    value: formatYesNo(form.has_logo),
                    icon: Image,
                    description: "Whether they already have a logo"
                },
                {
                    label: "Logo Action",
                    value: formatArray(form.logo_action),
                    icon: PenTool,
                    description: "What to do with existing logo"
                },
                {
                    label: "Preferred Colors",
                    value: form.preferred_colors || 'Not provided',
                    icon: Palette,
                    description: "Preferred brand colors"
                },
                {
                    label: "Colors to Avoid",
                    value: form.colors_to_avoid || 'Not provided',
                    icon: AlertCircle,
                    description: "Colors that don't fit the brand"
                },
                {
                    label: "Font Styles",
                    value: formatArray(form.font_styles),
                    icon: Type,
                    description: "Preferred font styles"
                },
                {
                    label: "Design Style",
                    value: formatArray(form.design_style),
                    icon: Image,
                    description: "Overall design aesthetic preference"
                },
                {
                    label: "Logo Type",
                    value: formatArray(form.logo_type),
                    icon: Image,
                    description: "Preferred logo types"
                },
                {
                    label: "Imagery Style",
                    value: formatArray(form.imagery_style),
                    icon: Camera,
                    description: "Preferred visual imagery approach"
                },
                {
                    label: "Design Inspiration",
                    value: formatFileUpload(form.inspiration_links),
                    icon: FileImage,
                    description: "Design inspiration files or links"
                }
            ]
        },

        // Collateral Needs
        collateralNeeds: {
            title: "Collateral Needs",
            icon: Layers,
            color: "bg-purple-50 border-purple-200",
            fields: [
                {
                    label: "Brand Kit Use",
                    value: formatArray(form.brand_kit_use),
                    icon: Layers,
                    description: "Where the brand kit will primarily be used"
                },
                {
                    label: "Brand Elements Needed",
                    value: formatArray(form.brand_elements),
                    icon: Star,
                    description: "Specific brand elements required"
                },
                {
                    label: "File Format Preferences",
                    value: formatArray(form.file_formats),
                    icon: File,
                    description: "Preferred file formats for deliverables"
                }
            ]
        },

        // Business Goals & Vision
        businessGoals: {
            title: "Business Goals & Vision",
            icon: Target,
            color: "bg-emerald-50 border-emerald-200",
            fields: [
                {
                    label: "Primary Goal",
                    value: form.primary_goal || 'Not specified',
                    icon: Target,
                    description: "Main objective for this project"
                },
                {
                    label: "Short-term Goals",
                    value: form.short_term_goals || 'Not specified',
                    icon: TrendingUp,
                    isLongText: true,
                    description: "Immediate goals and objectives"
                },
                {
                    label: "Long-term Goal",
                    value: form.long_term_goal || 'Not specified',
                    icon: Target,
                    description: "Main thing to achieve in 3-5 years"
                },
                {
                    label: "Mid-term Goals",
                    value: form.mid_term_goals || 'Not specified',
                    icon: TrendingUp,
                    isLongText: true,
                    description: "Additional mid-term goals"
                },
                {
                    label: "Big Picture Vision",
                    value: form.big_picture_vision || 'Not specified',
                    icon: Lightbulb,
                    isLongText: true,
                    description: "Long-term brand vision"
                },
                {
                    label: "Success Metrics",
                    value: formatArray(form.success_metrics),
                    icon: Award,
                    description: "How success will be measured"
                }
            ]
        },

        // Mission, Vision & Values
        missionVisionValues: {
            title: "Mission, Vision & Values",
            icon: Compass,
            color: "bg-rose-50 border-rose-200",
            fields: [
                {
                    label: "Mission Statement",
                    value: form.mission_statement || 'Not provided',
                    icon: Target,
                    isLongText: true,
                    description: "The brand's purpose and mission"
                },
                {
                    label: "Long-term Vision",
                    value: form.long_term_vision || 'Not specified',
                    icon: Lightbulb,
                    isLongText: true,
                    description: "Long-term vision and aspirations"
                },
                {
                    label: "Core Values",
                    value: formatArray(form.core_values),
                    icon: Heart,
                    description: "Fundamental principles that guide the brand"
                }
            ]
        },

        // Social Media Presence
        socialMedia: {
            title: "Social Media Presence",
            icon: Globe,
            color: "bg-cyan-50 border-cyan-200",
            fields: [
                {
                    label: "Has Social Media",
                    value: formatYesNo(form.has_social_media),
                    icon: Globe,
                    description: "Current social media presence"
                },
                {
                    label: "Social Media Platforms",
                    value: formatArray(form.social_media_platforms),
                    icon: Globe,
                    description: "Platforms currently in use"
                },
                {
                    label: "Facebook URL",
                    value: formatUrl(form.facebook_url),
                    icon: Globe,
                    description: "Facebook page URL"
                },
                {
                    label: "Instagram URL",
                    value: formatUrl(form.instagram_url),
                    icon: Camera,
                    description: "Instagram profile URL"
                },
                {
                    label: "Twitter/X URL",
                    value: formatUrl(form.twitter_url),
                    icon: MessageSquare,
                    description: "Twitter/X profile URL"
                },
                {
                    label: "LinkedIn URL",
                    value: formatUrl(form.linkedin_url),
                    icon: Briefcase,
                    description: "LinkedIn profile URL"
                },
                {
                    label: "TikTok URL",
                    value: formatUrl(form.tiktok_url),
                    icon: Video,
                    description: "TikTok profile URL"
                },
                {
                    label: "YouTube URL",
                    value: formatUrl(form.youtube_url),
                    icon: Play,
                    description: "YouTube channel URL"
                },
                {
                    label: "Pinterest URL",
                    value: formatUrl(form.pinterest_url),
                    icon: Image,
                    description: "Pinterest profile URL"
                },
                {
                    label: "Snapchat Username",
                    value: form.snapchat_username || 'Not provided',
                    icon: Camera,
                    description: "Snapchat username"
                },
                {
                    label: "Other Social Media URLs",
                    value: form.other_social_media_urls || 'Not provided',
                    icon: Globe,
                    isLongText: true,
                    description: "Other social media platforms and URLs"
                },
                {
                    label: "Want to Create Social Media",
                    value: form.want_to_create_social_media || 'Not specified',
                    icon: Globe,
                    description: "Whether they want to create social media accounts"
                },
                {
                    label: "Desired Social Media Platforms",
                    value: formatArray(form.desired_social_media_platforms),
                    icon: Globe,
                    description: "Social media platforms they want to create"
                }
            ]
        },

        // Website Information
        websiteInfo: {
            title: "Website Information",
            icon: Monitor,
            color: "bg-blue-50 border-blue-200",
            fields: [
                {
                    label: "Has Website",
                    value: formatYesNo(form.has_website),
                    icon: Monitor,
                    description: "Current website status"
                },
                {
                    label: "Website Files",
                    value: formatFileUpload(form.website_files),
                    icon: File,
                    description: "Current website files uploaded"
                },
                {
                    label: "Website URL",
                    value: formatUrl(form.website_url),
                    icon: Link,
                    description: "Current website address"
                },
                {
                    label: "Want Website",
                    value: form.want_website || 'Not specified',
                    icon: Monitor,
                    description: "Future website development plans"
                }
            ]
        },

        // Collaboration & Wrap-Up
        collaborationWrapUp: {
            title: "Collaboration & Wrap-Up",
            icon: Users,
            color: "bg-slate-50 border-slate-200",
            fields: [
                {
                    label: "Main Point of Contact",
                    value: form.main_contact || 'Not provided',
                    icon: Users,
                    description: "Primary contact person"
                },
                {
                    label: "Additional Information",
                    value: form.special_notes || 'Not provided',
                    icon: FileText,
                    isLongText: true,
                    description: "Any additional information or special requirements"
                },
                {
                    label: "Reference Materials",
                    value: formatFileUpload(form.reference_materials),
                    icon: File,
                    description: "Reference files or links for collaboration"
                },
                {
                    label: "Timeline",
                    value: form.timeline || 'Not specified',
                    icon: Clock,
                    description: "Expected completion timeframe"
                },
                {
                    label: "Approver",
                    value: form.approver || 'Not specified',
                    icon: Users,
                    description: "Person reviewing and approving the work"
                }
            ]
        }
    });

    // BrandKitQuestionnaire specific sections (product type)
    const getBrandKitQuestionnaireSections = (form) => ({
        // Basic Contact Information
        contactInfo: {
            title: "Contact Information",
            icon: Users,
            color: "bg-blue-50 border-blue-200",
            fields: [
                {
                    label: "Client Name",
                    value: form.user_fullname || 'Not provided',
                    icon: Users,
                    description: "The person who submitted this form"
                },
                {
                    label: "Business Email",
                    value: form.business_email || form.user_email || 'No email provided',
                    icon: Mail,
                    description: "Primary contact email"
                },
                {
                    label: "Form Submitted",
                    value: formatDate(form.created_at),
                    icon: Calendar,
                    description: "When this form was completed"
                }
            ]
        },

        // Product/Service Specific Information
        productInfo: {
            title: "Product/Service Details",
            icon: Package,
            color: "bg-purple-50 border-purple-200",
            fields: [
                {
                    label: "Offering Type",
                    value: form.offering_type === 'product' ? 'Product' : form.offering_type === 'service' ? 'Service' : 'Not specified',
                    icon: Package,
                    description: "Primary offering type"
                },
                {
                    label: "Brand/Product Name",
                    value: form.brand_name || 'Not provided',
                    icon: Star,
                    description: "Name of the product or service"
                },
                {
                    label: "Product Industry",
                    value: form.product_industry || 'Not specified',
                    icon: Building,
                    description: "Industry category for the product"
                },
                {
                    label: "Product Industry (Other)",
                    value: form.product_industry_other || 'Not provided',
                    icon: Building,
                    description: "Custom industry specification"
                },
                {
                    label: "Product Type",
                    value: formatArray(form.product_type),
                    icon: Package,
                    description: "Types of products or services offered"
                },
                {
                    label: "Key Features and Benefits",
                    value: form.product_features || 'Not provided',
                    icon: Zap,
                    isLongText: true,
                    description: "Main features and benefits of the offering"
                },
                {
                    label: "Pricing Tier",
                    value: form.product_pricing || 'Not specified',
                    icon: DollarSign,
                    description: "Pricing strategy and tier"
                },
                {
                    label: "Product Stage",
                    value: form.product_stage || 'Not specified',
                    icon: TrendingUp,
                    description: "Current stage of product development"
                },
                {
                    label: "Brand Description",
                    value: form.brand_description || 'Not provided',
                    icon: FileText,
                    isLongText: true,
                    description: "One-sentence brand description"
                }
            ]
        },

        // Target Audience & Market
        targetAudience: {
            title: "Target Audience & Market",
            icon: Target,
            color: "bg-orange-50 border-orange-200",
            fields: [
                {
                    label: "Primary Customers",
                    value: form.primary_customers || 'Not provided',
                    icon: Users,
                    isLongText: true,
                    description: "Main customer base and target market"
                },
                {
                    label: "Desired Emotional Response",
                    value: form.desired_emotion || 'Not specified',
                    icon: Heart,
                    description: "How customers should feel about the brand"
                },
                {
                    label: "Unfair Advantage",
                    value: form.unfair_advantage || 'Not provided',
                    icon: Zap,
                    isLongText: true,
                    description: "What makes the brand unique vs competitors"
                },
                {
                    label: "What Would Customers Miss",
                    value: form.customer_miss || 'Not provided',
                    icon: Heart,
                    isLongText: true,
                    description: "What customers would miss if brand disappeared"
                },
                {
                    label: "Problem Solved",
                    value: form.problem_solved || 'Not provided',
                    icon: CheckCircle,
                    isLongText: true,
                    description: "Problem the offering solves for customers"
                }
            ]
        },

        // Competitive Landscape
        competitiveLandscape: {
            title: "Competitive Landscape",
            icon: TrendingUp,
            color: "bg-red-50 border-red-200",
            fields: [
                {
                    label: "Top Competitors",
                    value: formatArray(form.competitors),
                    icon: Target,
                    description: "Main competitors in the market"
                },
                {
                    label: "What You Like About Competitors",
                    value: form.competitor_likes || 'Not provided',
                    icon: Heart,
                    isLongText: true,
                    description: "Aspects of competitor branding admired"
                },
                {
                    label: "What You Dislike About Competitors",
                    value: form.competitor_dislikes || 'Not provided',
                    icon: AlertCircle,
                    isLongText: true,
                    description: "Aspects of competitor branding disliked"
                },
                {
                    label: "How Should Your Brand Stand Apart",
                    value: form.brand_differentiation || 'Not provided',
                    icon: Sparkles,
                    isLongText: true,
                    description: "Brand differentiation strategy"
                }
            ]
        },
        // Applications & Use Cases
        applicationsUseCases: {
            title: "Applications & Use Cases",
            icon: Layers,
            color: "bg-teal-50 border-teal-200",
            fields: [
                {
                    label: "Brand Kit Use",
                    value: formatArray(form.brand_kit_use),
                    icon: Layers,
                    description: "Where the brand kit will primarily be used"
                },
                {
                    label: "Templates Needed",
                    value: formatArray(form.templates),
                    icon: FileText,
                    description: "Templates required"
                },
                {
                    label: "Internal Assets",
                    value: formatArray(form.internal_assets),
                    icon: Building,
                    description: "Assets needed for internal use"
                },
                {
                    label: "File Formats",
                    value: formatArray(form.file_formats),
                    icon: File,
                    description: "Preferred file formats"
                },
                {
                    label: "Cultural Adaptation",
                    value: form.cultural_adaptation || 'Not specified',
                    icon: Globe,
                    description: "Whether kit should adapt across languages/cultures"
                }
            ]
        },

        // Brand Identity & Personality
        brandIdentity: {
            title: "Brand Identity & Personality",
            icon: Star,
            color: "bg-yellow-50 border-yellow-200",
            fields: [
                {
                    label: "Brand Voice",
                    value: formatArray(form.brand_voice),
                    icon: Mic,
                    description: "How the brand would speak if it were a person"
                },
                {
                    label: "Admired Brands for Tone",
                    value: form.admired_brands || 'Not provided',
                    icon: Heart,
                    isLongText: true,
                    description: "Brands admired for their tone of voice"
                },
                {
                    label: "Inspiration Brand",
                    value: form.inspiration_brand || 'Not provided',
                    icon: Star,
                    description: "Inspiration brand that can be imported"
                },
                {
                    label: "Communication Perception",
                    value: formatArray(form.communication_perception),
                    icon: MessageSquare,
                    description: "How audience should perceive communications"
                }
            ]
        },

        // Visual Design Preferences
        visualPreferences: {
            title: "Visual Design Preferences",
            icon: Palette,
            color: "bg-pink-50 border-pink-200",
            fields: [
                {
                    label: "Brand Logo",
                    value: formatFileUpload(form.brand_logo),
                    icon: FileImage,
                    description: "Uploaded brand logo"
                },
                {
                    label: "Logo Redesign",
                    value: form.logo_redesign || 'Not specified',
                    icon: PenTool,
                    description: "Whether logo should be redesigned"
                },
                {
                    label: "Has Existing Colors",
                    value: formatYesNo(form.has_existing_colors),
                    icon: Palette,
                    description: "Whether they have existing brand colors"
                },
                {
                    label: "Existing Colors",
                    value: formatArray(form.existing_colors),
                    icon: Palette,
                    description: "Existing brand colors"
                },
                {
                    label: "Preferred Colors",
                    value: form.preferred_colors || 'Not provided',
                    icon: Palette,
                    description: "Preferred brand colors"
                },
                {
                    label: "Colors to Avoid",
                    value:  formatArray(form.colors_to_avoid),
                    icon: AlertCircle,
                    description: "Colors that don't fit the brand"
                },
                {
                    label: "Imagery Style",
                    value: formatArray(form.imagery_style),
                    icon: Camera,
                    description: "Preferred visual imagery approach"
                },
                {
                    label: "Font Types",
                    value: formatArray(form.font_types),
                    icon: Type,
                    description: "Preferred font types"
                },
                {
                    label: "Font Styles",
                    value: formatArray(form.font_styles),
                    icon: Type,
                    description: "Preferred font styles"
                },
                {
                    label: "Legal Considerations",
                    value: form.legal_considerations || 'Not provided',
                    icon: Shield,
                    isLongText: true,
                    description: "Brand compliance or legal considerations"
                }
            ]
        },
        // Technical Deliverables
        technicalDeliverables: {
            title: "Technical Deliverables",
            icon: Settings,
            color: "bg-gray-50 border-gray-200",
            fields: [
                {
                    label: "Source Files",
                    value: formatArray(form.source_files),
                    icon: File,
                    description: "Source files needed"
                },
                {
                    label: "Required Formats",
                    value: formatArray(form.required_formats),
                    icon: File,
                    description: "Specific file formats required"
                }
            ]
        },

        // Inspiration & References
        inspirationReferences: {
            title: "Inspiration & References",
            icon: Lightbulb,
            color: "bg-amber-50 border-amber-200",
            fields: [
                {
                    label: "Reference Materials",
                    value: formatFileUpload(form.reference_materials),
                    icon: FileImage,
                    description: "Moodboards, Pinterest boards, or reference images"
                },
                {
                    label: "Inspiration Brands",
                    value: form.inspiration_brands || 'Not provided',
                    icon: Star,
                    isLongText: true,
                    description: "Brands outside the industry that inspire"
                },
                {
                    label: "Brand Vibe",
                    value: formatArray(form.brand_vibe),
                    icon: Sparkles,
                    description: "The vibe being chased"
                }
            ]
        },

        // Mission, Vision & Values
        missionVisionValues: {
            title: "Mission, Vision & Values",
            icon: Compass,
            color: "bg-rose-50 border-rose-200",
            fields: [
                {
                    label: "Brand Words",
                    value: formatArray(form.brand_words),
                    icon: Star,
                    description: "3 words people should use to describe the brand"
                },
                {
                    label: "Brand Avoid Words",
                    value: formatArray(form.brand_avoid_words),
                    icon: AlertCircle,
                    description: "3 words people should never use to describe the brand"
                },
                {
                    label: "Tagline or Slogan",
                    value: form.tagline || 'Not provided',
                    icon: Star,
                    description: "Existing or aspirational tagline"
                },
                {
                    label: "Mission Statement",
                    value: form.mission || 'Not provided',
                    icon: Target,
                    isLongText: true,
                    description: "The brand's purpose and mission"
                },
                {
                    label: "Vision",
                    value: form.vision || 'Not specified',
                    icon: Lightbulb,
                    isLongText: true,
                    description: "Long-term vision and aspirations"
                },
                {
                    label: "Core Values",
                    value: formatArray(form.core_values),
                    icon: Heart,
                    description: "Fundamental principles that guide the brand"
                }
            ]
        },

        // Website Information
        websiteInfo: {
            title: "Website Information",
            icon: Monitor,
            color: "bg-blue-50 border-blue-200",
            fields: [
                {
                    label: "Has Web Page",
                    value: formatYesNo(form.has_web_page),
                    icon: Monitor,
                    description: "Whether they have a web page"
                },
                {
                    label: "Web Page Upload",
                    value: formatFileUpload(form.web_page_upload),
                    icon: File,
                    description: "Web page files or URL"
                },
                {
                    label: "Want Web Page",
                    value: form.want_web_page || 'Not specified',
                    icon: Monitor,
                    description: "Whether they want a web page or sales funnel"
                }
            ]
        },

        // Social Media Presence
        socialMedia: {
            title: "Social Media Presence",
            icon: Globe,
            color: "bg-cyan-50 border-cyan-200",
            fields: [
                {
                    label: "Has Social Media",
                    value: formatYesNo(form.has_social_media),
                    icon: Globe,
                    description: "Current social media presence"
                },
                {
                    label: "Social Media Platforms",
                    value: formatArray(form.social_media_platforms),
                    icon: Globe,
                    description: "Platforms currently in use"
                },
                {
                    label: "Facebook URL",
                    value: formatUrl(form.facebook_url),
                    icon: Globe,
                    description: "Facebook page URL"
                },
                {
                    label: "Instagram URL",
                    value: formatUrl(form.instagram_url),
                    icon: Camera,
                    description: "Instagram profile URL"
                },
                {
                    label: "Twitter/X URL",
                    value: formatUrl(form.twitter_url),
                    icon: MessageSquare,
                    description: "Twitter/X profile URL"
                },
                {
                    label: "LinkedIn URL",
                    value: formatUrl(form.linkedin_url),
                    icon: Briefcase,
                    description: "LinkedIn profile URL"
                },
                {
                    label: "TikTok URL",
                    value: formatUrl(form.tiktok_url),
                    icon: Video,
                    description: "TikTok profile URL"
                },
                {
                    label: "YouTube URL",
                    value: formatUrl(form.youtube_url),
                    icon: Play,
                    description: "YouTube channel URL"
                },
                {
                    label: "Pinterest URL",
                    value: formatUrl(form.pinterest_url),
                    icon: Image,
                    description: "Pinterest profile URL"
                },
                {
                    label: "Snapchat Username",
                    value: form.snapchat_username || 'Not provided',
                    icon: Camera,
                    description: "Snapchat username"
                },
                {
                    label: "Other Social Media URLs",
                    value: form.other_social_media_urls || 'Not provided',
                    icon: Globe,
                    isLongText: true,
                    description: "Other social media platforms and URLs"
                },
                {
                    label: "Want to Create Social Media",
                    value: form.want_to_create_social_media || 'Not specified',
                    icon: Globe,
                    description: "Whether they want to create social media accounts"
                },
                {
                    label: "Desired Social Media Platforms",
                    value: formatArray(form.desired_social_media_platforms),
                    icon: Globe,
                    description: "Social media platforms they want to create"
                }
            ]
        },

        // Collaboration & Wrap-Up
        collaborationWrapUp: {
            title: "Collaboration & Wrap-Up",
            icon: Users,
            color: "bg-slate-50 border-slate-200",
            fields: [
                {
                    label: "Main Point of Contact",
                    value: form.main_contact || 'Not provided',
                    icon: Users,
                    description: "Primary contact person"
                },
                {
                    label: "Additional Information",
                    value: form.additional_info || 'Not provided',
                    icon: FileText,
                    isLongText: true,
                    description: "Any additional information or special requirements"
                },
                {
                    label: "Collaboration References",
                    value: formatFileUpload(form.collaboration_references),
                    icon: File,
                    description: "Reference files or links for collaboration"
                }
            ]
        }
    });

    // OrganizationForm specific sections (organization type)
    const getOrganizationFormSections = (form) => ({
        // Basic Contact Information
        contactInfo: {
            title: "Contact Information",
            icon: Users,
            color: "bg-blue-50 border-blue-200",
            fields: [
                {
                    label: "Client Name",
                    value: form.user_fullname || 'Not provided',
                    icon: Users,
                    description: "The person who submitted this form"
                },
                {
                    label: "Business Email",
                    value: form.business_email || form.user_email || 'No email provided',
                    icon: Mail,
                    description: "Primary contact email"
                },
                {
                    label: "Form Submitted",
                    value: formatDate(form.created_at),
                    icon: Calendar,
                    description: "When this form was completed"
                }
            ]
        },

        // Business Information
        businessInfo: {
            title: "Organization Details",
            icon: Building,
            color: "bg-green-50 border-green-200",
            fields: [
                {
                    label: "What Are You Building",
                    value: form.building_type === 'organization' ? 'Organization/Brand/Page' : form.building_type || 'Not specified',
                    icon: Building,
                    description: "Type of entity being built"
                }
            ]
        },

        // Organization & Campaign Details
        organizationInfo: {
            title: "Organization & Campaign Details",
            icon: Flag,
            color: "bg-violet-50 border-violet-200",
            fields: [
                {
                    label: "Organization Name",
                    value: form.organization_name || 'Not provided',
                    icon: Building,
                    description: "Name of the organization, brand, or page"
                },
                {
                    label: "Social Media Goals",
                    value: form.social_media_goals || 'Not provided',
                    icon: Target,
                    isLongText: true,
                    description: "Social media goals and target audience"
                },
                {
                    label: "Brand Uniqueness",
                    value: form.brand_uniqueness || 'Not provided',
                    icon: Sparkles,
                    isLongText: true,
                    description: "What makes the brand unique and how it should sound online"
                },
                {
                    label: "Desired Emotional Response",
                    value: form.desired_emotion || 'Not specified',
                    icon: Heart,
                    description: "How customers should feel about the brand"
                }
            ]
        },

        // Platform & Content Focus
        platformContent: {
            title: "Platform & Content Focus",
            icon: Globe,
            color: "bg-cyan-50 border-cyan-200",
            fields: [
                {
                    label: "Target Platforms",
                    value: formatArray(form.target_platforms),
                    icon: Globe,
                    description: "Social media platforms to focus on"
                },
                {
                    label: "Content Types",
                    value: formatArray(form.content_types),
                    icon: Video,
                    description: "Types of content to prioritize"
                }
            ]
        },

        // Deliverables & Timeline
        deliverablesTimeline: {
            title: "Deliverables & Timeline",
            icon: FileText,
            color: "bg-emerald-50 border-emerald-200",
            fields: [
                {
                    label: "Deliverables",
                    value: formatArray(form.deliverables),
                    icon: FileText,
                    description: "What needs to be created"
                },
                {
                    label: "Timeline",
                    value: form.timeline || 'Not specified',
                    icon: Clock,
                    description: "Expected completion timeframe"
                }
            ]
        },

        // Collaboration & Wrap-Up
        collaborationWrapUp: {
            title: "Collaboration & Wrap-Up",
            icon: Users,
            color: "bg-slate-50 border-slate-200",
            fields: [
                {
                    label: "Main Point of Contact",
                    value: form.main_contact || 'Not provided',
                    icon: Users,
                    description: "Primary contact person"
                },
                {
                    label: "Additional Information",
                    value: form.additional_info || 'Not provided',
                    icon: FileText,
                    isLongText: true,
                    description: "Any additional information or special requirements"
                },
                {
                    label: "Reference Materials",
                    value: formatFileUpload(form.reference_materials),
                    icon: File,
                    description: "Reference files or links for collaboration"
                }
            ]
        }
    });

    // Get form-specific sections based on form type
    const sections = getFormSections(formType);

    // Filter sections based on form type (show all relevant sections regardless of data)
    const filteredSections = {};

    // Debug logging for form type detection
    console.log('formatFormData - Form type detected:', formType);
    console.log('formatFormData - All available sections:', Object.keys(sections));

    Object.entries(sections).forEach(([key, section]) => {
        // Filter sections based on form type only
        let shouldInclude = false;

        if (formType === 'business') {
            // For KnowingYouForm, include all business-specific sections
            const businessSections = [
                'contactInfo', 'businessInfo', 'targetAudience', 'teamCulture',
                'brandIdentity', 'visualPreferences', 'businessGoals', 'collateralNeeds',
                'missionVisionValues', 'socialMedia', 'websiteInfo', 'collaborationWrapUp'
            ];
            shouldInclude = businessSections.includes(key);
        } else if (formType === 'product') {
            // For BrandKitQuestionnaire, include all product-specific sections
            const productSections = [
                'contactInfo', 'businessInfo', 'productInfo', 'targetAudience',
                'competitiveLandscape', 'brandIdentity', 'visualPreferences',
                'applicationsUseCases', 'technicalDeliverables', 'inspirationReferences',
                'socialMedia', 'websiteInfo', 'missionVisionValues', 'collaborationWrapUp'
            ];
            shouldInclude = productSections.includes(key);
        } else if (formType === 'organization') {
            // For OrganizationForm, include all organization-specific sections
            const organizationSections = [
                'contactInfo', 'businessInfo', 'organizationInfo', 'platformContent',
                'deliverablesTimeline', 'socialMedia', 'websiteInfo', 'collaborationWrapUp'
            ];
            shouldInclude = organizationSections.includes(key);
        } else {
            // If no form type detected, show all sections as fallback
            shouldInclude = true;
            console.log('formatFormData - No form type detected, showing all sections');
        }

        if (shouldInclude) {
            filteredSections[key] = section;
        }
    });

    console.log('formatFormData - Final filtered sections:', Object.keys(filteredSections));

    return filteredSections;
};

const FormDetailsView = ({ form, onClose, onExport, exporting }) => {
    // Debug logging to see what form data we're receiving
    console.log('FormDetailsView - Received form data:', form);
    console.log('FormDetailsView - Form type (snake_case):', form.building_type);
    console.log('FormDetailsView - Form type (camelCase):', form.buildingType);
    console.log('FormDetailsView - Form type (final):', form.building_type || form.buildingType || form.form_type);

    const formattedData = formatFormData(form);
    console.log('FormDetailsView - Formatted data:', formattedData);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {form.form_name || 'BrandKit Form'} Details
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Complete form information and client requirements
                            </p>
                        </div>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
                        >
                            ✕
                        </Button>
                    </div>

                    {/* Formatted Data Sections */}
                    <div className="space-y-6">
                        {Object.keys(formattedData).length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                        No Form Sections Found
                                    </h3>
                                    <p className="text-yellow-700 mb-4">
                                        The form sections could not be determined. This might be due to missing form type or data.
                                    </p>
                                    <div className="text-sm text-yellow-600 text-left">
                                        <p><strong>Form Type Detected:</strong> {form.building_type || form.buildingType || form.form_type || 'None'}</p>
                                        <p><strong>Form Keys Available:</strong> {Object.keys(form).join(', ') || 'None'}</p>
                                        <p><strong>Form Data:</strong> {JSON.stringify(form, null, 2)}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            Object.entries(formattedData).map(([sectionKey, section]) => {
                                const SectionIcon = section.icon;
                                return (
                                    <div key={sectionKey} className={`border-2 ${section.color} rounded-2xl p-6`}>
                                        <div className="flex items-center mb-4">
                                            <SectionIcon className="w-5 h-5 mr-2 text-gray-700" />
                                            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {section.fields.map((field, index) => {
                                                const FieldIcon = field.icon;
                                                return (
                                                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                                                        <div className="flex items-start mb-2">
                                                            <FieldIcon className="w-4 h-4 mr-2 text-gray-600 mt-0.5 flex-shrink-0" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-700">{field.label}</p>
                                                                {field.description && (
                                                                    <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={`${field.isLongText ? 'max-h-32 overflow-y-auto' : ''}`}>
                                                            {typeof field.value === 'string' ? (
                                                                <p className={`text-gray-900 ${field.isLongText ? 'text-sm leading-relaxed' : 'font-medium'}`}>
                                                                    {field.value}
                                                                </p>
                                                            ) : (
                                                                <div className="text-gray-900">
                                                                    {field.value}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* Raw Data Section (Collapsible) */}
                        <div className="border-t pt-6">
                            <details className="group">
                                <summary className="flex items-center cursor-pointer text-lg font-semibold text-gray-900 mb-4">
                                    <FileTextIcon className="w-5 h-5 mr-2 text-gray-600" />
                                    Technical Data (For Developers)
                                    <span className="ml-auto text-sm text-gray-500 group-open:rotate-180 transition-transform">
                                        ▼
                                    </span>
                                </summary>
                                <div className="bg-gray-50 rounded-2xl p-4 max-h-96 overflow-y-auto">
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {JSON.stringify(form, null, 2)}
                                    </pre>
                                </div>
                            </details>
                        </div>

                        <div className="flex space-x-3 pt-6 border-t">
                            <Button
                                onClick={() => onExport(form, 'pdf')}
                                disabled={exporting}
                                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export as PDF
                            </Button>
                            <Button
                                onClick={() => onExport(form, 'json')}
                                disabled={exporting}
                                variant="outline"
                                className="border-2 border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-2xl font-semibold"
                            >
                                <FileTextIcon className="w-4 h-4 mr-2" />
                                Export as JSON
                            </Button>
                            <Button
                                onClick={() => onExport(form, 'csv')}
                                disabled={exporting}
                                variant="outline"
                                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100 px-6 py-3 rounded-2xl font-semibold"
                            >
                                <FileDown className="w-4 h-4 mr-2" />
                                Export as CSV
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetailsView;
