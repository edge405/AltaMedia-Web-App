-- =====================================================
-- ALTA MEDIA - ENHANCED DATABASE SCHEMA
-- Builds upon existing Alta_Table.sql structure
-- Adds Client Portal and Admin Portal functionality
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES FOR NEW FUNCTIONALITY
-- =====================================================

DO $$
BEGIN
    -- User roles (enhancing existing users table)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('client', 'admin', 'project_manager');
    END IF;

    -- User status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_enum') THEN
        CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended');
    END IF;

    -- Package types (enhancing existing packages table)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'package_type_enum') THEN
        CREATE TYPE package_type_enum AS ENUM ('meta_marketing', 'ai_marketing', 'website_dev', 'google_ads');
    END IF;

    -- Campaign status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campaign_status_enum') THEN
        CREATE TYPE campaign_status_enum AS ENUM ('active', 'paused', 'completed', 'draft');
    END IF;

    -- Deliverable types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deliverable_type_enum') THEN
        CREATE TYPE deliverable_type_enum AS ENUM ('graphics', 'reels', 'ads', 'website', 'branding', 'campaign');
    END IF;

    -- Deliverable status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deliverable_status_enum') THEN
        CREATE TYPE deliverable_status_enum AS ENUM ('pending', 'in_progress', 'review', 'approved', 'delivered', 'revision');
    END IF;

    -- Priority levels
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_enum') THEN
        CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
    END IF;

    -- Support ticket status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status_enum') THEN
        CREATE TYPE ticket_status_enum AS ENUM ('open', 'in_progress', 'resolved', 'closed');
    END IF;

    -- Activity types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type_enum') THEN
        CREATE TYPE activity_type_enum AS ENUM ('login', 'download', 'approve', 'revision', 'view', 'upload', 'message');
    END IF;

    -- Project status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status_enum') THEN
        CREATE TYPE project_status_enum AS ENUM ('active', 'completed', 'paused', 'cancelled');
    END IF;

    -- Milestone status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'milestone_status_enum') THEN
        CREATE TYPE milestone_status_enum AS ENUM ('pending', 'in_progress', 'completed');
    END IF;
END;
$$;

-- =====================================================
-- ENHANCE EXISTING TABLES
-- =====================================================

-- Add new columns to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS role user_role_enum DEFAULT 'client',
ADD COLUMN IF NOT EXISTS status user_status_enum DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Add new columns to existing packages table
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS package_type package_type_enum,
ADD COLUMN IF NOT EXISTS features JSONB;

-- Add new columns to existing package_purchases table
ALTER TABLE package_purchases 
ADD COLUMN IF NOT EXISTS project_manager_id BIGINT REFERENCES users(id);

-- =====================================================
-- NEW TABLES FOR CLIENT & ADMIN PORTALS
-- =====================================================

-- User profiles for additional client information
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    industry VARCHAR(100),
    website VARCHAR(255),
    social_media_links JSONB,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table for organizing work
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    package_purchase_id INTEGER REFERENCES package_purchases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status_enum DEFAULT 'active',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE,
    end_date DATE,
    project_manager_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project milestones
CREATE TABLE IF NOT EXISTS project_milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completed_at TIMESTAMP,
    status milestone_status_enum DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Deliverables table for tracking project deliverables
CREATE TABLE IF NOT EXISTS deliverables (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    package_purchase_id INTEGER REFERENCES package_purchases(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type deliverable_type_enum,
    status deliverable_status_enum DEFAULT 'pending',
    priority priority_enum DEFAULT 'medium',
    assigned_to BIGINT REFERENCES users(id),
    due_date DATE,
    delivered_at TIMESTAMP,
    files JSONB, -- Array of file URLs
    feedback TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Deliverable files table for better file management
CREATE TABLE IF NOT EXISTS deliverable_files (
    id SERIAL PRIMARY KEY,
    deliverable_id INTEGER REFERENCES deliverables(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns table for tracking marketing campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    package_purchase_id INTEGER REFERENCES package_purchases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status campaign_status_enum DEFAULT 'active',
    platform VARCHAR(50), -- 'facebook', 'instagram', 'google', etc.
    budget DECIMAL(10, 2),
    budget_used DECIMAL(10, 2) DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    ctr DECIMAL(5, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics data for tracking performance
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend DECIMAL(10, 2) DEFAULT 0,
    ctr DECIMAL(5, 2) DEFAULT 0,
    cpc DECIMAL(10, 2) DEFAULT 0,
    cpm DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Activity logs for tracking user actions
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    action_type activity_type_enum NOT NULL,
    action_description TEXT,
    related_entity_type VARCHAR(50), -- 'deliverable', 'campaign', 'package'
    related_entity_id INTEGER,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ticket_status_enum DEFAULT 'open',
    priority priority_enum DEFAULT 'medium',
    category VARCHAR(50), -- 'technical', 'billing', 'deliverables', 'general'
    assigned_to BIGINT REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table for internal communication
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    recipient_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ENHANCE EXISTING FORM TABLES
-- =====================================================

-- Add missing columns to existing company_brand_kit_forms if they don't exist
ALTER TABLE company_brand_kit_forms 
ADD COLUMN IF NOT EXISTS spending_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS secondary_audience TEXT,
ADD COLUMN IF NOT EXISTS emotional_goal VARCHAR(50),
ADD COLUMN IF NOT EXISTS culture_description TEXT,
ADD COLUMN IF NOT EXISTS business_stage VARCHAR(50);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate progress percentage for forms
CREATE OR REPLACE FUNCTION calculate_form_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate progress based on current_step (11 steps total for BrandKit)
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

-- Create triggers for updated_at on new tables
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at 
    BEFORE UPDATE ON deliverables 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at 
    BEFORE UPDATE ON campaigns 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for form progress calculation (if not already exists)
DROP TRIGGER IF EXISTS update_brandkit_progress ON company_brand_kit_forms;
CREATE TRIGGER update_brandkit_progress 
    BEFORE INSERT OR UPDATE ON company_brand_kit_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_form_progress();

DROP TRIGGER IF EXISTS update_product_service_progress ON product_service_forms;
CREATE TRIGGER update_product_service_progress 
    BEFORE INSERT OR UPDATE ON product_service_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_form_progress();

DROP TRIGGER IF EXISTS update_organization_progress ON organization_forms;
CREATE TRIGGER update_organization_progress 
    BEFORE INSERT OR UPDATE ON organization_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_form_progress();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- New table indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON projects(project_manager_id);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON project_milestones(status);

CREATE INDEX IF NOT EXISTS idx_deliverables_user_id ON deliverables(user_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_type ON deliverables(type);
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status);
CREATE INDEX IF NOT EXISTS idx_deliverables_assigned_to ON deliverables(assigned_to);

CREATE INDEX IF NOT EXISTS idx_deliverable_files_deliverable_id ON deliverable_files(deliverable_id);
CREATE INDEX IF NOT EXISTS idx_deliverable_files_uploaded_by ON deliverable_files(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_campaign_id ON analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enhanced indexes for existing tables
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);

CREATE INDEX IF NOT EXISTS idx_packages_type ON packages(package_type);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample admin user (if not exists)
INSERT INTO users (email, password, fullname, role, status) 
VALUES ('admin@altamedia.com', '$2b$10$encrypted_password_hash', 'Admin User', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample project manager (if not exists)
INSERT INTO users (email, password, fullname, role, status) 
VALUES ('pm@altamedia.com', '$2b$10$encrypted_password_hash', 'Project Manager', 'project_manager', 'active')
ON CONFLICT (email) DO NOTHING;

-- Update existing packages with package_type if not set
UPDATE packages 
SET package_type = CASE 
    WHEN name ILIKE '%meta%' THEN 'meta_marketing'::package_type_enum
    WHEN name ILIKE '%ai%' THEN 'ai_marketing'::package_type_enum
    WHEN name ILIKE '%website%' THEN 'website_dev'::package_type_enum
    WHEN name ILIKE '%google%' THEN 'google_ads'::package_type_enum
    ELSE 'meta_marketing'::package_type_enum
END
WHERE package_type IS NULL;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for client dashboard data
CREATE OR REPLACE VIEW client_dashboard_view AS
SELECT 
    u.id as user_id,
    u.fullname,
    u.email,
    u.company,
    COUNT(DISTINCT pp.id) as active_packages,
    COUNT(DISTINCT d.id) as total_deliverables,
    COUNT(DISTINCT c.id) as active_campaigns,
    AVG(c.ctr) as avg_ctr,
    SUM(c.budget_used) as total_spend
FROM users u
LEFT JOIN package_purchases pp ON u.id = pp.user_id AND pp.status = 'active'
LEFT JOIN deliverables d ON u.id = d.user_id
LEFT JOIN campaigns c ON u.id = c.user_id AND c.status = 'active'
WHERE u.role = 'client'
GROUP BY u.id, u.fullname, u.email, u.company;

-- View for admin dashboard overview
CREATE OR REPLACE VIEW admin_dashboard_view AS
SELECT 
    COUNT(DISTINCT u.id) as total_clients,
    COUNT(DISTINCT CASE WHEN u.role = 'client' THEN u.id END) as client_count,
    COUNT(DISTINCT CASE WHEN u.role = 'admin' THEN u.id END) as admin_count,
    COUNT(DISTINCT CASE WHEN u.role = 'project_manager' THEN u.id END) as pm_count,
    COUNT(DISTINCT pp.id) as active_packages,
    COUNT(DISTINCT d.id) as total_deliverables,
    COUNT(DISTINCT c.id) as active_campaigns,
    SUM(c.budget_used) as total_budget_used,
    AVG(c.ctr) as avg_ctr
FROM users u
LEFT JOIN package_purchases pp ON u.id = pp.user_id AND pp.status = 'active'
LEFT JOIN deliverables d ON u.id = d.user_id
LEFT JOIN campaigns c ON u.id = c.user_id AND c.status = 'active';

-- View for package distribution
CREATE OR REPLACE VIEW package_distribution_view AS
SELECT 
    p.package_type,
    COUNT(pp.id) as active_purchases,
    SUM(pp.total_amount) as total_revenue
FROM packages p
LEFT JOIN package_purchases pp ON p.id = pp.package_id AND pp.status = 'active'
GROUP BY p.package_type;

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to get client's form completion status
CREATE OR REPLACE FUNCTION get_client_form_status(user_id_param BIGINT)
RETURNS TABLE(
    form_type VARCHAR,
    is_completed BOOLEAN,
    current_step INTEGER,
    progress_percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'brandkit'::VARCHAR as form_type,
        cbkf.is_completed,
        cbkf.current_step,
        cbkf.progress_percentage
    FROM company_brand_kit_forms cbkf
    WHERE cbkf.user_id = user_id_param
    
    UNION ALL
    
    SELECT 
        'product_service'::VARCHAR as form_type,
        psf.is_completed,
        psf.current_step,
        psf.progress_percentage
    FROM product_service_forms psf
    WHERE psf.user_id = user_id_param
    
    UNION ALL
    
    SELECT 
        'organization'::VARCHAR as form_type,
        of.is_completed,
        of.current_step,
        of.progress_percentage
    FROM organization_forms of
    WHERE of.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
    user_id_param BIGINT,
    action_type_param activity_type_enum,
    action_description_param TEXT,
    related_entity_type_param VARCHAR DEFAULT NULL,
    related_entity_id_param INTEGER DEFAULT NULL,
    metadata_param JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO activity_logs (
        user_id, 
        action_type, 
        action_description, 
        related_entity_type, 
        related_entity_id, 
        metadata
    ) VALUES (
        user_id_param,
        action_type_param,
        action_description_param,
        related_entity_type_param,
        related_entity_id_param,
        metadata_param
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE user_profiles IS 'Additional user profile information for enhanced client data';
COMMENT ON TABLE projects IS 'Project management for organizing client work';
COMMENT ON TABLE project_milestones IS 'Project milestones and deadlines';
COMMENT ON TABLE deliverables IS 'Project deliverables and assets for client delivery';
COMMENT ON TABLE deliverable_files IS 'File management for deliverables';
COMMENT ON TABLE campaigns IS 'Marketing campaigns and performance tracking';
COMMENT ON TABLE analytics IS 'Performance analytics and metrics for campaigns';
COMMENT ON TABLE activity_logs IS 'User activity tracking for admin monitoring';
COMMENT ON TABLE support_tickets IS 'Customer support ticket system';
COMMENT ON TABLE messages IS 'Internal messaging system between users';

COMMENT ON FUNCTION get_client_form_status(BIGINT) IS 'Get form completion status for a specific client';
COMMENT ON FUNCTION log_user_activity(BIGINT, activity_type_enum, TEXT, VARCHAR, INTEGER, JSONB) IS 'Log user activity for audit trail';

-- =====================================================
-- END OF ENHANCED SCHEMA
-- =====================================================