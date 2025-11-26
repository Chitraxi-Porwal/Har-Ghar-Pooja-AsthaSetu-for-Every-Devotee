#!/bin/bash

echo "🕉️ Starting Har Ghar Pooja Backend Locally..."
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Installing with Homebrew..."
    brew install postgresql@15
fi

# Start PostgreSQL
echo "📦 Starting PostgreSQL..."
brew services start postgresql@15 2>/dev/null || true

# Wait for PostgreSQL
sleep 3

# Create database if it doesn't exist
echo "🗄️ Setting up database..."
psql postgres -c "DROP DATABASE IF EXISTS hargharpooja;" 2>/dev/null || true
psql postgres -c "CREATE DATABASE hargharpooja;" 2>/dev/null || true
psql postgres -c "CREATE USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || true
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE hargharpooja TO postgres;" 2>/dev/null || true

# Update DATABASE_URL in .env for local
cat > .env << EOF
# Database - Local PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hargharpooja

# JWT
JWT_SECRET_KEY=super-secret-key-for-development-only-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_API_KEY=your_stripe_api_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
APP_NAME=Har Ghar Pooja
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Admin
ADMIN_PHONE=919999999999
ADMIN_PASSWORD=Admin@123
EOF

echo "✅ .env file configured for local PostgreSQL"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Seed database
echo "🌱 Seeding database with initial data..."
python -m app.seed_data

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "🚀 Starting FastAPI server..."
echo "   API: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo ""

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
