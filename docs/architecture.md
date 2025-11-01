# MegaMart Architecture

## Backend
- Node.js/Express REST API
- MongoDB models (User, Product, Order, Cart, Review, Blog, Brand, Category)
- Controllers, routes, middlewares (auth, error, audit, telemetry)
- JWT for authentication, BCrypt for password hashing

## Frontend
- React 19 SPA using TailwindCSS and shadcn/ui
- Pages: Home, Product Listing, Product Details, Cart, Checkout, Blog, Admin Dashboard
- Contexts: Auth, Cart, Theme

## Data Flow
- Actions from frontend → REST API → MongoDB
- Real-time updates via WebSockets (optional)
- Admin panel for management

## Third-Party Integrations
- Payment gateway (Stripe or Razorpay)
- Email notifications (SendGrid/Mailgun)