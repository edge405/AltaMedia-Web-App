#!/bin/bash

echo "Creating .env file for frontend..."
echo

# Check if .env file already exists
if [ -f ".env" ]; then
    echo ".env file already exists!"
    echo "Current contents:"
    cat .env
    echo
    read -p "Do you want to overwrite it? (y/n): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Create .env file
cat > .env << EOF
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:3000/api

# Development settings
VITE_DEV_MODE=true
EOF

echo
echo ".env file created successfully!"
echo
echo "Contents:"
cat .env
echo
echo "Please restart your development server for changes to take effect."
echo
