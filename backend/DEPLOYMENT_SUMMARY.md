# 🚀 AltaMedia Backend Deployment Summary

## Quick Start Guide

Your backend is ready to be deployed to `https://builderapi.altamedia.ai/` to serve your frontend at `https://builder.altamedia.ai/`.

## 📋 Pre-Deployment Checklist

- [ ] cPanel access with Node.js support
- [ ] MySQL database created in cPanel
- [ ] Domain `builderapi.altamedia.ai` configured
- [ ] SSL certificate installed
- [ ] Environment variables configured

## 🔧 Required Configuration

### 1. Environment Variables (.env file)
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_USER=your_cpanel_db_user
DB_PASSWORD=your_cpanel_db_password
DB_NAME=your_cpanel_db_name
DB_PORT=3306
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://builder.altamedia.ai
ALLOWED_ORIGINS=https://builder.altamedia.ai
OPENAI_API_KEY=your_openai_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

### 2. cPanel Node.js App Configuration
- **Node.js version**: 18.x or 20.x
- **Application mode**: Production
- **Application root**: `/public_html/builderapi`
- **Application URL**: `https://builderapi.altamedia.ai`
- **Application startup file**: `src/server.js`
- **Passenger port**: 3000

## 📁 File Structure After Deployment
```
/public_html/builderapi/
├── src/                    # Source code
├── uploads/               # File uploads directory
│   ├── deliverables/
│   └── forms/
├── package.json           # Dependencies
├── .env                   # Environment variables
└── node_modules/          # Installed packages
```

## 🔗 API Endpoints

Your backend will serve these endpoints:
- `https://builderapi.altamedia.ai/health` - Health check
- `https://builderapi.altamedia.ai/api/auth/*` - Authentication
- `https://builderapi.altamedia.ai/api/packages/*` - Package management
- `https://builderapi.altamedia.ai/api/addons/*` - Addon management
- `https://builderapi.altamedia.ai/api/purchases/*` - Purchase handling
- `https://builderapi.altamedia.ai/api/brandkit/*` - Brand kit features
- `https://builderapi.altamedia.ai/api/ai-suggestions/*` - AI suggestions
- `https://builderapi.altamedia.ai/api/deliverables/*` - File deliverables

## 🎯 Frontend Integration

Your frontend is already configured to use the correct backend URL:
```javascript
// frontend/src/config/api.js
if (process.env.NODE_ENV === 'production') {
  return 'https://builderapi.altamedia.ai/';
}
```

## 🛠️ Deployment Commands

### Local Preparation
```bash
cd backend
npm run deploy  # Creates deployment package
```

### cPanel Deployment
```bash
# Upload alta-backend-deploy.tar.gz to cPanel
# Extract in /public_html/builderapi/
cd /public_html/builderapi
npm install --production
# Configure .env file
# Restart Node.js app in cPanel
```

## 🧪 Testing Deployment

After deployment, test your backend:
```bash
cd backend
node test-deployment.js
```

Expected health check response:
```json
{
  "success": true,
  "message": "AltaMedia Client Dashboard Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "MySQL"
}
```

## 🔒 Security Features

- CORS configured for your frontend domain only
- JWT authentication
- Rate limiting (can be enabled)
- Helmet security headers
- Input validation and sanitization
- File upload restrictions

## 📊 Monitoring

- Health check endpoint: `/health`
- Error logging in cPanel
- Database connection monitoring
- File upload monitoring

## 🆘 Troubleshooting

### Common Issues:
1. **Port 3000 not available**: Change port in cPanel Node.js settings
2. **Database connection failed**: Verify credentials in `.env`
3. **CORS errors**: Check `ALLOWED_ORIGINS` configuration
4. **File uploads failing**: Check uploads directory permissions

### Logs Location:
- cPanel error logs
- Node.js app logs in cPanel
- Application logs in `/public_html/builderapi/`

## 📞 Support

If you encounter issues:
1. Check the detailed guide in `deploy-cpanel.md`
2. Verify all environment variables are set correctly
3. Test the health endpoint first
4. Check cPanel error logs

---

**Your backend will be accessible at: https://builderapi.altamedia.ai/**
**Your frontend will communicate with: https://builderapi.altamedia.ai/api/**

🎉 **Ready for deployment!**
