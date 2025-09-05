import {
    Users, Mail, Phone, MapPin, Calendar, Building, TrendingUp, Package, FileText,
    Target, Lightbulb, Heart, Star, Palette, Type, Image, Globe, Award, Download,
    FileText as FileTextIcon, FileDown, Eye, MessageSquare, Zap, Shield, Layers,
    Clock, CheckCircle, AlertCircle, Briefcase, Smile, Compass, Camera, Video,
    Music, BookOpen, Flag, DollarSign, BarChart3, Users2, Sparkles, FileImage,
    Link, Hash, AtSign, Play, Mic, PenTool, Layout, Smartphone, Monitor, Printer,
    Gift, File, Settings, Monitor as MonitorIcon
} from 'lucide-react';

// Helper function to format arrays and handle empty values
const formatArray = (value) => {
    if (!value) return 'Not specified';
    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'Not specified';
    }
    return value;
};

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

// Helper function to format file uploads
const formatFileUpload = (files) => {
    if (!files) return 'No files uploaded';
    if (Array.isArray(files)) {
        return files.length > 0 ? files.join(', ') : 'No files uploaded';
    }
    return files;
};

// Main function to format form data for display
export const formatFormData = (form) => {
    const sections = {
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

        // Business/Organization Information
        businessInfo: {
            title: "Business & Organization Details",
            icon: Building,
            color: "bg-green-50 border-green-200",
            fields: [
                {
                    label: "What Are You Building",
                    value: form.building_type ?
                        (form.building_type === 'business' ? 'Business/Company' :
                            form.building_type === 'product' ? 'Specific Product/Service' :
                                form.building_type === 'organization' ? 'Organization/Brand/Page' :
                                    form.building_type) : 'Not specified',
                    icon: Building,
                    description: "Type of entity being built"
                },
                {
                    label: "Business/Organization Name",
                    value: form.business_name || form.organization_name || form.brand_name || 'Not provided',
                    icon: Building,
                    description: "Official business or organization name"
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
                    label: "Year Officially Started",
                    value: form.year_started || 'Not specified',
                    icon: Calendar,
                    description: "When the business was founded"
                },
                {
                    label: "Business Stage",
                    value: form.business_stage || form.product_stage || 'Not specified',
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

        // Product/Service Specific Information (BrandKit Questionnaire)
        productInfo: {
            title: "Product/Service Details",
            icon: Package,
            color: "bg-purple-50 border-purple-200",
            fields: [
                {
                    label: "Offering Type",
                    value: form.offering_type ? 
                        (form.offering_type === 'product' ? 'Product' : 'Service') : 'Not specified',
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
                    value: formatArray(form.primary_customers || form.current_customers),
                    icon: Users,
                    description: "Main customer base and target market"
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
                },
                {
                    label: "Unfair Advantage",
                    value: form.unfair_advantage || 'Not provided',
                    icon: Zap,
                    isLongText: true,
                    description: "Unique competitive advantage"
                },
                {
                    label: "If Brand Disappeared, What Would Customers Miss",
                    value: form.customer_miss || 'Not provided',
                    icon: Heart,
                    isLongText: true,
                    description: "What customers would miss most"
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
                    label: "Brand Voice",
                    value: formatArray(form.brand_voice),
                    icon: Mic,
                    description: "How the brand would speak if it were a person"
                },
                {
                    label: "Communication Perception",
                    value: formatArray(form.communication_perception),
                    icon: MessageSquare,
                    description: "How audience should perceive communications"
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
                    value: form.existing_colors || 'Not provided',
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
                    value: form.colors_to_avoid || 'Not provided',
                    icon: AlertCircle,
                    description: "Colors that don't fit the brand"
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
                    label: "Legal Considerations",
                    value: form.legal_considerations || 'Not provided',
                    icon: Shield,
                    isLongText: true,
                    description: "Brand compliance or legal considerations"
                },
                {
                    label: "Design Inspiration",
                    value: formatFileUpload(form.inspiration_links),
                    icon: FileImage,
                    description: "Design inspiration files or links"
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
                },
                {
                    label: "Brand Elements Needed",
                    value: formatArray(form.brand_elements),
                    icon: Layers,
                    description: "Brand elements required"
                },
                {
                    label: "Required Formats",
                    value: formatArray(form.required_formats),
                    icon: File,
                    description: "Specific file formats required"
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
                },
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

        // Organization Form Specific Fields
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
                },
                {
                    label: "Deliverables",
                    value: formatArray(form.deliverables),
                    icon: FileText,
                    description: "What needs to be created"
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
                    value: form.mission_statement || form.mission || 'Not provided',
                    icon: Target,
                    isLongText: true,
                    description: "The brand's purpose and mission"
                },
                {
                    label: "Long-term Vision",
                    value: form.long_term_vision || form.vision || 'Not specified',
                    icon: Lightbulb,
                    isLongText: true,
                    description: "Long-term vision and aspirations"
                },
                {
                    label: "Core Values",
                    value: formatArray(form.core_values),
                    icon: Heart,
                    description: "Fundamental principles that guide the brand"
                },
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
                    value: form.additional_info || form.special_notes || 'Not provided',
                    icon: FileText,
                    isLongText: true,
                    description: "Any additional information or special requirements"
                },
                {
                    label: "Collaboration References",
                    value: formatFileUpload(form.collaboration_references),
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
    };

    // Filter out sections that have no meaningful data
    const filteredSections = {};
    Object.entries(sections).forEach(([key, section]) => {
        const hasData = section.fields.some(field =>
            field.value && 
            field.value !== 'Not provided' && 
            field.value !== 'Not specified' && 
            field.value !== 'No files uploaded' &&
            field.value !== 'No email provided'
        );
        if (hasData) {
            filteredSections[key] = section;
        }
    });

    return filteredSections;
};
