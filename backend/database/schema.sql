-- Supabase Package Management Database Schema
-- This schema is optimized for Supabase (PostgreSQL)

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    phone_number VARCHAR(50),
    address TEXT,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create package_features table
CREATE TABLE IF NOT EXISTS package_features (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL,
    feature_name VARCHAR(255) NOT NULL,
    feature_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Create addons table (standalone table for better flexibility)
CREATE TABLE IF NOT EXISTS addons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_type VARCHAR(50) NOT NULL CHECK (price_type IN ('one-time', 'recurring')),
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create package_purchases table
CREATE TABLE IF NOT EXISTS package_purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT NOW(),
    expiration_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Create purchased_addons table
CREATE TABLE IF NOT EXISTS purchased_addons (
    id SERIAL PRIMARY KEY,
    package_purchase_id INTEGER NOT NULL,
    addon_id INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT NOW(),
    amount_paid DECIMAL(10, 2) NOT NULL CHECK (amount_paid >= 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (package_purchase_id) REFERENCES package_purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
);

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at
CREATE TRIGGER update_packages_updated_at 
    BEFORE UPDATE ON packages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addons_updated_at 
    BEFORE UPDATE ON addons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_package_purchases_updated_at 
    BEFORE UPDATE ON package_purchases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_name ON packages(name);
CREATE INDEX IF NOT EXISTS idx_package_features_package_id ON package_features(package_id);
CREATE INDEX IF NOT EXISTS idx_package_features_active ON package_features(is_active);
CREATE INDEX IF NOT EXISTS idx_addons_active ON addons(is_active);
CREATE INDEX IF NOT EXISTS idx_addons_price_type ON addons(price_type);
CREATE INDEX IF NOT EXISTS idx_package_purchases_user_id ON package_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_package_purchases_package_id ON package_purchases(package_id);
CREATE INDEX IF NOT EXISTS idx_package_purchases_status ON package_purchases(status);
CREATE INDEX IF NOT EXISTS idx_package_purchases_expiration ON package_purchases(expiration_date);
CREATE INDEX IF NOT EXISTS idx_purchased_addons_package_purchase_id ON purchased_addons(package_purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchased_addons_addon_id ON purchased_addons(addon_id);
CREATE INDEX IF NOT EXISTS idx_purchased_addons_status ON purchased_addons(status);
