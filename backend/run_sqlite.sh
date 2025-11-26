#!/bin/bash

echo "🕉️ Starting Har Ghar Pooja Backend (SQLite - No Docker Required)..."
echo ""

# Create .env for SQLite
cat > .env << 'EOF'
# Database - SQLite (No PostgreSQL needed)
DATABASE_URL=sqlite:///./hargharpooja.db

# JWT
JWT_SECRET_KEY=super-secret-development-key-change-in-production-12345
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
CORS_ORIGINS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000

# Admin
ADMIN_PHONE=919999999999
ADMIN_PASSWORD=Admin@123
EOF

echo "✅ Created .env with SQLite configuration"

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.9+"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies (this may take a minute)..."
pip install -q --upgrade pip setuptools wheel
pip install -q fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose passlib python-multipart python-dotenv razorpay stripe httpx bcrypt cryptography

echo "🗄️ Setting up database..."
# Remove old database
rm -f hargharpooja.db

# Seed database
echo "🌱 Seeding database with pujas and users..."
python3 -m app.seed_data

echo ""
echo "═══════════════════════════════════════"
echo "✅ Backend Ready!"
echo "═══════════════════════════════════════"
echo ""
echo "Default Credentials:"
echo "  Admin:  919999999999 / Admin@123"
echo "  User:   919876543210 / User@123"
echo "  Pandit: 919111111111 / Pandit@123"
echo ""
echo "🚀 Starting server..."
echo "   API: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo ""

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
