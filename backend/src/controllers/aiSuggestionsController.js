const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Field type definitions and their characteristics
const FIELD_TYPES = {
  // Tag fields - should return comma-separated tags
  TAG_FIELDS: [
    'industry', 'coreValues', 'brandPersonality', 'targetInterests', 
    'currentInterests', 'audienceBehavior', 'spendingHabits', 
    'targetProfessions', 'reachLocations', 'ageGroups', 'currentCustomers',
    'logoAction', 'preferredColors', 'colorsToAvoid', 'fontStyles', 
    'designStyle', 'logoType', 'imageryStyle', 'brandKitUse', 
    'brandElements', 'fileFormats', 'interactionMethods', 'successMetrics',
    'cultureWords', 'brandTone',
    // OrganizationForm specific fields
    'targetPlatforms', 'contentTypes', 'deliverables',
    // BrandKit Questionnaire specific fields
    'competitors', 'brandKitUse', 'templates', 'internalAssets', 'fileFormats',
    'brandVoice', 'communicationPerception', 'imageryStyle', 'fontTypes', 'fontStyles',
    'sourceFiles', 'requiredFormats', 'brandVibe', 'brandWords', 'brandAvoidWords'
  ],
  
  // Short text fields - brief, concise responses
  SHORT_TEXT_FIELDS: [
    'businessName', 'businessEmail', 'contactNumber', 'yearStarted',
    'reason1', 'reason2', 'reason3', 'brandSoul', 'primaryGoal',
    'longTermGoal', 'timeline', 'approver', 'buildingType',
    'hasProventousId', 'proventousId', 'preferredContact', 'businessDescription', 'businessStage',
    'desiredEmotion', 'spendingType', 'hasLogo',
    // ProductService specific fields
    'productName', 'productDescription',
    // OrganizationForm specific fields
    'organizationName', 'mainContact',
    // BrandKit Questionnaire specific fields
    'brandName', 'brandDescription', 'inspirationBrand', 'tagline'
  ],
  
  // Long text fields - detailed, conversational responses
  LONG_TEXT_FIELDS: [
    'missionStatement', 'visionStatement', 'brandDescription', 
    'wantToAttract', 'secondaryAudience', 'teamDescription',
    'customerChallenges', 'purchaseMotivators', 'cultureDescription',
    'teamTraditions', 'behindBrand', 'inspiration', 'brand1', 'brand2', 
    'brand3', 'brandAvoid', 'shortTermGoals', 'midTermGoals', 
    'bigPictureVision', 'customerChoice', 
    'teamHighlights', 'specialNotes', 'inspirationLinks', 
    'referenceMaterials',
    // ProductService specific fields
    'missionStory', 'targetAudienceProfile', 'competitors',
    // OrganizationForm specific fields
    'socialMediaGoals', 'brandUniqueness', 'additionalInfo',
    // BrandKit Questionnaire specific fields
    'primaryCustomers', 'unfairAdvantage', 'customerMiss', 'problemSolved',
    'competitorLikes', 'competitorDislikes', 'brandDifferentiation',
    'admiredBrands', 'inspirationBrands', 'legalConsiderations', 'mission', 'vision'
  ]
};

// Context extraction helpers
const extractBusinessContext = (formData) => {
  const context = {
    businessType: formData.buildingType || 'business',
    businessName: formData.businessName || '',
    industry: Array.isArray(formData.industry) ? formData.industry.join(', ') : formData.industry || '',
    yearStarted: formData.yearStarted || '',
    businessStage: formData.businessStage || '',
    mission: formData.missionStatement || '',
    vision: formData.visionStatement || '',
    coreValues: Array.isArray(formData.coreValues) ? formData.coreValues.join(', ') : formData.coreValues || '',
    targetAudience: formData.wantToAttract || '',
    brandPersonality: Array.isArray(formData.brandPersonality) ? formData.brandPersonality.join(', ') : formData.brandPersonality || '',
    currentCustomers: Array.isArray(formData.currentCustomers) ? formData.currentCustomers.join(', ') : formData.currentCustomers || '',
    spendingType: formData.spendingType || '',
    desiredEmotion: formData.desiredEmotion || '',
    brandDescription: formData.brandDescription || '',
    behindBrand: formData.behindBrand || '',
    inspiration: formData.inspiration || '',
    primaryGoal: formData.primaryGoal || '',
    longTermGoal: formData.longTermGoal || '',
    // ProductService specific context
    productName: formData.productName || '',
    productDescription: formData.productDescription || '',
    missionStory: formData.missionStory || '',
    targetAudienceProfile: formData.targetAudienceProfile || '',
    competitors: formData.competitors || '',
    brandTone: formData.brandTone || '',
    designStyle: Array.isArray(formData.designStyle) ? formData.designStyle.join(', ') : formData.designStyle || '',
    preferredColors: Array.isArray(formData.preferredColors) ? formData.preferredColors.join(', ') : formData.preferredColors || '',
    colorsToAvoid: Array.isArray(formData.colorsToAvoid) ? formData.colorsToAvoid.join(', ') : formData.colorsToAvoid || '',
    brandKitUse: Array.isArray(formData.brandKitUse) ? formData.brandKitUse.join(', ') : formData.brandKitUse || '',
    brandElements: Array.isArray(formData.brandElements) ? formData.brandElements.join(', ') : formData.brandElements || '',
    fileFormats: Array.isArray(formData.fileFormats) ? formData.fileFormats.join(', ') : formData.fileFormats || '',
    platformSupport: Array.isArray(formData.platformSupport) ? formData.platformSupport.join(', ') : formData.platformSupport || '',
    timeline: formData.timeline || '',
    primaryLocation: formData.primaryLocation || '',
    preferredContact: formData.preferredContact || '',
    approver: formData.approver || '',
    specialNotes: formData.specialNotes || '',
    // OrganizationForm specific context
    organizationName: formData.organizationName || '',
    socialMediaGoals: formData.socialMediaGoals || '',
    brandUniqueness: formData.brandUniqueness || '',
    targetPlatforms: Array.isArray(formData.targetPlatforms) ? formData.targetPlatforms.join(', ') : formData.targetPlatforms || '',
    contentTypes: Array.isArray(formData.contentTypes) ? formData.contentTypes.join(', ') : formData.contentTypes || '',
    deliverables: Array.isArray(formData.deliverables) ? formData.deliverables.join(', ') : formData.deliverables || '',
    mainContact: formData.mainContact || '',
    additionalInfo: formData.additionalInfo || '',
    // BrandKit Questionnaire specific context
    brandName: formData.brandName || '',
    brandDescription: formData.brandDescription || '',
    primaryCustomers: formData.primaryCustomers || '',
    unfairAdvantage: formData.unfairAdvantage || '',
    customerMiss: formData.customerMiss || '',
    problemSolved: formData.problemSolved || '',
    competitorLikes: formData.competitorLikes || '',
    competitorDislikes: formData.competitorDislikes || '',
    brandDifferentiation: formData.brandDifferentiation || '',
    admiredBrands: formData.admiredBrands || '',
    inspirationBrand: formData.inspirationBrand || '',
    communicationPerception: Array.isArray(formData.communicationPerception) ? formData.communicationPerception.join(', ') : formData.communicationPerception || '',
    brandLogo: formData.brandLogo || '',
    logoRedesign: formData.logoRedesign || '',
    hasExistingColors: formData.hasExistingColors || '',
    existingColors: formData.existingColors || '',
    preferredColors: formData.preferredColors || '',
    colorsToAvoid: formData.colorsToAvoid || '',
    imageryStyle: Array.isArray(formData.imageryStyle) ? formData.imageryStyle.join(', ') : formData.imageryStyle || '',
    fontTypes: Array.isArray(formData.fontTypes) ? formData.fontTypes.join(', ') : formData.fontTypes || '',
    fontStyles: Array.isArray(formData.fontStyles) ? formData.fontStyles.join(', ') : formData.fontStyles || '',
    legalConsiderations: formData.legalConsiderations || '',
    sourceFiles: Array.isArray(formData.sourceFiles) ? formData.sourceFiles.join(', ') : formData.sourceFiles || '',
    requiredFormats: Array.isArray(formData.requiredFormats) ? formData.requiredFormats.join(', ') : formData.requiredFormats || '',
    referenceMaterials: formData.referenceMaterials || '',
    inspirationBrands: formData.inspirationBrands || '',
    brandVibe: Array.isArray(formData.brandVibe) ? formData.brandVibe.join(', ') : formData.brandVibe || '',
    brandWords: Array.isArray(formData.brandWords) ? formData.brandWords.join(', ') : formData.brandWords || '',
    brandAvoidWords: Array.isArray(formData.brandAvoidWords) ? formData.brandAvoidWords.join(', ') : formData.brandAvoidWords || '',
    tagline: formData.tagline || '',
    mission: formData.mission || '',
    vision: formData.vision || '',
    coreValues: formData.coreValues || '',
    hasWebPage: formData.hasWebPage || '',
    webPageUpload: formData.webPageUpload || '',
    wantWebPage: formData.wantWebPage || '',
    templates: Array.isArray(formData.templates) ? formData.templates.join(', ') : formData.templates || '',
    internalAssets: Array.isArray(formData.internalAssets) ? formData.internalAssets.join(', ') : formData.internalAssets || '',
    culturalAdaptation: formData.culturalAdaptation || '',
    brandVoice: Array.isArray(formData.brandVoice) ? formData.brandVoice.join(', ') : formData.brandVoice || ''
  };
  
  return context;
};

// Check if we have sufficient context data
const hasSufficientContext = (context) => {
  const requiredFields = ['businessName', 'industry', 'businessType', 'brandName'];
  const hasRequired = requiredFields.some(field => context[field] && context[field].trim() !== '');
  
  const optionalFields = ['mission', 'vision', 'targetAudience', 'brandDescription', 'behindBrand', 'primaryCustomers', 'problemSolved', 'unfairAdvantage', 'inspiration', 'primaryGoal', 'brandPersonality', 'desiredEmotion', 'brandTone', 'designStyle', 'brandKitUse', 'timeline', 'yearStarted'];
  const hasOptional = optionalFields.some(field => context[field] && context[field].trim() !== '');
  
  return hasRequired || hasOptional;
};

// Generate field-specific prompts
const generateFieldPrompt = (fieldName, context, currentValue = '') => {
  const businessContext = extractBusinessContext(context);
  const hasContext = hasSufficientContext(businessContext);
  
  // Base context string
  const contextString = `
Business Context:
- Business Type: ${businessContext.businessType}
- Business Name: ${businessContext.businessName}
- Industry: ${businessContext.industry}
- Year Started: ${businessContext.yearStarted}
- Business Stage: ${businessContext.businessStage}
- Mission: ${businessContext.mission}
- Vision: ${businessContext.vision}
- Core Values: ${businessContext.coreValues}
- Target Audience: ${businessContext.targetAudience}
- Brand Personality: ${businessContext.brandPersonality}
- Current Customers: ${businessContext.currentCustomers}
- Spending Type: ${businessContext.spendingType}
- Desired Emotion: ${businessContext.desiredEmotion}
- Brand Description: ${businessContext.brandDescription}
- Behind Brand: ${businessContext.behindBrand}
- Inspiration: ${businessContext.inspiration}
- Primary Goal: ${businessContext.primaryGoal}
- Long Term Goal: ${businessContext.longTermGoal}
- Product Name: ${businessContext.productName}
- Product Description: ${businessContext.productDescription}
- Mission Story: ${businessContext.missionStory}
- Target Audience Profile: ${businessContext.targetAudienceProfile}
- Competitors: ${businessContext.competitors}
- Brand Tone: ${businessContext.brandTone}
- Design Style: ${businessContext.designStyle}
- Preferred Colors: ${businessContext.preferredColors}
- Colors to Avoid: ${businessContext.colorsToAvoid}
- Brand Kit Use: ${businessContext.brandKitUse}
- Brand Elements: ${businessContext.brandElements}
- File Formats: ${businessContext.fileFormats}
- Platform Support: ${businessContext.platformSupport}
- Timeline: ${businessContext.timeline}
- Primary Location: ${businessContext.primaryLocation}
- Preferred Contact: ${businessContext.preferredContact}
- Approver: ${businessContext.approver}
- Special Notes: ${businessContext.specialNotes}
- Organization Name: ${businessContext.organizationName}
- Social Media Goals: ${businessContext.socialMediaGoals}
- Brand Uniqueness: ${businessContext.brandUniqueness}
- Target Platforms: ${businessContext.targetPlatforms}
- Content Types: ${businessContext.contentTypes}
- Deliverables: ${businessContext.deliverables}
- Main Contact: ${businessContext.mainContact}
- Additional Info: ${businessContext.additionalInfo}
- Brand Name: ${businessContext.brandName}
- Brand Description: ${businessContext.brandDescription}
- Primary Customers: ${businessContext.primaryCustomers}
- Unfair Advantage: ${businessContext.unfairAdvantage}
- Customer Miss: ${businessContext.customerMiss}
- Problem Solved: ${businessContext.problemSolved}
- Competitor Likes: ${businessContext.competitorLikes}
- Competitor Dislikes: ${businessContext.competitorDislikes}
- Brand Differentiation: ${businessContext.brandDifferentiation}
- Admired Brands: ${businessContext.admiredBrands}
- Inspiration Brand: ${businessContext.inspirationBrand}
- Communication Perception: ${businessContext.communicationPerception}
- Brand Logo: ${businessContext.brandLogo}
- Logo Redesign: ${businessContext.logoRedesign}
- Has Existing Colors: ${businessContext.hasExistingColors}
- Existing Colors: ${businessContext.existingColors}
- Preferred Colors: ${businessContext.preferredColors}
- Colors to Avoid: ${businessContext.colorsToAvoid}
- Imagery Style: ${businessContext.imageryStyle}
- Font Types: ${businessContext.fontTypes}
- Font Styles: ${businessContext.fontStyles}
- Legal Considerations: ${businessContext.legalConsiderations}
- Source Files: ${businessContext.sourceFiles}
- Required Formats: ${businessContext.requiredFormats}
- Reference Materials: ${businessContext.referenceMaterials}
- Inspiration Brands: ${businessContext.inspirationBrands}
- Brand Vibe: ${businessContext.brandVibe}
- Brand Words: ${businessContext.brandWords}
- Brand Avoid Words: ${businessContext.brandAvoidWords}
- Tagline: ${businessContext.tagline}
- Mission: ${businessContext.mission}
- Vision: ${businessContext.vision}
- Core Values: ${businessContext.coreValues}
- Has Web Page: ${businessContext.hasWebPage}
- Web Page Upload: ${businessContext.webPageUpload}
- Want Web Page: ${businessContext.wantWebPage}
- Templates: ${businessContext.templates}
- Internal Assets: ${businessContext.internalAssets}
- Cultural Adaptation: ${businessContext.culturalAdaptation}
- Brand Voice: ${businessContext.brandVoice}
`;

  // Field-specific prompts with fallback strategies
  const fieldPrompts = {
    // Mission Statement
    missionStatement: hasContext 
      ? `Based on the business context, write a compelling mission statement that captures the essence of what this business does and why it exists. Make it inspiring and authentic.`
      : `Write a compelling mission statement for a business. Focus on creating value, serving customers, and making a positive impact. Make it inspiring and authentic.`,
    
    // Vision Statement
    visionStatement: hasContext
      ? `Based on the business context, write a revolutionary vision statement that imagines how this business could fundamentally transform the world. Think beyond current limitations and imagine the most audacious, world-changing possibilities. Consider how emerging technologies (AI, quantum computing, biotechnology, space exploration, renewable energy, etc.) could amplify this business's impact. Imagine how this business could solve global challenges, create new industries, or change human behavior on a massive scale. Consider the ripple effects - how this business could inspire other companies, influence policy, or create entirely new markets. Focus on the 10-20 year horizon and imagine the most ambitious, transformative future possible. Make it inspiring, bold, and revolutionary.`
      : `Write a revolutionary vision statement that imagines how a business could fundamentally transform the world. Think beyond current limitations and imagine the most audacious, world-changing possibilities. Consider how emerging technologies (AI, quantum computing, biotechnology, space exploration, renewable energy, etc.) could amplify a business's impact. Imagine how a business could solve global challenges, create new industries, or change human behavior on a massive scale. Consider the ripple effects - how a business could inspire other companies, influence policy, or create entirely new markets. Focus on the 10-20 year horizon and imagine the most ambitious, transformative future possible. Make it inspiring, bold, and revolutionary.`,
    
    // Business Description
    businessDescription: hasContext
      ? `Based on the business context, write a concise, powerful one-sentence description of what this business does. Make it memorable and compelling.`
      : `Write a concise, powerful one-sentence description of what a business does. Focus on the core value proposition and make it memorable and compelling.`,
    
    // ProductService specific fields
    productDescription: hasContext
      ? `Based on the business context, write a one sentence concise, compelling description of this product or service. Focus on the core value proposition, what it does, and who it's for. Make it memorable and engaging.`
      : `Write a one sentence concise, compelling description of a product or service. Focus on the core value proposition, what it does, and who it's for. Make it memorable and engaging.`,
    
    missionStory: hasContext
      ? `Based on the business context, write a one paragraph compelling story about the problem this product/service solves and what inspired its creation. Focus on the pain points, the solution, and the motivation behind solving this problem. Make it personal and authentic.`
      : `Write a compelling story about the problem a product/service solves and what inspired its creation. Focus on the pain points, the solution, and the motivation behind solving this problem. Make it personal and authentic.`,
    
    targetAudienceProfile: hasContext
      ? `Based on the business context, describe the specific types of people this product/service is designed for. Include demographics, psychographics, behaviors, and pain points. Be detailed and specific about who would benefit most from this solution.`
      : `Describe the specific types of people a product/service is designed for. Include demographics, psychographics, behaviors, and pain points. Be detailed and specific about who would benefit most from this solution.`,
    
    competitors: hasContext
      ? `Based on the business context, describe the competitive landscape and similar products/services in the market. Focus on direct competitors, their strengths and weaknesses, and how this product/service differentiates itself.`
      : `Describe the competitive landscape and similar products/services in the market. Focus on direct competitors, their strengths and weaknesses, and how a product/service might differentiate itself.`,
    
    // Target Audience
    wantToAttract: hasContext
      ? `Based on the business context, describe the ideal target audience this business wants to attract. Be specific about demographics, psychographics, and behaviors.`
      : `Describe an ideal target audience for a business. Consider demographics, psychographics, behaviors, and pain points. Be specific and actionable.`,
    
    // Core Values
    coreValues: hasContext
      ? `Based on the business context, suggest 3-5 core values that would guide this business. Return only the values as comma-separated tags.`
      : `Suggest 3-5 core values that would guide a successful business. Focus on integrity, customer focus, innovation, and excellence. Return only the values as comma-separated tags.`,
    
    // Brand Personality
    brandPersonality: hasContext
      ? `Based on the business context, suggest 3-5 personality traits that describe how this brand should come across. Return only the traits as comma-separated tags.`
      : `Suggest 3-5 personality traits that describe how a professional brand should come across. Focus on trustworthiness, approachability, and expertise. Return only the traits as comma-separated tags.`,
    
    // Industry
    industry: hasContext
      ? `Based on the business context, suggest relevant industry categories or niches. Return only the industries as comma-separated tags.`
      : `Suggest relevant industry categories for a business. Consider technology, healthcare, finance, retail, education, and professional services. Return only the industries as comma-separated tags.`,
    
    // Target Interests
    targetInterests: hasContext
      ? `Based on the business context, suggest interests and lifestyle traits of the target audience. Return only the interests as comma-separated tags.`
      : `Suggest interests and lifestyle traits of a professional target audience. Consider technology, business, personal development, and lifestyle interests. Return only the interests as comma-separated tags.`,
    
    // Current Interests
    currentInterests: hasContext
      ? `Based on the business context, suggest interests and lifestyle traits of current customers. Return only the interests as comma-separated tags.`
      : `Suggest interests and lifestyle traits of current business customers. Consider professional development, technology, and business interests. Return only the interests as comma-separated tags.`,
    
    // Audience Behavior
    audienceBehavior: hasContext
      ? `Based on the business context, suggest behavioral patterns of the target audience. Return only the behaviors as comma-separated tags.`
      : `Suggest behavioral patterns of a professional target audience. Consider online research, social media usage, and decision-making behaviors. Return only the behaviors as comma-separated tags.`,
    
    // Spending Habits
    spendingHabits: hasContext
      ? `Based on the business context, suggest spending behavior patterns. Return only the habits as comma-separated tags.`
      : `Suggest spending behavior patterns for business customers. Consider value-conscious, quality-focused, and research-oriented behaviors. Return only the habits as comma-separated tags.`,
    
    // Target Professions
    targetProfessions: hasContext
      ? `Based on the business context, suggest professional roles or job titles to target. Return only the professions as comma-separated tags.`
      : `Suggest professional roles or job titles to target. Consider executives, managers, entrepreneurs, and professionals. Return only the professions as comma-separated tags.`,
    
    // Reach Locations
    reachLocations: hasContext
      ? `Based on the business context, suggest platforms or locations where the target audience can be reached. Return only the locations as comma-separated tags.`
      : `Suggest platforms or locations where a professional target audience can be reached. Consider LinkedIn, industry events, and professional networks. Return only the locations as comma-separated tags.`,
    
    // Age Groups
    ageGroups: hasContext
      ? `Based on the business context, suggest relevant age groups to target. Return only the age groups as comma-separated tags.`
      : `Suggest relevant age groups for a business target audience. Consider young professionals, mid-career professionals, and experienced executives. Return only the age groups as comma-separated tags.`,
    
    // Current Customers
    currentCustomers: hasContext
      ? `Based on the business context, suggest types of current customers. Return only the customer types as comma-separated tags.`
      : `Suggest types of current business customers. Consider small businesses, enterprises, startups, and professionals. Return only the customer types as comma-separated tags.`,
    
    // Culture Words
    cultureWords: hasContext
      ? `Based on the business context, suggest 3 words that describe the company culture. Return only the words as comma-separated tags.`
      : `Suggest 3 words that describe a positive company culture. Focus on collaboration, innovation, and growth. Return only the words as comma-separated tags.`,
    
    // Brand Soul
    brandSoul: hasContext
      ? `Based on the business context, describe the soul of this brand in one powerful word or short phrase. What is the essence, spirit, or core identity that makes this brand unique?`
      : `Describe the soul of a brand in one powerful word or short phrase. What is the essence, spirit, or core identity that makes a brand unique?`,
    
    // Brand Tone
    brandTone: hasContext
      ? `Based on the business context, suggest 4-5 tone of voice characteristics. Return only the tone traits as comma-separated tags.`
      : `Suggest tone of voice characteristics for a professional brand. Focus on trustworthy, friendly, and authoritative traits. Return only the tone traits as comma-separated tags.`,
    
    // Design Style
    designStyle: hasContext
      ? `Based on the business context, suggest 4-5 visual design styles. Return only the styles as comma-separated tags.`
      : `Suggest visual design styles for a professional brand. Consider modern, clean, and professional approaches. Return only the styles as comma-separated tags.`,
    
    // Logo Type
    logoType: hasContext
      ? `Based on the business context, suggest logo design types. Return only the types as comma-separated tags.`
      : `Suggest logo design types for a professional business. Consider wordmark, symbol, and combination approaches. Return only the types as comma-separated tags.`,
    
    // Font Styles
    fontStyles: hasContext
      ? `Based on the business context, suggest typography styles. Return only the styles as comma-separated tags.`
      : `Suggest typography styles for a professional brand. Consider sans-serif, serif, and modern typefaces. Return only the styles as comma-separated tags.`,
    
    // Imagery Style
    imageryStyle: hasContext
      ? `Based on the business context, suggest visual imagery styles. Return only the styles as comma-separated tags.`
      : `Suggest visual imagery styles for a professional brand. Consider photography, illustration, and abstract approaches. Return only the styles as comma-separated tags.`,
    
    // Brand Kit Use
    brandKitUse: hasContext
      ? `Based on the business context, suggest where the brand kit will be used. Return only the uses as comma-separated tags.`
      : `Suggest where a brand kit will be used. Consider website, social media, print materials, and business cards. Return only the uses as comma-separated tags.`,
    
    // Brand Elements
    brandElements: hasContext
      ? `Based on the business context, suggest brand elements needed. Return only the elements as comma-separated tags.`
      : `Suggest brand elements needed for a professional business. Consider logo, color palette, typography, and business cards. Return only the elements as comma-separated tags.`,
    
    // File Formats
    fileFormats: hasContext
      ? `Based on the business context, suggest file formats needed. Return only the formats as comma-separated tags.`
      : `Suggest file formats needed for a brand kit. Consider PNG, JPG, PDF, and vector formats. Return only the formats as comma-separated tags.`,
    
    // Success Metrics
    successMetrics: hasContext
      ? `Based on the business context, suggest key performance indicators. Return only the metrics as comma-separated tags.`
      : `Suggest key performance indicators for a business. Consider revenue growth, customer satisfaction, and brand recognition. Return only the metrics as comma-separated tags.`,
    
    // Interaction Methods
    interactionMethods: hasContext
      ? `Based on the business context, suggest how customers interact with the business. Return only the methods as comma-separated tags.`
      : `Suggest how customers interact with a business. Consider website, phone, email, and social media. Return only the methods as comma-separated tags.`,
    
    // Behind Brand
    behindBrand: hasContext
      ? `Based on the business context, write a compelling story about the people behind this brand. Make it personal and authentic.`
      : `Write a compelling story about the people behind a brand. Focus on passion, expertise, and commitment to customers. Make it personal and authentic.`,
    
    // Inspiration
    inspiration: hasContext
      ? `Based on the business context, write about what inspired the creation of this business. Make it personal and motivating.`
      : `Write about what might inspire the creation of a business. Focus on solving problems, serving customers, and making a difference. Make it personal and motivating.`,
    
    // Customer Challenges
    customerChallenges: hasContext
      ? `Based on the business context, describe the main challenges or problems that customers face that this business solves.`
      : `Describe common challenges that business customers face. Focus on efficiency, cost, quality, and time-related problems.`,
    
    // Purchase Motivators
    purchaseMotivators: hasContext
      ? `Based on the business context, describe what motivates customers to choose this business over competitors.`
      : `Describe what motivates customers to choose a business over competitors. Focus on quality, value, expertise, and customer service.`,
    
    // Customer Choice
    customerChoice: hasContext
      ? `Based on the business context, explain why customers choose this business over competitors.`
      : `Explain why customers choose a business over competitors. Focus on unique value proposition, expertise, and customer experience.`,
    
    // Team Traditions
    teamTraditions: hasContext
      ? `Based on the business context, describe traditions, rituals, or fun activities that could be part of the team culture.`
      : `Describe traditions, rituals, or fun activities that could be part of a positive team culture. Focus on collaboration, celebration, and team building.`,
    
    // Team Highlights
    teamHighlights: hasContext
      ? `Based on the business context, describe highlights and fun aspects of working at this business.`
      : `Describe highlights and fun aspects of working at a business. Focus on growth opportunities, team collaboration, and meaningful work.`,
    
    // Culture Description
    cultureDescription: hasContext
      ? `Based on the business context, describe how the team would describe working at this business.`
      : `Describe how a team would describe working at a business. Focus on positive culture, growth opportunities, and supportive environment.`,
    
    // Brand Ideas
    brand1: hasContext
      ? `Based on the business context, describe a compelling brand concept and why it would work for this business.`
      : `Describe a compelling brand concept for a business. Focus on professionalism, innovation, and customer focus.`,
    brand2: hasContext
      ? `Based on the business context, describe an alternative brand concept and why it could work.`
      : `Describe an alternative brand concept for a business. Focus on different approaches and unique positioning.`,
    brand3: hasContext
      ? `Based on the business context, describe another brand concept option and its benefits.`
      : `Describe another brand concept option for a business. Focus on creative approaches and market opportunities.`,
    
    // Brand Avoid
    brandAvoid: hasContext
      ? `Based on the business context, describe what this brand should avoid being associated with.`
      : `Describe what a professional brand should avoid being associated with. Focus on unprofessional, unethical, or low-quality associations.`,
    
    // Goals
    shortTermGoals: hasContext
      ? `Based on the business context, describe short-term goals for the next 12 months.`
      : `Describe short-term goals for a business in the next 12 months. Focus on growth, customer acquisition, and operational improvements.`,
    midTermGoals: hasContext
      ? `Based on the business context, describe mid-term goals for the next 2-3 years.`
      : `Describe mid-term goals for a business in the next 2-3 years. Focus on market expansion, product development, and team growth.`,
    bigPictureVision: hasContext
      ? `Based on the business context, describe the revolutionary big-picture vision for how this brand could fundamentally transform the world. Think beyond current limitations and imagine the most audacious, world-changing possibilities. Consider how emerging technologies, global megatrends, and societal shifts could amplify this brand's impact. Imagine how this brand could solve humanity's biggest challenges, create entirely new industries, or change human behavior on a massive scale. Consider the ripple effects and second-order consequences of the brand's success. Focus on the 10-20 year horizon and imagine the most ambitious, transformative future possible. Make it inspiring, bold, and revolutionary.`
      : `Describe the revolutionary big-picture vision for how a brand could fundamentally transform the world. Think beyond current limitations and imagine the most audacious, world-changing possibilities. Consider how emerging technologies, global megatrends, and societal shifts could amplify a brand's impact. Imagine how a brand could solve humanity's biggest challenges, create entirely new industries, or change human behavior on a massive scale. Consider the ripple effects and second-order consequences of the brand's success. Focus on the 10-20 year horizon and imagine the most ambitious, transformative future possible. Make it inspiring, bold, and revolutionary.`,
    
    // Special Notes
    specialNotes: hasContext
      ? `Based on the business context, note any special considerations or unique aspects about this business.`
      : `Note any special considerations or unique aspects about a business. Focus on competitive advantages, unique positioning, and market opportunities.`,
    
    // OrganizationForm specific fields
    socialMediaGoals: hasContext
      ? `Based on the business context, write compelling social media goals that align with the organization's mission and target audience. Focus on specific, measurable objectives that drive engagement, awareness, and business growth.`
      : `Write compelling social media goals for an organization. Focus on increasing brand awareness, driving engagement, generating leads, and building community. Be specific about target audience and desired outcomes.`,
    
    brandUniqueness: hasContext
      ? `Based on the business context, describe what makes this brand unique and how it should sound online. Focus on the distinctive voice, personality, and positioning that sets this organization apart from competitors.`
      : `Describe what makes a brand unique and how it should sound online. Focus on distinctive voice, personality, and positioning that sets an organization apart. Consider tone, style, and unique value propositions.`,
    
    targetPlatforms: hasContext
      ? `Based on the business context, suggest the most effective social media platforms for this organization. Consider the target audience, content type, and business goals. Return only the platform names as comma-separated tags.`
      : `Suggest the most effective social media platforms for an organization. Consider Facebook, Instagram, TikTok, YouTube, LinkedIn, Twitter, and Pinterest. Return only the platform names as comma-separated tags.`,
    
    contentTypes: hasContext
      ? `Based on the business context, suggest the most effective content types for this organization's social media strategy. Consider the target platforms, audience preferences, and business objectives. Return only the content types as comma-separated tags.`
      : `Suggest the most effective content types for social media strategy. Consider Short Videos/Reels, Static Graphics, Carousel Posts, Motion Graphics, Long-Form Videos, Stories, and Live Content. Return only the content types as comma-separated tags.`,
    
    deliverables: hasContext
      ? `Based on the business context, suggest the most valuable deliverables for this organization's social media needs. Consider the business goals, available resources, and desired outcomes. Return only the deliverables as comma-separated tags.`
      : `Suggest the most valuable deliverables for social media needs. Consider Social Media Calendar, Ad Creatives, Caption Writing + Hashtags, Video Editing, Graphics Design, Platform Setup/Optimization, and Performance Reports. Return only the deliverables as comma-separated tags.`,
    
    organizationName: hasContext
      ? `Based on the business context, suggest a compelling name for this organization that reflects its mission, values, and target audience. Make it memorable, professional, and aligned with the brand identity.`
      : `Suggest a compelling name for an organization that reflects its mission, values, and target audience. Make it memorable, professional, and aligned with the brand identity.`,
    
    mainContact: hasContext
      ? `Based on the business context, suggest who would be the ideal main point of contact for this organization's social media project. Consider the role, responsibilities, and communication style needed.`
      : `Suggest who would be the ideal main point of contact for an organization's social media project. Consider marketing managers, business owners, or communications directors.`,
    
    additionalInfo: hasContext
      ? `Based on the business context, provide additional insights or considerations that would be valuable for understanding this organization's social media needs. Focus on unique aspects, challenges, or opportunities.`
      : `Provide additional insights or considerations that would be valuable for understanding an organization's social media needs. Focus on unique aspects, challenges, or opportunities.`,
    
    // BrandKit Questionnaire specific fields
    brandName: hasContext
      ? `Based on the business context, suggest a compelling brand name that reflects the brand's personality, values, and target audience. Make it memorable, unique, and aligned with the brand's mission.`
      : `Suggest a compelling brand name that reflects the brand's personality, values, and target audience. Make it memorable, unique, and professional.`,
    
    brandDescription: hasContext
      ? `Based on the business context, write a compelling one-sentence description of this brand that captures its essence, personality, and value proposition. Make it memorable and authentic.`
      : `Write a compelling one-sentence description of a brand that captures its essence, personality, and value proposition. Make it memorable and authentic.`,
    
    primaryCustomers: hasContext
      ? `Based on the business context, describe the primary customers in detail including demographics, psychographics, behaviors, and pain points. Be specific about who this brand serves.`
      : `Describe the primary customers in detail including demographics, psychographics, behaviors, and pain points. Be specific about who the brand serves.`,
    
    unfairAdvantage: hasContext
      ? `Based on the business context, describe what makes this brand unique versus competitors - their 'unfair advantage' that sets them apart in the market.`
      : `Describe what makes a brand unique versus competitors - their 'unfair advantage' that sets them apart in the market.`,
    
    customerMiss: hasContext
      ? `Based on the business context, describe what customers would miss most if this brand disappeared tomorrow. Focus on the emotional and practical value provided.`
      : `Describe what customers would miss most if a brand disappeared tomorrow. Focus on the emotional and practical value provided.`,
    
    problemSolved: hasContext
      ? `Based on the business context, describe the specific problem this brand solves for its customers. Be clear about the pain points and how the brand addresses them.`
      : `Describe the specific problem a brand solves for its customers. Be clear about the pain points and how the brand addresses them.`,
    
    competitors: hasContext
      ? `Based on the business context, suggest the top 3 competitors in this market. Consider direct competitors and similar brands that customers might compare to. Return only the competitor names as comma-separated tags.`
      : `Suggest the top 3 competitors in a market. Consider direct competitors and similar brands that customers might compare to. Return only the competitor names as comma-separated tags.`,
    
    competitorLikes: hasContext
      ? `Based on the business context, describe what aspects of competitor branding are admirable or effective. Focus on design, messaging, and customer experience elements.`
      : `Describe what aspects of competitor branding are admirable or effective. Focus on design, messaging, and customer experience elements.`,
    
    competitorDislikes: hasContext
      ? `Based on the business context, describe what aspects of competitor branding are ineffective or off-putting. Focus on areas where this brand could differentiate.`
      : `Describe what aspects of competitor branding are ineffective or off-putting. Focus on areas where a brand could differentiate.`,
    
    brandDifferentiation: hasContext
      ? `Based on the business context, describe how this brand should stand apart from competitors. Focus on unique positioning, messaging, and visual identity approaches.`
      : `Describe how a brand should stand apart from competitors. Focus on unique positioning, messaging, and visual identity approaches.`,
    
    admiredBrands: hasContext
      ? `Based on the business context, describe which brands are admired for their tone of voice and why. Focus on communication style and brand personality.`
      : `Describe which brands are admired for their tone of voice and why. Focus on communication style and brand personality.`,
    
    inspirationBrand: hasContext
      ? `Based on the business context, suggest an inspiration brand that could be imported or referenced. Consider brands with similar values, audience, or aesthetic.`
      : `Suggest an inspiration brand that could be imported or referenced. Consider brands with similar values, audience, or aesthetic.`,
    
    brandVoice: hasContext
      ? `Based on the business context, suggest 4-5 personality traits that describe how this brand should speak and communicate. Return only the traits as comma-separated tags.`
      : `Suggest 4-5 personality traits that describe how a brand should speak and communicate. Consider formal, casual, witty, professional, playful, authoritative, friendly, sophisticated. Return only the traits as comma-separated tags.`,
    
    communicationPerception: hasContext
      ? `Based on the business context, suggest 4-5 characteristics for how the audience should perceive communications. Return only the characteristics as comma-separated tags.`
      : `Suggest 4-5 characteristics for how the audience should perceive communications. Consider authoritative, friendly, quirky, luxurious, approachable, professional, innovative, trustworthy. Return only the characteristics as comma-separated tags.`,
    
    imageryStyle: hasContext
      ? `Based on the business context, suggest 4-5 visual imagery/photography styles that fit this brand. Return only the styles as comma-separated tags.`
      : `Suggest 4-5 visual imagery/photography styles that fit a brand. Consider minimalist, vibrant, nostalgic, futuristic, natural, bold, elegant, playful, professional. Return only the styles as comma-separated tags.`,
    
    fontTypes: hasContext
      ? `Based on the business context, suggest 3-4 font type preferences. Return only the types as comma-separated tags.`
      : `Suggest 3-4 font type preferences. Consider serif, sans-serif, script, display, monospace. Return only the types as comma-separated tags.`,
    
    fontStyles: hasContext
      ? `Based on the business context, suggest 3-4 font style preferences. Return only the styles as comma-separated tags.`
      : `Suggest 3-4 font style preferences. Consider modern, classic, playful, professional, elegant. Return only the styles as comma-separated tags.`,
    
    legalConsiderations: hasContext
      ? `Based on the business context, describe any brand compliance or legal considerations that should be noted. Consider trademarked elements, restricted iconography, or industry regulations.`
      : `Describe any brand compliance or legal considerations that should be noted. Consider trademarked elements, restricted iconography, or industry regulations.`,
    
    sourceFiles: hasContext
      ? `Based on the business context, suggest 3-4 source file formats needed for deliverables. Return only the formats as comma-separated tags.`
      : `Suggest 3-4 source file formats needed for deliverables. Consider AI, PSD, Figma, Sketch, XD. Return only the formats as comma-separated tags.`,
    
    requiredFormats: hasContext
      ? `Based on the business context, suggest 4-5 specific file formats required for deliverables. Return only the formats as comma-separated tags.`
      : `Suggest 4-5 specific file formats required for deliverables. Consider PNG, SVG, PDF, JPG, EPS, TIFF. Return only the formats as comma-separated tags.`,
    
    inspirationBrands: hasContext
      ? `Based on the business context, describe brands outside this industry that provide inspiration. Focus on brands with similar values, aesthetic, or approach.`
      : `Describe brands outside the industry that provide inspiration. Focus on brands with similar values, aesthetic, or approach.`,
    
    brandVibe: hasContext
      ? `Based on the business context, suggest 4-5 words that describe the 'vibe' this brand is chasing. Return only the words as comma-separated tags.`
      : `Suggest 4-5 words that describe the 'vibe' a brand is chasing. Consider luxury, eco-friendly, tech-forward, approachable, youthful, professional, creative, minimalist, bold. Return only the words as comma-separated tags.`,
    
    brandWords: hasContext
      ? `Based on the business context, suggest 3 words that people should use to describe this brand. Return only the words as comma-separated tags.`
      : `Suggest 3 words that people should use to describe a brand. Consider innovative, trustworthy, creative, professional, friendly, bold, elegant, reliable. Return only the words as comma-separated tags.`,
    
    brandAvoidWords: hasContext
      ? `Based on the business context, suggest 3 words that people should never use to describe this brand. Return only the words as comma-separated tags.`
      : `Suggest 3 words that people should never use to describe a brand. Consider cheap, unreliable, boring, unprofessional, confusing, outdated. Return only the words as comma-separated tags.`,
    
    tagline: hasContext
      ? `Based on the business context, suggest a compelling tagline or slogan that captures the brand's essence and value proposition. Make it memorable and authentic.`
      : `Suggest a compelling tagline or slogan that captures the brand's essence and value proposition. Make it memorable and authentic.`,
    
    mission: hasContext
      ? `Based on the business context, write a compelling mission statement that captures the essence of what this brand does and why it exists. Make it inspiring and authentic.`
      : `Write a compelling mission statement that captures the essence of what a brand does and why it exists. Make it inspiring and authentic.`,
    
    vision: hasContext
      ? `Based on the business context, write a revolutionary vision statement that imagines how this brand could fundamentally transform the world. Think beyond current limitations and imagine the most audacious, world-changing possibilities. Consider how emerging technologies (AI, quantum computing, biotechnology, space exploration, renewable energy, etc.) could amplify this brand's impact. Imagine how this brand could solve global challenges, create new industries, or change human behavior on a massive scale. Consider the ripple effects - how this brand could inspire other companies, influence policy, or create entirely new markets. Focus on the 10-20 year horizon and imagine the most ambitious, transformative future possible. Make it inspiring, bold, and revolutionary.`
      : `Write a revolutionary vision statement that imagines how a brand could fundamentally transform the world. Think beyond current limitations and imagine the most audacious, world-changing possibilities. Consider how emerging technologies (AI, quantum computing, biotechnology, space exploration, renewable energy, etc.) could amplify a brand's impact. Imagine how a brand could solve global challenges, create new industries, or change human behavior on a massive scale. Consider the ripple effects - how a brand could inspire other companies, influence policy, or create entirely new markets. Focus on the 10-20 year horizon and imagine the most ambitious, transformative future possible. Make it inspiring, bold, and revolutionary.`,
    
    coreValues: hasContext
      ? `Based on the business context, suggest 3-5 core values that should always be reflected in this brand. Return only the values as comma-separated tags.`
      : `Suggest 3-5 core values that should always be reflected in a brand. Consider innovation, integrity, excellence, customer-first, collaboration, transparency, sustainability. Return only the values as comma-separated tags.`,
    
    // Default for any other field
    default: hasContext
      ? `Based on the business context, provide a helpful suggestion for ${fieldName}.`
      : `Provide a helpful suggestion for ${fieldName} for a professional business. Focus on best practices and industry standards.`
  };

  const prompt = fieldPrompts[fieldName] || fieldPrompts.default;
  
  // Add special enhancement for vision-related fields
  let visionEnhancement = '';
  if (fieldName === 'vision' || fieldName === 'visionStatement' || fieldName === 'bigPictureVision' || fieldName === 'longlongTermVision') {
    visionEnhancement = `\n\nRevolutionary Vision Enhancement: Consider the following when crafting this world-changing vision:
- Emerging technologies (AI, quantum computing, biotechnology, space exploration, renewable energy, nanotechnology, brain-computer interfaces, etc.)
- Global megatrends (climate change, urbanization, aging populations, digital transformation, etc.)
- How this business could solve humanity's biggest challenges
- Industry disruption and creation of entirely new markets
- The business's potential to influence global policy and societal change
- Ripple effects and second-order consequences of the business's success
- 10-20 year timeframe for maximum transformative impact
- Think beyond current limitations and imagine the most audacious, world-changing possibilities
- Consider how this business could inspire a movement or change human behavior on a massive scale
- Imagine the business's role in shaping the future of humanity and the planet`;
  }
  
  // Add context awareness note
  const contextNote = hasContext 
    ? `\n\nNote: Use the provided business context to create a tailored suggestion.`
    : `\n\nNote: Since limited business context is available, create a general but professional suggestion based on industry best practices.`;
  
  return `${contextString}\n\nTask: ${prompt}${visionEnhancement}${contextNote}`;
};

// Determine field type and format response accordingly
const determineFieldType = (fieldName) => {
  if (FIELD_TYPES.TAG_FIELDS.includes(fieldName)) {
    return 'tag';
  } else if (FIELD_TYPES.SHORT_TEXT_FIELDS.includes(fieldName)) {
    return 'short_text';
  } else if (FIELD_TYPES.LONG_TEXT_FIELDS.includes(fieldName)) {
    return 'long_text';
  }
  return 'long_text'; // default
};

const getAISuggestions = async (req, res) => {
  try {
    const { fieldName, formData } = req.body;

    if (!fieldName) {
      return res.status(400).json({
        success: false,
        message: 'Field name is required'
      });
    }

    // Use form data directly from request body
    let parsedFormData = formData || {};

    console.log(`Generating AI suggestion for field: ${fieldName}`);
    console.log("Form data context:", JSON.stringify(parsedFormData, null, 2));
    
    // Determine field type
    const fieldType = determineFieldType(fieldName);
    
    // Generate contextual prompt
    const prompt = generateFieldPrompt(fieldName, parsedFormData);
    
    // Log context availability
    const businessContext = extractBusinessContext(parsedFormData);
    const hasContext = hasSufficientContext(businessContext);
    console.log(`Context availability for ${fieldName}: ${hasContext ? 'Sufficient' : 'Limited - using fallback strategies'}`);
    
    // System message based on field type
    let systemMessage = '';
    switch (fieldType) {
      case 'tag':
        systemMessage = `You are an expert brand strategist. Generate relevant tags based on the business context. If limited context is available, use industry best practices and professional standards. Return ONLY comma-separated tags without explanations or additional text. Keep it concise and relevant.`;
        break;
      case 'short_text':
        systemMessage = `You are an expert brand strategist. Provide concise, impactful responses that sound natural and human-written. If limited context is available, create professional, general-purpose suggestions that can be customized later. Keep responses brief but compelling.`;
        break;
      case 'long_text':
        systemMessage = `You are an expert brand strategist and revolutionary futurist. Write natural, conversational responses that sound like they were written by a person. Think beyond conventional boundaries and imagine the most audacious, world-changing possibilities - especially for vision statements. Consider how emerging technologies, global megatrends, and societal shifts could create unprecedented opportunities. Imagine how businesses could solve humanity's biggest challenges, create entirely new industries, or change the course of history. If limited context is available, create professional, general-purpose content that follows industry best practices and can be customized. Be authentic, engaging, and avoid giving instructions or advice - just provide the content. Write in a warm, professional tone that inspires and motivates. For vision statements, think like a revolutionary leader who sees possibilities others cannot imagine.`;
        break;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: fieldType === 'tag' ? 100 : fieldType === 'short_text' ? 150 : (fieldName === 'vision' || fieldName === 'visionStatement' || fieldName === 'bigPictureVision') ? 800 : 300,
      temperature: (fieldName === 'vision' || fieldName === 'visionStatement' || fieldName === 'bigPictureVision') ? 0.95 : 0.7,
    });

    let suggestion = completion.choices[0]?.message?.content?.trim();
    
    // Clean up tag responses
    if (fieldType === 'tag' && suggestion) {
      // Remove any explanatory text and keep only tags
      suggestion = suggestion.replace(/^[^a-zA-Z]*/, '').replace(/[^a-zA-Z\s,].*$/, '');
      suggestion = suggestion.replace(/\s*,\s*/g, ', ').trim();
    }

    console.log(`Generated suggestion for ${fieldName}:`, suggestion);

    res.json({
      success: true,
      data: {
        suggestion,
        fieldName,
        fieldType
      }
    });

  } catch (error) {
    console.error('AI Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI suggestion',
      error: error.message
    });
  }
};

module.exports = {
  getAISuggestions
};
