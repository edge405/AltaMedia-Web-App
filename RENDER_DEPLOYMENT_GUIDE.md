# Render Deployment Guide - Fixed Version

## ✅ Issue Fixed
The build was failing because Vite was in `devDependencies`. I've moved Vite and build tools to `dependencies` so they're available during production builds.

## 🚀 Deploy to Render

### 1. Push Your Changes
```bash
git add .
git commit -m "Fix build dependencies for Render deployment"
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

1. **Moved build tools to dependencies:**
   - `vite`
   - `@vitejs/plugin-react`
   - `autoprefixer`
   - `postcss`
   - `tailwindcss`

2. **Updated build script:**
   - Uses `npm install --production=false` to ensure dev dependencies are installed

3. **Simplified backend scripts:**
   - Removed conflicting build scripts

## ✅ Test Your Deployment

1. **Health Check:** `https://your-app.onrender.com/health`
2. **Frontend:** `https://your-app.onrender.com`
3. **API:** `https://your-app.onrender.com/api/auth`

## 🐛 If Build Still Fails

Check Render logs for:
- Missing environment variables
- Database connection issues
- Port conflicts

The build should now work correctly! 🎉
