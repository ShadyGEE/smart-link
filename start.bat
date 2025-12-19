@echo off
echo ========================================
echo    SmartLink - Startup Script
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker is not running.
    echo [*] Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo [*] Please wait for Docker Desktop to fully start (about 60 seconds)
    echo [*] Then run this script again.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Start containers
echo [*] Starting PostgreSQL, pgAdmin, and Redis containers...
cd /d %~dp0
docker-compose up -d

if %errorlevel% neq 0 (
    echo [!] Failed to start containers
    pause
    exit /b 1
)

echo.
echo [*] Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

REM Install dependencies if needed
if not exist "node_modules" (
    echo [*] Installing dependencies...
    call npm install
)

REM Generate Prisma client
echo [*] Generating Prisma client...
call npx prisma generate

REM Push database schema
echo [*] Setting up database schema...
call npx prisma db push

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo PostgreSQL: localhost:5432
echo pgAdmin:    http://localhost:5050
echo            (admin@smartlink.local / admin123)
echo Redis:      localhost:6379
echo.
echo To start the app, run: npm run dev
echo.
pause
