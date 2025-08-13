-- Alta Media Web App - Redesigned Database Schema
-- This schema is designed for the core functionality of the Alta Media platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (for both regular users and admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table (simplified to match frontend requirements)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    phone_number VARCHAR(50),
    email_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products/Services table
CREATE TABLE products_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'product' CHECK (type IN ('product', 'service')),
    category VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'PHP',
    website VARCHAR(500),
    features TEXT,
    target_audience TEXT,
    competitors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BRAND KIT TABLES
-- =====================================================

-- Brand Kit Forms table (for companies)
CREATE TABLE company_brand_kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Business Information
    business_email VARCHAR(255),
    has_proventous_id VARCHAR(10),
    proventous_id VARCHAR(255),
    business_name VARCHAR(255),
    contact_number VARCHAR(50),
    preferred_contact VARCHAR(50),
    industry TEXT[], -- Array of industries
    year_started INTEGER,
    primary_location JSONB,
    
    -- Brand Identity
    behind_brand TEXT,
    current_customers TEXT[],
    want_to_attract TEXT,
    team_description TEXT,
    desired_emotion VARCHAR(100),
    target_professions TEXT[],
    reach_locations TEXT[],
    age_groups TEXT[],
    spending_habits TEXT[],
    interaction_methods TEXT[],
    customer_challenges TEXT,
    customer_motivation TEXT,
    audience_behavior TEXT[],
    customer_choice TEXT,
    
    -- Brand Personality
    culture_words TEXT[],
    team_traditions TEXT,
    team_highlights TEXT,
    reason1 VARCHAR(255),
    reason2 VARCHAR(255),
    reason3 VARCHAR(255),
    brand_soul VARCHAR(255),
    brand_tone TEXT[],
    brand1 TEXT,
    brand2 TEXT,
    brand3 TEXT,
    brand_avoid TEXT,
    
    -- Mission & Values
    mission_statement TEXT,
    long_term_vision TEXT,
    core_values TEXT[],
    brand_personality TEXT[],
    
    -- Visual Identity
    has_logo VARCHAR(10),
    logo_action TEXT[],
    preferred_colors TEXT[],
    colors_to_avoid TEXT[],
    font_styles TEXT[],
    design_style TEXT[],
    logo_type TEXT[],
    imagery_style TEXT[],
    inspiration_links TEXT,
    
    -- Usage & Goals
    brand_kit_use TEXT[],
    brand_elements TEXT[],
    file_formats TEXT[],
    primary_goal TEXT,
    short_term_goals TEXT,
    mid_term_goals TEXT,
    long_term_goal TEXT,
    big_picture_vision TEXT,
    success_metrics TEXT[],
    
    -- Additional Information
    business_description TEXT,
    inspiration TEXT,
    target_interests TEXT[],
    current_interests TEXT[],
    special_notes TEXT,
    timeline VARCHAR(100),
    approver VARCHAR(255),
    reference_materials TEXT,
    
    -- Form Progress
    current_step INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brand Kit Forms table (for products/services)
CREATE TABLE product_brand_kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_service_id UUID NOT NULL REFERENCES products_services(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Product Information
    building_type VARCHAR(50) DEFAULT 'product',
    product_name VARCHAR(255),
    product_description TEXT,
    industry TEXT[],
    want_to_attract TEXT,
    mission_story TEXT,
    desired_emotion VARCHAR(100),
    brand_tone VARCHAR(100),
    target_audience_profile TEXT,
    reach_locations TEXT[],
    
    -- Brand Identity
    brand_personality TEXT[],
    design_style TEXT[],
    preferred_colors TEXT[],
    colors_to_avoid TEXT[],
    competitors TEXT,
    
    -- Usage & Requirements
    brand_kit_use TEXT[],
    brand_elements TEXT[],
    file_formats TEXT[],
    platform_support TEXT[],
    
    -- Project Details
    timeline VARCHAR(100),
    primary_location VARCHAR(255),
    preferred_contact VARCHAR(50),
    approver VARCHAR(255),
    special_notes TEXT,
    reference_materials TEXT,
    
    -- Form Progress
    current_step INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Company Users table (for managing team members)
CREATE TABLE company_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(company_id, user_id)
);

-- =====================================================
-- PACKAGE & SUBSCRIPTION TABLES
-- =====================================================

-- Packages table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    features JSONB, -- Store features as JSON
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Package Purchases table
CREATE TABLE package_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES packages(id),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    features JSONB, -- Store purchased features as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADMIN DASHBOARD TABLES
-- =====================================================

-- Admin Downloads table (for tracking brand kit downloads)
CREATE TABLE admin_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_kit_id UUID NOT NULL,
    brand_kit_type VARCHAR(20) NOT NULL CHECK (brand_kit_type IN ('company', 'product')),
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(500),
    notes TEXT
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Companies indexes
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_name ON companies(name);

-- Products/Services indexes
CREATE INDEX idx_products_company_id ON products_services(company_id);
CREATE INDEX idx_products_type ON products_services(type);

-- Brand Kit indexes
CREATE INDEX idx_company_brand_kits_company_id ON company_brand_kits(company_id);
CREATE INDEX idx_company_brand_kits_user_id ON company_brand_kits(user_id);
CREATE INDEX idx_company_brand_kits_completed ON company_brand_kits(is_completed);

CREATE INDEX idx_product_brand_kits_product_id ON product_brand_kits(product_service_id);
CREATE INDEX idx_product_brand_kits_user_id ON product_brand_kits(user_id);
CREATE INDEX idx_product_brand_kits_completed ON product_brand_kits(is_completed);

-- Company Users indexes
CREATE INDEX idx_company_users_company_id ON company_users(company_id);
CREATE INDEX idx_company_users_user_id ON company_users(user_id);
CREATE INDEX idx_company_users_role ON company_users(role);

-- Package indexes
CREATE INDEX idx_package_purchases_user_id ON package_purchases(user_id);
CREATE INDEX idx_package_purchases_status ON package_purchases(status);
CREATE INDEX idx_package_purchases_expiration ON package_purchases(expiration_date);

-- Admin Downloads indexes
CREATE INDEX idx_admin_downloads_admin_id ON admin_downloads(admin_user_id);
CREATE INDEX idx_admin_downloads_brand_kit_type ON admin_downloads(brand_kit_type);
CREATE INDEX idx_admin_downloads_date ON admin_downloads(download_date);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_services_updated_at BEFORE UPDATE ON products_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_brand_kits_updated_at BEFORE UPDATE ON company_brand_kits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_brand_kits_updated_at BEFORE UPDATE ON product_brand_kits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_users_updated_at BEFORE UPDATE ON company_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_package_purchases_updated_at BEFORE UPDATE ON package_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample admin user
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@altamedia.com', '$2y$10$example_hash', 'Admin User', 'admin');

-- Insert sample packages
INSERT INTO packages (name, description, price, duration_days, features) VALUES 
('Starter', 'Basic package for small businesses', 99.00, 30, '["Basic Brand Kit", "1 Company", "2 Products"]'),
('Professional', 'Professional package for growing businesses', 199.00, 30, '["Advanced Brand Kit", "3 Companies", "Unlimited Products", "Team Management"]'),
('Enterprise', 'Enterprise package for large organizations', 399.00, 30, '["Premium Brand Kit", "Unlimited Companies", "Unlimited Products", "Advanced Analytics", "Priority Support"]');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for company dashboard data
CREATE VIEW company_dashboard AS
SELECT 
    c.id as company_id,
    c.name as company_name,
    c.industry,
    COUNT(ps.id) as total_products,
    COUNT(CASE WHEN cbk.is_completed = true THEN 1 END) as completed_company_brand_kits,
    COUNT(CASE WHEN pbk.is_completed = true THEN 1 END) as completed_product_brand_kits,
    COUNT(cu.id) as total_team_members
FROM companies c
LEFT JOIN products_services ps ON c.id = ps.company_id
LEFT JOIN company_brand_kits cbk ON c.id = cbk.company_id
LEFT JOIN product_brand_kits pbk ON ps.id = pbk.product_service_id
LEFT JOIN company_users cu ON c.id = cu.company_id AND cu.is_active = true
GROUP BY c.id, c.name, c.industry;

-- View for user's active packages
CREATE VIEW user_active_packages AS
SELECT 
    u.id as user_id,
    u.email,
    p.name as package_name,
    pp.purchase_date,
    pp.expiration_date,
    pp.status,
    pp.features
FROM users u
JOIN package_purchases pp ON u.id = pp.user_id
JOIN packages p ON pp.package_id = p.id
WHERE pp.status = 'active' AND pp.expiration_date >= CURRENT_DATE;

-- View for admin brand kit downloads
CREATE VIEW admin_brand_kit_downloads AS
SELECT 
    ad.id,
    u.full_name as admin_name,
    u.email as admin_email,
    ad.brand_kit_type,
    ad.download_date,
    ad.notes,
    CASE 
        WHEN ad.brand_kit_type = 'company' THEN cbk.business_name
        WHEN ad.brand_kit_type = 'product' THEN ps.name
    END as brand_kit_name
FROM admin_downloads ad
JOIN users u ON ad.admin_user_id = u.id
LEFT JOIN company_brand_kits cbk ON ad.brand_kit_id = cbk.id AND ad.brand_kit_type = 'company'
LEFT JOIN product_brand_kits pbk ON ad.brand_kit_id = pbk.id AND ad.brand_kit_type = 'product'
LEFT JOIN products_services ps ON pbk.product_service_id = ps.id;
