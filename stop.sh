#!/bin/bash

echo "🛑 Stopping Har Ghar Pooja Platform..."
echo ""

# Stop backend Docker containers
echo "📦 Stopping backend services..."
cd backend
docker-compose down

echo ""
echo "🎨 Stopping frontend..."
# Kill any process running on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Kill any Vite processes
pkill -f "vite" 2>/dev/null || true

echo ""
echo "✅ All services stopped successfully!"
