@echo off
echo Creating .env file for frontend...
echo.

REM Check if .env file already exists
if exist ".env" (
    echo .env file already exists!
    echo Current contents:
    type .env
    echo.
    set /p overwrite="Do you want to overwrite it? (y/n): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled.
        pause
        exit /b
    )
)

REM Create .env file
echo # Frontend Environment Variables > .env
echo VITE_API_BASE_URL=http://localhost:3000/api >> .env
echo. >> .env
echo # Development settings >> .env
echo VITE_DEV_MODE=true >> .env

echo.
echo .env file created successfully!
echo.
echo Contents:
type .env
echo.
echo Please restart your development server for changes to take effect.
echo.
pause
