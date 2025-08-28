# API URL Troubleshooting Guide

## Problem: API calls going to frontend URL instead of backend

**Error**: `POST http://localhost:5173/api/deliverables/admin/upload 404 (Not Found)`

## Root Cause
The frontend is making API calls to `localhost:5173` (frontend port) instead of `localhost:3000` (backend port).

## Solution

### 1. Create Environment File
Run one of these scripts to create the `.env` file:

**Windows:**
```bash
cd frontend
setup-env.bat
```

**Unix/Linux/Mac:**
```bash
cd frontend
chmod +x setup-env.sh
./setup-env.sh
```

### 2. Manual Setup
Create a `.env` file in the `frontend/` directory with:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEV_MODE=true
```

### 3. Restart Development Server
After creating the `.env` file, restart your frontend development server:
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Verification

### Check Environment Variables
Open browser console and look for:
```
Environment variables: {VITE_API_BASE_URL: "http://localhost:3000/api"}
Final baseURL: http://localhost:3000/api
```

### Test API Call
Make an API call and check the network tab - it should show:
```
POST http://localhost:3000/api/deliverables/admin/upload
```

## Common Issues

### 1. Environment Variable Not Loading
- Make sure `.env` file is in the `frontend/` directory
- Restart the development server after creating `.env`
- Check that the variable name is exactly `VITE_API_BASE_URL`

### 2. Backend Not Running
- Ensure backend is running on port 3000
- Check: `http://localhost:3000/health`

### 3. CORS Issues
- Backend should allow requests from `localhost:5173`
- Check backend CORS configuration

## Debug Steps

1. **Check current API base URL:**
   ```javascript
   console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
   ```

2. **Check API service configuration:**
   ```javascript
   console.log('Final baseURL:', apiService.baseURL);
   ```

3. **Test API endpoint:**
   ```javascript
   fetch('http://localhost:3000/api/health')
     .then(response => response.json())
     .then(data => console.log('Backend response:', data));
   ```

## Files Modified
- `frontend/src/utils/api.js` - Fixed baseURL construction
- `frontend/src/components/admin/sections/AdminRevisions.jsx` - Updated to use API service
- `frontend/.env` - Environment configuration (created by script)
