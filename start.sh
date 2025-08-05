#!/bin/bash
chmod +x "$0"

# Define script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Start Express pension tracking system backend
echo "Starting Express backend..."
cd "$SCRIPT_DIR/backend"
npm start &

# Start React pension tracking system frontend
echo "Starting React frontend..."
cd "$SCRIPT_DIR/frontend"
npm run dev
