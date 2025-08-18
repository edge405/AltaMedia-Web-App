-- Organization Form Schema
-- Simple schema for OrganizationForm.jsx fields

CREATE TABLE organization_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Step 1: Core Brand & Campaign Info
    building_type VARCHAR(50) NOT NULL DEFAULT 'organization',
    organization_name VARCHAR(255) NOT NULL,
    social_media_goals TEXT NOT NULL,
    brand_uniqueness TEXT NOT NULL,
    desired_emotion VARCHAR(100) NOT NULL,
    
    -- Step 2: Platform & Content Focus
    target_platforms TEXT[], -- Array of platforms
    content_types TEXT[], -- Array of content types
    
    -- Step 3: Deliverables & Timeline
    deliverables TEXT[], -- Array of deliverables
    timeline VARCHAR(50) NOT NULL,
    
    -- Step 4: Collaboration & Wrap-Up
    main_contact VARCHAR(255) NOT NULL,
    additional_info TEXT,
    reference_materials TEXT, -- File uploads/links
    
    -- Metadata
    current_step INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_organization_forms_user_id ON organization_forms(user_id);
CREATE INDEX idx_organization_forms_created_at ON organization_forms(created_at);
CREATE INDEX idx_organization_forms_is_completed ON organization_forms(is_completed);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_organization_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organization_forms_updated_at
    BEFORE UPDATE ON organization_forms
    FOR EACH ROW
    EXECUTE FUNCTION update_organization_forms_updated_at();