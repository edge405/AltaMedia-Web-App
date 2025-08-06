# Purchase, Package, and Addon Purchase Data Labeling Documentation

## Overview

The purchase, package, and addon purchase endpoints have been enhanced to provide clearly labeled and organized data structure for packages, addons, and features. This includes independent addon purchases separate from package purchases. This improves data readability, maintainability, and frontend integration.

## Data Structure Improvements

### Before (Flat Structure)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "package_id": 1,
      "purchase_date": "2024-01-15T10:30:00Z",
      "expiration_date": "2024-04-15",
      "status": "active",
      "total_amount": 299.99,
      "packages": {
        "id": 1,
        "name": "Premium Package",
        "description": "Complete branding solution",
        "price": 299.99,
        "duration_days": 90
      },
      "addons": [
        {
          "id": 1,
          "addon_id": 1,
          "amount_paid": 49.99,
          "status": "active",
          "addons": {
            "id": 1,
            "name": "Social Media Kit",
            "description": "Complete social media assets",
            "price_type": "one-time",
            "base_price": 49.99
          }
        }
      ]
    }
  ]
}
```

### After (Labeled Structure)
```json
{
  "success": true,
  "message": "User purchases retrieved successfully",
  "data": {
    "user_id": 123,
    "total_purchases": 1,
    "purchases": [
      {
        "purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00Z",
          "expiration_date": "2024-04-15",
          "status": "active",
          "total_amount": 299.99,
          "created_at": "2024-01-15T10:30:00Z",
          "updated_at": "2024-01-15T10:30:00Z"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution",
          "package_price": 299.99,
          "duration_days": 90
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
              "purchase_date": "2024-01-15T10:30:00Z",
              "created_at": "2024-01-15T10:30:00Z"
            }
          }
        ]
      }
    ]
  }
}
```

## Key Improvements

### 1. Clear Data Separation
- **`purchase_info`**: Contains all purchase-related metadata
- **`package_details`**: Contains package-specific information
- **`addons`**: Array of addon objects with clear structure

### 2. Descriptive Field Names
- `package_name` instead of `packages.name`
- `addon_name` instead of `addons.name`
- `purchase_id` instead of `id`
- `addon_purchase_id` for addon purchase records

### 3. Organized Addon Structure
Each addon now has:
- **`addon_details`**: Addon-specific information
- **`purchase_info`**: Purchase-related metadata for the addon

### 4. Consistent Response Structure
All purchase endpoints now return:
- `success`: Boolean status
- `message`: Descriptive success/error message
- `data`: Organized data structure

## Endpoints Updated

### Purchase Endpoints

#### 1. GET /api/purchases
Returns user's purchases with labeled structure.

#### 2. GET /api/purchases/:id
Returns specific purchase with labeled structure.

#### 3. POST /api/purchases
Creates new purchase and returns labeled response.

#### 4. GET /api/admin/purchases
Returns all purchases (admin) with additional user details.

### Package Endpoints

#### 1. GET /api/packages
Returns all active packages with labeled structure.

#### 2. GET /api/packages/:id
Returns specific package with features and labeled structure.

#### 3. POST /api/packages
Creates new package and returns labeled response.

#### 4. PUT /api/packages/:id
Updates package and returns labeled response.

### Addon Purchase Endpoints (Independent)

#### 1. GET /api/addon-purchases
Returns user's independent addon purchases with labeled structure.

#### 2. GET /api/addon-purchases/:id
Returns specific addon purchase with labeled structure.

#### 3. POST /api/addon-purchases
Creates new independent addon purchase and returns labeled response.

#### 4. PUT /api/addon-purchases/:id/cancel
Cancels addon purchase.

#### 5. GET /api/admin/addon-purchases
Returns all addon purchases (admin) with user details.

## Benefits

1. **Better Frontend Integration**: Clear field names make it easier to map data to UI components
2. **Improved Debugging**: Organized structure makes it easier to identify data issues
3. **Consistent API**: All endpoints follow the same response pattern
4. **Future-Proof**: Easy to extend with additional fields without breaking existing integrations
5. **Better Documentation**: Self-documenting field names reduce confusion

## Package Data Structure Example

### Before (Flat Structure)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Premium Package",
      "description": "Complete branding solution",
      "price": 299.99,
      "duration_days": 90,
      "is_active": true
    }
  ]
}
```

### After (Labeled Structure)
```json
{
  "success": true,
  "message": "Packages retrieved successfully",
  "data": {
    "total_packages": 1,
    "packages": [
      {
        "package_id": 1,
        "package_info": {
          "name": "Premium Package",
          "description": "Complete branding solution",
          "price": 299.99,
          "duration_days": 90,
          "is_active": true,
          "created_at": "2024-01-15T10:30:00Z",
          "updated_at": "2024-01-15T10:30:00Z"
        }
      }
    ]
  }
}
```

### Package with Features (Labeled Structure)
```json
{
  "success": true,
  "message": "Package details retrieved successfully",
  "data": {
    "package_id": 1,
    "package_info": {
      "name": "Premium Package",
      "description": "Complete branding solution",
      "price": 299.99,
      "duration_days": 90,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "features": [
      {
        "feature_id": 1,
        "feature_info": {
          "feature_name": "Logo Design",
          "feature_description": "Professional logo design service",
          "is_active": true,
          "created_at": "2024-01-15T10:30:00Z"
        }
      }
    ]
  }
}
```

## Addon Purchase Data Structure Example

### Independent Addon Purchase (Labeled Structure)
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
          "purchase_date": "2024-01-15T10:30:00Z",
          "expiration_date": "2024-02-15",
          "status": "active",
          "amount_paid": 49.99,
          "created_at": "2024-01-15T10:30:00Z",
          "updated_at": "2024-01-15T10:30:00Z"
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

## Key Differences: Package vs Independent Addon Purchases

### Package Purchases
- **Table**: `package_purchases`
- **Structure**: Includes package details and associated addons
- **Purpose**: Complete package with optional addons

### Independent Addon Purchases
- **Table**: `addon_purchases`
- **Structure**: Standalone addon purchases
- **Purpose**: Individual addon purchases without packages
- **Flexibility**: Supports different price types (one-time/recurring)
- **Duration**: Configurable duration independent of packages

## Testing

Run the test files to see the labeled structure in action:

```bash
# Test purchase data labeling
node test-purchases-labeled.js

# Test package data labeling
node test-packages-labeled.js

# Test independent addon purchases
node test-addon-purchases.js
```

This will demonstrate the improved data structure and show how the labeled data makes it easier to work with packages, addons, and features in the frontend. 