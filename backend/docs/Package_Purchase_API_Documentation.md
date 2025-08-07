# Package Purchase API Documentation

## 📋 Overview

The Package Purchase API provides comprehensive management for package purchases and their tracking. This system handles package purchase viewing, user-specific purchase tracking, and administrative oversight with clear data labeling and organization for both user access and admin management.

## 🗄️ Database Schema

### Table: `package_purchases`

```sql
CREATE TABLE package_purchases (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    package_id INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT NOW(),
    expiration_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);
```

### Database Features

#### Indexes for Performance
```sql
-- Purchase indexes
CREATE INDEX idx_package_purchases_user_id ON package_purchases(user_id);
CREATE INDEX idx_package_purchases_package_id ON package_purchases(package_id);
CREATE INDEX idx_package_purchases_status ON package_purchases(status);
CREATE INDEX idx_package_purchases_created_at ON package_purchases(created_at);
```

#### Constraints and Validation
```sql
-- Check constraints for data integrity
CHECK (total_amount >= 0)
CHECK (status IN ('active', 'cancelled', 'expired'))

-- Foreign key constraints
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
```

## 🔐 Authentication

### Private Endpoints (JWT Required)
- `GET /api/package-purchases` - Get user's package purchases
- `GET /api/package-purchases/:id` - Get package purchase by ID

### Admin Only Endpoints
- `GET /api/package-purchases/admin/all` - Get all package purchases (Admin only)

## 📡 API Endpoints

### 1. Get User's Package Purchases

**GET** `/api/package-purchases`

Retrieves all package purchases for the current authenticated user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Package purchases retrieved successfully",
  "data": {
    "user_id": 123,
    "total_package_purchases": 2,
    "package_purchases": [
      {
        "package_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00.000Z",
          "expiration_date": "2024-02-14",
          "status": "active",
          "total_amount": 299.99,
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution with premium features",
          "package_price": 299.99,
          "duration_days": 30,
          "features": [
            {
              "feature_id": 1,
              "feature_info": {
                "feature_name": "Logo Design",
                "feature_description": "Custom logo design with multiple formats",
                "is_active": true,
                "created_at": "2024-01-15T10:30:00.000Z"
              }
            },
            {
              "feature_id": 2,
              "feature_info": {
                "feature_name": "Brand Guidelines",
                "feature_description": "Complete brand style guide and guidelines",
                "is_active": true,
                "created_at": "2024-01-15T10:30:00.000Z"
              }
            }
          ]
        }
      },
      {
        "package_purchase_id": 2,
        "purchase_info": {
          "purchase_date": "2024-01-14T15:45:00.000Z",
          "expiration_date": "2024-01-29",
          "status": "active",
          "total_amount": 149.99,
          "created_at": "2024-01-14T15:45:00.000Z",
          "updated_at": "2024-01-14T15:45:00.000Z"
        },
        "package_details": {
          "package_id": 2,
          "package_name": "Basic Package",
          "package_description": "Essential branding package for startups",
          "package_price": 149.99,
          "duration_days": 15,
          "features": [
            {
              "feature_id": 3,
              "feature_info": {
                "feature_name": "Basic Logo",
                "feature_description": "Simple logo design in standard formats",
                "is_active": true,
                "created_at": "2024-01-14T15:45:00.000Z"
              }
            }
          ]
        }
      }
    ]
  }
}
```

### 2. Get Package Purchase by ID

**GET** `/api/package-purchases/:id`

Retrieves a specific package purchase for the current authenticated user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Package purchase details retrieved successfully",
  "data": {
    "package_purchase_id": 1,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00.000Z",
      "expiration_date": "2024-02-14",
      "status": "active",
      "total_amount": 299.99,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "package_details": {
      "package_id": 1,
      "package_name": "Premium Package",
      "package_description": "Complete branding solution with premium features",
      "package_price": 299.99,
      "duration_days": 30,
      "features": [
        {
          "feature_id": 1,
          "feature_info": {
            "feature_name": "Logo Design",
            "feature_description": "Custom logo design with multiple formats",
            "is_active": true,
            "created_at": "2024-01-15T10:30:00.000Z"
          }
        },
        {
          "feature_id": 2,
          "feature_info": {
            "feature_name": "Brand Guidelines",
            "feature_description": "Complete brand style guide and guidelines",
            "is_active": true,
            "created_at": "2024-01-15T10:30:00.000Z"
          }
        }
      ]
    }
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Package purchase not found"
}
```

### 3. Get All Package Purchases (Admin Only)

**GET** `/api/package-purchases/admin/all`

Retrieves all package purchases across all users (Admin access required).

#### Response (200 OK)
```json
{
  "success": true,
  "message": "All package purchases retrieved successfully",
  "data": {
    "total_package_purchases": 3,
    "package_purchases": [
      {
        "package_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00.000Z",
          "expiration_date": "2024-02-14",
          "status": "active",
          "total_amount": 299.99,
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z"
        },
        "user_details": {
          "user_id": 123,
          "user_email": "user@example.com"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution with premium features",
          "package_price": 299.99,
          "duration_days": 30,
          "features": [
            {
              "feature_id": 1,
              "feature_info": {
                "feature_name": "Logo Design",
                "feature_description": "Custom logo design with multiple formats",
                "is_active": true,
                "created_at": "2024-01-15T10:30:00.000Z"
              }
            }
          ]
        }
      },
      {
        "package_purchase_id": 2,
        "purchase_info": {
          "purchase_date": "2024-01-14T15:45:00.000Z",
          "expiration_date": "2024-01-29",
          "status": "cancelled",
          "total_amount": 149.99,
          "created_at": "2024-01-14T15:45:00.000Z",
          "updated_at": "2024-01-14T15:45:00.000Z"
        },
        "user_details": {
          "user_id": 124,
          "user_email": "another@example.com"
        },
        "package_details": {
          "package_id": 2,
          "package_name": "Basic Package",
          "package_description": "Essential branding package for startups",
          "package_price": 149.99,
          "duration_days": 15,
          "features": [
            {
              "feature_id": 3,
              "feature_info": {
                "feature_name": "Basic Logo",
                "feature_description": "Simple logo design in standard formats",
                "is_active": true,
                "created_at": "2024-01-14T15:45:00.000Z"
              }
            }
          ]
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
│   │   └── packagePurchaseController.js
│   ├── routes/
│   │   └── packagePurchaseRoutes.js
│   └── server.js
├── docs/
│   └── Package_Purchase_API_Documentation.md
└── database/
    └── schema.sql
```

### Key Features

1. **Package Purchase Tracking**
   - User-specific purchase viewing
   - Purchase status management
   - Expiration date tracking
   - Total amount calculation

2. **Data Organization**
   - Clear labeling of data structures
   - Separated purchase info from package details
   - User details for admin views
   - Feature organization within packages

3. **Access Control**
   - User-specific data access
   - Admin-only global view
   - JWT authentication for all endpoints
   - Role-based authorization

4. **Purchase Management**
   - Purchase history tracking
   - Status monitoring (active/cancelled/expired)
   - Expiration date management
   - Complete audit trail

### Database Features

1. **Indexes for Performance**
   - User ID indexes for fast lookups
   - Package ID indexes for feature queries
   - Status indexes for filtering
   - Created date indexes for sorting

2. **Data Integrity**
   - Foreign key constraints
   - Check constraints for amount validation
   - Status validation constraints
   - Cascade delete relationships

3. **Purchase Tracking**
   - Purchase date tracking
   - Expiration date management
   - Status management
   - Total amount calculation

## 🎨 Frontend Integration

### API Integration Examples

#### Get User's Package Purchases
```javascript
const response = await fetch('/api/package-purchases', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('User package purchases:', data.data.package_purchases);
```

#### Get Specific Package Purchase
```javascript
const response = await fetch('/api/package-purchases/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('Package purchase details:', data.data);
} else {
  console.error('Package purchase not found:', data.message);
}
```

#### Get All Package Purchases (Admin)
```javascript
const response = await fetch('/api/package-purchases/admin/all', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('All package purchases:', data.data.package_purchases);
} else {
  console.error('Failed to get purchases:', data.message);
}
```

## 🧪 Testing

### Test Scenarios

1. **Purchase Tracking**
   - View user's package purchases
   - Get specific purchase details
   - Check purchase status
   - Verify expiration dates

2. **Data Validation**
   - Invalid purchase ID
   - Non-existent purchases
   - Missing authentication
   - Admin access control

3. **Error Handling**
   - Database connection errors
   - Invalid request data
   - Authorization failures
   - Not found scenarios

4. **Admin Functions**
   - View all purchases
   - Filter by status
   - User-specific queries
   - Purchase analytics

### Test Data Examples

#### Expected Package Purchase Response
```json
{
  "success": true,
  "message": "Package purchases retrieved successfully",
  "data": {
    "user_id": 123,
    "total_package_purchases": 1,
    "package_purchases": [
      {
        "package_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00.000Z",
          "expiration_date": "2024-02-14",
          "status": "active",
          "total_amount": 299.99,
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution with premium features",
          "package_price": 299.99,
          "duration_days": 30,
          "features": [
            {
              "feature_id": 1,
              "feature_info": {
                "feature_name": "Logo Design",
                "feature_description": "Custom logo design with multiple formats",
                "is_active": true,
                "created_at": "2024-01-15T10:30:00.000Z"
              }
            }
          ]
        }
      }
    ]
  }
}
```

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid purchase ID"
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
  "message": "Package purchase not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch package purchases",
  "error": "Database connection error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Get User's Package Purchases
```bash
curl -X GET http://localhost:3000/api/package-purchases \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Specific Package Purchase
```bash
curl -X GET http://localhost:3000/api/package-purchases/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get All Package Purchases (Admin)
```bash
curl -X GET http://localhost:3000/api/package-purchases/admin/all \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### JavaScript/Fetch Examples

#### Get User's Package Purchases
```javascript
const response = await fetch('/api/package-purchases', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('User package purchases:', data.data.package_purchases);
} else {
  console.error('Failed to get purchases:', data.message);
}
```

#### Get Specific Package Purchase
```javascript
const response = await fetch('/api/package-purchases/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('Package purchase details:', data.data);
} else {
  console.error('Package purchase not found:', data.message);
}
```

#### Get All Package Purchases (Admin)
```javascript
const response = await fetch('/api/package-purchases/admin/all', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('All package purchases:', data.data.package_purchases);
} else {
  console.error('Failed to get all purchases:', data.message);
}
```

## 🔄 Recent Updates

### Version 1.0.0 (Latest)
- ✅ **Package Purchase Tracking**
  - User-specific purchase viewing
  - Purchase status management
  - Expiration date tracking
  - Total amount calculation

- ✅ **Data Organization**
  - Clear labeling of data structures
  - Separated purchase info from package details
  - User details for admin views
  - Feature organization within packages

- ✅ **Access Control**
  - User-specific data access
  - Admin-only global view
  - JWT authentication for all endpoints
  - Role-based authorization

- ✅ **Purchase Management**
  - Purchase history tracking
  - Status monitoring (active/cancelled/expired)
  - Expiration date management
  - Complete audit trail

- ✅ **Database Optimization**
  - Comprehensive indexing for performance
  - Foreign key constraints for data integrity
  - Check constraints for validation
  - Cascade delete relationships

## 📝 Notes

1. **Purchase Tracking**: Complete tracking of package purchases with status management and expiration dates.

2. **Data Organization**: All responses use clear, descriptive field names for better readability and frontend integration.

3. **Status Management**: Purchases can have different statuses (active, cancelled, expired) for proper lifecycle management.

4. **User Isolation**: Users can only access their own purchases, with admin access for global views.

5. **Performance**: Optimized with database indexes and efficient queries for large datasets.

6. **Scalability**: Designed to handle multiple concurrent users and large purchase volumes.

7. **Security**: JWT authentication and role-based access control ensure proper authorization.

8. **Audit Trail**: Complete tracking of purchase creation, modifications, and status changes.

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Maintainer**: Edjay Lindayao
