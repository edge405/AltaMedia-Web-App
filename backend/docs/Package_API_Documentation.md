# Package API Documentation

## 📋 Overview

The Package API provides comprehensive management for service packages and their features. This system handles package creation, management, feature organization, and administrative oversight with clear data labeling and organization for both public viewing and admin management.

## 🗄️ Database Schema

### Table: `packages`

```sql
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    duration_days INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `package_features`

```sql
CREATE TABLE package_features (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL,
    feature_name VARCHAR(255) NOT NULL,
    feature_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);
```

### Database Features

#### Indexes for Performance
```sql
-- Package indexes
CREATE INDEX idx_packages_active ON packages(is_active);
CREATE INDEX idx_packages_created_at ON packages(created_at);
CREATE INDEX idx_package_features_package_id ON package_features(package_id);
CREATE INDEX idx_package_features_active ON package_features(is_active);
```

#### Constraints and Validation
```sql
-- Check constraints for data integrity
CHECK (price >= 0)
CHECK (duration_days > 0)

-- Foreign key constraints
FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
```

## 🔐 Authentication

### Public Endpoints
- `GET /api/packages` - Get all active packages
- `GET /api/packages/:id` - Get package by ID

### Admin Only Endpoints
- `POST /api/packages` - Create new package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

## 📡 API Endpoints

### 1. Get All Active Packages

**GET** `/api/packages`

Retrieves all active packages with their features.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Packages retrieved successfully",
  "data": {
    "total_packages": 2,
    "packages": [
      {
        "package_id": 1,
        "package_info": {
          "name": "Premium Package",
          "description": "Complete branding solution with premium features",
          "price": 299.99,
          "duration_days": 30,
          "is_active": true,
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z"
        },
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
      },
      {
        "package_id": 2,
        "package_info": {
          "name": "Basic Package",
          "description": "Essential branding package for startups",
          "price": 149.99,
          "duration_days": 15,
          "is_active": true,
          "created_at": "2024-01-14T15:45:00.000Z",
          "updated_at": "2024-01-14T15:45:00.000Z"
        },
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
    ]
  }
}
```

### 2. Get Package by ID

**GET** `/api/packages/:id`

Retrieves a specific package with its features.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Package details retrieved successfully",
  "data": {
    "package_id": 1,
    "package_info": {
      "name": "Premium Package",
      "description": "Complete branding solution with premium features",
      "price": 299.99,
      "duration_days": 30,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
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
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Package not found"
}
```

### 3. Create New Package (Admin Only)

**POST** `/api/packages`

Creates a new package with optional features.

#### Request Body
```json
{
  "name": "Enterprise Package",
  "description": "Comprehensive enterprise branding solution",
  "price": 499.99,
  "duration_days": 60,
  "features": [
    {
      "name": "Advanced Logo Design",
      "description": "Premium logo design with unlimited revisions"
    },
    {
      "name": "Brand Strategy",
      "description": "Complete brand strategy and positioning"
    },
    {
      "name": "Marketing Materials",
      "description": "Full suite of marketing materials and templates"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Package created successfully",
  "data": {
    "package_id": 3,
    "package_info": {
      "name": "Enterprise Package",
      "description": "Comprehensive enterprise branding solution",
      "price": 499.99,
      "duration_days": 60,
      "is_active": true,
      "created_at": "2024-01-15T11:00:00.000Z",
      "updated_at": "2024-01-15T11:00:00.000Z"
    },
    "features": [
      {
        "feature_name": "Advanced Logo Design",
        "feature_description": "Premium logo design with unlimited revisions",
        "status": "active"
      },
      {
        "feature_name": "Brand Strategy",
        "feature_description": "Complete brand strategy and positioning",
        "status": "active"
      },
      {
        "feature_name": "Marketing Materials",
        "feature_description": "Full suite of marketing materials and templates",
        "status": "active"
      }
    ]
  }
}
```

### 4. Update Package (Admin Only)

**PUT** `/api/packages/:id`

Updates an existing package.

#### Request Body
```json
{
  "name": "Updated Premium Package",
  "description": "Enhanced premium branding solution with new features",
  "price": 349.99,
  "duration_days": 45,
  "is_active": true
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Package updated successfully",
  "data": {
    "package_id": 1,
    "package_info": {
      "name": "Updated Premium Package",
      "description": "Enhanced premium branding solution with new features",
      "price": 349.99,
      "duration_days": 45,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T11:30:00.000Z"
    }
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Package not found or update failed"
}
```

### 5. Delete Package (Admin Only)

**DELETE** `/api/packages/:id`

Deletes a package and its associated features.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Package deleted successfully"
}
```

#### Response (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Failed to delete package",
  "error": "Database constraint error"
}
```

## 🔧 Implementation Details

### File Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── packageController.js
│   ├── routes/
│   │   └── packageRoutes.js
│   └── server.js
├── docs/
│   └── Package_API_Documentation.md
└── database/
    └── schema.sql
```

### Key Features

1. **Package Management**
   - Complete CRUD operations for packages
   - Feature management for each package
   - Admin-only creation and modification
   - Public viewing of active packages

2. **Feature Organization**
   - Clear labeling of data structures
   - Organized feature management
   - Feature status tracking
   - Consistent response formats

3. **Data Organization**
   - Separated package info from features
   - Clear labeling of data structures
   - Organized feature management
   - Consistent response formats

4. **Access Control**
   - Public endpoints for viewing
   - Admin-only endpoints for management
   - Role-based authorization
   - Secure package management

### Database Features

1. **Indexes for Performance**
   - Package ID indexes for fast lookups
   - Active status indexes for filtering
   - Created date indexes for sorting
   - Feature package ID indexes

2. **Data Integrity**
   - Foreign key constraints
   - Check constraints for price validation
   - Duration validation constraints
   - Cascade delete relationships

3. **Feature Management**
   - Feature creation with packages
   - Feature status tracking
   - Feature description management
   - Organized feature hierarchy

## 🎨 Frontend Integration

### API Integration Examples

#### Get All Packages
```javascript
const response = await fetch('/api/packages');
const data = await response.json();
console.log('Available packages:', data.data.packages);
```

#### Get Package by ID
```javascript
const response = await fetch('/api/packages/1');
const data = await response.json();
if (data.success) {
  console.log('Package details:', data.data);
} else {
  console.error('Package not found:', data.message);
}
```

#### Create Package (Admin)
```javascript
const response = await fetch('/api/packages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    name: 'Enterprise Package',
    description: 'Comprehensive enterprise branding solution',
    price: 499.99,
    duration_days: 60,
    features: [
      {
        name: 'Advanced Logo Design',
        description: 'Premium logo design with unlimited revisions'
      }
    ]
  })
});

const data = await response.json();
if (data.success) {
  console.log('Package created:', data.data);
} else {
  console.error('Package creation failed:', data.message);
}
```

#### Update Package (Admin)
```javascript
const response = await fetch('/api/packages/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    name: 'Updated Premium Package',
    description: 'Enhanced premium branding solution',
    price: 349.99,
    duration_days: 45,
    is_active: true
  })
});

const data = await response.json();
if (data.success) {
  console.log('Package updated:', data.data);
} else {
  console.error('Package update failed:', data.message);
}
```

## 🧪 Testing

### Test Scenarios

1. **Package Management**
   - Create new package with features
   - Update existing package
   - Delete package
   - View all active packages
   - View specific package with features

2. **Feature Management**
   - Create features with packages
   - Update feature descriptions
   - Manage feature status
   - Organize features by package

3. **Access Control**
   - Public access to view packages
   - Admin-only access for management
   - Role-based authorization
   - Secure package operations

4. **Data Validation**
   - Invalid package ID
   - Missing required fields
   - Invalid price values
   - Authentication failures

### Test Data Examples

#### Create Package
```json
{
  "name": "Test Package",
  "description": "Test package for API documentation",
  "price": 199.99,
  "duration_days": 30,
  "features": [
    {
      "name": "Test Feature 1",
      "description": "First test feature description"
    },
    {
      "name": "Test Feature 2",
      "description": "Second test feature description"
    }
  ]
}
```

#### Update Package
```json
{
  "name": "Updated Test Package",
  "description": "Updated test package description",
  "price": 249.99,
  "duration_days": 45,
  "is_active": true
}
```

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid package data"
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
  "message": "Package not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch packages",
  "error": "Database connection error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Get All Packages
```bash
curl -X GET http://localhost:3000/api/packages
```

#### Get Package by ID
```bash
curl -X GET http://localhost:3000/api/packages/1
```

#### Create Package (Admin)
```bash
curl -X POST http://localhost:3000/api/packages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Enterprise Package",
    "description": "Comprehensive enterprise branding solution",
    "price": 499.99,
    "duration_days": 60,
    "features": [
      {
        "name": "Advanced Logo Design",
        "description": "Premium logo design with unlimited revisions"
      }
    ]
  }'
```

#### Update Package (Admin)
```bash
curl -X PUT http://localhost:3000/api/packages/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Updated Premium Package",
    "description": "Enhanced premium branding solution",
    "price": 349.99,
    "duration_days": 45,
    "is_active": true
  }'
```

#### Delete Package (Admin)
```bash
curl -X DELETE http://localhost:3000/api/packages/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### JavaScript/Fetch Examples

#### Get All Packages
```javascript
const response = await fetch('/api/packages');
const data = await response.json();
console.log('Available packages:', data.data.packages);
```

#### Get Package by ID
```javascript
const response = await fetch('/api/packages/1');
const data = await response.json();
if (data.success) {
  console.log('Package details:', data.data);
} else {
  console.error('Package not found:', data.message);
}
```

#### Create Package (Admin)
```javascript
const response = await fetch('/api/packages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    name: 'Enterprise Package',
    description: 'Comprehensive enterprise branding solution',
    price: 499.99,
    duration_days: 60,
    features: [
      {
        name: 'Advanced Logo Design',
        description: 'Premium logo design with unlimited revisions'
      }
    ]
  })
});

const data = await response.json();
if (data.success) {
  console.log('Package created:', data.data);
} else {
  console.error('Package creation failed:', data.message);
}
```

## 🔄 Recent Updates

### Version 1.0.0 (Latest)
- ✅ **Comprehensive Package Management**
  - CRUD operations for packages
  - Feature management system
  - Admin-only creation and modification
  - Public viewing of active packages

- ✅ **Feature Organization**
  - Clear labeling of data structures
  - Organized feature management
  - Feature status tracking
  - Consistent response formats

- ✅ **Data Organization**
  - Separated package info from features
  - Clear labeling of data structures
  - Organized feature management
  - Consistent response formats

- ✅ **Access Control**
  - Public endpoints for viewing
  - Admin-only endpoints for management
  - Role-based authorization
  - Secure package management

- ✅ **Database Optimization**
  - Comprehensive indexing for performance
  - Foreign key constraints for data integrity
  - Check constraints for validation
  - Cascade delete relationships

## 📝 Notes

1. **Package Management**: Complete CRUD operations for service packages with feature organization.

2. **Feature Organization**: Each package can have multiple features with individual activation status.

3. **Access Control**: Public viewing of packages with admin-only management capabilities.

4. **Data Labeling**: All responses use clear, descriptive field names for better readability and frontend integration.

5. **Performance**: Optimized with database indexes and efficient queries for large datasets.

6. **Scalability**: Designed to handle multiple concurrent users and large package catalogs.

7. **Security**: Role-based access control ensures proper authorization for different operations.

8. **Data Integrity**: Foreign key constraints and validation ensure data consistency.

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Maintainer**: Edjay Lindayao
