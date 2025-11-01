# API Documentation

## Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` [protected]

## Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` [admin]
- `PUT /api/products/:id` [admin]
- `DELETE /api/products/:id` [admin]

## Cart
- `GET /api/cart` [protected]
- `POST /api/cart`
- `DELETE /api/cart/:id`

## Orders
- `GET /api/orders` [protected]
- `POST /api/orders`
- `GET /api/orders/:id`

## Reviews
- `POST /api/reviews`
- `GET /api/reviews/:productId`

## Blog
- `GET /api/blogs`
- `POST /api/blogs` [admin]

## Swagger
See `/api-docs` route in backend for live docs.