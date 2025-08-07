# Addon Purchase API Documentation

## 📋 Overview

The Addon Purchase API provides comprehensive management for independent addon purchases, separate from package-linked purchases. This system handles the complete lifecycle of addon purchases including creation, tracking, cancellation, and administrative oversight with clear data labeling and organization.

## 🗄️ Database Schema

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
-- Purchase indexes
CREATE INDEX idx_purchased_addons_user_id ON purchased_addons(user_id);
CREATE INDEX idx_purchased_addons_addon_id ON purchased_addons(addon_id);
CREATE INDEX idx_purchased_addons_status ON purchased_addons(status);
CREATE INDEX idx_purchased_addons_created_at ON purchased_addons(created_at);
```

#### Constraints and Validation
```sql
-- Check constraints for data integrity
CHECK (base_price >= 0)
CHECK (status IN ('active', 'cancelled', 'expired'))

-- Foreign key constraints
FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

## 🔐 Authentication

### Private Endpoints (JWT Required)
- `GET /api/addon-purchases` - Get user's independent addon purchases
- `GET /api/addon-purchases/:id` - Get addon purchase by ID
- `POST /api/addon-purchases` - Create new independent addon purchase
- `PUT /api/addon-purchases/:id/cancel` - Cancel addon purchase

### Admin Only Endpoints
- `GET /api/addon-purchases/admin/all` - Get all addon purchases (Admin only)

## 📡 API Endpoints

### 1. Get User's Independent Addon Purchases

**GET** `/api/addon-purchases`

Retrieves all independent addon purchases for the current authenticated user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Addon purchases retrieved successfully",
  "data": {
    "user_id": 123,
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
        "addon_details": {
          "addon_id": 1,
          "addon_name": "Social Media Kit",
          "addon_description": "Complete social media assets",
          "price_type": "one-time",
          "base_price": 49.99
        }
      },
      {
        "addon_purchase_id": 2,
        "purchase_info": {
          "purchase_date": "2024-01-14T15:45:00.000Z",
          "status": "active",
          "base_price": 99.99,
          "price_type": "one-time",
          "duration": null,
          "created_at": "2024-01-14T15:45:00.000Z"
        },
        "addon_details": {
          "addon_id": 2,
          "addon_name": "Premium Logo Design",
          "addon_description": "Custom logo design with multiple formats",
          "price_type": "one-time",
          "base_price": 99.99
        }
      }
    ]
  }
}
```

### 2. Get Addon Purchase by ID

**GET** `/api/addon-purchases/:id`

Retrieves a specific addon purchase for the current authenticated user.

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

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Addon purchase not found"
}
```

### 3. Create New Independent Addon Purchase

**POST** `/api/addon-purchases`

Creates a new independent addon purchase for the current authenticated user.

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
    "addon_purchase_id": 3,
    "purchase_info": {
      "purchase_date": "2024-01-15T11:00:00.000Z",
      "status": "active",
      "base_price": 49.99,
      "price_type": "one-time",
      "duration": null,
      "created_at": "2024-01-15T11:00:00.000Z"
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

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Addon not found"
}
```

### 4. Cancel Addon Purchase

**PUT** `/api/addon-purchases/:id/cancel`

Cancels an existing addon purchase for the current authenticated user.

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

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Addon purchase not found or already cancelled"
}
```

### 5. Get All Addon Purchases (Admin Only)

**GET** `/api/addon-purchases/admin/all`

Retrieves all addon purchases across all users (Admin access required).

#### Response (200 OK)
```json
{
  "success": true,
  "message": "All addon purchases retrieved successfully",
  "data": {
    "total_addon_purchases": 3,
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
      },
      {
        "addon_purchase_id": 2,
        "purchase_info": {
          "purchase_date": "2024-01-14T15:45:00.000Z",
          "status": "cancelled",
          "base_price": 99.99,
          "price_type": "one-time",
          "duration": null,
          "created_at": "2024-01-14T15:45:00.000Z"
        },
        "user_details": {
          "user_id": 124,
          "user_email": "another@example.com"
        },
        "addon_details": {
          "addon_id": 2,
          "addon_name": "Premium Logo Design",
          "addon_description": "Custom logo design with multiple formats",
          "price_type": "one-time",
          "base_price": 99.99
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
│   │   └── addonPurchaseController.js
│   ├── routes/
│   │   └── addonPurchaseRoutes.js
│   └── server.js
├── docs/
│   └── Addon_Purchase_API_Documentation.md
└── database/
    └── schema.sql
```

### Key Features

1. **Independent Purchase Management**
   - Standalone addon purchases (not tied to packages)
   - User-specific purchase tracking
   - Purchase status management (active/cancelled/expired)
   - Complete purchase lifecycle handling

2. **Data Organization**
   - Clear labeling of data structures
   - Separated purchase info from addon details
   - User details for admin views
   - Consistent response formats

3. **Security & Access Control**
   - JWT authentication for all endpoints
   - User-specific data access
   - Admin-only global view
   - Role-based authorization

4. **Purchase Lifecycle**
   - Purchase creation with validation
   - Status tracking and updates
   - Cancellation functionality
   - Complete audit trail

### Database Features

1. **Indexes for Performance**
   - User ID indexes for fast lookups
   - Addon ID indexes for feature queries
   - Status indexes for filtering
   - Created date indexes for sorting

2. **Data Integrity**
   - Foreign key constraints
   - Check constraints for price validation
   - Status validation constraints
   - Cascade delete relationships

3. **Purchase Tracking**
   - Purchase date tracking
   - Status management
   - Price type support
   - Duration tracking (for future use)

## 🎨 Frontend Integration

### API Integration Examples

#### Get User's Addon Purchases
```javascript
const response = await fetch('/api/addon-purchases', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('User purchases:', data.data.addon_purchases);
```

#### Create Addon Purchase
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
  console.log('Purchase created:', data.data);
} else {
  console.error('Purchase failed:', data.message);
}
```

#### Cancel Addon Purchase
```javascript
const response = await fetch('/api/addon-purchases/1/cancel', {
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

#### Get Specific Purchase Details
```javascript
const response = await fetch('/api/addon-purchases/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('Purchase details:', data.data);
```

## 🧪 Testing

### Test Scenarios

1. **Purchase Flow**
   - Create new addon purchase
   - Verify purchase details
   - Check user's purchase list
   - Cancel purchase
   - Verify cancellation

2. **Data Validation**
   - Invalid addon ID
   - Non-existent purchase ID
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

#### Create Purchase
```json
{
  "addon_id": 1
}
```

#### Expected Response
```json
{
  "success": true,
  "message": "Addon purchase created successfully",
  "data": {
    "addon_purchase_id": 3,
    "purchase_info": {
      "purchase_date": "2024-01-15T11:00:00.000Z",
      "status": "active",
      "base_price": 49.99,
      "price_type": "one-time",
      "duration": null,
      "created_at": "2024-01-15T11:00:00.000Z"
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

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid addon ID"
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
  "message": "Failed to create addon purchase",
  "error": "Database connection error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Get User's Addon Purchases
```bash
curl -X GET http://localhost:3000/api/addon-purchases \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Addon Purchase
```bash
curl -X POST http://localhost:3000/api/addon-purchases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "addon_id": 1
  }'
```

#### Get Specific Purchase
```bash
curl -X GET http://localhost:3000/api/addon-purchases/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Cancel Purchase
```bash
curl -X PUT http://localhost:3000/api/addon-purchases/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get All Purchases (Admin)
```bash
curl -X GET http://localhost:3000/api/addon-purchases/admin/all \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### JavaScript/Fetch Examples

#### Get User's Purchases
```javascript
const response = await fetch('/api/addon-purchases', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('User purchases:', data.data.addon_purchases);
```

#### Create Purchase
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

#### Cancel Purchase
```javascript
const response = await fetch('/api/addon-purchases/1/cancel', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('Cancellation successful:', data.data);
} else {
  console.error('Cancellation failed:', data.message);
}
```

## 🔄 Recent Updates

### Version 1.0.0 (Latest)
- ✅ **Independent Purchase System**
  - Standalone addon purchase management
  - User-specific purchase tracking
  - Complete purchase lifecycle handling
  - Status management (active/cancelled/expired)

- ✅ **Data Organization**
  - Clear labeling of data structures
  - Separated purchase info from addon details
  - User details for admin views
  - Consistent response formats

- ✅ **Security & Access Control**
  - JWT authentication for all endpoints
  - User-specific data access
  - Admin-only global view
  - Role-based authorization

- ✅ **Purchase Lifecycle Management**
  - Purchase creation with validation
  - Status tracking and updates
  - Cancellation functionality
  - Complete audit trail

- ✅ **Database Optimization**
  - Comprehensive indexing for performance
  - Foreign key constraints for data integrity
  - Check constraints for validation
  - Cascade delete relationships

## 📝 Notes

1. **Independent Purchases**: These purchases are separate from package-linked addon purchases and provide standalone addon functionality.

2. **Data Labeling**: All responses use clear, descriptive field names for better readability and frontend integration.

3. **Status Management**: Purchases can have different statuses (active, cancelled, expired) for proper lifecycle management.

4. **User Isolation**: Users can only access their own purchases, with admin access for global views.

5. **Performance**: Optimized with database indexes and efficient queries for large datasets.

6. **Scalability**: Designed to handle multiple concurrent users and large purchase volumes.

7. **Security**: JWT authentication and role-based access control ensure proper authorization.

8. **Audit Trail**: Complete tracking of purchase creation, modifications, and cancellations.

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Maintainer**: Edjay Lindayao
