#!/bin/bash
set -e

echo "🚀 Quick Start - Har Ghar Pooja Backend"

# Set environment variables directly
export DATABASE_URL="sqlite:///./hargharpooja.db"
export JWT_SECRET_KEY="development-secret-key-12345"
export JWT_ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"
export REFRESH_TOKEN_EXPIRE_DAYS="7"
export CORS_ORIGINS="http://localhost:3000,http://localhost:8000"
export ADMIN_PHONE="919999999999"
export ADMIN_PASSWORD="Admin@123"

# Remove old database
rm -f hargharpooja.db

echo "📦 Installing minimal dependencies..."
pip3 install --quiet --break-system-packages fastapi uvicorn sqlalchemy pydantic python-jose passlib python-dotenv bcrypt cryptography pydantic-settings 2>/dev/null || pip3 install fastapi uvicorn sqlalchemy pydantic python-jose passlib python-dotenv bcrypt cryptography pydantic-settings

echo "🌱 Seeding database..."
python3 -m app.seed_data

echo ""
echo "✅ Ready! Starting server on http://localhost:8000"
echo ""

python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
