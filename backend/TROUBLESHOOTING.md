# API Testing Troubleshooting Guide

## Common Issues and Solutions

### 1. Server Not Starting

**Error:** `Missing Supabase configuration`

**Solution:**
1. Create a `.env` file in the root directory
2. Add your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

### 2. Database Connection Issues

**Error:** `relation "users" does not exist`

**Solution:**
1. Run the database schema in your Supabase SQL editor:
```sql
-- Copy the contents of database/schema.sql and run it in Supabase
```

### 3. Authentication Errors

**Error:** `Invalid or expired token`

**Possible Causes:**
- JWT_SECRET not set in environment
- Token format incorrect
- User doesn't exist in database

**Solution:**
1. Check that JWT_SECRET is set in your `.env` file
2. Ensure you're sending the token as: `Authorization: Bearer <token>`
3. Verify the user exists in the database

### 4. CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
The server is configured to allow all origins in development. If you're still getting CORS errors:
1. Check that the server is running on the correct port
2. Ensure you're using the correct URL in your requests

### 5. Rate Limiting

**Error:** `Too many requests from this IP`

**Solution:**
- Wait 15 minutes or restart the server
- The rate limit is 100 requests per 15 minutes per IP

## Testing Steps

### Step 1: Check Server Status
```bash
curl http://localhost:3000/health
```

### Step 2: Test Public Endpoints
```bash
# Get packages
curl http://localhost:3000/api/packages

# Get addons
curl http://localhost:3000/api/addons
```

### Step 3: Test Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Step 4: Test Protected Endpoints
```bash
# Get profile (replace TOKEN with actual token)
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Environment Setup Checklist

- [ ] `.env` file exists with all required variables
- [ ] Supabase project is set up
- [ ] Database schema is applied
- [ ] Server is running on port 3000
- [ ] No firewall blocking localhost:3000

## Debug Mode

To run the server in debug mode:
```bash
NODE_ENV=development DEBUG=* npm start
```

## Common Postman Issues

1. **Wrong URL**: Ensure you're using `http://localhost:3000/api`
2. **Missing Headers**: Add `Content-Type: application/json` for POST requests
3. **Token Format**: Use `Bearer <token>` in Authorization header
4. **Environment Variables**: Set up `base_url`, `token`, and `admin_token` in Postman

## Getting Help

If you're still experiencing issues:

1. Check the server console for error messages
2. Run the test script: `node test-api.js`
3. Verify your Supabase configuration
4. Ensure all environment variables are set correctly 