# Render Deployment Guide - Fixed Version

## ✅ Issues Fixed
1. **Build failing:** Vite was in `devDependencies` - moved to `dependencies`
2. **Server crashing:** Express 5.x compatibility issue - downgraded to Express 4.18.2

## 🚀 Deploy to Render

### 1. Push Your Changes
```bash
git add .
git commit -m "Fix Express version and build dependencies for Render deployment"
git push origin main
```

### 2. Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `altamedia-web-app`
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or your preferred plan)

### 3. Set Environment Variables
Add these in Render dashboard:

**Required:**
```
NODE_ENV = production
PORT = 10000
JWT_SECRET = [your-secure-jwt-secret]
SUPABASE_URL = [your-supabase-url]
SUPABASE_ANON_KEY = [your-supabase-anon-key]
SUPABASE_SERVICE_ROLE_KEY = [your-supabase-service-role-key]
```

**Optional:**
```
OPENAI_API_KEY = [your-openai-key]
SMTP_HOST = [your-smtp-host]
SMTP_PORT = [your-smtp-port]
SMTP_USER = [your-smtp-user]
SMTP_PASS = [your-smtp-pass]
```

### 4. Deploy
Click **"Create Web Service"** and wait for build to complete.

### 5. Update URLs (After Deployment)
Once you have your Render URL (e.g., `https://altamedia-web-app.onrender.com`), add:
```
FRONTEND_URL = https://your-app-name.onrender.com
ALLOWED_ORIGINS = https://your-app-name.onrender.com
```

## 🔧 What Was Fixed

### 1. Build Dependencies
- **Moved build tools to dependencies:**
  - `vite`
  - `@vitejs/plugin-react`
  - `autoprefixer`
  - `postcss`
  - `tailwindcss`

- **Updated build script:**
  - Uses `npm install --production=false` to ensure dev dependencies are installed

### 2. Express Version Fix
- **Downgraded Express:** From `^5.1.0` to `^4.18.2`
- **Why:** Express 5.x has breaking changes that cause `path-to-regexp` errors
- **Result:** Server now starts successfully without crashes

### 3. Simplified Backend Scripts
- Removed conflicting build scripts from backend package.json

## ✅ Test Your Deployment

1. **Health Check:** `https://your-app.onrender.com/health`
   - Should return: `{"success":true,"message":"AltaMedia Client Dashboard Backend is running"}`
2. **Frontend:** `https://your-app.onrender.com`
3. **API:** `https://your-app.onrender.com/api/auth`

## 🐛 If Build Still Fails

Check Render logs for:
- Missing environment variables
- Database connection issues
- Port conflicts

## 🎉 Success Indicators

- ✅ Build completes without errors
- ✅ Server starts successfully
- ✅ Health endpoint responds
- ✅ Frontend loads correctly
- ✅ API endpoints work

The deployment should now work perfectly! 🚀
