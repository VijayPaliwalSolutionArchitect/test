# MegaMart E-commerce App

## Overview
MegaMart is a full-featured e-commerce platform including user management, product management, shopping cart, order processing, product reviews, blogs, and admin dashboard. This is a complete, production-ready application built with modern technologies.

## Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with BCrypt password hashing
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Morgan with custom middleware
- **Dev Tools:** Nodemon for development

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS with custom components
- **State Management:** Zustand for global state
- **Routing:** React Router v6
- **HTTP Client:** Axios with interceptors
- **UI Components:** Custom components with Lucide icons
- **Notifications:** React Hot Toast

## Main Features

### User Features
- User registration and authentication (JWT-based)
- Product browsing with filtering, sorting, and search
- Shopping cart management (add, update, remove items)
- Secure checkout process
- Order history and tracking
- Product reviews and ratings
- Blog reading
- Responsive design for mobile and desktop

### Admin Features
- Product management (CRUD operations)
- Order management and status updates
- User management
- Blog post creation and management
- Dashboard with statistics

### Technical Features
- RESTful API architecture
- Token-based authentication with automatic refresh
- Input validation and sanitization
- Comprehensive error handling
- Request logging and monitoring
- CORS configuration
- Rate limiting for API protection
- Persistent state management
- Optimistic UI updates

## Project Structure

```
megamart/
├── backend/
│   ├── models/          # MongoDB schemas (User, Product, Order, Cart, Review, Blog, Brand, Category)
│   ├── controllers/     # Request handlers for each resource
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, error handling, logging
│   ├── config/          # Database configuration
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
│   └── package.json     # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Navbar, Footer, ProductCard)
│   │   ├── pages/       # Page components (Home, Products, Cart, etc.)
│   │   ├── stores/      # Zustand state stores (auth, cart)
│   │   ├── services/    # API service layer
│   │   ├── utils/       # Helper functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # App entry point
│   ├── vite.config.js   # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── package.json     # Frontend dependencies
│
├── docs/                # Documentation files
├── config/              # Shared configuration
└── .env.example         # Environment variables template
```

## Quick Start

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `PORT`: Backend server port (default: 5000)
   - `CORS_ORIGIN`: Frontend URL (default: http://localhost:5173)

5. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env
```

4. Configure `.env` if needed:
   - `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Product Endpoints
- `GET /api/products` - Get all products (with filtering & pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:itemId` - Update cart item (protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Order Endpoints
- `GET /api/orders` - Get user's orders (protected)
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id` - Update order status (admin only)
- `DELETE /api/orders/:id` - Cancel order (protected)

### Review Endpoints
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)
- `POST /api/reviews/:id/helpful` - Mark review helpful (protected)

### Blog Endpoints
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:id` - Get single blog post
- `POST /api/blogs` - Create blog post (admin only)
- `PUT /api/blogs/:id` - Update blog post (admin only)
- `DELETE /api/blogs/:id` - Delete blog post (admin only)

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Architecture

See `docs/architecture.md` for detailed architecture information.

## Local Setup Guide

See `docs/setup-local.md` for step-by-step local development setup.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Quality

- All code includes comprehensive comments explaining functionality
- Error handling implemented throughout the application
- Input validation on all user inputs
- Security best practices followed
- Consistent code style and formatting

## Contact

For support, issues, or feature requests, please open a GitHub issue or contact the maintainer.

## License

This project is licensed under the ISC License.