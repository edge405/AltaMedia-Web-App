CREATE TABLE IF NOT EXISTS brand_kit_forms (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    business_type TEXT,
    business_email VARCHAR(255) NOT NULL,
    has_proventous_id TEXT,
    proventous_id VARCHAR(100),
    business_name VARCHAR(255) NOT NULL,

    phone_number VARCHAR(50),
    preferred_contact_method TEXT,
    industry TEXT[],
    year_started INTEGER,
    main_location VARCHAR(255),
    mission_statement TEXT,
    vision_statement TEXT,
    core_values TEXT[],
    business_stage TEXT,
    brand_description VARCHAR(500),
    buyer_type TEXT[],
    target_audience TEXT,
    spending_type TEXT,
    secondary_audience TEXT,

    desired_feeling TEXT,
    audience_interests TEXT[],
    professions TEXT[],
    preferred_platforms TEXT[],
    age_groups TEXT[],

    current_audience_interests TEXT[],
    spending_habits TEXT[],
    audience_behaviors TEXT[],
    interaction_modes TEXT[],
    customer_pain_points TEXT,
    purchase_motivators TEXT,
    emotional_goal TEXT,

    brand_owner TEXT,
    why_started TEXT,
    reasons_exist1 VARCHAR(255),
    reasons_exist2 VARCHAR(255),
    reasons_exist3 VARCHAR(255),
    brand_soul VARCHAR(255),
    brand_personality TEXT[],
    brand_voice TEXT[],
    admire_brand1 TEXT,
    admire_brand2 TEXT,
    admire_brand3 TEXT,
    styles_to_avoid TEXT,

    existing_logo TEXT,
    logo_action TEXT[],
    brand_colors TEXT[],
    colors_to_avoid TEXT[],
    font_preferences TEXT[],
    design_style TEXT[],
    logo_style TEXT[],
    imagery_style TEXT[],
    design_inspiration TEXT,

    usage_channels TEXT[],
    brand_elements_needed TEXT[],
    file_formats_needed TEXT[],

    goal_this_year VARCHAR(255),
    other_short_term_goals TEXT,
    three_to_five_year_vision VARCHAR(255),
    additional_mid_term_goals TEXT,
    long_term_vision TEXT,
    key_metrics TEXT[],

    company_culture TEXT[],
    culture_description TEXT,
    internal_rituals TEXT,

    additional_notes TEXT,
    timeline TEXT,
    decision_makers VARCHAR(255),
    reference_materials TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT FALSE,
    current_step INTEGER DEFAULT 1,
    progress_percentage DECIMAL(5,2) DEFAULT 8.33
);

-- Trigger for updated_at
CREATE TRIGGER update_brand_kit_forms_updated_at 
    BEFORE UPDATE ON brand_kit_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brand_kit_forms_user_id ON brand_kit_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_kit_forms_email ON brand_kit_forms(business_email);
CREATE INDEX IF NOT EXISTS idx_brand_kit_forms_is_completed ON brand_kit_forms(is_completed);
