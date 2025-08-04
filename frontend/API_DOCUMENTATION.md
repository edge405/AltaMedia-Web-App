# Alta Flow - API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Response Format](#response-format)
5. [Error Handling](#error-handling)
6. [Endpoints](#endpoints)
7. [Models](#models)
8. [Examples](#examples)

## 🎯 Overview

The Alta Flow API is a RESTful API built with Laravel that provides endpoints for managing clients, projects, packages, and user authentication. The API uses JWT tokens for authentication and returns JSON responses.

## 🔐 Authentication

### JWT Token Authentication

All API endpoints (except authentication endpoints) require a valid JWT token in the Authorization header.

**Header Format:**
```
Authorization: Bearer {token}
```

### Getting a Token

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Refreshing a Token

**Endpoint:** `POST /api/auth/refresh`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

## 🌐 Base URL

- **Development:** `http://localhost:8000`
- **Production:** `https://api.altamedia.com`

## 📄 Response Format

### Success Response
```json
{
  "data": {
    // Response data
  },
  "meta": {
    "current_page": 1,
    "total": 50,
    "per_page": 10,
    "last_page": 5
  }
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {
      // Additional error details
    }
  }
}
```

## ❌ Error Handling

### HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation errors
- **500 Internal Server Error** - Server error

### Error Codes

- **AUTH_001** - Invalid credentials
- **AUTH_002** - Token expired
- **AUTH_003** - Invalid token
- **VAL_001** - Validation failed
- **NOT_FOUND_001** - Resource not found
- **PERM_001** - Insufficient permissions

## 📡 Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Authenticate a user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

#### POST /api/auth/logout
Logout the authenticated user.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

#### GET /api/auth/user
Get the authenticated user's information.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "admin",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

#### POST /api/auth/refresh
Refresh the JWT token.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### User Endpoints

#### GET /api/users
Get paginated list of users (admin only).

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `role`: Filter by role (admin, manager, user)
- `search`: Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 10,
    "per_page": 10,
    "last_page": 1
  }
}
```

#### POST /api/users
Create a new user (admin only).

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "user"
}
```

#### PUT /api/users/{id}
Update an existing user.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "manager"
}
```

#### DELETE /api/users/{id}
Delete a user (admin only).

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

### Client Endpoints

#### GET /api/clients
Get paginated list of clients.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `search`: Search by name, email, or company
- `sort_by`: Sort field (name, email, created_at)
- `sort_order`: Sort order (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Client Name",
      "email": "client@example.com",
      "phone": "+1234567890",
      "company": "Company Name",
      "address": "123 Main St, City, State",
      "projects_count": 5,
      "total_revenue": 25000.00,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 25,
    "per_page": 10,
    "last_page": 3
  }
}
```

#### GET /api/clients/{id}
Get a specific client.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": 1,
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+1234567890",
  "company": "Company Name",
  "address": "123 Main St, City, State",
  "projects": [
    {
      "id": 1,
      "name": "Website Redesign",
      "status": "active",
      "progress": 75
    }
  ],
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

#### POST /api/clients
Create a new client.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "New Client",
  "email": "newclient@example.com",
  "phone": "+1234567890",
  "company": "New Company",
  "address": "456 Oak St, City, State"
}
```

#### PUT /api/clients/{id}
Update an existing client.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Updated Client Name",
  "email": "updated@example.com",
  "phone": "+1234567890",
  "company": "Updated Company",
  "address": "789 Pine St, City, State"
}
```

#### DELETE /api/clients/{id}
Delete a client.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

### Project Endpoints

#### GET /api/projects
Get paginated list of projects.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `status`: Filter by status (pending, active, completed, cancelled)
- `client_id`: Filter by client ID
- `search`: Search by name or description
- `sort_by`: Sort field (name, status, created_at, budget)
- `sort_order`: Sort order (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Complete website redesign project",
      "status": "active",
      "progress": 75,
      "client": {
        "id": 1,
        "name": "Client Name"
      },
      "start_date": "2024-01-15",
      "end_date": "2024-02-15",
      "budget": 5000.00,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 50,
    "per_page": 10,
    "last_page": 5
  }
}
```

#### GET /api/projects/{id}
Get a specific project.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": 1,
  "name": "Website Redesign",
  "description": "Complete website redesign project",
  "status": "active",
  "progress": 75,
  "client": {
    "id": 1,
    "name": "Client Name",
    "email": "client@example.com"
  },
  "start_date": "2024-01-15",
  "end_date": "2024-02-15",
  "budget": 5000.00,
  "features": [
    {
      "id": 1,
      "name": "Homepage Design",
      "status": "completed",
      "progress": 100
    }
  ],
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

#### POST /api/projects
Create a new project.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "client_id": 1,
  "start_date": "2024-01-15",
  "end_date": "2024-02-15",
  "budget": 5000
}
```

#### PUT /api/projects/{id}
Update an existing project.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated project description",
  "status": "active",
  "progress": 80,
  "start_date": "2024-01-15",
  "end_date": "2024-02-15",
  "budget": 6000
}
```

#### DELETE /api/projects/{id}
Delete a project.

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

### Package Endpoints

#### GET /api/packages
Get all active packages.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Core Package",
      "description": "Essential services package",
      "price": 10999.00,
      "features": [
        "Dashboard",
        "Website",
        "Content Management"
      ],
      "is_active": true,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### GET /api/packages/{id}
Get a specific package.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": 1,
  "name": "Core Package",
  "description": "Essential services package",
  "price": 10999.00,
  "features": [
    "Dashboard",
    "Website",
    "Content Management"
  ],
  "is_active": true,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

#### POST /api/packages
Create a new package (admin only).

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Premium Package",
  "description": "Premium services package",
  "price": 19999.00,
  "features": [
    "Dashboard",
    "Website",
    "Content Management",
    "SEO Optimization",
    "Analytics"
  ]
}
```

#### PUT /api/packages/{id}
Update an existing package (admin only).

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "Updated Package Name",
  "description": "Updated package description",
  "price": 15999.00,
  "features": [
    "Dashboard",
    "Website",
    "Content Management",
    "SEO Optimization"
  ]
}
```

#### DELETE /api/packages/{id}
Delete a package (admin only).

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

### Dashboard Endpoints

#### GET /api/dashboard/stats
Get dashboard statistics.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "total_clients": 25,
  "total_projects": 50,
  "active_projects": 15,
  "completed_projects": 30,
  "total_revenue": 125000.00,
  "monthly_revenue": 15000.00,
  "recent_projects": [
    {
      "id": 1,
      "name": "Website Redesign",
      "status": "active",
      "progress": 75,
      "client": {
        "id": 1,
        "name": "Client Name"
      }
    }
  ],
  "recent_clients": [
    {
      "id": 1,
      "name": "Client Name",
      "email": "client@example.com",
      "projects_count": 3
    }
  ]
}
```

#### GET /api/dashboard/charts
Get chart data for dashboard.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `period`: Chart period (week, month, year)

**Response:**
```json
{
  "revenue_chart": [
    {
      "date": "2024-01-01",
      "revenue": 5000.00
    }
  ],
  "projects_chart": [
    {
      "date": "2024-01-01",
      "active": 5,
      "completed": 3
    }
  ],
  "clients_chart": [
    {
      "date": "2024-01-01",
      "new_clients": 2,
      "total_clients": 25
    }
  ]
}
```

## 📊 Models

### User Model
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "email_verified_at": "2024-01-15T10:00:00Z",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Client Model
```json
{
  "id": 1,
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+1234567890",
  "company": "Company Name",
  "address": "123 Main St, City, State",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Project Model
```json
{
  "id": 1,
  "name": "Project Name",
  "description": "Project description",
  "client_id": 1,
  "status": "active",
  "progress": 75,
  "start_date": "2024-01-15",
  "end_date": "2024-02-15",
  "budget": 5000.00,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Package Model
```json
{
  "id": 1,
  "name": "Package Name",
  "description": "Package description",
  "price": 10999.00,
  "features": [
    "Feature 1",
    "Feature 2"
  ],
  "is_active": true,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## 💡 Examples

### Complete Authentication Flow

1. **Login:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123"
     }'
   ```

2. **Use token for authenticated requests:**
   ```bash
   curl -X GET http://localhost:8000/api/clients \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
   ```

### Creating a Client with Projects

1. **Create client:**
   ```bash
   curl -X POST http://localhost:8000/api/clients \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "New Client",
       "email": "client@example.com",
       "phone": "+1234567890",
       "company": "New Company"
     }'
   ```

2. **Create project for client:**
   ```bash
   curl -X POST http://localhost:8000/api/projects \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Website Development",
       "description": "New website for client",
       "client_id": 1,
       "start_date": "2024-01-15",
       "end_date": "2024-02-15",
       "budget": 5000
     }'
   ```

### Error Handling Example

**Invalid request:**
```bash
curl -X POST http://localhost:8000/api/clients \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email"
  }'
```

**Response:**
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VAL_001",
    "details": {
      "name": ["The name field is required."],
      "email": ["The email field must be a valid email address."]
    }
  }
}
```

## 🔧 Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints:** 5 requests per minute
- **Other endpoints:** 60 requests per minute per user

When rate limit is exceeded:
```json
{
  "error": {
    "message": "Too many requests",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

## 📝 Pagination

All list endpoints support pagination with the following parameters:

- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "total": 100,
    "per_page": 10,
    "last_page": 10,
    "from": 1,
    "to": 10
  }
}
```

---

**Last Updated**: January 2024  
**API Version**: v1.0  
**Maintainers**: Altamedia Development Team 