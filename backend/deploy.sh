#!/bin/bash

# AltaMedia Backend Deployment Script for cPanel
# This script helps prepare and deploy the backend to cPanel

echo "🚀 AltaMedia Backend Deployment Script"
echo "======================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your production configuration."
    echo "See deploy-cpanel.md for the required environment variables."
    exit 1
fi

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install --production

# Check if uploads directory exists
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads/deliverables
    mkdir -p uploads/forms
fi

# Set proper permissions
echo "🔐 Setting file permissions..."
chmod 755 uploads
chmod 755 uploads/deliverables
chmod 755 uploads/forms

# Create a deployment package
echo "📦 Creating deployment package..."
tar -czf alta-backend-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='test' \
    --exclude='docs' \
    --exclude='diagram' \
    .

echo "✅ Deployment package created: alta-backend-deploy.tar.gz"
echo ""
echo "📋 Next steps:"
echo "1. Upload alta-backend-deploy.tar.gz to your cPanel"
echo "2. Extract it in /public_html/builderapi/"
echo "3. Run 'npm install --production' in the extracted directory"
echo "4. Configure your .env file with production values"
echo "5. Set up Node.js app in cPanel"
echo "6. Import your database schema"
echo ""
echo "📖 See deploy-cpanel.md for detailed instructions"
