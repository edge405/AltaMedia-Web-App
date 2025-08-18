# AltaMedia Web App Deployment Guide

This guide explains how to deploy the AltaMedia Web App (React + Express) to Render.

## Project Structure

```
Alta-Web-App/
├── frontend/          # React + Vite application
├── backend/           # Express.js API server
├── package.json       # Root package.json for deployment
├── render.yaml        # Render deployment configuration
└── .gitignore         # Git ignore rules
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   This starts both the frontend (Vite dev server) and backend (Express) concurrently.

3. **Build for production:**
   ```bash
   npm run build
   ```
   This builds the frontend and installs backend dependencies.

## Render Deployment

### Prerequisites

1. Create a Render account at [render.com](https://render.com)
2. Connect your GitHub repository to Render
3. Ensure your repository is public or you have a paid Render plan

### Deployment Steps

1. **Connect Repository:**
   - Go to your Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this project

2. **Configure Service:**
   - **Name:** `altamedia-web-app` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Choose your preferred plan (Free tier works for testing)

3. **Environment Variables:**
   Add the following environment variables in Render:
   
   **Required:**
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render will override this)
   - `JWT_SECRET` = Your JWT secret key
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_ANON_KEY` = Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
   
   **Optional (if using features):**
   - `OPENAI_API_KEY` = Your OpenAI API key
   - `SMTP_HOST` = Your SMTP host
   - `SMTP_PORT` = Your SMTP port
   - `SMTP_USER` = Your SMTP username
   - `SMTP_PASS` = Your SMTP password

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - The first deployment may take 5-10 minutes

### How It Works

1. **Build Process:**
   - Render runs `npm run build` from the root
   - This installs frontend dependencies and builds the React app
   - The built files are placed in `backend/public/`
   - Backend dependencies are installed

2. **Runtime:**
   - Express server starts with `npm start`
   - Serves static files from `backend/public/`
   - Handles API routes under `/api/*`
   - Serves React app for all other routes (client-side routing)

3. **API Configuration:**
   - In production, the frontend makes API calls to `/api/*` (same domain)
   - In development, it uses the `VITE_API_BASE_URL` environment variable

## Environment Variables Reference

### Development (.env files)
Create `.env` files in both `frontend/` and `backend/` directories:

**frontend/.env:**
```
VITE_API_BASE_URL=http://localhost:3000/api
```

**backend/.env:**
```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Production (Render Environment Variables)
Set these in your Render dashboard:

- `NODE_ENV` = `production`
- `PORT` = `10000` (Render sets this automatically)
- `JWT_SECRET` = Your secure JWT secret
- `SUPABASE_URL` = Your Supabase project URL
- `SUPABASE_ANON_KEY` = Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
- `OPENAI_API_KEY` = Your OpenAI API key (if using AI features)
- `SMTP_HOST` = Your SMTP host (if using email features)
- `SMTP_PORT` = Your SMTP port
- `SMTP_USER` = Your SMTP username
- `SMTP_PASS` = Your SMTP password
- `FRONTEND_URL` = Your Render app URL (e.g., `https://your-app.onrender.com`)
- `ALLOWED_ORIGINS` = Your Render app URL

## Troubleshooting

### Common Issues

1. **Build fails:**
   - Check that all dependencies are properly listed in package.json files
   - Ensure Node.js version is compatible (>=18.0.0)

2. **API calls fail in production:**
   - Verify environment variables are set correctly in Render
   - Check that the API base URL is configured correctly

3. **Static files not served:**
   - Ensure the build process completed successfully
   - Check that `backend/public/` directory exists with built files

4. **CORS errors:**
   - Verify `ALLOWED_ORIGINS` environment variable is set correctly
   - Check that `FRONTEND_URL` matches your actual Render URL

### Health Check

The application includes a health check endpoint at `/health` that returns:
```json
{
  "success": true,
  "message": "AltaMedia Client Dashboard Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

## Security Notes

1. **Environment Variables:** Never commit sensitive environment variables to version control
2. **JWT Secret:** Use a strong, random JWT secret in production
3. **CORS:** Configure CORS properly for production domains
4. **Helmet:** Security headers are enabled by default
5. **Rate Limiting:** Consider enabling rate limiting for production

## Monitoring

- Use Render's built-in logs to monitor your application
- Set up alerts for failed deployments
- Monitor the `/health` endpoint for application status
- Check Render's metrics dashboard for performance insights
