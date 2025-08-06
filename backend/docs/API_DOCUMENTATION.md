# AltaMedia API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Admin Login
**POST** `/auth/admin/login`

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 📦 Package Endpoints

### Get All Packages
**GET** `/packages`

**Response:**
```json
{
  "success": true,
  "message": "Packages retrieved successfully",
  "data": [
    {
      "package_id": 1,
      "package_info": {
        "name": "Premium Package",
        "description": "Complete branding solution",
        "price": 99.99,
        "duration_days": 30,
        "is_active": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    }
  ]
}
```

### Get Package by ID
**GET** `/packages/:id`

**Response:**
```json
{
  "success": true,
  "message": "Package retrieved successfully",
  "data": {
    "package_id": 1,
    "package_info": {
      "name": "Premium Package",
      "description": "Complete branding solution",
      "price": 99.99,
      "duration_days": 30,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "features": [
      {
        "feature_id": 1,
        "feature_info": {
          "name": "Logo Design",
          "description": "Professional logo creation",
          "is_active": true
        }
      }
    ]
  }
}
```

### Create Package (Admin Only)
**POST** `/packages`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Body:**
```json
{
  "name": "New Package",
  "description": "Package description",
  "price": 149.99,
  "duration_days": 60,
  "features": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Package created successfully",
  "data": {
    "package_id": 2,
    "package_info": {
      "name": "New Package",
      "description": "Package description",
      "price": 149.99,
      "duration_days": 60,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "features": [
      {
        "feature_id": 1,
        "feature_info": {
          "name": "Logo Design",
          "description": "Professional logo creation",
          "is_active": true
        }
      }
    ]
  }
}
```

### Update Package (Admin Only)
**PUT** `/packages/:id`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Body:**
```json
{
  "name": "Updated Package",
  "description": "Updated description",
  "price": 199.99,
  "duration_days": 90,
  "is_active": true
}
```

---

## 🎯 Addon Endpoints

### Get All Addons
**GET** `/addons`

**Response:**
```json
{
  "success": true,
  "message": "Addons retrieved successfully",
  "data": [
    {
      "addon_id": 1,
      "addon_info": {
        "name": "Social Media Kit",
        "description": "Complete social media assets",
        "price_type": "one-time",
        "base_price": 49.99,
        "is_active": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    }
  ]
}
```

### Get Addon by ID
**GET** `/addons/:id`

**Response:**
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
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

## 🛒 Purchase Endpoints (Combined Package + Addons)

### Get User Purchases
**GET** `/purchases`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Purchases retrieved successfully",
  "data": {
    "user_id": 1,
    "total_purchases": 2,
    "purchases": [
      {
        "purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00Z",
          "expiration_date": "2024-02-15",
          "status": "active",
          "total_amount": 149.98,
          "created_at": "2024-01-15T10:30:00Z",
          "updated_at": "2024-01-15T10:30:00Z"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution",
          "package_price": 99.99,
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
              "purchase_date": "2024-01-15T10:30:00Z",
              "status": "active",
              "amount_paid": 49.99,
              "created_at": "2024-01-15T10:30:00Z"
            }
          }
        ]
      }
    ]
  }
}
```

### Get Purchase by ID
**GET** `/purchases/:id`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Purchase details retrieved successfully",
  "data": {
    "purchase_id": 1,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00Z",
      "expiration_date": "2024-02-15",
      "status": "active",
      "total_amount": 149.98,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "package_details": {
      "package_id": 1,
      "package_name": "Premium Package",
      "package_description": "Complete branding solution",
      "package_price": 99.99,
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
          "purchase_date": "2024-01-15T10:30:00Z",
          "status": "active",
          "amount_paid": 49.99,
          "created_at": "2024-01-15T10:30:00Z"
        }
      }
    ]
  }
}
```

### Create Purchase
**POST** `/purchases`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Body:**
```json
{
  "package_id": 1,
  "addon_ids": [1, 2]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "purchase_id": 1,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00Z",
      "expiration_date": "2024-02-15",
      "status": "active",
      "total_amount": 149.98,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "package_details": {
      "package_id": 1,
      "package_name": "Premium Package",
      "package_description": "Complete branding solution",
      "package_price": 99.99,
      "duration_days": 30
    },
    "addons": [
      {
        "addon_id": 1,
        "addon_name": "Social Media Kit",
        "addon_description": "Complete social media assets",
        "price_type": "one-time",
        "base_price": 49.99
      }
    ]
  }
}
```

### Get All Purchases (Admin Only)
**GET** `/purchases/admin/all`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "All purchases retrieved successfully",
  "data": {
    "total_purchases": 5,
    "purchases": [
      {
        "purchase_id": 1,
        "user_details": {
          "user_id": 1,
          "user_email": "user@example.com"
        },
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00Z",
          "expiration_date": "2024-02-15",
          "status": "active",
          "total_amount": 149.98,
          "created_at": "2024-01-15T10:30:00Z",
          "updated_at": "2024-01-15T10:30:00Z"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution",
          "package_price": 99.99,
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
              "purchase_date": "2024-01-15T10:30:00Z",
              "status": "active",
              "amount_paid": 49.99,
              "created_at": "2024-01-15T10:30:00Z"
            }
          }
        ]
      }
    ]
  }
}
```

---

## 🎯 Independent Addon Purchase Endpoints

### Get User's Addon Purchases
**GET** `/addon-purchases`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Addon purchases retrieved successfully",
  "data": {
    "user_id": 1,
    "total_addon_purchases": 2,
    "addon_purchases": [
      {
        "addon_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00Z",
          "status": "active",
          "base_price": 49.99,
          "price_type": "one-time",
          "duration": null,
          "created_at": "2024-01-15T10:30:00Z"
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

### Get Addon Purchase by ID
**GET** `/addon-purchases/:id`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Addon purchase details retrieved successfully",
  "data": {
    "addon_purchase_id": 1,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00Z",
      "status": "active",
      "base_price": 49.99,
      "price_type": "one-time",
      "duration": null,
      "created_at": "2024-01-15T10:30:00Z"
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

### Create Addon Purchase
**POST** `/addon-purchases`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Body:**
```json
{
  "addon_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Addon purchase created successfully",
  "data": {
    "addon_purchase_id": 1,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00Z",
      "status": "active",
      "base_price": 49.99,
      "price_type": "one-time",
      "duration": null,
      "created_at": "2024-01-15T10:30:00Z"
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

### Cancel Addon Purchase
**PUT** `/addon-purchases/:id/cancel`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
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

### Get All Addon Purchases (Admin Only)
**GET** `/addon-purchases/admin/all`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "All addon purchases retrieved successfully",
  "data": {
    "total_addon_purchases": 5,
    "addon_purchases": [
      {
        "addon_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00Z",
          "status": "active",
          "base_price": 49.99,
          "price_type": "one-time",
          "duration": null,
          "created_at": "2024-01-15T10:30:00Z"
        },
        "user_details": {
          "user_id": 1,
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

---

## 📦 Package Purchase Endpoints (Package Only)

### Get User's Package Purchases
**GET** `/package-purchases`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Package purchases retrieved successfully",
  "data": {
    "user_id": 1,
    "total_package_purchases": 2,
    "package_purchases": [
      {
        "package_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00Z",
          "expiration_date": "2024-02-15",
          "status": "active",
          "total_amount": 99.99,
          "created_at": "2024-01-15T10:30:00Z",
          "updated_at": "2024-01-15T10:30:00Z"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution",
          "package_price": 99.99,
          "duration_days": 30
        }
      }
    ]
  }
}
```

### Get Package Purchase by ID
**GET** `/package-purchases/:id`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Package purchase details retrieved successfully",
  "data": {
    "package_purchase_id": 1,
    "purchase_info": {
      "purchase_date": "2024-01-15T10:30:00Z",
      "expiration_date": "2024-02-15",
      "status": "active",
      "total_amount": 99.99,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "package_details": {
      "package_id": 1,
      "package_name": "Premium Package",
      "package_description": "Complete branding solution",
      "package_price": 99.99,
      "duration_days": 30
    }
  }
}
```

### Get All Package Purchases (Admin Only)
**GET** `/package-purchases/admin/all`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "All package purchases retrieved successfully",
  "data": {
    "total_package_purchases": 5,
    "package_purchases": [
      {
        "package_purchase_id": 1,
        "purchase_info": {
          "purchase_date": "2024-01-15T10:30:00Z",
          "expiration_date": "2024-02-15",
          "status": "active",
          "total_amount": 99.99,
          "created_at": "2024-01-15T10:30:00Z",
          "updated_at": "2024-01-15T10:30:00Z"
        },
        "user_details": {
          "user_id": 1,
          "user_email": "user@example.com"
        },
        "package_details": {
          "package_id": 1,
          "package_name": "Premium Package",
          "package_description": "Complete branding solution",
          "package_price": 99.99,
          "duration_days": 30
        }
      }
    ]
  }
}
```

---

## 🎨 Brand Kit Endpoints

### Get Brand Kit Forms
**GET** `/brandkit/forms`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Brand kit forms retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "form_data": {
        "company_name": "Example Corp",
        "industry": "Technology",
        "brand_colors": ["#FF0000", "#00FF00"],
        "logo_preferences": "Modern and minimal"
      },
      "status": "completed",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Brand Kit Form by ID
**GET** `/brandkit/forms/:id`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Brand kit form retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "form_data": {
      "company_name": "Example Corp",
      "industry": "Technology",
      "brand_colors": ["#FF0000", "#00FF00"],
      "logo_preferences": "Modern and minimal"
    },
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### Create Brand Kit Form
**POST** `/brandkit/forms`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Body:**
```json
{
  "form_data": {
    "company_name": "Example Corp",
    "industry": "Technology",
    "brand_colors": ["#FF0000", "#00FF00"],
    "logo_preferences": "Modern and minimal"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Brand kit form created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "form_data": {
      "company_name": "Example Corp",
      "industry": "Technology",
      "brand_colors": ["#FF0000", "#00FF00"],
      "logo_preferences": "Modern and minimal"
    },
    "status": "draft",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### Update Brand Kit Form
**PUT** `/brandkit/forms/:id`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Body:**
```json
{
  "form_data": {
    "company_name": "Updated Corp",
    "industry": "Technology",
    "brand_colors": ["#FF0000", "#00FF00", "#0000FF"],
    "logo_preferences": "Modern and minimal with blue accent"
  },
  "status": "completed"
}
```

### Get All Brand Kit Forms (Admin Only)
**GET** `/brandkit/forms/admin/all`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "All brand kit forms retrieved successfully",
  "data": {
    "total_forms": 10,
    "forms": [
      {
        "id": 1,
        "user_details": {
          "user_id": 1,
          "user_email": "user@example.com"
        },
        "form_data": {
          "company_name": "Example Corp",
          "industry": "Technology",
          "brand_colors": ["#FF0000", "#00FF00"],
          "logo_preferences": "Modern and minimal"
        },
        "status": "completed",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
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
  "message": "Access denied. Admin role required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔧 Rate Limiting

All API endpoints are rate limited to **100 requests per 15 minutes** per IP address.

---

## 📝 Notes

1. **Authentication**: All protected endpoints require a valid JWT token in the Authorization header
2. **Admin Access**: Admin-only endpoints require a user with 'admin' role
3. **Data Labeling**: All responses use clear labeling for easy frontend integration
4. **Error Handling**: Consistent error response format across all endpoints
5. **Pagination**: Currently not implemented - all endpoints return all data
6. **File Uploads**: Brand kit forms support file uploads for logos and assets

---

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   cd backend
   npm start
   ```

2. **Register a user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password123","first_name":"John","last_name":"Doe"}'
   ```

3. **Login to get token:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password123"}'
   ```

4. **Use the token for authenticated requests:**
   ```bash
   curl -X GET http://localhost:3000/api/packages \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ``` 