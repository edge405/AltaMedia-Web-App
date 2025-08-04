@echo off
setlocal enabledelayedexpansion

REM Alta Flow - Setup Script (Windows)
REM This script automates the installation and setup of the Alta Flow project

echo.
echo 🚀 Alta Flow - Setup Script
echo ==========================
echo.

REM Check if required tools are installed
echo [INFO] Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check PHP
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PHP is not installed. Please install PHP 8.2+ first.
    pause
    exit /b 1
)

REM Check Composer
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Composer is not installed. Please install Composer first.
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites are installed!
echo.

REM Setup Frontend
echo [INFO] Setting up frontend...
echo [INFO] Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed successfully!
echo.

REM Setup Backend
echo [INFO] Setting up backend...
cd backend

echo [INFO] Installing Composer dependencies...
call composer install --no-interaction
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed successfully!

REM Copy environment file
if not exist .env (
    echo [INFO] Copying environment file...
    copy .env.example .env
    echo [SUCCESS] Environment file created!
) else (
    echo [WARNING] Environment file already exists
)

REM Generate application key
echo [INFO] Generating application key...
call php artisan key:generate

REM Install npm dependencies for backend assets
echo [INFO] Installing backend npm dependencies...
call npm install

REM Build backend assets
echo [INFO] Building backend assets...
call npm run build

cd ..
echo.

REM Setup Database
echo [INFO] Setting up database...
cd backend

REM Check if database configuration is set
findstr "DB_DATABASE=alta_flow" .env >nul
if %errorlevel% equ 0 (
    echo [WARNING] Database configuration found in .env
    echo [INFO] Please ensure your database server is running and the database 'alta_flow' exists
    echo.
    
    set /p run_migrations="Do you want to run migrations? (y/n): "
    if /i "!run_migrations!"=="y" (
        echo [INFO] Running database migrations...
        call php artisan migrate
        if %errorlevel% neq 0 (
            echo [ERROR] Failed to run database migrations
            echo [WARNING] Please check your database configuration in .env file
        ) else (
            echo [SUCCESS] Database migrations completed!
        )
    )
    
    set /p seed_db="Do you want to seed the database? (y/n): "
    if /i "!seed_db!"=="y" (
        echo [INFO] Seeding database...
        call php artisan db:seed
        if %errorlevel% neq 0 (
            echo [ERROR] Failed to seed database
        ) else (
            echo [SUCCESS] Database seeded successfully!
        )
    )
) else (
    echo [WARNING] Database not configured. Please update the .env file with your database settings
)

cd ..
echo.

REM Create development scripts
echo [INFO] Creating development scripts...

REM Create start-frontend.bat
(
echo @echo off
echo echo 🚀 Starting Alta Flow Frontend...
echo call npm run dev
) > start-frontend.bat

REM Create start-backend.bat
(
echo @echo off
echo echo 🚀 Starting Alta Flow Backend...
echo cd backend
echo call php artisan serve
) > start-backend.bat

REM Create start-all.bat
(
echo @echo off
echo echo 🚀 Starting Alta Flow ^(Frontend + Backend^)...
echo echo Frontend will be available at: http://localhost:5173
echo echo Backend API will be available at: http://localhost:8000
echo echo.
echo echo Press Ctrl+C to stop all services
echo echo.
echo.
echo REM Start backend in background
echo start /B cmd /c "cd backend ^&^& php artisan serve ^> ..\backend.log 2^>^&1"
echo.
echo REM Start frontend
echo call npm run dev
) > start-all.bat

echo [SUCCESS] Development scripts created!
echo.

REM Display setup completion
echo.
echo 🎉 Alta Flow Setup Complete!
echo ==========================
echo.
echo 📁 Project Structure:
echo   ├── Frontend ^(React + Vite^)
echo   ├── Backend ^(Laravel^)
echo   └── Documentation
echo.
echo 🚀 Quick Start Commands:
echo   start-frontend.bat    - Start frontend only
echo   start-backend.bat     - Start backend only
echo   start-all.bat         - Start both frontend and backend
echo.
echo 📖 Documentation:
echo   README.md              - Main project documentation
echo   DOCUMENTATION.md       - Technical documentation
echo   backend\README.md      - Backend-specific documentation
echo.
echo 🔧 Configuration:
echo   - Frontend: Configured with Vite and Tailwind CSS
echo   - Backend: Check .env file in backend\ directory
echo   - Database: Ensure database is running and configured
echo.
echo 🌐 Access Points:
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://localhost:8000
echo.
echo 📝 Next Steps:
echo   1. Configure your database in backend\.env
echo   2. Run database migrations: cd backend ^&^& php artisan migrate
echo   3. Start the development servers
echo   4. Access the application at http://localhost:5173
echo.
echo For detailed setup instructions, see README.md
echo.

pause 