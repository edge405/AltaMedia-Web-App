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
    'cultureWords', 'brandTone'
  ],
  
  // Short text fields - brief, concise responses
  SHORT_TEXT_FIELDS: [
    'businessName', 'businessEmail', 'contactNumber', 'yearStarted',
    'reason1', 'reason2', 'reason3', 'brandSoul', 'primaryGoal',
    'longTermGoal', 'timeline', 'approver', 'buildingType',
    'hasProventousId', 'proventousId', 'preferredContact','businessDescription', 'businessStage',
    'desiredEmotion', 'spendingType', 'hasLogo'
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
    'referenceMaterials'
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
    longTermGoal: formData.longTermGoal || ''
  };
  
  return context;
};

// Check if we have sufficient context data
const hasSufficientContext = (context) => {
  const requiredFields = ['businessName', 'industry', 'businessType'];
  const hasRequired = requiredFields.some(field => context[field] && context[field].trim() !== '');
  
  const optionalFields = ['mission', 'vision', 'targetAudience', 'brandDescription', 'behindBrand'];
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
`;

  // Field-specific prompts with fallback strategies
  const fieldPrompts = {
    // Mission Statement
    missionStatement: hasContext 
      ? `Based on the business context, write a compelling mission statement that captures the essence of what this business does and why it exists. Make it inspiring and authentic.`
      : `Write a compelling mission statement for a business. Focus on creating value, serving customers, and making a positive impact. Make it inspiring and authentic.`,
    
    // Vision Statement
    visionStatement: hasContext
      ? `Based on the business context, write a visionary statement that describes the future this business wants to create. Make it aspirational and forward-looking.`
      : `Write a visionary statement that describes the future a business wants to create. Focus on innovation, growth, and positive change. Make it aspirational and forward-looking.`,
    
    // Brand Description
    brandDescription: hasContext
      ? `Based on the business context, write a concise, powerful one-sentence description of what this business does. Make it memorable and compelling.`
      : `Write a concise, powerful one-sentence description of what a business does. Focus on the core value proposition and make it memorable and compelling.`,
    
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
    
    // Brand Tone
    brandTone: hasContext
      ? `Based on the business context, suggest tone of voice characteristics. Return only the tone traits as comma-separated tags.`
      : `Suggest tone of voice characteristics for a professional brand. Focus on trustworthy, friendly, and authoritative traits. Return only the tone traits as comma-separated tags.`,
    
    // Design Style
    designStyle: hasContext
      ? `Based on the business context, suggest visual design styles. Return only the styles as comma-separated tags.`
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
      ? `Based on the business context, describe the big-picture vision for the brand's long-term impact.`
      : `Describe the big-picture vision for a brand's long-term impact. Focus on industry leadership, innovation, and positive change.`,
    
    // Special Notes
    specialNotes: hasContext
      ? `Based on the business context, note any special considerations or unique aspects about this business.`
      : `Note any special considerations or unique aspects about a business. Focus on competitive advantages, unique positioning, and market opportunities.`,
    
    // Default for any other field
    default: hasContext
      ? `Based on the business context, provide a helpful suggestion for ${fieldName}.`
      : `Provide a helpful suggestion for ${fieldName} for a professional business. Focus on best practices and industry standards.`
  };

  const prompt = fieldPrompts[fieldName] || fieldPrompts.default;
  
  // Add context awareness note
  const contextNote = hasContext 
    ? `\n\nNote: Use the provided business context to create a tailored suggestion.`
    : `\n\nNote: Since limited business context is available, create a general but professional suggestion based on industry best practices.`;
  
  return `${contextString}\n\nTask: ${prompt}${contextNote}`;
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
    const { fieldName, formData } = req.query;

    if (!fieldName) {
      return res.status(400).json({
        success: false,
        message: 'Field name is required'
      });
    }

    // Parse form data
    let parsedFormData = {};
    if (formData) {
      try {
        parsedFormData = JSON.parse(formData);
      } catch (e) {
        console.warn('Failed to parse formData:', e);
      }
    }

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
        systemMessage = `You are an expert brand strategist. Write natural, conversational responses that sound like they were written by a person. If limited context is available, create professional, general-purpose content that follows industry best practices and can be customized. Be authentic, engaging, and avoid giving instructions or advice - just provide the content. Write in a warm, professional tone.`;
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
      max_tokens: fieldType === 'tag' ? 100 : fieldType === 'short_text' ? 150 : 300,
      temperature: 0.7,
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
