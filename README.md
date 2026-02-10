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

### Screenshots

<table>
  <tr>
    <td><img width="1866" height="947" alt="image" src="https://github.com/user-attachments/assets/2778eff0-15eb-482b-890a-f40524bf6bb9" />

</td>
    <td><img width="1861" height="946" alt="image" src="https://github.com/user-attachments/assets/50951a75-8b9e-4075-8881-55f0a6e552ca" />
</td>
  </tr>
  <tr>
    <td><img width="1857" height="963" alt="image" src="https://github.com/user-attachments/assets/09df5cbf-31ca-4294-9fb9-eb7462150a5a" />
</td>
    <td><img width="1859" height="941" alt="image" src="https://github.com/user-attachments/assets/0aa9080f-1de0-470b-81fd-ec3943e2abb9" />
</td>
  </tr>
  <tr>
    <td><img width="1859" height="941" alt="image" src="https://github.com/user-attachments/assets/10e4d795-cdd1-4a9e-b47b-744f835315dd" />
</td>
    <td><img width="1855" height="946" alt="image" src="https://github.com/user-attachments/assets/ae2dd3c1-d2b5-43a2-a336-6f7aada15932" />
</td>
  </tr>
</table>

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
