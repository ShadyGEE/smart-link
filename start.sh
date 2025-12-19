#!/bin/bash
echo "========================================"
echo "   SmartLink - Startup Script"
echo "========================================"
echo

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "[!] Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "[OK] Docker is running"
echo

# Start containers
echo "[*] Starting PostgreSQL, pgAdmin, and Redis containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "[!] Failed to start containers"
    exit 1
fi

echo
echo "[*] Waiting for PostgreSQL to be ready..."
sleep 10

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[*] Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "[*] Generating Prisma client..."
npx prisma generate

# Push database schema
echo "[*] Setting up database schema..."
npx prisma db push

echo
echo "========================================"
echo "   Setup Complete!"
echo "========================================"
echo
echo "PostgreSQL: localhost:5432"
echo "pgAdmin:    http://localhost:5050"
echo "           (admin@smartlink.local / admin123)"
echo "Redis:      localhost:6379"
echo
echo "To start the app, run: npm run dev"
