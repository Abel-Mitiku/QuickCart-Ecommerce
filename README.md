# 🔥 QuickCart - E-commerce Portfolio Project

Full-stack e-commerce application built with **Next.js 14** (App Router) + **Node.js** backend + **MonogDB**.

## 🚀 Features

### Frontend
- ✅ Product catalog with filtering and search
- ✅ Shopping cart with localStorage persistence
- ✅ User authentication (JWT-based)
- ✅ Stripe payment integration
- ✅ Responsive design (mobile-first)
- ✅ Admin panel for product management
- ✅ Order management system

### Backend
- ✅ JWT authentication with refresh tokens
- ✅ Password hashing (bcrypt)
- ✅ CSRF protection (SameSite=Strict cookies)
- ✅ Rate limiting on login attempts
- ✅ Email verification system
- ✅ MongoDB database integration
- ✅ Secure API endpoints

### Security
- ✅ SameSite=Strict cookies (CSRF protection)
- ✅ Password hashing with bcrypt
- ✅ JWT token expiration and rotation
- ✅ Rate limiting to prevent brute force
- ✅ Environment variables for secrets

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt, refresh tokens
- **Payments**: Stripe API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/quickcart-ecommerce.git

# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Run development server
npm run dev

# Open http://localhost:3000
