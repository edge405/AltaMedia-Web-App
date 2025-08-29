# cPanel Backend Deployment Guide

## Prerequisites
- cPanel access with Node.js support
- MySQL database created in cPanel
- Domain: builderapi.altamedia.ai

## Step 1: Environment Configuration

Create a `.env` file in your backend directory with the following configuration:

```env
# Production Environment Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=your_cpanel_db_user
DB_PASSWORD=your_cpanel_db_password
DB_NAME=your_cpanel_db_name
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=https://builder.altamedia.ai
ALLOWED_ORIGINS=https://builder.altamedia.ai

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# Cloudinary Configuration (if using)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Step 2: cPanel Setup

### 2.1 Create Subdomain
1. Go to cPanel → Domains → Subdomains
2. Create subdomain: `builderapi` pointing to your main domain
3. Document root: `/public_html/builderapi`

### 2.2 Setup Node.js App
1. Go to cPanel → Node.js Selector
2. Create new Node.js app:
   - Node.js version: 18.x or 20.x
   - Application mode: Production
   - Application root: `/public_html/builderapi`
   - Application URL: `https://builderapi.altamedia.ai`
   - Application startup file: `src/server.js`
   - Passenger port: 3000

## Step 3: File Upload

### 3.1 Upload Backend Files
1. Use File Manager or FTP to upload backend files to `/public_html/builderapi/`
2. Ensure the following structure:
```
/public_html/builderapi/
├── src/
├── uploads/
├── package.json
├── .env
└── node_modules/ (will be created)
```

### 3.2 Install Dependencies
1. Open Terminal in cPanel or use SSH
2. Navigate to `/public_html/builderapi/`
3. Run: `npm install --production`

## Step 4: Database Setup

### 4.1 Create MySQL Database
1. Go to cPanel → MySQL Databases
2. Create database: `your_db_name`
3. Create user: `your_db_user`
4. Assign user to database with all privileges

### 4.2 Import Database Schema
1. Go to phpMyAdmin
2. Select your database
3. Import the SQL file from `backend/database/alta_web.sql`

## Step 5: Configure Domain

### 5.1 DNS Configuration
1. Go to cPanel → Zone Editor
2. Add A record:
   - Name: `builderapi`
   - TTL: 300
   - Points to: Your server IP

### 5.2 SSL Certificate
1. Go to cPanel → SSL/TLS
2. Install SSL certificate for `builderapi.altamedia.ai`
3. Force HTTPS redirect

## Step 6: Start Application

### 6.1 Restart Node.js App
1. Go to cPanel → Node.js Selector
2. Find your app and click "Restart"

### 6.2 Test Health Endpoint
Visit: `https://builderapi.altamedia.ai/health`

Expected response:
```json
{
  "success": true,
  "message": "AltaMedia Client Dashboard Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "MySQL"
}
```

## Step 7: Update Frontend Configuration

Your frontend is already configured correctly in `frontend/src/config/api.js`:
```javascript
if (process.env.NODE_ENV === 'production') {
  return 'https://builderapi.altamedia.ai/';
}
```

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Ensure port 3000 is available
2. **Database connection**: Verify database credentials in `.env`
3. **CORS errors**: Check `ALLOWED_ORIGINS` configuration
4. **File permissions**: Ensure uploads directory is writable

### Logs:
- Check cPanel error logs
- Node.js app logs in cPanel
- Database connection logs

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use strong passwords
3. **JWT Secret**: Use a long, random string
4. **CORS**: Only allow your frontend domain
5. **Rate Limiting**: Enable in production
6. **SSL**: Always use HTTPS in production

## Monitoring

1. Set up uptime monitoring for your API
2. Monitor database performance
3. Set up error logging
4. Monitor file upload sizes and storage
