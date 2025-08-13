-- Brand Kit Forms Database Schema for PostgreSQL/Supabase
-- This schema captures all form fields from the 12-step Brand Kit Form

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for dropdown fields
CREATE TYPE business_type_enum AS ENUM ('business', 'product');
CREATE TYPE proventous_id_enum AS ENUM ('yes', 'no');
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
CREATE TYPE timeline_enum AS ENUM ('within-1-month', '1-2-months', '2-3-months', 'flexible');

-- Main brand kit forms table
CREATE TABLE company_brand_kit_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Step 1: Business Type & Email Collection
    business_type business_type_enum,
    
    -- Step 2: Welcome & Identity Verification
    business_email VARCHAR(255) NOT NULL,
    has_proventous_id proventous_id_enum,
    proventous_id VARCHAR(100),
    business_name VARCHAR(255) NOT NULL,
    
    -- Step 3: About Your Business
    phone_number VARCHAR(50),
    preferred_contact_method contact_method_enum,
    industry TEXT[], -- Array of tags
    year_started INTEGER,
    main_location VARCHAR(255),
    mission_statement TEXT,
    vision_statement TEXT,
    core_values TEXT[], -- Array of tags
    business_stage business_stage_enum,
    brand_description VARCHAR(500),
    buyer_type buyer_type_enum[],
    target_audience TEXT,
    spending_type spending_type_enum,
    secondary_audience TEXT,
    
    -- Step 4: Audience Clarity - Section A: Target Market
    desired_feeling desired_feeling_enum,
    audience_interests TEXT[], -- Array of tags
    professions TEXT[], -- Array of tags
    preferred_platforms TEXT[], -- Array of tags
    age_groups age_group_enum[],
    
    -- Step 4: Audience Clarity - Section B: Current Market
    current_audience_interests TEXT[], -- Array of tags
    spending_habits TEXT[], -- Array of tags
    audience_behaviors TEXT[], -- Array of tags
    interaction_modes interaction_mode_enum[],
    customer_pain_points TEXT,
    purchase_motivators TEXT,
    emotional_goal emotional_goal_enum,
    
    -- Step 5: Brand Identity
    brand_owner TEXT,
    why_started TEXT,
    reasons_exist1 VARCHAR(255),
    reasons_exist2 VARCHAR(255),
    reasons_exist3 VARCHAR(255),
    brand_soul VARCHAR(255),
    brand_personality TEXT[], -- Array of tags
    brand_voice brand_voice_enum[],
    admire_brand1 TEXT,
    admire_brand2 TEXT,
    admire_brand3 TEXT,
    styles_to_avoid TEXT,
    
    -- Step 6: Visual Preferences
    existing_logo existing_logo_enum,
    logo_action logo_action_enum[],
    brand_colors TEXT[], -- Array of color codes
    colors_to_avoid TEXT[], -- Array of color codes
    font_preferences font_preference_enum[],
    design_style TEXT[], -- Array of design styles
    logo_style logo_style_enum[],
    imagery_style imagery_style_enum[],
    design_inspiration TEXT, -- File upload or links
    
    -- Step 7: Collateral Needs
    usage_channels usage_channel_enum[],
    brand_elements_needed brand_element_enum[],
    file_formats_needed file_format_enum[],
    
    -- Step 8: Business Goals & Vision
    goal_this_year VARCHAR(255),
    other_short_term_goals TEXT,
    three_to_five_year_vision VARCHAR(255),
    additional_mid_term_goals TEXT,
    long_term_vision TEXT,
    key_metrics key_metric_enum[],
    
    -- Step 9: Team Culture
    company_culture TEXT[], -- Array of tags
    culture_description TEXT,
    internal_rituals TEXT,
    
    -- Step 10: Wrap-Up
    additional_notes TEXT,
    timeline timeline_enum,
    decision_makers VARCHAR(255),
    
    -- Step 11: Uploads & Reference
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

-- Create a view for form analytics
CREATE VIEW brand_kit_analytics AS
SELECT 
    COUNT(*) as total_forms,
    COUNT(*) FILTER (WHERE is_completed = true) as completed_forms,
    COUNT(*) FILTER (WHERE is_completed = false) as incomplete_forms,
    AVG(progress_percentage) as avg_progress,
    COUNT(*) FILTER (WHERE business_type = 'business') as business_count,
    COUNT(*) FILTER (WHERE business_type = 'product') as product_count,
    COUNT(*) FILTER (WHERE timeline = 'within-1-month') as urgent_requests,
    COUNT(*) FILTER (WHERE timeline = 'flexible') as flexible_requests
FROM company_brand_kit_forms;

-- Create a view for step completion analytics
CREATE VIEW step_completion_analytics AS
SELECT 
    current_step,
    COUNT(*) as forms_at_step,
    AVG(progress_percentage) as avg_progress_at_step
FROM company_brand_kit_forms
GROUP BY current_step
ORDER BY current_step;

-- Row Level Security (RLS) policies
ALTER TABLE company_brand_kit_forms ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their own forms
CREATE POLICY "Users can view their own forms" ON company_brand_kit_forms
    FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own forms
CREATE POLICY "Users can insert their own forms" ON company_brand_kit_forms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own forms
CREATE POLICY "Users can update their own forms" ON company_brand_kit_forms
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own forms
CREATE POLICY "Users can delete their own forms" ON company_brand_kit_forms
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to get form statistics for a user
CREATE OR REPLACE FUNCTION get_user_form_stats(user_uuid UUID)
RETURNS TABLE (
    total_forms BIGINT,
    completed_forms BIGINT,
    incomplete_forms BIGINT,
    avg_progress DECIMAL(5,2),
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_forms,
        COUNT(*) FILTER (WHERE is_completed = true)::BIGINT as completed_forms,
        COUNT(*) FILTER (WHERE is_completed = false)::BIGINT as incomplete_forms,
        AVG(progress_percentage) as avg_progress,
        MAX(updated_at) as last_updated
    FROM company_brand_kit_forms
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create a function to save form progress
CREATE OR REPLACE FUNCTION save_form_progress(
    form_id UUID,
    step_data JSONB,
    current_step_num INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE company_brand_kit_forms
    SET 
        current_step = current_step_num,
        progress_percentage = (current_step_num * 100.0 / 12.0),
        updated_at = NOW()
    WHERE id = form_id AND user_id = auth.uid();
    
    -- Update specific fields based on step_data
    -- This would be implemented based on the specific fields for each step
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO company_brand_kit_forms (
    user_id,
    business_type,
    business_email,
    business_name,
    current_step,
    is_completed
) VALUES 
(
    '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
    'business',
    'sample@example.com',
    'Sample Business',
    1,
    false
);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON company_brand_kit_forms TO authenticated;
GRANT SELECT ON brand_kit_analytics TO authenticated;
GRANT SELECT ON step_completion_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_form_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION save_form_progress(UUID, JSONB, INTEGER) TO authenticated;

-- Comments for documentation
COMMENT ON TABLE company_brand_kit_forms IS 'Main table for storing Brand Kit Form submissions';
COMMENT ON COLUMN company_brand_kit_forms.business_type IS 'Type of business: business/company or specific product/service';
COMMENT ON COLUMN company_brand_kit_forms.business_email IS 'Primary business email address';
COMMENT ON COLUMN company_brand_kit_forms.has_proventous_id IS 'Whether the business has a Proventous ID';
COMMENT ON COLUMN company_brand_kit_forms.proventous_id IS 'Proventous ID number (conditional field)';
COMMENT ON COLUMN company_brand_kit_forms.business_name IS 'Full name of the business or organization';
COMMENT ON COLUMN company_brand_kit_forms.phone_number IS 'Contact number with country code';
COMMENT ON COLUMN company_brand_kit_forms.preferred_contact_method IS 'Preferred method of contact';
COMMENT ON COLUMN company_brand_kit_forms.industry IS 'Array of industry/niche tags';
COMMENT ON COLUMN company_brand_kit_forms.year_started IS 'Year the business officially started';
COMMENT ON COLUMN company_brand_kit_forms.main_location IS 'Primary business location';
COMMENT ON COLUMN company_brand_kit_forms.mission_statement IS 'Business mission statement';
COMMENT ON COLUMN company_brand_kit_forms.vision_statement IS 'Long-term vision statement';
COMMENT ON COLUMN company_brand_kit_forms.core_values IS 'Array of core business values';
COMMENT ON COLUMN company_brand_kit_forms.business_stage IS 'Current stage of the business';
COMMENT ON COLUMN company_brand_kit_forms.brand_description IS 'One-sentence business description';
COMMENT ON COLUMN company_brand_kit_forms.buyer_type IS 'Array of current buyer types';
COMMENT ON COLUMN company_brand_kit_forms.target_audience IS 'Description of target audience';
COMMENT ON COLUMN company_brand_kit_forms.spending_type IS 'Target audience spending type';
COMMENT ON COLUMN company_brand_kit_forms.secondary_audience IS 'Additional target groups';
COMMENT ON COLUMN company_brand_kit_forms.desired_feeling IS 'Desired emotional response from brand';
COMMENT ON COLUMN company_brand_kit_forms.audience_interests IS 'Array of audience interests/lifestyle';
COMMENT ON COLUMN company_brand_kit_forms.professions IS 'Array of target professions/roles';
COMMENT ON COLUMN company_brand_kit_forms.preferred_platforms IS 'Array of preferred platforms/locations';
COMMENT ON COLUMN company_brand_kit_forms.age_groups IS 'Array of target age groups';
COMMENT ON COLUMN company_brand_kit_forms.current_audience_interests IS 'Array of current customer interests';
COMMENT ON COLUMN company_brand_kit_forms.spending_habits IS 'Array of current customer spending habits';
COMMENT ON COLUMN company_brand_kit_forms.audience_behaviors IS 'Array of current audience behaviors';
COMMENT ON COLUMN company_brand_kit_forms.interaction_modes IS 'Array of current interaction methods';
COMMENT ON COLUMN company_brand_kit_forms.customer_pain_points IS 'Customer challenges addressed';
COMMENT ON COLUMN company_brand_kit_forms.purchase_motivators IS 'Competitive advantages';
COMMENT ON COLUMN company_brand_kit_forms.emotional_goal IS 'Current brand emotional response';
COMMENT ON COLUMN company_brand_kit_forms.brand_owner IS 'Description of people behind the brand';
COMMENT ON COLUMN company_brand_kit_forms.why_started IS 'Inspiration for starting the business';
COMMENT ON COLUMN company_brand_kit_forms.reasons_exist1 IS 'First reason for starting';
COMMENT ON COLUMN company_brand_kit_forms.reasons_exist2 IS 'Second reason for starting';
COMMENT ON COLUMN company_brand_kit_forms.reasons_exist3 IS 'Third reason for starting';
COMMENT ON COLUMN company_brand_kit_forms.brand_soul IS 'Description of brand soul';
COMMENT ON COLUMN company_brand_kit_forms.brand_personality IS 'Array of brand personality traits';
COMMENT ON COLUMN company_brand_kit_forms.brand_voice IS 'Array of brand voice characteristics';
COMMENT ON COLUMN company_brand_kit_forms.admire_brand1 IS 'First admired brand and why';
COMMENT ON COLUMN company_brand_kit_forms.admire_brand2 IS 'Second admired brand and why';
COMMENT ON COLUMN company_brand_kit_forms.admire_brand3 IS 'Third admired brand and why';
COMMENT ON COLUMN company_brand_kit_forms.styles_to_avoid IS 'Brand associations to avoid';
COMMENT ON COLUMN company_brand_kit_forms.existing_logo IS 'Whether business has existing logo';
COMMENT ON COLUMN company_brand_kit_forms.logo_action IS 'Array of logo action preferences';
COMMENT ON COLUMN company_brand_kit_forms.brand_colors IS 'Array of preferred brand colors';
COMMENT ON COLUMN company_brand_kit_forms.colors_to_avoid IS 'Array of colors to avoid';
COMMENT ON COLUMN company_brand_kit_forms.font_preferences IS 'Array of preferred font styles';
COMMENT ON COLUMN company_brand_kit_forms.design_style IS 'Array of design style preferences';
COMMENT ON COLUMN company_brand_kit_forms.logo_style IS 'Array of logo type preferences';
COMMENT ON COLUMN company_brand_kit_forms.imagery_style IS 'Array of visual imagery preferences';
COMMENT ON COLUMN company_brand_kit_forms.design_inspiration IS 'Design inspiration files/links';
COMMENT ON COLUMN company_brand_kit_forms.usage_channels IS 'Array of brand kit usage channels';
COMMENT ON COLUMN company_brand_kit_forms.brand_elements_needed IS 'Array of needed brand elements';
COMMENT ON COLUMN company_brand_kit_forms.file_formats_needed IS 'Array of preferred file formats';
COMMENT ON COLUMN company_brand_kit_forms.goal_this_year IS 'Primary goal for this year';
COMMENT ON COLUMN company_brand_kit_forms.other_short_term_goals IS 'Additional short-term goals';
COMMENT ON COLUMN company_brand_kit_forms.three_to_five_year_vision IS '3-5 year business vision';
COMMENT ON COLUMN company_brand_kit_forms.additional_mid_term_goals IS 'Additional mid-term goals';
COMMENT ON COLUMN company_brand_kit_forms.long_term_vision IS 'Long-term brand vision';
COMMENT ON COLUMN company_brand_kit_forms.key_metrics IS 'Array of key success metrics';
COMMENT ON COLUMN company_brand_kit_forms.company_culture IS 'Array of company culture words';
COMMENT ON COLUMN company_brand_kit_forms.culture_description IS 'Description of work environment';
COMMENT ON COLUMN company_brand_kit_forms.internal_rituals IS 'Team traditions and rituals';
COMMENT ON COLUMN company_brand_kit_forms.additional_notes IS 'Additional information/requirements';
COMMENT ON COLUMN company_brand_kit_forms.timeline IS 'Required completion timeline';
COMMENT ON COLUMN company_brand_kit_forms.decision_makers IS 'Name of decision maker';
COMMENT ON COLUMN company_brand_kit_forms.reference_materials IS 'Reference files/links';
COMMENT ON COLUMN company_brand_kit_forms.current_step IS 'Current form step (1-12)';
COMMENT ON COLUMN company_brand_kit_forms.progress_percentage IS 'Form completion percentage';
COMMENT ON COLUMN company_brand_kit_forms.is_completed IS 'Whether form is fully completed';

-- Usage Examples:

-- 1. Create a new form
-- INSERT INTO company_brand_kit_forms (user_id, business_type, business_email, business_name) 
-- VALUES (auth.uid(), 'business', 'test@example.com', 'Test Business');

-- 2. Update form progress
-- UPDATE company_brand_kit_forms 
-- SET current_step = 3, business_name = 'Updated Business Name' 
-- WHERE id = 'form-uuid' AND user_id = auth.uid();

-- 3. Get user's forms
-- SELECT * FROM company_brand_kit_forms WHERE user_id = auth.uid() ORDER BY created_at DESC;

-- 4. Get form analytics
-- SELECT * FROM brand_kit_analytics;

-- 5. Get user statistics
-- SELECT * FROM get_user_form_stats(auth.uid()); 