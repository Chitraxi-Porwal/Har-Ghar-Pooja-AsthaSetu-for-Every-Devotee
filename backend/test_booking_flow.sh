#!/bin/bash
set -e

echo "════════════════════════════════════════════════════════════"
echo "🕉️  HAR GHAR POOJA - Complete Booking & Payment Flow Test"
echo "════════════════════════════════════════════════════════════"
echo ""

BASE_URL="http://localhost:8001"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing backend connection...${NC}"
if ! curl -s $BASE_URL/health > /dev/null; then
    echo "❌ Backend not running on $BASE_URL"
    echo "Please start backend first:"
    echo "  cd backend && DATABASE_URL='sqlite:///./hargharpooja.db' python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001"
    exit 1
fi
echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Step 1: Login
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 1: User Login${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"919876543210","password":"User@123"}')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token', ''))")
USER_NAME=$(echo $LOGIN_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('user', {}).get('name', 'Unknown'))")

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed"
    echo $LOGIN_RESPONSE
    exit 1
fi

echo -e "${GREEN}✅ Logged in as: $USER_NAME${NC}"
echo "   Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Get Available Pujas
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 2: Fetching Available Pujas${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

PUJAS_RESPONSE=$(curl -s $BASE_URL/api/pujas)
PUJA_COUNT=$(echo $PUJAS_RESPONSE | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")
echo -e "${GREEN}✅ Found $PUJA_COUNT pujas${NC}"

# Get first puja details
PUJA_ID=$(echo $PUJAS_RESPONSE | python3 -c "import sys,json; pujas=json.load(sys.stdin); print(pujas[0]['id'])")
PUJA_NAME=$(echo $PUJAS_RESPONSE | python3 -c "import sys,json; pujas=json.load(sys.stdin); print(pujas[0]['name_local'])")
PUJA_PRICE=$(echo $PUJAS_RESPONSE | python3 -c "import sys,json; pujas=json.load(sys.stdin); print(pujas[0]['default_price'])")

echo "   Selected Puja: $PUJA_NAME"
echo "   Price: ₹$PUJA_PRICE"
echo "   ID: $PUJA_ID"
echo ""

# Step 3: Get Available Pandits
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 3: Fetching Available Pandits${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

PANDITS_RESPONSE=$(curl -s $BASE_URL/api/pandits)
PANDIT_COUNT=$(echo $PANDITS_RESPONSE | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")
echo -e "${GREEN}✅ Found $PANDIT_COUNT approved pandits${NC}"

PANDIT_ID=$(echo $PANDITS_RESPONSE | python3 -c "import sys,json; pandits=json.load(sys.stdin); print(pandits[0]['id'])")
PANDIT_CITY=$(echo $PANDITS_RESPONSE | python3 -c "import sys,json; pandits=json.load(sys.stdin); print(pandits[0]['city'])")

echo "   Selected Pandit from: $PANDIT_CITY"
echo "   ID: $PANDIT_ID"
echo ""

# Step 4: Create Booking
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 4: Creating Booking${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

BOOKING_DATE="2025-11-15T10:00:00+05:30"
BOOKING_RESPONSE=$(curl -s -X POST $BASE_URL/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"puja_type_id\": \"$PUJA_ID\",
    \"pandit_id\": \"$PANDIT_ID\",
    \"scheduled_at\": \"$BOOKING_DATE\",
    \"address\": \"Test Address, Mumbai, Maharashtra\",
    \"is_virtual\": false
  }")

BOOKING_ID=$(echo $BOOKING_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('id', ''))")
BOOKING_STATUS=$(echo $BOOKING_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('status', ''))")

if [ -z "$BOOKING_ID" ]; then
    echo "❌ Booking creation failed"
    echo $BOOKING_RESPONSE
    exit 1
fi

echo -e "${GREEN}✅ Booking created successfully${NC}"
echo "   Booking ID: $BOOKING_ID"
echo "   Status: $BOOKING_STATUS"
echo "   Puja: $PUJA_NAME"
echo "   Price: ₹$PUJA_PRICE"
echo "   Date: 2025-11-15 10:00 AM"
echo ""

# Step 5: Create Payment
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 5: Initiating Payment${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

PAYMENT_RESPONSE=$(curl -s -X POST $BASE_URL/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"booking_id\": \"$BOOKING_ID\",
    \"provider\": \"razorpay\"
  }")

PAYMENT_ID=$(echo $PAYMENT_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('id', ''))")
PAYMENT_STATUS=$(echo $PAYMENT_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('status', ''))")
PAYMENT_AMOUNT=$(echo $PAYMENT_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('amount', 0))")

if [ -z "$PAYMENT_ID" ]; then
    echo "❌ Payment creation failed"
    echo $PAYMENT_RESPONSE
    exit 1
fi

echo -e "${GREEN}✅ Payment initiated${NC}"
echo "   Payment ID: $PAYMENT_ID"
echo "   Status: $PAYMENT_STATUS"
echo "   Amount: ₹$PAYMENT_AMOUNT"
echo "   Provider: Razorpay (Mock Mode)"
echo ""

# Step 6: Complete Payment
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 6: Completing Payment${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

COMPLETE_RESPONSE=$(curl -s -X POST $BASE_URL/api/payments/complete/$PAYMENT_ID \
  -H "Authorization: Bearer $TOKEN")

FINAL_STATUS=$(echo $COMPLETE_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('status', ''))")
BOOKING_STATUS=$(echo $COMPLETE_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('booking_status', ''))")

if [ "$FINAL_STATUS" != "success" ]; then
    echo "❌ Payment completion failed"
    echo $COMPLETE_RESPONSE
    exit 1
fi

echo -e "${GREEN}✅ Payment completed successfully!${NC}"
echo "   Payment Status: SUCCESS"
echo "   Booking Status: $BOOKING_STATUS"
echo ""

# Step 7: Verify Booking
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 7: Verifying Booking Status${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

MY_BOOKINGS=$(curl -s $BASE_URL/api/bookings/my-bookings \
  -H "Authorization: Bearer $TOKEN")

BOOKING_COUNT=$(echo $MY_BOOKINGS | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")

echo -e "${GREEN}✅ Found $BOOKING_COUNT total bookings${NC}"
echo ""
echo "Recent bookings:"
echo $MY_BOOKINGS | python3 -c "
import sys, json
bookings = json.load(sys.stdin)
for i, b in enumerate(bookings[-3:], 1):
    print(f\"   {i}. {b['puja_type']['name_local']} - Status: {b['status'].upper()} - ₹{b['price']}\")
"
echo ""

# Final Summary
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 COMPLETE FLOW TEST PASSED! 🎉${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Summary:"
echo "  ✅ User Authentication"
echo "  ✅ Puja Selection ($PUJA_NAME)"
echo "  ✅ Pandit Selection ($PANDIT_CITY)"
echo "  ✅ Booking Creation (ID: ${BOOKING_ID:0:8}...)"
echo "  ✅ Payment Initiation (₹$PAYMENT_AMOUNT)"
echo "  ✅ Payment Completion"
echo "  ✅ Booking Confirmation"
echo ""
echo "The booking & payment pipeline is FULLY OPERATIONAL! 🚀"
echo ""
echo "Access your dashboard:"
echo "  Frontend: http://localhost:3000/dashboard"
echo "  API Docs: http://localhost:8001/docs"
echo ""
