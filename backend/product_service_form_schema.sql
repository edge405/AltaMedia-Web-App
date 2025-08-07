CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Product Service Form Schema
-- This schema handles the streamlined 5-step product/service form

-- Main table for product service form submissions
CREATE TABLE product_service_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Step 1: Product Basics
    building_type VARCHAR(50) DEFAULT 'product',
    product_name VARCHAR(255),
    product_description TEXT,
    industry TEXT[], -- Array of industry tags
    want_to_attract TEXT, -- Target audience description
    mission_story TEXT, -- Problem solving story
    desired_emotion VARCHAR(100), -- Emotional response
    brand_tone VARCHAR(50), -- Tone of voice
    
    -- Step 2: Audience & Market Fit
    target_audience_profile TEXT, -- Types of people trying to reach
    reach_locations TEXT[], -- Array of platforms/places
    
    -- Step 3: Brand Style & Identity
    brand_personality TEXT[], -- Array of 3 personality words
    design_style TEXT[], -- Array of visual direction tags
    preferred_colors TEXT[], -- Array of preferred colors
    colors_to_avoid TEXT[], -- Array of colors to avoid
    competitors TEXT, -- Direct competitors description
    
    -- Step 4: Needs & Deliverables
    brand_kit_use TEXT[], -- Array of where product will appear
    brand_elements TEXT[], -- Array of needed assets
    file_formats TEXT[], -- Array of preferred file formats
    platform_support TEXT[], -- Array of platform support needs
    
    -- Step 5: Final Info
    timeline VARCHAR(50), -- When do you need this ready by
    primary_location VARCHAR(255),
    preferred_contact VARCHAR(100), -- How should we reach you
    approver VARCHAR(255), -- Who else is involved in approvals
    special_notes TEXT, -- Additional information
    reference_materials TEXT, -- File upload path/URL
    
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
CREATE INDEX idx_product_service_forms_user_id ON product_service_forms(user_id);
CREATE INDEX idx_product_service_forms_created_at ON product_service_forms(created_at);
CREATE INDEX idx_product_service_forms_is_completed ON product_service_forms(is_completed);
CREATE INDEX idx_product_service_forms_current_step ON product_service_forms(current_step);
CREATE INDEX idx_product_service_forms_progress_percentage ON product_service_forms(progress_percentage);
CREATE INDEX idx_product_service_forms_building_type ON product_service_forms(building_type);

-- Create GIN indexes for array columns
CREATE INDEX idx_product_service_forms_industry ON product_service_forms USING GIN (industry);
CREATE INDEX idx_product_service_forms_reach_locations ON product_service_forms USING GIN (reach_locations);
CREATE INDEX idx_product_service_forms_brand_personality ON product_service_forms USING GIN (brand_personality);
CREATE INDEX idx_product_service_forms_design_style ON product_service_forms USING GIN (design_style);
CREATE INDEX idx_product_service_forms_preferred_colors ON product_service_forms USING GIN (preferred_colors);
CREATE INDEX idx_product_service_forms_colors_to_avoid ON product_service_forms USING GIN (colors_to_avoid);
CREATE INDEX idx_product_service_forms_brand_kit_use ON product_service_forms USING GIN (brand_kit_use);
CREATE INDEX idx_product_service_forms_brand_elements ON product_service_forms USING GIN (brand_elements);
CREATE INDEX idx_product_service_forms_file_formats ON product_service_forms USING GIN (file_formats);
CREATE INDEX idx_product_service_forms_platform_support ON product_service_forms USING GIN (platform_support);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_service_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_product_service_forms_updated_at 
    BEFORE UPDATE ON product_service_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_product_service_forms_updated_at();

-- Function to calculate progress percentage
CREATE OR REPLACE FUNCTION calculate_product_service_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate progress based on current_step (5 steps total)
    NEW.progress_percentage = CASE 
        WHEN NEW.current_step IS NULL THEN 0
        WHEN NEW.current_step >= 5 THEN 100
        ELSE (NEW.current_step * 100) / 5
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
CREATE TRIGGER update_product_service_progress_percentage 
    BEFORE INSERT OR UPDATE ON product_service_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_product_service_progress_percentage();

-- Add comments to document the structure
COMMENT ON TABLE product_service_forms IS 'Product/Service BrandKit form data for 5-step streamlined brand identity process';
COMMENT ON COLUMN product_service_forms.reference_materials IS 'File upload path/URL for reference materials';
COMMENT ON COLUMN product_service_forms.current_step IS 'Current step in the 5-step form process (1-5)';
COMMENT ON COLUMN product_service_forms.progress_percentage IS 'Calculated progress percentage (0-100)';
COMMENT ON COLUMN product_service_forms.is_completed IS 'Whether the form has been completed';
COMMENT ON COLUMN product_service_forms.completed_at IS 'Timestamp when the form was completed';
