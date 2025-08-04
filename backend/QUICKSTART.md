# Quick Start Guide for API Testing

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Supabase Account** with a project set up
3. **Postman** (for API testing)

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 2. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL to create all tables

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 Server running on port 3000
📊 Environment: development
🔗 Health check: http://localhost:3000/health
🔐 Auth endpoints: http://localhost:3000/api/auth
```

### 5. Test the API

#### Option A: Using the Test Script
```bash
# Install axios if not already installed
npm install axios

# Run the test script
node test-api.js
```

#### Option B: Using Postman
1. Import the Postman collection: `docs/AltaMedia_API.postman_collection.json`
2. Set up environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `token`: (will be set automatically after login)
   - `admin_token`: (set manually for admin tests)

#### Option C: Using curl
```bash
# Health check
curl http://localhost:3000/health

# Get packages
curl http://localhost:3000/api/packages

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Common Issues

### Server Won't Start
- Check that all environment variables are set in `.env`
- Ensure Supabase credentials are correct
- Verify port 3000 is not in use

### Database Errors
- Make sure you've run the schema in Supabase
- Check that your Supabase project is active
- Verify the table names match the schema

### Authentication Errors
- Ensure JWT_SECRET is set
- Check that users exist in the database
- Verify token format: `Bearer <token>`

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| GET | `/api/packages` | Get all packages | No |
| GET | `/api/addons` | Get all addons | No |
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| GET | `/api/purchases` | Get user purchases | Yes |
| POST | `/api/purchases` | Create purchase | Yes |

## Next Steps

1. Test all endpoints using Postman
2. Check the API documentation: `docs/API_DOCUMENTATION.md`
3. Review the troubleshooting guide: `TROUBLESHOOTING.md`
4. Set up your frontend application to use these endpoints 