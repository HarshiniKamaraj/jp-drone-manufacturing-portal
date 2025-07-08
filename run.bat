@echo off
REM Script to set up and run the Drone Manufacturing Logistics Website

echo === Drone Manufacturing Logistics Website ===
echo Setting up the application...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js v16 or later.
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please install npm.
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Mock data generation will not be available.
    set HAS_PYTHON=false
) else (
    set HAS_PYTHON=true
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Create public/mock-data directory if it doesn't exist
if not exist "public\mock-data" mkdir "public\mock-data"

REM Generate mock data if Python is available
if "%HAS_PYTHON%"=="true" (
    echo Generating mock data...
    cd mock-data
    python generate_drones.py
    python generate_parts.py
    python generate_jobs.py
    cd ..
) else (
    echo Skipping mock data generation (Python not found).
    echo You can still use the 'Import Mock Data' button in the app.
)

REM Start the development server
echo Starting the development server...
echo Open your browser and navigate to http://localhost:3000
call npm run dev

REM Made with Bob
