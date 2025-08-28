-- BrandKit Questionnaire Database Schema for MySQL
-- This schema supports the 9-step BrandKitQuestionnaire form

-- Create the main table for BrandKit Questionnaire
    CREATE TABLE brandkit_questionnaire_forms (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id BIGINT NOT NULL,
        
        -- Step 1: Brand Identity
        brand_name VARCHAR(255),
        brand_description TEXT,
        
        -- Step 2: Target Audience & Positioning
        primary_customers TEXT,
        desired_emotion VARCHAR(50), -- Dynamic field for emotional responses
        unfair_advantage TEXT,
        customer_miss TEXT,
        problem_solved TEXT,
        
        -- Step 3: Competitive Landscape
        competitors JSON, -- Array of competitor names
        competitor_likes TEXT,
        competitor_dislikes TEXT,
        brand_differentiation TEXT,
        
        -- Step 4: Applications & Use Cases
        brand_kit_use JSON, -- Array of use cases
        templates JSON, -- Array of template types
        internal_assets JSON, -- Array of internal asset types
        file_formats JSON, -- Array of file formats
        cultural_adaptation VARCHAR(20), -- Dynamic field for adaptation options
        
        -- Step 5: Brand Voice & Personality
        brand_voice JSON, -- Array of voice characteristics
        admired_brands TEXT,
        inspiration_brand VARCHAR(255),
        communication_perception JSON, -- Array of perception traits
        
        -- Step 6: Visual Preferences
        brand_logo TEXT, -- File path or URL
        logo_redesign VARCHAR(20), -- Dynamic field for redesign options
        has_existing_colors VARCHAR(10), -- Dynamic field for yes/no
        existing_colors JSON, -- JSON array of colors
        preferred_colors JSON, -- JSON array of colors
        colors_to_avoid JSON, -- JSON array of colors
        imagery_style JSON, -- Array of imagery styles
        font_types JSON, -- Array of font types
        font_styles JSON, -- Array of font styles
        legal_considerations TEXT,
        
        -- Step 7: Technical Deliverables
        source_files JSON, -- Array of source file types
        required_formats JSON, -- Array of required formats
        
        -- Step 8: Inspiration & References
        reference_materials TEXT, -- File paths or URLs
        inspiration_brands TEXT,
        brand_vibe JSON, -- Array of vibe descriptors
        
        -- Step 9: Closing Information
        brand_words JSON, -- Array of brand descriptor words
        brand_avoid_words JSON, -- Array of words to avoid
        tagline VARCHAR(255),
        mission TEXT,
        vision TEXT,
        core_values JSON, -- Array of core values
        has_web_page VARCHAR(10), -- Dynamic field for yes/no
        web_page_upload TEXT, -- File path or URL
        want_web_page VARCHAR(50), -- Dynamic field for web page options
        
        -- Metadata
        current_step INT DEFAULT 1,
        progress_percentage INT DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Foreign key constraint
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Create indexes for performance
    CREATE INDEX idx_brandkit_questionnaire_user_id ON brandkit_questionnaire_forms(user_id);
    CREATE INDEX idx_brandkit_questionnaire_created_at ON brandkit_questionnaire_forms(created_at);
    CREATE INDEX idx_brandkit_questionnaire_completed ON brandkit_questionnaire_forms(is_completed);

    -- Create trigger to calculate progress percentage
    DELIMITER //
    CREATE TRIGGER calculate_brandkit_questionnaire_progress
    BEFORE INSERT ON brandkit_questionnaire_forms
    FOR EACH ROW
    BEGIN
        -- Calculate progress based on current step (9 total steps)
        SET NEW.progress_percentage = LEAST((NEW.current_step * 100) / 9, 100);
        
        -- Mark as completed if on final step
        IF NEW.current_step >= 9 THEN
            SET NEW.is_completed = TRUE;
        END IF;
    END//

    CREATE TRIGGER calculate_brandkit_questionnaire_progress_update
    BEFORE UPDATE ON brandkit_questionnaire_forms
    FOR EACH ROW
    BEGIN
        -- Calculate progress based on current step (9 total steps)
        SET NEW.progress_percentage = LEAST((NEW.current_step * 100) / 9, 100);
        
        -- Mark as completed if on final step
        IF NEW.current_step >= 9 THEN
            SET NEW.is_completed = TRUE;
        END IF;
    END//
    DELIMITER ;

-- Insert sample data for testing
INSERT INTO brandkit_questionnaire_forms (
    user_id,
    brand_name,
    brand_description,
    current_step,
    progress_percentage,
    is_completed
) VALUES (
    1,
    'Sample Brand',
    'A sample brand for testing purposes',
    1,
    11,
    FALSE
);
