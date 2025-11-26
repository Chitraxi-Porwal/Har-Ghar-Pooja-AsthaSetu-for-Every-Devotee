#!/bin/bash

echo "🕉️  Starting Har Ghar Pooja Platform..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose first."
    exit 1
fi

# Start backend with Docker
echo "📦 Starting backend services (PostgreSQL + FastAPI)..."
cd backend

# Copy .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
fi

# Start Docker containers
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 10

# Seed database
echo "🌱 Seeding database with initial data..."
docker-compose exec -T backend python -m app.seed_data

echo ""
echo "✅ Backend started successfully!"
echo "   API: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo ""

# Start frontend
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🎨 Starting frontend development server..."
npm run dev &

FRONTEND_PID=$!

echo ""
echo "✅ Frontend started successfully!"
echo "   App: http://localhost:3000"
echo ""
echo "═══════════════════════════════════════════"
echo "🎉 Har Ghar Pooja is now running!"
echo "═══════════════════════════════════════════"
echo ""
echo "Default Login Credentials:"
echo "  Admin:  919999999999 / Admin@123"
echo "  User:   919876543210 / User@123"
echo "  Pandit: 919111111111 / Pandit@123"
echo ""
echo "Press Ctrl+C to stop the services"
echo ""

# Wait for frontend process
wait $FRONTEND_PID
