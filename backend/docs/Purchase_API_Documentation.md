# Purchase API Documentation

## 📋 Overview

The Purchase API provides comprehensive management for complete purchase transactions including packages with addons. This system handles purchase creation, tracking, cancellation, and administrative oversight with clear data labeling and organization for both user access and admin management.

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

### Table: `purchased_addons`

```sql
CREATE TABLE purchased_addons (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    addon_id INTEGER NOT NULL,
    package_purchase_id INTEGER,
    purchase_date TIMESTAMP DEFAULT NOW(),
    amount_paid DECIMAL(10, 2) NOT NULL CHECK (amount_paid >= 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
    FOREIGN KEY (package_purchase_id) REFERENCES package_purchases(id) ON DELETE CASCADE
);
```

### Database Features

#### Indexes for Performance
```sql
-- Purchase indexes
CREATE INDEX idx_package_purchases_user_id ON package_purchases(user_id);
CREATE INDEX idx_package_purchases_package_id ON package_purchases(package_id);
CREATE INDEX idx_package_purchases_status ON package_purchases(status);
CREATE INDEX idx_purchased_addons_user_id ON purchased_addons(user_id);
CREATE INDEX idx_purchased_addons_package_purchase_id ON purchased_addons(package_purchase_id);
CREATE INDEX idx_purchased_addons_status ON purchased_addons(status);
```

#### Constraints and Validation
```sql
-- Check constraints for data integrity
CHECK (total_amount >= 0)
CHECK (amount_paid >= 0)
CHECK (status IN ('active', 'cancelled', 'expired'))

-- Foreign key constraints
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
FOREIGN KEY (package_purchase_id) REFERENCES package_purchases(id) ON DELETE CASCADE
```

## 🔐 Authentication

### Private Endpoints (JWT Required)
- `GET /api/purchases` - Get user's purchases with addons
- `GET /api/purchases/:id` - Get purchase by ID with addons
- `POST /api/purchases` - Create new package purchase with addons
- `PUT /api/purchases/:id/cancel` - Cancel purchase

### Admin Only Endpoints
- `GET /api/admin/purchases` - Get all purchases with addons (Admin only)

## 📡 API Endpoints

### 1. Get User's Purchases with Addons

**GET** `/api/purchases`

Retrieves all purchases for the current authenticated user including package details and associated addons.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "User purchases retrieved successfully",
  "data": {
    "user_id": 123,
    "total_purchases": 2,
    "purchases": [
      {
        "purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00.000Z",
          "expiration_date": "2024-02-14",
          "status": "active",
          "total_amount": 349.98,
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution with premium features",
          "package_price": 299.99,
          "duration_days": 30
        },
        "addons": [
          {
            "addon_purchase_id": 1,
            "addon_details": {
              "addon_id": 1,
              "addon_name": "Social Media Kit",
              "addon_description": "Complete social media assets",
              "price_type": "one-time",
              "base_price": 49.99
            },
            "purchase_info": {
              "amount_paid": 49.99,
              "status": "active",
              "purchase_date": "2024-01-15T10:30:00.000Z",
              "created_at": "2024-01-15T10:30:00.000Z"
            }
          }
        ]
      },
      {
        "purchase_id": 2,
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
          "duration_days": 15
        },
        "addons": []
      }
    ]
  }
}
```

### 2. Get Purchase by ID with Addons

**GET** `/api/purchases/:id`

Retrieves a specific purchase with its package details and associated addons.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Purchase details retrieved successfully",
  "data": {
    "purchase_id": 1,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00.000Z",
      "expiration_date": "2024-02-14",
      "status": "active",
      "total_amount": 349.98,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "package_details": {
      "package_id": 1,
      "package_name": "Premium Package",
      "package_description": "Complete branding solution with premium features",
      "package_price": 299.99,
      "duration_days": 30
    },
    "addons": [
      {
        "addon_purchase_id": 1,
        "addon_details": {
          "addon_id": 1,
          "addon_name": "Social Media Kit",
          "addon_description": "Complete social media assets",
          "price_type": "one-time",
          "base_price": 49.99
        },
        "purchase_info": {
          "amount_paid": 49.99,
          "status": "active",
          "purchase_date": "2024-01-15T10:30:00.000Z",
          "created_at": "2024-01-15T10:30:00.000Z"
        }
      }
    ]
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Purchase not found"
}
```

### 3. Create New Package Purchase with Addons

**POST** `/api/purchases`

Creates a new package purchase with optional addons.

#### Request Body
```json
{
  "package_id": 1,
  "addons": [1, 2]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "purchase_id": 3,
    "purchase_info": {
      "purchase_date": "2024-01-15T11:00:00.000Z",
      "expiration_date": "2024-02-14",
      "status": "active",
      "total_amount": 399.97,
      "created_at": "2024-01-15T11:00:00.000Z",
      "updated_at": "2024-01-15T11:00:00.000Z"
    },
    "package_details": {
      "package_id": 1,
      "package_name": "Premium Package",
      "package_description": "Complete branding solution with premium features",
      "package_price": 299.99,
      "duration_days": 30
    },
    "addons": [
      {
        "addon_id": 1,
        "status": "active"
      },
      {
        "addon_id": 2,
        "status": "active"
      }
    ]
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Package not found"
}
```

### 4. Cancel Purchase

**PUT** `/api/purchases/:id/cancel`

Cancels a purchase and its associated addons.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Purchase cancelled successfully",
  "data": {
    "id": 1,
    "status": "cancelled",
    "purchase_date": "2024-01-15T10:30:00.000Z",
    "expiration_date": "2024-02-14",
    "total_amount": 349.98,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T11:30:00.000Z"
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Purchase not found or already cancelled"
}
```

### 5. Get All Purchases with Addons (Admin Only)

**GET** `/api/admin/purchases`

Retrieves all purchases across all users with package details and addons (Admin access required).

#### Response (200 OK)
```json
{
  "success": true,
  "message": "All purchases retrieved successfully",
  "data": {
    "total_purchases": 3,
    "purchases": [
      {
        "purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00.000Z",
          "expiration_date": "2024-02-14",
          "status": "active",
          "total_amount": 349.98,
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
          "package_description": "Complete branding solution with premium features"
        },
        "addons": [
          {
            "addon_purchase_id": 1,
            "addon_details": {
              "addon_id": 1,
              "addon_name": "Social Media Kit",
              "addon_description": "Complete social media assets",
              "price_type": "one-time",
              "base_price": 49.99
            },
            "purchase_info": {
              "amount_paid": 49.99,
              "status": "active",
              "purchase_date": "2024-01-15T10:30:00.000Z",
              "created_at": "2024-01-15T10:30:00.000Z"
            }
          }
        ]
      },
      {
        "purchase_id": 2,
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
          "package_description": "Essential branding package for startups"
        },
        "addons": []
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
│   │   └── purchaseController.js
│   ├── routes/
│   │   └── purchaseRoutes.js
│   └── server.js
├── docs/
│   └── Purchase_API_Documentation.md
└── database/
    └── schema.sql
```

### Key Features

1. **Complete Purchase Management**
   - Package purchases with addon integration
   - Purchase creation with addon selection
   - Purchase cancellation with addon cancellation
   - Total amount calculation including addons

2. **Data Organization**
   - Clear labeling of data structures
   - Separated purchase info from package details
   - Addon organization within purchases
   - User details for admin views

3. **Access Control**
   - User-specific data access
   - Admin-only global view
   - JWT authentication for all endpoints
   - Role-based authorization

4. **Purchase Lifecycle**
   - Purchase creation with validation
   - Addon integration and management
   - Status tracking and updates
   - Complete audit trail

### Database Features

1. **Indexes for Performance**
   - User ID indexes for fast lookups
   - Package ID indexes for feature queries
   - Status indexes for filtering
   - Addon purchase ID indexes

2. **Data Integrity**
   - Foreign key constraints
   - Check constraints for amount validation
   - Status validation constraints
   - Cascade delete relationships

3. **Purchase Tracking**
   - Purchase date tracking
   - Expiration date management
   - Status management
   - Total amount calculation with addons

## 🎨 Frontend Integration

### API Integration Examples

#### Get User's Purchases
```javascript
const response = await fetch('/api/purchases', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('User purchases:', data.data.purchases);
```

#### Get Specific Purchase
```javascript
const response = await fetch('/api/purchases/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('Purchase details:', data.data);
} else {
  console.error('Purchase not found:', data.message);
}
```

#### Create Purchase with Addons
```javascript
const response = await fetch('/api/purchases', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    package_id: 1,
    addons: [1, 2]
  })
});

const data = await response.json();
if (data.success) {
  console.log('Purchase created:', data.data);
} else {
  console.error('Purchase creation failed:', data.message);
}
```

#### Cancel Purchase
```javascript
const response = await fetch('/api/purchases/1/cancel', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('Purchase cancelled:', data.data);
} else {
  console.error('Cancellation failed:', data.message);
}
```

#### Get All Purchases (Admin)
```javascript
const response = await fetch('/api/admin/purchases', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('All purchases:', data.data.purchases);
} else {
  console.error('Failed to get purchases:', data.message);
}
```

## 🧪 Testing

### Test Scenarios

1. **Purchase Flow**
   - Create package purchase with addons
   - Verify purchase details and addons
   - Check user's purchase list
   - Cancel purchase and verify addon cancellation

2. **Data Validation**
   - Invalid package ID
   - Non-existent purchase ID
   - Missing authentication
   - Admin access control

3. **Error Handling**
   - Database connection errors
   - Invalid request data
   - Authorization failures
   - Not found scenarios

4. **Admin Functions**
   - View all purchases with addons
   - Filter by status
   - User-specific queries
   - Purchase analytics

### Test Data Examples

#### Create Purchase
```json
{
  "package_id": 1,
  "addons": [1, 2]
}
```

#### Expected Response
```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "purchase_id": 3,
    "purchase_info": {
      "purchase_date": "2024-01-15T11:00:00.000Z",
      "expiration_date": "2024-02-14",
      "status": "active",
      "total_amount": 399.97,
      "created_at": "2024-01-15T11:00:00.000Z",
      "updated_at": "2024-01-15T11:00:00.000Z"
    },
    "package_details": {
      "package_id": 1,
      "package_name": "Premium Package",
      "package_description": "Complete branding solution with premium features",
      "package_price": 299.99,
      "duration_days": 30
    },
    "addons": [
      {
        "addon_id": 1,
        "status": "active"
      },
      {
        "addon_id": 2,
        "status": "active"
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
  "message": "Invalid package ID"
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
  "message": "Purchase not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create purchase",
  "error": "Database connection error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Get User's Purchases
```bash
curl -X GET http://localhost:3000/api/purchases \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Specific Purchase
```bash
curl -X GET http://localhost:3000/api/purchases/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Purchase with Addons
```bash
curl -X POST http://localhost:3000/api/purchases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "package_id": 1,
    "addons": [1, 2]
  }'
```

#### Cancel Purchase
```bash
curl -X PUT http://localhost:3000/api/purchases/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get All Purchases (Admin)
```bash
curl -X GET http://localhost:3000/api/admin/purchases \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### JavaScript/Fetch Examples

#### Get User's Purchases
```javascript
const response = await fetch('/api/purchases', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('User purchases:', data.data.purchases);
} else {
  console.error('Failed to get purchases:', data.message);
}
```

#### Create Purchase with Addons
```javascript
const response = await fetch('/api/purchases', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    package_id: 1,
    addons: [1, 2]
  })
});

const data = await response.json();
if (data.success) {
  console.log('Purchase created:', data.data);
} else {
  console.error('Purchase creation failed:', data.message);
}
```

#### Cancel Purchase
```javascript
const response = await fetch('/api/purchases/1/cancel', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('Purchase cancelled:', data.data);
} else {
  console.error('Cancellation failed:', data.message);
}
```

## 🔄 Recent Updates

### Version 1.0.0 (Latest)
- ✅ **Complete Purchase Management**
  - Package purchases with addon integration
  - Purchase creation with addon selection
  - Purchase cancellation with addon cancellation
  - Total amount calculation including addons

- ✅ **Data Organization**
  - Clear labeling of data structures
  - Separated purchase info from package details
  - Addon organization within purchases
  - User details for admin views

- ✅ **Access Control**
  - User-specific data access
  - Admin-only global view
  - JWT authentication for all endpoints
  - Role-based authorization

- ✅ **Purchase Lifecycle**
  - Purchase creation with validation
  - Addon integration and management
  - Status tracking and updates
  - Complete audit trail

- ✅ **Database Optimization**
  - Comprehensive indexing for performance
  - Foreign key constraints for data integrity
  - Check constraints for validation
  - Cascade delete relationships

## 📝 Notes

1. **Complete Purchase System**: Handles package purchases with optional addon integration for comprehensive purchase management.

2. **Data Organization**: All responses use clear, descriptive field names for better readability and frontend integration.

3. **Status Management**: Purchases can have different statuses (active, cancelled, expired) for proper lifecycle management.

4. **User Isolation**: Users can only access their own purchases, with admin access for global views.

5. **Performance**: Optimized with database indexes and efficient queries for large datasets.

6. **Scalability**: Designed to handle multiple concurrent users and large purchase volumes.

7. **Security**: JWT authentication and role-based access control ensure proper authorization.

8. **Audit Trail**: Complete tracking of purchase creation, modifications, and cancellations including addon management.

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Maintainer**: Edjay Lindayao
