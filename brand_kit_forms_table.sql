-- Brand Kit Forms Table for Supabase
-- This table captures all form fields from the 12-step Brand Kit Form

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for dropdown fields
CREATE TYPE business_type_enum AS ENUM ('Business/Company', 'Specific Product/Service');
CREATE TYPE proventous_id_enum AS ENUM ('Yes', 'No');
CREATE TYPE contact_method_enum AS ENUM ('email', 'phone', 'messenger', 'other');
CREATE TYPE business_stage_enum AS ENUM ('startup', 'growing', 'established', 'mature');
CREATE TYPE buyer_type_enum AS ENUM ('Male', 'Female', 'Everyone (both)');
CREATE TYPE spending_type_enum AS ENUM ('budget-conscious', 'value-seeking', 'premium');
CREATE TYPE desired_feeling_enum AS ENUM ('happy', 'fulfilled', 'inspired', 'satisfied', 'energized', 'empowered', 'safe-secure', 'confident');
CREATE TYPE age_group_enum AS ENUM ('Teens (13–19)', 'Young Adults (20–29)', 'Adults (30–39)', 'Mature Adults (40–59)', 'Seniors (60+)');
CREATE TYPE interaction_mode_enum AS ENUM ('Website', 'Social Media', 'Phone', 'Email', 'In-person', 'Mobile App');
CREATE TYPE emotional_goal_enum AS ENUM ('happy', 'fulfilled', 'inspired', 'satisfied', 'energized', 'empowered', 'safe-secure', 'confident');
CREATE TYPE brand_voice_enum AS ENUM ('Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 'Sophisticated');
CREATE TYPE existing_logo_enum AS ENUM ('yes', 'no');
CREATE TYPE logo_action_enum AS ENUM ('Keep', 'Improve', 'Redo');
CREATE TYPE font_preference_enum AS ENUM ('Serif', 'Sans-serif', 'Script', 'Display', 'Monospace');
CREATE TYPE logo_style_enum AS ENUM ('Wordmark', 'Symbol', 'Combination', 'Emblem', 'Lettermark');
CREATE TYPE imagery_style_enum AS ENUM ('Photography', 'Illustration', 'Abstract', 'Geometric', 'Organic', 'Mixed Media');
CREATE TYPE usage_channel_enum AS ENUM ('Website', 'Social Media', 'Print Materials', 'Business Cards', 'Email Marketing', 'Packaging', 'Signage', 'Apparel');
CREATE TYPE brand_element_enum AS ENUM ('Logo', 'Color Palette', 'Typography', 'Business Cards', 'Letterhead', 'Social Media Templates', 'Email Signature', 'Brand Guidelines');
CREATE TYPE file_format_enum AS ENUM ('PNG', 'JPG', 'PDF', 'AI', 'EPS', 'SVG');
CREATE TYPE key_metric_enum AS ENUM ('Revenue Growth', 'Customer Satisfaction', 'Brand Recognition', 'Market Share', 'Social Media Engagement', 'Website Traffic', 'Customer Retention', 'Employee Satisfaction');
CREATE TYPE timeline_enum AS ENUM ('Within 1 month', '1–2 months', '2–3 months', 'Flexible');

-- Main brand kit forms table
CREATE TABLE company_brand_kit_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Step 1: Business Type & Email Collection
    what_building business_type_enum,
    
    -- Step 2: Welcome & Identity Verification
    business_email VARCHAR(255),
    has_proventous_id proventous_id_enum,
    proventous_id VARCHAR(100),
    full_business_name VARCHAR(255),
    
    -- Step 3: About Your Business
    contact_number VARCHAR(50),
    preferred_communication contact_method_enum,
    industry_niche TEXT[], -- Array of tags
    year_started INTEGER,
    primary_location VARCHAR(255),
    whos_behind_brand TEXT,
    business_description VARCHAR(500),
    current_customers buyer_type_enum[],
    target_attraction TEXT,
    team_description TEXT,
    inspiration_for_starting TEXT,
    
    -- Step 4: Audience Clarity - Target Market
    desired_feeling desired_feeling_enum,
    target_interests TEXT[], -- Array of tags
    target_professions TEXT[], -- Array of tags
    target_reach_locations TEXT[], -- Array of tags
    target_age_groups age_group_enum[],
    
    -- Step 4: Audience Clarity - Current Market
    current_customer_interests TEXT[], -- Array of tags
    current_spending_habits TEXT[], -- Array of tags
    current_audience_behavior TEXT[], -- Array of tags
    interaction_methods interaction_mode_enum[],
    customer_challenges TEXT,
    customer_motivation TEXT,
    current_brand_feeling emotional_goal_enum,
    
    -- Step 5: Team Culture
    culture_words TEXT[], -- Array of tags
    team_traditions TEXT,
    
    -- Step 6: Brand Identity
    reason1 VARCHAR(255),
    reason2 VARCHAR(255),
    reason3 VARCHAR(255),
    brand_soul VARCHAR(255),
    personality_words TEXT[], -- Array of tags
    brand_voice brand_voice_enum[],
    brand1 TEXT,
    brand2 TEXT,
    brand3 TEXT,
    brand_avoid_associations TEXT,
    
    -- Step 7: Visual Preferences
    has_logo existing_logo_enum,
    logo_action logo_action_enum[],
    preferred_colors TEXT[], -- Array of color codes
    colors_to_avoid TEXT[], -- Array of color codes
    font_styles font_preference_enum[],
    design_style TEXT[], -- Array of design styles
    logo_type logo_style_enum[],
    visual_imagery_style imagery_style_enum[],
    design_inspiration_links TEXT, -- File upload or links
    
    -- Step 8: Collateral Needs
    brand_kit_usage usage_channel_enum[],
    brand_elements_needed brand_element_enum[],
    file_format_preferences file_format_enum[],
    
    -- Step 9: Business Goals & Vision
    primary_goal_this_year VARCHAR(255),
    short_term_goals TEXT,
    three_to_five_year_goal VARCHAR(255),
    mid_term_goals TEXT,
    long_term_vision TEXT,
    success_metrics key_metric_enum[],
    
    -- Step 10: Mission, Vision & Values (AI Suggestions)
    business_mission TEXT,
    long_term_vision_ai TEXT,
    business_values TEXT[], -- Array of tags
    business_journey_stage business_stage_enum,
    spending_type spending_type_enum,
    other_audiences TEXT,
    
    -- Step 11: Wrap-Up
    special_requirements TEXT,
    brand_kit_timeline timeline_enum,
    review_approval_person VARCHAR(255),
    
    -- Step 12: Uploads & Reference
    reference_materials TEXT, -- File upload or links
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT FALSE,
    current_step INTEGER DEFAULT 1,
    progress_percentage DECIMAL(5,2) DEFAULT 8.33,
    
    -- Constraints
    CONSTRAINT valid_year_started CHECK (year_started >= 1900 AND year_started <= 2030),
    CONSTRAINT valid_progress_percentage CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    CONSTRAINT valid_current_step CHECK (current_step >= 1 AND current_step <= 12)
);

-- Create indexes for better performance
CREATE INDEX idx_company_brand_kit_forms_user_id ON company_brand_kit_forms(user_id);
CREATE INDEX idx_company_brand_kit_forms_created_at ON company_brand_kit_forms(created_at);
CREATE INDEX idx_company_brand_kit_forms_is_completed ON company_brand_kit_forms(is_completed);
CREATE INDEX idx_company_brand_kit_forms_business_email ON company_brand_kit_forms(business_email);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_company_brand_kit_forms_updated_at 
    BEFORE UPDATE ON company_brand_kit_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to calculate progress percentage
CREATE OR REPLACE FUNCTION calculate_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
    NEW.progress_percentage = (NEW.current_step * 100.0 / 12.0);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically calculate progress
CREATE TRIGGER update_progress_percentage 
    BEFORE INSERT OR UPDATE ON company_brand_kit_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_progress_percentage();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON company_brand_kit_forms TO authenticated;

-- Comments for documentation
COMMENT ON TABLE company_brand_kit_forms IS 'Main table for storing Brand Kit Form submissions';
COMMENT ON COLUMN company_brand_kit_forms.what_building IS 'Type of business: business/company or specific product/service';
COMMENT ON COLUMN company_brand_kit_forms.business_email IS 'Primary business email address';
COMMENT ON COLUMN company_brand_kit_forms.has_proventous_id IS 'Whether the business has a Proventous ID';
COMMENT ON COLUMN company_brand_kit_forms.proventous_id IS 'Proventous ID number (conditional field)';
COMMENT ON COLUMN company_brand_kit_forms.full_business_name IS 'Full name of the business or organization';
COMMENT ON COLUMN company_brand_kit_forms.contact_number IS 'Contact number with country code';
COMMENT ON COLUMN company_brand_kit_forms.preferred_communication IS 'Preferred method of contact';
COMMENT ON COLUMN company_brand_kit_forms.industry_niche IS 'Array of industry/niche tags';
COMMENT ON COLUMN company_brand_kit_forms.year_started IS 'Year the business officially started';
COMMENT ON COLUMN company_brand_kit_forms.primary_location IS 'Primary business location';
COMMENT ON COLUMN company_brand_kit_forms.whos_behind_brand IS 'Description of people behind the brand';
COMMENT ON COLUMN company_brand_kit_forms.business_description IS 'One-sentence business description';
COMMENT ON COLUMN company_brand_kit_forms.current_customers IS 'Array of current buyer types';
COMMENT ON COLUMN company_brand_kit_forms.target_attraction IS 'Description of target audience';
COMMENT ON COLUMN company_brand_kit_forms.team_description IS 'Description of team/work environment';
COMMENT ON COLUMN company_brand_kit_forms.inspiration_for_starting IS 'Inspiration for starting the business';
COMMENT ON COLUMN company_brand_kit_forms.desired_feeling IS 'Desired emotional response from brand';
COMMENT ON COLUMN company_brand_kit_forms.target_interests IS 'Array of audience interests/lifestyle';
COMMENT ON COLUMN company_brand_kit_forms.target_professions IS 'Array of target professions/roles';
COMMENT ON COLUMN company_brand_kit_forms.target_reach_locations IS 'Array of preferred platforms/locations';
COMMENT ON COLUMN company_brand_kit_forms.target_age_groups IS 'Array of target age groups';
COMMENT ON COLUMN company_brand_kit_forms.current_customer_interests IS 'Array of current customer interests';
COMMENT ON COLUMN company_brand_kit_forms.current_spending_habits IS 'Array of current customer spending habits';
COMMENT ON COLUMN company_brand_kit_forms.current_audience_behavior IS 'Array of current audience behaviors';
COMMENT ON COLUMN company_brand_kit_forms.interaction_methods IS 'Array of current interaction methods';
COMMENT ON COLUMN company_brand_kit_forms.customer_challenges IS 'Customer challenges addressed';
COMMENT ON COLUMN company_brand_kit_forms.customer_motivation IS 'Competitive advantages';
COMMENT ON COLUMN company_brand_kit_forms.current_brand_feeling IS 'Current brand emotional response';
COMMENT ON COLUMN company_brand_kit_forms.culture_words IS 'Array of company culture words';
COMMENT ON COLUMN company_brand_kit_forms.team_traditions IS 'Team traditions and rituals';
COMMENT ON COLUMN company_brand_kit_forms.reason1 IS 'First reason for starting';
COMMENT ON COLUMN company_brand_kit_forms.reason2 IS 'Second reason for starting';
COMMENT ON COLUMN company_brand_kit_forms.reason3 IS 'Third reason for starting';
COMMENT ON COLUMN company_brand_kit_forms.brand_soul IS 'Description of brand soul';
COMMENT ON COLUMN company_brand_kit_forms.personality_words IS 'Array of brand personality traits';
COMMENT ON COLUMN company_brand_kit_forms.brand_voice IS 'Array of brand voice characteristics';
COMMENT ON COLUMN company_brand_kit_forms.brand1 IS 'First admired brand and why';
COMMENT ON COLUMN company_brand_kit_forms.brand2 IS 'Second admired brand and why';
COMMENT ON COLUMN company_brand_kit_forms.brand3 IS 'Third admired brand and why';
COMMENT ON COLUMN company_brand_kit_forms.brand_avoid_associations IS 'Brand associations to avoid';
COMMENT ON COLUMN company_brand_kit_forms.has_logo IS 'Whether business has existing logo';
COMMENT ON COLUMN company_brand_kit_forms.logo_action IS 'Array of logo action preferences';
COMMENT ON COLUMN company_brand_kit_forms.preferred_colors IS 'Array of preferred brand colors';
COMMENT ON COLUMN company_brand_kit_forms.colors_to_avoid IS 'Array of colors to avoid';
COMMENT ON COLUMN company_brand_kit_forms.font_styles IS 'Array of preferred font styles';
COMMENT ON COLUMN company_brand_kit_forms.design_style IS 'Array of design style preferences';
COMMENT ON COLUMN company_brand_kit_forms.logo_type IS 'Array of logo type preferences';
COMMENT ON COLUMN company_brand_kit_forms.visual_imagery_style IS 'Array of visual imagery preferences';
COMMENT ON COLUMN company_brand_kit_forms.design_inspiration_links IS 'Design inspiration files/links';
COMMENT ON COLUMN company_brand_kit_forms.brand_kit_usage IS 'Array of brand kit usage channels';
COMMENT ON COLUMN company_brand_kit_forms.brand_elements_needed IS 'Array of needed brand elements';
COMMENT ON COLUMN company_brand_kit_forms.file_format_preferences IS 'Array of preferred file formats';
COMMENT ON COLUMN company_brand_kit_forms.primary_goal_this_year IS 'Primary goal for this year';
COMMENT ON COLUMN company_brand_kit_forms.short_term_goals IS 'Additional short-term goals';
COMMENT ON COLUMN company_brand_kit_forms.three_to_five_year_goal IS '3-5 year business vision';
COMMENT ON COLUMN company_brand_kit_forms.mid_term_goals IS 'Additional mid-term goals';
COMMENT ON COLUMN company_brand_kit_forms.long_term_vision IS 'Long-term brand vision';
COMMENT ON COLUMN company_brand_kit_forms.success_metrics IS 'Array of key success metrics';
COMMENT ON COLUMN company_brand_kit_forms.business_mission IS 'Business mission statement';
COMMENT ON COLUMN company_brand_kit_forms.long_term_vision_ai IS 'Long-term vision statement (AI)';
COMMENT ON COLUMN company_brand_kit_forms.business_values IS 'Array of core business values';
COMMENT ON COLUMN company_brand_kit_forms.business_journey_stage IS 'Current stage of the business';
COMMENT ON COLUMN company_brand_kit_forms.spending_type IS 'Target audience spending type';
COMMENT ON COLUMN company_brand_kit_forms.other_audiences IS 'Additional target groups';
COMMENT ON COLUMN company_brand_kit_forms.special_requirements IS 'Additional information/requirements';
COMMENT ON COLUMN company_brand_kit_forms.brand_kit_timeline IS 'Required completion timeline';
COMMENT ON COLUMN company_brand_kit_forms.review_approval_person IS 'Name of decision maker';
COMMENT ON COLUMN company_brand_kit_forms.reference_materials IS 'Reference files/links';
COMMENT ON COLUMN company_brand_kit_forms.current_step IS 'Current form step (1-12)';
COMMENT ON COLUMN company_brand_kit_forms.progress_percentage IS 'Form completion percentage';
COMMENT ON COLUMN company_brand_kit_forms.is_completed IS 'Whether form is fully completed'; 