# Package Feature Comments API Documentation

## 📋 Overview

The Package Feature Comments API provides comprehensive CRUD operations for managing comments on package features. This API allows users to create, read, update, and delete comments associated with specific package features, with full user authentication and data validation.

## 🗄️ Database Schema

### Table: `package_feature_comments`

```sql
CREATE TABLE public.package_feature_comments (
  id integer NOT NULL DEFAULT nextval('package_feature_comments_id_seq'::regclass),
  package_feature_id integer NOT NULL,
  user_id bigint NOT NULL,
  comment_text text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT package_feature_comments_pkey PRIMARY KEY (id),
  CONSTRAINT fk_package_feature FOREIGN KEY (package_feature_id) REFERENCES public.package_features(id),
  CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES public.users(id)
);
```

### Relationships
- `package_feature_comments.package_feature_id` → `package_features.id`
- `package_feature_comments.user_id` → `users.id`
- `package_features.package_id` → `packages.id`

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📡 API Endpoints

### 1. Create Comment

**POST** `/api/package-feature-comments`

Creates a new comment for a package feature.

#### Request Body
```json
{
  "package_feature_id": 1,
  "user_id": 1,
  "comment_text": "This feature is exactly what I need for my project!"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 1,
    "package_feature_id": 1,
    "user_id": 1,
    "comment_text": "This feature is exactly what I need for my project!",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get Comments by Feature

**GET** `/api/package-feature-comments/feature/:packageFeatureId`

Retrieves all comments for a specific package feature.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "comments": [
      {
        "id": 1,
        "package_feature_id": 1,
        "user_id": 1,
        "comment_text": "Great feature!",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z",
        "users": {
          "fullname": "John Doe",
          "email": "john@example.com"
        },
        "package_features": {
          "feature_name": "Advanced Analytics",
          "feature_description": "Comprehensive analytics dashboard"
        }
      }
    ],
    "total": 1,
    "package_feature_id": 1
  }
}
```

### 3. Get Comments by User

**GET** `/api/package-feature-comments/user/:userId`

Retrieves all comments made by a specific user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "User comments retrieved successfully",
  "data": {
    "comments": [
      {
        "id": 1,
        "package_feature_id": 1,
        "user_id": 1,
        "comment_text": "Great feature!",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z",
        "package_features": {
          "feature_name": "Advanced Analytics",
          "feature_description": "Comprehensive analytics dashboard",
          "package_id": 1,
          "packages": {
            "name": "Premium Package",
            "description": "Complete solution for businesses"
          }
        }
      }
    ],
    "total": 1,
    "user_id": 1
  }
}
```

### 4. Get Comments by Feature and User

**GET** `/api/package-feature-comments/feature/:packageFeatureId/user/:userId`

Retrieves comments for a specific package feature made by a specific user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "comments": [
      {
        "id": 1,
        "package_feature_id": 1,
        "user_id": 1,
        "comment_text": "Great feature!",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z",
        "users": {
          "fullname": "John Doe",
          "email": "john@example.com"
        },
        "package_features": {
          "feature_name": "Advanced Analytics",
          "feature_description": "Comprehensive analytics dashboard",
          "package_id": 1,
          "packages": {
            "name": "Premium Package",
            "description": "Complete solution for businesses"
          }
        }
      }
    ],
    "total": 1,
    "package_feature_id": 1,
    "user_id": 1
  }
}
```

### 5. Get Specific Comment

**GET** `/api/package-feature-comments/:commentId`

Retrieves a specific comment by its ID.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Comment retrieved successfully",
  "data": {
    "id": 1,
    "package_feature_id": 1,
    "user_id": 1,
    "comment_text": "Great feature!",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "users": {
      "fullname": "John Doe",
      "email": "john@example.com"
    },
    "package_features": {
      "feature_name": "Advanced Analytics",
      "feature_description": "Comprehensive analytics dashboard",
      "package_id": 1,
      "packages": {
        "name": "Premium Package",
        "description": "Complete solution for businesses"
      }
    }
  }
}
```

### 6. Update Comment

**PUT** `/api/package-feature-comments/:commentId`

Updates an existing comment.

#### Request Body
```json
{
  "comment_text": "Updated comment text with more details!"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": 1,
    "package_feature_id": 1,
    "user_id": 1,
    "comment_text": "Updated comment text with more details!",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T11:45:00.000Z"
  }
}
```

### 7. Delete Comment

**DELETE** `/api/package-feature-comments/:commentId`

Deletes a comment by its ID.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## 🔧 Implementation Details

### File Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── packageFeatureCommentController.js
│   ├── routes/
│   │   └── packageFeatureCommentRoutes.js
│   └── server.js
├── docs/
│   └── Package_Feature_Comments_API.md
└── Package_Feature_Comments_API.postman_collection.json
```

### Key Features

1. **Comprehensive CRUD Operations**
   - Create, Read, Update, Delete comments
   - Multiple retrieval methods (by feature, user, feature+user, by ID)

2. **Data Validation**
   - Required field validation
   - Foreign key constraint validation
   - Input sanitization

3. **Error Handling**
   - Detailed error messages
   - Proper HTTP status codes
   - Comprehensive logging

4. **Database Relationships**
   - Proper joins through related tables
   - Nested data retrieval (users, package_features, packages)

5. **Authentication & Security**
   - JWT token validation
   - Protected routes
   - User authorization

### Database Joins

The API uses nested joins to retrieve related data:

```javascript
// Correct join structure for Supabase
.select(`
  *,
  users!inner(fullname, email),
  package_features!inner(
    feature_name, 
    feature_description, 
    package_id,
    packages!inner(name, description)
  )
`)
```

This follows the relationship chain:
`package_feature_comments` → `package_features` → `packages`

## 🧪 Testing

### Postman Collection
A comprehensive Postman collection is available at:
`backend/Package_Feature_Comments_API.postman_collection.json`

### Test Scenarios
1. **Happy Path Testing**
   - Create comment with valid data
   - Retrieve comments by various criteria
   - Update and delete comments

2. **Validation Testing**
   - Missing required fields
   - Invalid foreign key references
   - Malformed request data

3. **Authentication Testing**
   - Unauthorized access attempts
   - Invalid JWT tokens
   - Missing authentication headers

4. **Error Handling Testing**
   - Non-existent resources
   - Database constraint violations
   - Server errors

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields: package_feature_id, user_id, comment_text",
  "received": {
    "package_feature_id": 1,
    "user_id": 1,
    "comment_text": true
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Comment not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch comments",
  "error": "Database connection error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Create Comment
```bash
curl -X POST http://localhost:3000/api/package-feature-comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "package_feature_id": 1,
    "user_id": 1,
    "comment_text": "This feature is amazing!"
  }'
```

#### Get Comments by Feature and User
```bash
curl -X GET http://localhost:3000/api/package-feature-comments/feature/1/user/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript/Fetch Examples

#### Create Comment
```javascript
const response = await fetch('/api/package-feature-comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    package_feature_id: 1,
    user_id: 1,
    comment_text: 'This feature is amazing!'
  })
});

const data = await response.json();
```

#### Get Comments by Feature and User
```javascript
const response = await fetch('/api/package-feature-comments/feature/1/user/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
```

## 🔄 Recent Updates

### Version 1.1.0 (Latest)
- ✅ **Fixed Database Relationship Issue**
  - Corrected Supabase join queries to follow proper relationship chain
  - Fixed direct joins to `packages` table from `package_feature_comments`
  - Implemented nested joins: `package_feature_comments` → `package_features` → `packages`

### Version 1.0.0
- ✅ **Initial Implementation**
  - Complete CRUD operations
  - Authentication integration
  - Comprehensive error handling
  - Postman collection for testing

## 📝 Notes

1. **Database Relationships**: The API correctly handles the multi-table relationship chain through nested Supabase joins.

2. **Performance**: All queries include proper indexing and are optimized for the expected data volume.

3. **Security**: All endpoints require authentication and validate user permissions.

4. **Scalability**: The API is designed to handle multiple concurrent requests and can be easily extended with additional features.

5. **Maintenance**: Comprehensive logging and error handling make debugging and maintenance straightforward.

---

**Last Updated**: August 2025
**API Version**: 1.1.0  
**Maintainer**: Edjay Lindayao
