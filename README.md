# SuperStore - World-Class E-Commerce Super App

A full-featured e-commerce application built with Next.js 15, MongoDB, Prisma, and modern web technologies.

## ✨ Features

### Customer Features
- 📱 Responsive, mobile-first design with glassmorphism UI
- 🔍 Advanced product search and filtering
- 🛒 Real-time shopping cart with persistence
- ❤️ Wishlist functionality
- 🤖 AI-powered shopping assistant
- 👤 User authentication (Google OAuth + Email/Password)
- 📍 Multiple shipping addresses
- 💳 Multiple payment methods (Card, COD, UPI)
- 📦 Order tracking
- ⭐ Product reviews and ratings

### Admin Features
- 📊 Analytics dashboard
- 📦 Product management (CRUD)
- 📁 Category management
- 📄 Order management
- 👥 Customer management
- 🏷️ Promotion & coupon management
- 📝 Blog management
- 📢 Modal/popup configuration
- 🚨 System alerts
- 📧 Contact message inbox

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| State | Zustand (Client), React Context |
| Database | MongoDB with Prisma ORM |
| Auth | NextAuth.js v5 (Auth.js) |
| Cache | Upstash Redis (with mock fallback) |
| Payments | Stripe |
| AI | OpenAI GPT-4 (with mock fallback) |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Yarn package manager

### Installation

```bash
# Clone the repository
cd /app/ecommerce

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run development server
yarn dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/
│   ├── (shop)/          # Customer-facing pages
│   │   ├── page.tsx     # Homepage
│   │   ├── products/    # Product listing & detail
│   │   ├── cart/        # Shopping cart
│   │   └── checkout/    # Checkout flow
│   ├── (admin)/         # Admin dashboard
│   │   └── admin/       # Admin pages
│   ├── auth/            # Authentication pages
│   └── api/             # API routes
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Header, Footer
│   ├── product/         # Product components
│   ├── cart/            # Cart components
│   ├── admin/           # Admin components
│   └── ai-chat/         # AI chat widget
├── lib/                 # Utilities
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # NextAuth config
│   ├── redis.ts         # Cache layer
│   ├── storage.ts       # File storage
│   └── utils.ts         # Helper functions
├── stores/              # Zustand stores
├── types/               # TypeScript types
└── prisma/
    └── schema.prisma    # Database schema
```

## 🔐 Environment Variables

See `.env.example` for all available options. Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Auth encryption key |
| `CACHE_MODE` | `mock` or `redis` |
| `STORAGE_MODE` | `local` or `cloud` |
| `AI_CHAT_MODE` | `mock` or `live` |

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](/api-docs)
- [Contributing Guide](./CONTRIBUTING.md)

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ using Next.js and modern web technologies.
