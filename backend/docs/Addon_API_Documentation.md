# Addon API Documentation

## 📋 Overview

The Addon API provides comprehensive management for addon products and services that can be purchased independently or as part of package deals. This system includes addon creation, management, purchase tracking, and feature management with clear data labeling and organization.

## 🗄️ Database Schema

### Table: `addons`

```sql
CREATE TABLE addons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_type VARCHAR(50) NOT NULL CHECK (price_type IN ('one-time', 'recurring')),
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `addon_features`

```sql
CREATE TABLE addon_features (
    id SERIAL PRIMARY KEY,
    addon_id INTEGER NOT NULL,
    feature_name VARCHAR(255) NOT NULL,
    feature_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
);
```

### Table: `purchased_addons`

```sql
CREATE TABLE purchased_addons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    addon_id INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT NOW(),
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    created_at TIMESTAMP DEFAULT NOW(),
    duration INTEGER,
    price_type VARCHAR(50) DEFAULT 'one-time',
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Database Features

#### Indexes for Performance
```sql
-- Addon indexes
CREATE INDEX idx_addons_active ON addons(is_active);
CREATE INDEX idx_addons_price_type ON addons(price_type);
CREATE INDEX idx_addon_features_addon_id ON addon_features(addon_id);
CREATE INDEX idx_addon_features_active ON addon_features(is_active);

-- Purchase indexes
CREATE INDEX idx_purchased_addons_user_id ON purchased_addons(user_id);
CREATE INDEX idx_purchased_addons_addon_id ON purchased_addons(addon_id);
CREATE INDEX idx_purchased_addons_status ON purchased_addons(status);
```

#### Triggers for Automation
```sql
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_addons_updated_at 
    BEFORE UPDATE ON addons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Authentication

### Public Endpoints
- `GET /api/addons` - Get all active addons
- `GET /api/addons/:id` - Get addon by ID

### Private Endpoints (JWT Required)
- `GET /api/addons/user` - Get current user's purchased addons
- `GET /api/addon-purchases` - Get user's independent addon purchases
- `GET /api/addon-purchases/:id` - Get addon purchase by ID
- `POST /api/addon-purchases` - Create new independent addon purchase
- `PUT /api/addon-purchases/:id/cancel` - Cancel addon purchase

### Admin Only Endpoints
- `POST /api/addons` - Create new addon
- `PUT /api/addons/:id` - Update addon
- `DELETE /api/addons/:id` - Delete addon
- `GET /api/addon-purchases/admin/all` - Get all addon purchases (Admin only)

## 📡 API Endpoints

### Addon Management

#### 1. Get All Active Addons

**GET** `/api/addons`

Retrieves all active addons with their features.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Addons retrieved successfully",
  "data": {
    "total_addons": 2,
    "addons": [
      {
        "addon_id": 1,
        "addon_info": {
          "name": "Social Media Kit",
          "description": "Complete social media assets",
          "price_type": "one-time",
          "base_price": 49.99,
          "is_active": true,
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z"
        },
        "features": [
          {
            "feature_id": 1,
            "feature_info": {
              "feature_name": "Instagram Templates",
              "feature_description": "Ready-to-use Instagram post templates",
              "is_active": true,
              "created_at": "2024-01-15T10:30:00.000Z"
            }
          }
        ]
      }
    ]
  }
}
```

#### 2. Get Addon by ID

**GET** `/api/addons/:id`

Retrieves a specific addon with its features.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Addon retrieved successfully",
  "data": {
    "addon_id": 1,
    "addon_info": {
      "name": "Social Media Kit",
      "description": "Complete social media assets",
      "price_type": "one-time",
      "base_price": 49.99,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "features": [
      {
        "feature_id": 1,
        "feature_info": {
          "feature_name": "Instagram Templates",
          "feature_description": "Ready-to-use Instagram post templates",
          "is_active": true,
          "created_at": "2024-01-15T10:30:00.000Z"
        }
      }
    ]
  }
}
```

#### 3. Create New Addon (Admin Only)

**POST** `/api/addons`

Creates a new addon with optional features.

#### Request Body
```json
{
  "name": "Premium Logo Design",
  "description": "Custom logo design with multiple formats",
  "price_type": "one-time",
  "base_price": 99.99,
  "features": [
    {
      "name": "Vector Files",
      "description": "Scalable vector formats (AI, EPS, SVG)"
    },
    {
      "name": "Multiple Formats",
      "description": "PNG, JPG, and PDF formats included"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Addon created successfully",
  "data": {
    "addon_id": 2,
    "addon_info": {
      "name": "Premium Logo Design",
      "description": "Custom logo design with multiple formats",
      "price_type": "one-time",
      "base_price": 99.99,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "features": [
      {
        "feature_name": "Vector Files",
        "feature_description": "Scalable vector formats (AI, EPS, SVG)",
        "status": "active"
      },
      {
        "feature_name": "Multiple Formats",
        "feature_description": "PNG, JPG, and PDF formats included",
        "status": "active"
      }
    ]
  }
}
```

#### 4. Update Addon (Admin Only)

**PUT** `/api/addons/:id`

Updates an existing addon.

#### Request Body
```json
{
  "name": "Updated Social Media Kit",
  "description": "Enhanced social media assets with new templates",
  "price_type": "one-time",
  "base_price": 59.99,
  "is_active": true
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Addon updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Social Media Kit",
    "description": "Enhanced social media assets with new templates",
    "price_type": "one-time",
    "base_price": 59.99,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:35:00.000Z"
  }
}
```

#### 5. Delete Addon (Admin Only)

**DELETE** `/api/addons/:id`

Deletes an addon.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Addon deleted successfully"
}
```

#### 6. Get User's Purchased Addons

**GET** `/api/addons/user`

Retrieves all addons purchased by the current user.

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "purchase_date": "2024-01-15T10:30:00.000Z",
      "amount_paid": 49.99,
      "status": "active",
      "created_at": "2024-01-15T10:30:00.000Z",
      "addon": {
        "id": 1,
        "name": "Social Media Kit",
        "description": "Complete social media assets",
        "price_type": "one-time",
        "base_price": 49.99
      },
      "package_purchase": {
        "id": 1,
        "purchase_date": "2024-01-15T10:30:00.000Z",
        "expiration_date": "2024-04-15",
        "status": "active",
        "package": {
          "id": 1,
          "name": "Premium Package",
          "description": "Complete branding solution"
        }
      }
    }
  ]
}
```

### Addon Purchase Management

#### 1. Get User's Independent Addon Purchases

**GET** `/api/addon-purchases`

Retrieves all independent addon purchases for the current user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Addon purchases retrieved successfully",
  "data": {
    "user_id": 123,
    "total_addon_purchases": 1,
    "addon_purchases": [
      {
        "addon_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00.000Z",
          "status": "active",
          "base_price": 49.99,
          "price_type": "one-time",
          "duration": null,
          "created_at": "2024-01-15T10:30:00.000Z"
        },
        "addon_details": {
          "addon_id": 1,
          "addon_name": "Social Media Kit",
          "addon_description": "Complete social media assets",
          "price_type": "one-time",
          "base_price": 49.99
        }
      }
    ]
  }
}
```

#### 2. Get Addon Purchase by ID

**GET** `/api/addon-purchases/:id`

Retrieves a specific addon purchase for the current user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Addon purchase details retrieved successfully",
  "data": {
    "addon_purchase_id": 1,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00.000Z",
      "status": "active",
      "base_price": 49.99,
      "price_type": "one-time",
      "duration": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "addon_details": {
      "addon_id": 1,
      "addon_name": "Social Media Kit",
      "addon_description": "Complete social media assets",
      "price_type": "one-time",
      "base_price": 49.99
    }
  }
}
```

#### 3. Create New Independent Addon Purchase

**POST** `/api/addon-purchases`

Creates a new independent addon purchase.

#### Request Body
```json
{
  "addon_id": 1
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Addon purchase created successfully",
  "data": {
    "addon_purchase_id": 2,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00.000Z",
      "status": "active",
      "base_price": 49.99,
      "price_type": "one-time",
      "duration": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "addon_details": {
      "addon_id": 1,
      "addon_name": "Social Media Kit",
      "addon_description": "Complete social media assets",
      "price_type": "one-time",
      "base_price": 49.99
    }
  }
}
```

#### 4. Cancel Addon Purchase

**PUT** `/api/addon-purchases/:id/cancel`

Cancels an addon purchase.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Addon purchase cancelled successfully",
  "data": {
    "addon_purchase_id": 1,
    "status": "cancelled"
  }
}
```

#### 5. Get All Addon Purchases (Admin Only)

**GET** `/api/addon-purchases/admin/all`

Retrieves all addon purchases across all users.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "All addon purchases retrieved successfully",
  "data": {
    "total_addon_purchases": 2,
    "addon_purchases": [
      {
        "addon_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00.000Z",
          "status": "active",
          "base_price": 49.99,
          "price_type": "one-time",
          "duration": null,
          "created_at": "2024-01-15T10:30:00.000Z"
        },
        "user_details": {
          "user_id": 123,
          "user_email": "user@example.com"
        },
        "addon_details": {
          "addon_id": 1,
          "addon_name": "Social Media Kit",
          "addon_description": "Complete social media assets",
          "price_type": "one-time",
          "base_price": 49.99
        }
      }
    ]
  }
}
```

## 🔧 Implementation Details

### File Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── addonController.js
│   │   └── addonPurchaseController.js
│   ├── routes/
│   │   ├── addonRoutes.js
│   │   └── addonPurchaseRoutes.js
│   └── server.js
├── docs/
│   └── Addon_API_Documentation.md
└── database/
    └── schema.sql
```

### Key Features

1. **Comprehensive Addon Management**
   - CRUD operations for addons
   - Feature management for each addon
   - Admin-only creation and modification
   - Public viewing of active addons

2. **Purchase Tracking**
   - Independent addon purchases
   - Package-linked addon purchases
   - Purchase status management
   - User-specific purchase history

3. **Data Organization**
   - Clear labeling of data structures
   - Separated purchase info from addon details
   - Organized feature management
   - Consistent response formats

4. **Role-Based Access Control**
   - Public endpoints for viewing
   - Private endpoints for user actions
   - Admin-only endpoints for management
   - JWT authentication for protected routes

### Database Features

1. **Indexes for Performance**
   - User ID indexes for fast lookups
   - Addon ID indexes for feature queries
   - Status indexes for filtering
   - Price type indexes for categorization

2. **Triggers for Automation**
   - Automatic `updated_at` timestamp updates
   - Data integrity constraints
   - Foreign key relationships

3. **Data Integrity**
   - Foreign key constraints
   - Check constraints for price validation
   - Status validation constraints
   - Cascade delete relationships

## 🎨 Frontend Integration

### API Integration Examples

#### Get All Addons
```javascript
const response = await fetch('/api/addons', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('Available addons:', data.data.addons);
```

#### Purchase Addon
```javascript
const response = await fetch('/api/addon-purchases', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    addon_id: 1
  })
});

const data = await response.json();
console.log('Purchase created:', data.data);
```

#### Get User Purchases
```javascript
const response = await fetch('/api/addon-purchases', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('User purchases:', data.data.addon_purchases);
```

## 🧪 Testing

### Test Scenarios

1. **Addon Management**
   - Create new addon with features
   - Update existing addon
   - Delete addon
   - View all active addons
   - View specific addon with features

2. **Purchase Flow**
   - Purchase addon independently
   - View user's purchases
   - Cancel purchase
   - Admin view all purchases

3. **Access Control**
   - Public access to view addons
   - Private access for user actions
   - Admin-only access for management

4. **Data Validation**
   - Invalid addon ID
   - Missing required fields
   - Invalid price types
   - Authentication failures

### Test Data Examples

#### Create Addon
```json
{
  "name": "Premium Logo Design",
  "description": "Custom logo design with multiple formats",
  "price_type": "one-time",
  "base_price": 99.99,
  "features": [
    {
      "name": "Vector Files",
      "description": "Scalable vector formats (AI, EPS, SVG)"
    },
    {
      "name": "Multiple Formats",
      "description": "PNG, JPG, and PDF formats included"
    }
  ]
}
```

#### Purchase Addon
```json
{
  "addon_id": 1
}
```

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Addon not found"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Addon purchase not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch addons",
  "error": "Database connection error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Get All Addons
```bash
curl -X GET http://localhost:3000/api/addons
```

#### Get Addon by ID
```bash
curl -X GET http://localhost:3000/api/addons/1
```

#### Create Addon (Admin)
```bash
curl -X POST http://localhost:3000/api/addons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Premium Logo Design",
    "description": "Custom logo design with multiple formats",
    "price_type": "one-time",
    "base_price": 99.99,
    "features": [
      {
        "name": "Vector Files",
        "description": "Scalable vector formats (AI, EPS, SVG)"
      }
    ]
  }'
```

#### Purchase Addon
```bash
curl -X POST http://localhost:3000/api/addon-purchases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "addon_id": 1
  }'
```

#### Get User Purchases
```bash
curl -X GET http://localhost:3000/api/addon-purchases \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript/Fetch Examples

#### Get All Addons
```javascript
const response = await fetch('/api/addons');
const data = await response.json();
console.log('Available addons:', data.data.addons);
```

#### Purchase Addon
```javascript
const response = await fetch('/api/addon-purchases', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    addon_id: 1
  })
});

const data = await response.json();
if (data.success) {
  console.log('Purchase successful:', data.data);
} else {
  console.error('Purchase failed:', data.message);
}
```

## 🔄 Recent Updates

### Version 1.0.0 (Latest)
- ✅ **Comprehensive Addon Management**
  - CRUD operations for addons
  - Feature management system
  - Admin-only creation and modification
  - Public viewing of active addons

- ✅ **Purchase Tracking System**
  - Independent addon purchases
  - Package-linked addon purchases
  - Purchase status management
  - User-specific purchase history

- ✅ **Data Organization**
  - Clear labeling of data structures
  - Separated purchase info from addon details
  - Organized feature management
  - Consistent response formats

- ✅ **Role-Based Access Control**
  - Public endpoints for viewing
  - Private endpoints for user actions
  - Admin-only endpoints for management
  - JWT authentication for protected routes

- ✅ **Database Optimization**
  - Comprehensive indexing for performance
  - Foreign key constraints for data integrity
  - Automatic triggers for timestamps
  - Check constraints for validation

## 📝 Notes

1. **Data Labeling**: All responses use clear, descriptive field names for better readability and frontend integration.

2. **Purchase Types**: Addons can be purchased independently or as part of package deals, with separate tracking for each.

3. **Feature Management**: Each addon can have multiple features with individual activation status.

4. **Status Management**: Purchases can have different statuses (active, cancelled, expired) for proper lifecycle management.

5. **Performance**: Optimized with database indexes and efficient queries for large datasets.

6. **Scalability**: Designed to handle multiple concurrent users and large addon catalogs.

7. **Security**: Role-based access control ensures proper authorization for different operations.

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Maintainer**: Edjay Lindayao
