#!/bin/bash

# Alta Flow - Setup Script
# This script automates the installation and setup of the Alta Flow project

set -e

echo "🚀 Alta Flow - Setup Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check PHP
    if ! command -v php &> /dev/null; then
        print_error "PHP is not installed. Please install PHP 8.2+ first."
        exit 1
    fi
    
    # Check Composer
    if ! command -v composer &> /dev/null; then
        print_error "Composer is not installed. Please install Composer first."
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Setup Frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Install npm dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully!"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
}

# Setup Backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install Composer dependencies
    print_status "Installing Composer dependencies..."
    composer install --no-interaction
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully!"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Copying environment file..."
        cp .env.example .env
        print_success "Environment file created!"
    else
        print_warning "Environment file already exists"
    fi
    
    # Generate application key
    print_status "Generating application key..."
    php artisan key:generate
    
    # Install npm dependencies for backend assets
    print_status "Installing backend npm dependencies..."
    npm install
    
    # Build backend assets
    print_status "Building backend assets..."
    npm run build
    
    cd ..
}

# Setup Database
setup_database() {
    print_status "Setting up database..."
    
    cd backend
    
    # Check if database configuration is set
    if grep -q "DB_DATABASE=alta_flow" .env; then
        print_warning "Database configuration found in .env"
        print_status "Please ensure your database server is running and the database 'alta_flow' exists"
        
        read -p "Do you want to run migrations? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Running database migrations..."
            php artisan migrate
            
            if [ $? -eq 0 ]; then
                print_success "Database migrations completed!"
            else
                print_error "Failed to run database migrations"
                print_warning "Please check your database configuration in .env file"
            fi
        fi
        
        read -p "Do you want to seed the database? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Seeding database..."
            php artisan db:seed
            
            if [ $? -eq 0 ]; then
                print_success "Database seeded successfully!"
            else
                print_error "Failed to seed database"
            fi
        fi
    else
        print_warning "Database not configured. Please update the .env file with your database settings"
    fi
    
    cd ..
}

# Create development scripts
create_dev_scripts() {
    print_status "Creating development scripts..."
    
    # Create start-frontend.sh
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Alta Flow Frontend..."
npm run dev
EOF
    chmod +x start-frontend.sh
    
    # Create start-backend.sh
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Alta Flow Backend..."
cd backend
php artisan serve
EOF
    chmod +x start-backend.sh
    
    # Create start-all.sh
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Alta Flow (Frontend + Backend)..."
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API will be available at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start backend in background
cd backend && php artisan serve > ../backend.log 2>&1 &
BACKEND_PID=$!

# Start frontend
cd .. && npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOF
    chmod +x start-all.sh
    
    print_success "Development scripts created!"
}

# Display setup completion
show_completion() {
    echo ""
    echo "🎉 Alta Flow Setup Complete!"
    echo "=========================="
    echo ""
    echo "📁 Project Structure:"
    echo "  ├── Frontend (React + Vite)"
    echo "  ├── Backend (Laravel)"
    echo "  └── Documentation"
    echo ""
    echo "🚀 Quick Start Commands:"
    echo "  ./start-frontend.sh    - Start frontend only"
    echo "  ./start-backend.sh     - Start backend only"
    echo "  ./start-all.sh         - Start both frontend and backend"
    echo ""
    echo "📖 Documentation:"
    echo "  README.md              - Main project documentation"
    echo "  DOCUMENTATION.md       - Technical documentation"
    echo "  backend/README.md      - Backend-specific documentation"
    echo ""
    echo "🔧 Configuration:"
    echo "  - Frontend: Configured with Vite and Tailwind CSS"
    echo "  - Backend: Check .env file in backend/ directory"
    echo "  - Database: Ensure database is running and configured"
    echo ""
    echo "🌐 Access Points:"
    echo "  - Frontend: http://localhost:5173"
    echo "  - Backend API: http://localhost:8000"
    echo ""
    echo "📝 Next Steps:"
    echo "  1. Configure your database in backend/.env"
    echo "  2. Run database migrations: cd backend && php artisan migrate"
    echo "  3. Start the development servers"
    echo "  4. Access the application at http://localhost:5173"
    echo ""
    echo "For detailed setup instructions, see README.md"
    echo ""
}

# Main setup function
main() {
    echo "Starting Alta Flow setup..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Setup frontend
    setup_frontend
    
    # Setup backend
    setup_backend
    
    # Setup database
    setup_database
    
    # Create development scripts
    create_dev_scripts
    
    # Show completion message
    show_completion
}

# Run main function
main "$@" 