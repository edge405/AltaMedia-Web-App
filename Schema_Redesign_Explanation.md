# Alta Media Database Schema Redesign - Explanation

## Overview

This redesigned schema focuses on the core functionality of your Alta Media platform, simplifying the structure while maintaining all essential features. The schema is designed to support:

1. **User Authentication** (both regular users and admins)
2. **Company Management** (simplified to 4 fields: name, industry, phone, email)
3. **Product/Service Management**
4. **Brand Kit Forms** (separate for companies and products)
5. **Team Member Management**
6. **Package/Subscription System**
7. **Admin Dashboard** (for brand kit downloads)

## Key Changes from Original Schema

### 1. **Simplified Company Structure**
- **Before**: 9 fields (name, industry, description, website, phone, email, address, employeeCount, foundedYear)
- **After**: 4 fields (name, industry, phone_number, email_address)
- **Reason**: Matches your frontend requirements exactly

### 2. **Unified User System**
- Single `users` table handles both regular users and admins
- Role-based access control with `role` field ('user' or 'admin')
- Simplified user profile with essential fields only

### 3. **Separated Brand Kit Tables**
- `company_brand_kits` - for company brand kits
- `product_brand_kits` - for product/service brand kits
- Each maintains all the detailed form fields from your existing forms

### 4. **Enhanced Admin Functionality**
- `admin_downloads` table tracks all brand kit downloads
- Views for easy reporting and analytics
- Proper audit trail for admin actions

## Database Structure Explanation

### Core Tables

#### 1. **users**
```sql
- id (UUID, Primary Key)
- email (Unique)
- password_hash
- full_name
- phone_number
- role ('user' or 'admin')
- is_active
- email_verified_at
- created_at, updated_at
```

**Purpose**: Central user management for both regular users and admins.

#### 2. **companies**
```sql
- id (UUID, Primary Key)
- user_id (Foreign Key to users)
- name
- industry
- phone_number
- email_address
- created_at, updated_at
```

**Purpose**: Stores company information with the simplified 4-field structure.

#### 3. **products_services**
```sql
- id (UUID, Primary Key)
- company_id (Foreign Key to companies)
- name, type, category, description
- price, currency, website
- features, target_audience, competitors
- created_at, updated_at
```

**Purpose**: Manages products and services for each company.

### Brand Kit Tables

#### 4. **company_brand_kits**
Contains all the detailed form fields for company brand kits, including:
- Business information
- Brand identity
- Brand personality
- Mission & values
- Visual identity
- Usage & goals
- Form progress tracking

#### 5. **product_brand_kits**
Contains all the detailed form fields for product/service brand kits, including:
- Product information
- Brand identity
- Usage & requirements
- Project details
- Form progress tracking

### User Management

#### 6. **company_users**
```sql
- id (UUID, Primary Key)
- company_id (Foreign Key to companies)
- user_id (Foreign Key to users)
- role ('owner', 'admin', 'member')
- is_active
- joined_at
- created_at, updated_at
```

**Purpose**: Manages team members for each company with role-based access.

### Package System

#### 7. **packages**
```sql
- id (UUID, Primary Key)
- name, description
- price, duration_days
- features (JSONB)
- is_active
- created_at, updated_at
```

**Purpose**: Defines available subscription packages.

#### 8. **package_purchases**
```sql
- id (UUID, Primary Key)
- user_id (Foreign Key to users)
- package_id (Foreign Key to packages)
- purchase_date, expiration_date
- status ('active', 'expired', 'cancelled')
- total_amount
- features (JSONB)
- created_at, updated_at
```

**Purpose**: Tracks user package purchases and subscriptions.

### Admin Dashboard

#### 9. **admin_downloads**
```sql
- id (UUID, Primary Key)
- admin_user_id (Foreign Key to users)
- brand_kit_id (UUID)
- brand_kit_type ('company' or 'product')
- download_date
- file_path
- notes
```

**Purpose**: Tracks all brand kit downloads by admins for audit and reporting.

## How It Works

### 1. **User Flow**

#### Regular User Journey:
1. **Register/Login** → `users` table
2. **Add Company** → `companies` table (4 fields only)
3. **Add Products/Services** → `products_services` table
4. **Fill Brand Kit** → `company_brand_kits` or `product_brand_kits` tables
5. **Manage Team** → `company_users` table
6. **View Dashboard** → Uses views for aggregated data

#### Admin Journey:
1. **Login** → `users` table (role = 'admin')
2. **View Brand Kits** → Query `company_brand_kits` and `product_brand_kits`
3. **Download Brand Kits** → Insert into `admin_downloads` table
4. **Generate Reports** → Use provided views

### 2. **Data Relationships**

```
users (1) ←→ (many) companies
companies (1) ←→ (many) products_services
companies (1) ←→ (many) company_brand_kits
products_services (1) ←→ (many) product_brand_kits
companies (1) ←→ (many) company_users
users (1) ←→ (many) company_users
users (1) ←→ (many) package_purchases
packages (1) ←→ (many) package_purchases
```

### 3. **Key Features**

#### **Automatic Timestamps**
- All tables have `created_at` and `updated_at` fields
- Triggers automatically update `updated_at` on record changes

#### **Performance Optimization**
- Strategic indexes on frequently queried fields
- Views for complex aggregations
- JSONB fields for flexible feature storage

#### **Data Integrity**
- Foreign key constraints ensure referential integrity
- Check constraints validate data (e.g., role values)
- Unique constraints prevent duplicates

## Admin Dashboard Implementation

### 1. **Backend API Endpoints Needed**

```javascript
// Authentication
POST /api/admin/login
POST /api/admin/logout

// Brand Kit Management
GET /api/admin/brand-kits/companies
GET /api/admin/brand-kits/products
GET /api/admin/brand-kits/:id/download
POST /api/admin/brand-kits/:id/download

// Reporting
GET /api/admin/downloads
GET /api/admin/downloads/stats
GET /api/admin/users/stats
GET /api/admin/companies/stats
```

### 2. **Database Queries for Admin Dashboard**

#### **Get All Company Brand Kits:**
```sql
SELECT 
    cbk.id,
    cbk.business_name,
    c.name as company_name,
    u.email as user_email,
    cbk.is_completed,
    cbk.created_at,
    cbk.completed_at
FROM company_brand_kits cbk
JOIN companies c ON cbk.company_id = c.id
JOIN users u ON cbk.user_id = u.id
ORDER BY cbk.created_at DESC;
```

#### **Get All Product Brand Kits:**
```sql
SELECT 
    pbk.id,
    pbk.product_name,
    ps.name as product_service_name,
    c.name as company_name,
    u.email as user_email,
    pbk.is_completed,
    pbk.created_at,
    pbk.completed_at
FROM product_brand_kits pbk
JOIN products_services ps ON pbk.product_service_id = ps.id
JOIN companies c ON ps.company_id = c.id
JOIN users u ON pbk.user_id = u.id
ORDER BY pbk.created_at DESC;
```

#### **Get Download Statistics:**
```sql
SELECT 
    brand_kit_type,
    COUNT(*) as total_downloads,
    COUNT(DISTINCT admin_user_id) as unique_admins,
    DATE_TRUNC('day', download_date) as download_date
FROM admin_downloads
GROUP BY brand_kit_type, DATE_TRUNC('day', download_date)
ORDER BY download_date DESC;
```

### 3. **Admin Dashboard Features**

#### **Brand Kit Management:**
- View all completed brand kits (companies and products)
- Filter by completion status, date range, company
- Download brand kit data (JSON/CSV format)
- Track download history

#### **User Management:**
- View user statistics
- Monitor active subscriptions
- Track user activity

#### **Company Overview:**
- View all companies and their details
- Monitor brand kit completion rates
- Track product/service counts

#### **Reporting:**
- Download statistics
- User growth metrics
- Brand kit completion analytics

## Implementation Steps

### 1. **Database Setup**
1. Run the `Alta_Redesigned_Schema.sql` file
2. Verify all tables, indexes, and views are created
3. Insert sample data for testing

### 2. **Backend Development**
1. Set up authentication system (JWT/Session-based)
2. Create API endpoints for all CRUD operations
3. Implement admin-specific endpoints
4. Add download tracking functionality

### 3. **Frontend Integration**
1. Update API calls to match new schema
2. Modify forms to use simplified company fields
3. Implement admin dashboard interface
4. Add download functionality

### 4. **Testing**
1. Test all user flows
2. Verify admin dashboard functionality
3. Test data integrity and constraints
4. Performance testing with sample data

## Benefits of This Design

### 1. **Simplified Structure**
- Easier to maintain and understand
- Reduced complexity in queries
- Better performance

### 2. **Scalable Architecture**
- UUID primary keys for distributed systems
- JSONB fields for flexible data storage
- Proper indexing for performance

### 3. **Admin Functionality**
- Complete audit trail for downloads
- Easy reporting and analytics
- Role-based access control

### 4. **Data Integrity**
- Foreign key constraints
- Check constraints for data validation
- Automatic timestamp management

This redesigned schema provides a solid foundation for your Alta Media platform while maintaining all the functionality you need for both users and admins.
