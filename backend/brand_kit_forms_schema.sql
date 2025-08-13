CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for dropdown fields
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_type_enum') THEN
        CREATE TYPE business_type_enum AS ENUM ('business', 'product');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'proventous_id_enum') THEN
        CREATE TYPE proventous_id_enum AS ENUM ('yes', 'no');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_method_enum') THEN
        CREATE TYPE contact_method_enum AS ENUM ('email', 'phone', 'messenger', 'other');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'desired_emotion_enum') THEN
        CREATE TYPE desired_emotion_enum AS ENUM ('happy', 'fulfilled', 'inspired', 'satisfied', 'energized', 'empowered', 'safe & secure', 'confident');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'age_group_enum') THEN
        CREATE TYPE age_group_enum AS ENUM ('Teens', 'Young Adults', 'Adults', 'Mature Adults', 'Seniors');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interaction_method_enum') THEN
        CREATE TYPE interaction_method_enum AS ENUM ('Online', 'In-person', 'Phone', 'Email', 'Social Media', 'Mobile App');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'buyer_type_enum') THEN
        CREATE TYPE buyer_type_enum AS ENUM ('Male', 'Female', 'Everyone');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'brand_voice_enum') THEN
        CREATE TYPE brand_voice_enum AS ENUM ('Friendly', 'Professional', 'Casual', 'Formal', 'Humorous', 'Serious', 'Inspirational', 'Direct');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'existing_logo_enum') THEN
        CREATE TYPE existing_logo_enum AS ENUM ('yes', 'no');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'logo_action_enum') THEN
        CREATE TYPE logo_action_enum AS ENUM ('Keep', 'Improve', 'Redo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'font_preference_enum') THEN
        CREATE TYPE font_preference_enum AS ENUM ('Serif', 'Sans-serif', 'Script', 'Display', 'Modern', 'Classic', 'Bold', 'Light');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'logo_style_enum') THEN
        CREATE TYPE logo_style_enum AS ENUM ('Wordmark', 'Symbol', 'Combination', 'Lettermark', 'Emblem', 'Abstract');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'imagery_style_enum') THEN
        CREATE TYPE imagery_style_enum AS ENUM ('Photography', 'Illustration', 'Abstract', 'Geometric', 'Nature', 'Urban', 'Hand-drawn', 'Digital');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'usage_channel_enum') THEN
        CREATE TYPE usage_channel_enum AS ENUM ('Website', 'Social Media', 'Business Cards', 'Letterhead', 'Packaging', 'Signage', 'Apparel', 'Digital Ads', 'Print Materials');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'brand_element_enum') THEN
        CREATE TYPE brand_element_enum AS ENUM ('Logo', 'Color Palette', 'Typography', 'Icon Set', 'Patterns', 'Photography Style', 'Illustration Style', 'Brand Guidelines');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'file_format_enum') THEN
        CREATE TYPE file_format_enum AS ENUM ('PNG', 'SVG', 'PDF', 'AI', 'EPS', 'JPG', 'TIFF');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'key_metric_enum') THEN
        CREATE TYPE key_metric_enum AS ENUM ('Revenue Growth', 'Customer Acquisition', 'Brand Recognition', 'Market Share', 'Customer Satisfaction', 'Employee Retention', 'Operational Efficiency', 'Innovation');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'timeline_enum') THEN
        CREATE TYPE timeline_enum AS ENUM ('1-2-weeks', '3-4-weeks', '1-2-months', '3-6-months', '6+months', 'flexible');
    END IF;
END;
$$;

-- Main brand kit forms table
CREATE TABLE company_brand_kit_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Step 1: Business Basics
    building_type business_type_enum,
    business_email VARCHAR(255),
    has_proventous_id proventous_id_enum,
    proventous_id VARCHAR(100),
    business_name VARCHAR(255),
    
    -- Step 2: About Your Business
    contact_number VARCHAR(50),
    preferred_contact contact_method_enum,
    industry TEXT[], -- Array of industry tags
    year_started INTEGER,
    primary_location JSONB, -- Store location as JSON with coordinates
    behind_brand TEXT,
    current_customers buyer_type_enum[],
    want_to_attract TEXT,
    team_description TEXT,
    
    -- Step 3: Audience Clarity
    desired_emotion desired_emotion_enum,
    target_professions TEXT[], -- Array of profession tags
    reach_locations TEXT[], -- Array of location tags
    age_groups age_group_enum[],
    spending_habits TEXT[], -- Array of spending habit tags
    interaction_methods interaction_method_enum[],
    customer_challenges TEXT,
    customer_motivation TEXT,
    audience_behavior TEXT[], -- Array of behavior tags
    customer_choice TEXT,
    
    -- Step 4: Team & Culture
    culture_words TEXT[], -- Array of culture words
    team_traditions TEXT,
    team_highlights TEXT,
    
    -- Step 5: Brand Identity
    reason1 VARCHAR(255),
    reason2 VARCHAR(255),
    reason3 VARCHAR(255),
    brand_soul VARCHAR(255),
    brand_tone brand_voice_enum[],
    brand1 TEXT,
    brand2 TEXT,
    brand3 TEXT,
    brand_avoid TEXT,
    mission_statement TEXT,
    long_term_vision TEXT,
    core_values TEXT[], -- Array of core values
    brand_personality TEXT[], -- Array of personality traits
    
    -- Step 6: Visual Direction
    has_logo existing_logo_enum,
    logo_action logo_action_enum[],
    preferred_colors TEXT[], -- Array of color codes
    colors_to_avoid TEXT[], -- Array of color codes
    font_styles font_preference_enum[],
    design_style TEXT[], -- Array of design styles
    logo_type logo_style_enum[],
    imagery_style imagery_style_enum[],
    inspiration_links TEXT, -- Cloudinary URL for uploaded inspiration files
    
    -- Step 7: Collateral Needs
    brand_kit_use usage_channel_enum[],
    brand_elements brand_element_enum[],
    file_formats file_format_enum[],
    
    -- Step 8: Business Goals
    primary_goal TEXT,
    short_term_goals TEXT,
    mid_term_goals TEXT,
    long_term_goal TEXT,
    big_picture_vision TEXT,
    success_metrics key_metric_enum[],
    
    -- Step 9: AI-Powered Insights
    business_description TEXT,
    inspiration TEXT,
    target_interests TEXT[], -- Array of target interests
    current_interests TEXT[], -- Array of current interests
    
    -- Step 10: Wrap-Up
    special_notes TEXT,
    timeline timeline_enum,
    approver VARCHAR(255),
    
    -- Step 11: Upload References
    reference_materials TEXT, -- Cloudinary URL for uploaded reference files
    
    -- Progress tracking
    current_step INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_company_brand_kit_forms_user_id ON company_brand_kit_forms(user_id);
CREATE INDEX idx_company_brand_kit_forms_created_at ON company_brand_kit_forms(created_at);
CREATE INDEX idx_company_brand_kit_forms_is_completed ON company_brand_kit_forms(is_completed);
CREATE INDEX idx_company_brand_kit_forms_business_email ON company_brand_kit_forms(business_email);
CREATE INDEX idx_company_brand_kit_forms_current_step ON company_brand_kit_forms(current_step);
CREATE INDEX idx_company_brand_kit_forms_progress_percentage ON company_brand_kit_forms(progress_percentage);

-- Create GIN indexes for array columns
CREATE INDEX idx_company_brand_kit_forms_industry ON company_brand_kit_forms USING GIN (industry);
CREATE INDEX idx_company_brand_kit_forms_current_customers ON company_brand_kit_forms USING GIN (current_customers);
CREATE INDEX idx_company_brand_kit_forms_target_professions ON company_brand_kit_forms USING GIN (target_professions);
CREATE INDEX idx_company_brand_kit_forms_reach_locations ON company_brand_kit_forms USING GIN (reach_locations);
CREATE INDEX idx_company_brand_kit_forms_age_groups ON company_brand_kit_forms USING GIN (age_groups);
CREATE INDEX idx_company_brand_kit_forms_spending_habits ON company_brand_kit_forms USING GIN (spending_habits);
CREATE INDEX idx_company_brand_kit_forms_interaction_methods ON company_brand_kit_forms USING GIN (interaction_methods);
CREATE INDEX idx_company_brand_kit_forms_audience_behavior ON company_brand_kit_forms USING GIN (audience_behavior);
CREATE INDEX idx_company_brand_kit_forms_culture_words ON company_brand_kit_forms USING GIN (culture_words);
CREATE INDEX idx_company_brand_kit_forms_brand_tone ON company_brand_kit_forms USING GIN (brand_tone);
CREATE INDEX idx_company_brand_kit_forms_core_values ON company_brand_kit_forms USING GIN (core_values);
CREATE INDEX idx_company_brand_kit_forms_brand_personality ON company_brand_kit_forms USING GIN (brand_personality);
CREATE INDEX idx_company_brand_kit_forms_logo_action ON company_brand_kit_forms USING GIN (logo_action);
CREATE INDEX idx_company_brand_kit_forms_preferred_colors ON company_brand_kit_forms USING GIN (preferred_colors);
CREATE INDEX idx_company_brand_kit_forms_colors_to_avoid ON company_brand_kit_forms USING GIN (colors_to_avoid);
CREATE INDEX idx_company_brand_kit_forms_font_styles ON company_brand_kit_forms USING GIN (font_styles);
CREATE INDEX idx_company_brand_kit_forms_design_style ON company_brand_kit_forms USING GIN (design_style);
CREATE INDEX idx_company_brand_kit_forms_logo_type ON company_brand_kit_forms USING GIN (logo_type);
CREATE INDEX idx_company_brand_kit_forms_imagery_style ON company_brand_kit_forms USING GIN (imagery_style);
CREATE INDEX idx_company_brand_kit_forms_brand_kit_use ON company_brand_kit_forms USING GIN (brand_kit_use);
CREATE INDEX idx_company_brand_kit_forms_brand_elements ON company_brand_kit_forms USING GIN (brand_elements);
CREATE INDEX idx_company_brand_kit_forms_file_formats ON company_brand_kit_forms USING GIN (file_formats);
CREATE INDEX idx_company_brand_kit_forms_success_metrics ON company_brand_kit_forms USING GIN (success_metrics);
CREATE INDEX idx_company_brand_kit_forms_target_interests ON company_brand_kit_forms USING GIN (target_interests);
CREATE INDEX idx_company_brand_kit_forms_current_interests ON company_brand_kit_forms USING GIN (current_interests);

-- Create GIN index for JSONB primary_location
CREATE INDEX idx_company_brand_kit_forms_primary_location ON company_brand_kit_forms USING GIN (primary_location);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_company_brand_kit_forms_updated_at 
    BEFORE UPDATE ON company_brand_kit_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate progress percentage
CREATE OR REPLACE FUNCTION calculate_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate progress based on current_step (11 steps total)
    NEW.progress_percentage = CASE 
        WHEN NEW.current_step IS NULL THEN 0
        WHEN NEW.current_step >= 11 THEN 100
        ELSE (NEW.current_step * 100) / 11
    END;
    
    -- Set is_completed based on progress
    NEW.is_completed = CASE 
        WHEN NEW.progress_percentage >= 100 THEN TRUE
        ELSE FALSE
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate progress
CREATE TRIGGER update_progress_percentage 
    BEFORE INSERT OR UPDATE ON company_brand_kit_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_progress_percentage();

-- Add comments to document the structure
COMMENT ON TABLE company_brand_kit_forms IS 'Comprehensive BrandKit form data for 11-step brand identity process';
COMMENT ON COLUMN company_brand_kit_forms.primary_location IS 'JSONB field storing location data with coordinates';
COMMENT ON COLUMN company_brand_kit_forms.inspiration_links IS 'Cloudinary URL for uploaded inspiration materials';
COMMENT ON COLUMN company_brand_kit_forms.reference_materials IS 'Cloudinary URL for uploaded reference materials';
COMMENT ON COLUMN company_brand_kit_forms.current_step IS 'Current step in the 11-step form process (1-11)';
COMMENT ON COLUMN company_brand_kit_forms.progress_percentage IS 'Calculated progress percentage (0-100)';
COMMENT ON COLUMN company_brand_kit_forms.is_completed IS 'Whether the form has been completed';
COMMENT ON COLUMN company_brand_kit_forms.completed_at IS 'Timestamp when the form was completed'; 