# Har Ghar Pooja - AsthaSetu 🕉️

> Traditional Vedic rituals and pujas at your doorstep. Book experienced pandits for authentic ceremonies, both in-person and virtual.

![Version](https://img.shields.io/badge/version-2.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Last Updated](https://img.shields.io/badge/updated-Oct%202025-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Test Credentials](#test-credentials)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Testing Guide](#testing-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🌟 Overview

**Har Ghar Pooja - AsthaSetu** is a comprehensive platform that bridges traditional spirituality with modern technology. Users can browse and book authentic Vedic rituals, consult experienced pandits, and participate in virtual or in-person pujas.

### Key Highlights

- 🛕 **15+ Traditional Pujas** - From Pitru Shanti to Vastu Poojan
- 👨‍🦳 **Verified Pandits** - Experienced and knowledgeable priests
- 🌐 **Virtual & In-Person** - Flexible puja options
- 💳 **Secure Payments** - Razorpay integration with mock fallback
- 📱 **Responsive Design** - Works on all devices
- ♿ **Accessible** - WCAG AA compliant

## ✨ Features

### For Users
- Browse 15 different puja services with detailed information
- Book pujas for specific dates and times
- Choose between virtual and in-person ceremonies
- Select preferred pandits
- Secure online payment processing
- View booking history and status
- Join virtual pujas via streaming links

### For Pandits
- Create and manage profile with bio and specializations
- View detailed customer information for each booking
- Accept or decline booking requests
- Track earnings and completed pujas
- Manage schedule and availability
- See customer contact details (name, phone, email, location)
- View booking details (date, time, address, payment)
- Mark bookings as completed

### For Admins
- Manage puja types and pricing
- Approve/revoke pandit applications
- Monitor all bookings and payments
- View platform analytics (users, pandits, bookings, revenue)
- Handle customer support
- Comprehensive dashboard with statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database (production)
- **SQLite** - Database (development)
- **Pydantic** - Data validation
- **JWT** - Authentication
- **Razorpay** - Payment gateway

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hgp
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Variables**

Create `.env` file in backend directory:
```env
DATABASE_URL=sqlite:///./hgp.db
SECRET_KEY=your-secret-key-here
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

5. **Run the Application**

Terminal 1 (Backend):
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🔐 Test Credentials

Use these credentials to test different user roles:

### Admin Account
```
Phone: 919999999999
Password: Admin@123
Access: http://localhost:3000/admin
```

### User Account
```
Phone: 919876543210
Password: User@123
Access: http://localhost:3000/dashboard
```

### Pandit Account
```
Phone: 919111111111
Password: Pandit@123
Access: http://localhost:3000/pandit
```

**Note**: These are seeded test accounts. You can also register new accounts.

## 📁 Project Structure

```
hgp/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── crud.py              # Database operations
│   │   ├── auth.py              # Authentication logic
│   │   ├── seed_data.py         # Database seeding
│   │   └── routers/
│   │       ├── auth.py          # Auth endpoints
│   │       ├── pujas.py         # Puja endpoints
│   │       ├── bookings.py      # Booking endpoints
│   │       ├── pandits.py       # Pandit endpoints
│   │       ├── payments.py      # Payment endpoints
│   │       ├── admin.py         # Admin endpoints
│   │       └── chatbot.py       # Chatbot endpoints
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── layout/          # Layout components
│   │   │   ├── sections/        # Page sections
│   │   │   ├── cards/           # Card components
│   │   │   ├── forms/           # Form components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── PujaCard.jsx
│   │   │   └── BookingModal.jsx
│   │   ├── pages/
│   │   │   ├── HomeNew.jsx      # Main landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── PanditDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Auth state management
│   │   │   └── ThemeContext.jsx
│   │   ├── styles/
│   │   │   └── theme.js         # Design tokens
│   │   ├── utils.js             # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── images/
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Pujas
- `GET /api/pujas` - List all pujas
- `GET /api/pujas/{id}` - Get puja details
- `POST /api/pujas` - Create puja (admin)
- `PUT /api/pujas/{id}` - Update puja (admin)
- `DELETE /api/pujas/{id}` - Delete puja (admin)

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking details
- `PATCH /api/bookings/{id}` - Update booking status
- `DELETE /api/bookings/{id}` - Cancel booking

### Pandits
- `GET /api/pandits` - List all pandits
- `POST /api/pandits` - Create pandit profile
- `GET /api/pandits/{id}` - Get pandit details
- `GET /api/pandits/{id}/bookings` - Get pandit bookings

### Payments
- `POST /api/payments/razorpay/order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment
- `POST /api/payments/create` - Create payment (mock)
- `POST /api/payments/complete/{id}` - Complete payment

Full API documentation available at: http://localhost:8000/docs

## ⚙️ Environment Setup

### Backend Environment Variables

```env
# Database
DATABASE_URL=sqlite:///./hgp.db
# For PostgreSQL: postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your-super-secret-key-min-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Razorpay (Optional - falls back to mock)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend Environment Variables

Create `.env` in frontend directory (if needed):
```env
VITE_API_URL=http://localhost:8000
```

## 💻 Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Vite HMR (instant updates)
- **Backend**: Uvicorn --reload (automatic restart)

### Debugging
```bash
# Backend with debug logs
uvicorn app.main:app --reload --log-level debug

# Frontend with source maps
npm run dev
```

### Code Formatting
```bash
# Backend
black app/
isort app/

# Frontend
npm run format
```

### Database Migrations
```bash
cd backend
# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

### Seeding Database
```bash
cd backend
python -m app.seed_data
```

This will create:
- 3 test users (admin, user, pandit)
- 3 pandit profiles
- 15 puja types
- Sample bookings

## 📋 Testing Guide

For comprehensive testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

### Quick Test Checklist

✅ **User Flow**
1. Register new user
2. Browse pujas
3. Book a puja
4. Complete payment
5. View booking in dashboard

✅ **Pandit Flow**
1. Login as pandit
2. View bookings with customer details
3. Accept/decline bookings
4. Mark bookings as complete
5. Track earnings

✅ **Admin Flow**
1. Login as admin
2. View platform statistics
3. Approve/revoke pandits
4. Monitor all bookings
5. Check revenue

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"919876543210","password":"User@123"}'

# Test booking creation
curl -X POST http://localhost:8000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"puja_type_id":"...","pandit_id":"...","scheduled_at":"2025-11-01T10:00:00"}'
```

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. Set environment variables
2. Update `DATABASE_URL` to PostgreSQL
3. Run migrations
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy `dist` folder
3. Set environment variables
4. Configure redirects for SPA

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📸 Screenshots

### User Dashboard
- Modern gradient design with stats cards
- Booking history with status indicators
- Quick book section for exploring services

### Pandit Dashboard
- Detailed customer information cards
- Booking details with date, time, and address
- Action buttons for accepting/declining bookings
- Earnings tracker

### Admin Dashboard
- Platform statistics (users, pandits, bookings, revenue)
- Pandit management with approve/revoke functionality
- Comprehensive booking overview

### Booking Flow
- Browse 15+ traditional pujas
- Select pandit and schedule
- Secure payment processing
- Instant confirmation

## 🎨 Design System

### Colors
- **Primary**: #FF9933 (Saffron/Orange)
- **Secondary**: #FF6B00 (Deep Orange)
- **Background**: Gradient from orange-50 to yellow-50
- **Text**: #333333 (Dark Gray)
- **Success**: #22c55e (Green)
- **Error**: #ef4444 (Red)
- **Warning**: #eab308 (Yellow)
- **Info**: #3b82f6 (Blue)

### Typography
- **Font Family**: System fonts (optimized for performance)
- **Base Size**: 16px
- **Headings**: Bold, 1.5-3rem
- **Line Height**: 1.5-1.75

### Components
- **Cards**: Rounded-2xl with gradient backgrounds
- **Buttons**: Gradient with hover effects
- **Inputs**: Rounded-lg with focus states
- **Modals**: Backdrop blur with animations

### Spacing
- **Section Gaps**: 32-64px
- **Component Padding**: 16-24px
- **Card Spacing**: 24-32px

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention via ORM
- XSS protection
- CSRF tokens for forms

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Current Status

### ✅ Completed Features
- User authentication (register, login, JWT)
- Puja browsing and booking
- Payment integration (Razorpay + mock)
- User dashboard with booking history
- Pandit dashboard with customer details
- Admin dashboard with platform analytics
- Responsive design (mobile, tablet, desktop)
- Context-aware navigation
- Real-time booking status updates

### 🚧 In Progress
- Virtual puja streaming
- Consultation booking
- Advanced search and filters
- Notification system
- Review and rating system

### 📅 Planned Features
- Multi-language support (Hindi, English, regional)
- Calendar integration
- Recurring bookings
- Gift vouchers
- Referral program
- Mobile app (React Native)

## 👥 Team

- **Full Stack Developer**: Atharv Pareta
- **Project Type**: Spiritual Services Platform
- **Tech Lead**: Atharv Pareta

## 📞 Support

For support and queries:
- **Email**: info@hargharpooja.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/hgp/issues)
- **Documentation**: See [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## 🐛 Known Issues

- Payment gateway requires Razorpay credentials (falls back to mock mode)
- Virtual puja streaming not yet implemented
- Email notifications pending

## 📝 Changelog

### Version 2.0.0 (October 2025)
- ✨ Redesigned all dashboards with modern UI
- ✨ Added customer details to Pandit Dashboard
- ✨ Implemented context-aware navigation
- ✨ Added comprehensive booking management
- ✨ Improved payment flow with better error handling
- 🐛 Fixed price display issues
- 🐛 Fixed authentication token management
- 🐛 Fixed navbar alignment on dashboards
- 🎨 Updated design system with gradients
- 📚 Added comprehensive testing guide

### Version 1.0.0 (Initial Release)
- Basic booking functionality
- User authentication
- Payment integration
- Admin panel

## 🙏 Acknowledgments

- All the pandits who provided guidance
- The open-source community
- Our beta testers and early users

---

**Made with ❤️ for devotees across India**

🕉️ **Har Ghar Pooja - AsthaSetu** 🕉️
