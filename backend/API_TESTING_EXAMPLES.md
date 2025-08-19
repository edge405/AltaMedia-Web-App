# API Testing Examples

## User Package Creation API

### Basic User Creation with Package

```bash
curl -X POST http://localhost:3000/api/user-package/create-user-with-package \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "fullname": "John Doe",
    "phone_number": "1234567890",
    "package_name": "Premium Brand Kit",
    "expiration_date": "2024-12-31",
    "total_amount": 299.99,
    "features": [
      {
        "feature_name": "Logo Design",
        "description": "Custom logo creation",
        "status": "pending",
        "progress": 0
      },
      {
        "feature_name": "Brand Guidelines",
        "description": "Complete brand style guide",
        "status": "pending",
        "progress": 0
      }
    ]
  }'
```

### User Creation without Features

```bash
curl -X POST http://localhost:3000/api/user-package/create-user-with-package \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "fullname": "Jane Smith",
    "phone_number": "9876543210",
    "package_name": "Basic Package",
    "expiration_date": "2024-06-30",
    "total_amount": 99.99
  }'
```

### Testing Validation Errors

#### Invalid Email
```bash
curl -X POST http://localhost:3000/api/user-package/create-user-with-package \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "fullname": "Test User",
    "phone_number": "1234567890",
    "package_name": "Test Package",
    "expiration_date": "2024-12-31",
    "total_amount": 199.99
  }'
```

#### Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/user-package/create-user-with-package \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullname": "Test User"
  }'
```

#### Duplicate Email (run twice)
```bash
curl -X POST http://localhost:3000/api/user-package/create-user-with-package \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "fullname": "Test User",
    "phone_number": "1234567890",
    "package_name": "Test Package",
    "expiration_date": "2024-12-31",
    "total_amount": 199.99
  }'
```

### Expected Responses

#### Success Response (201)
```json
{
  "success": true,
  "message": "User and package created successfully",
  "data": {
    "user_id": 123,
    "purchased_package_with_features_id": 456,
    "user": {
      "id": 123,
      "email": "john.doe@example.com",
      "fullname": "John Doe",
      "phone_number": "1234567890",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "package": {
      "id": 456,
      "package_name": "Premium Brand Kit",
      "expiration_date": "2024-12-31",
      "total_amount": 299.99,
      "status": "active",
      "purchase_date": "2024-01-15T10:30:00Z",
      "features": [
        {
          "feature_id": "feature_1705312200000_0",
          "feature_name": "Logo Design",
          "status": "pending",
          "progress": 0,
          "description": "Custom logo creation"
        }
      ]
    },
    "email_sent": true
  }
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Testing with PowerShell (Windows)

```powershell
$body = @{
    email = "test@example.com"
    fullname = "Test User"
    phone_number = "1234567890"
    package_name = "Test Package"
    expiration_date = "2024-12-31"
    total_amount = 199.99
    features = @(
        @{
            feature_name = "Logo Design"
            description = "Custom logo creation"
            status = "pending"
            progress = 0
        }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:3000/api/user-package/create-user-with-package" -Method POST -Body $body -ContentType "application/json"
```

### Testing with JavaScript (Node.js)

```javascript
const axios = require('axios');

const createUserWithPackage = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/user-package/create-user-with-package', {
      email: `test-${Date.now()}@example.com`,
      fullname: 'Test User',
      phone_number: '1234567890',
      package_name: 'Test Package',
      expiration_date: '2024-12-31',
      total_amount: 199.99,
      features: [
        {
          feature_name: 'Logo Design',
          description: 'Custom logo creation',
          status: 'pending',
          progress: 0
        }
      ]
    });

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

createUserWithPackage();
```

### Environment Variables Required

Make sure these environment variables are set in your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=https://altamedia-web-app.onrender.com
```
