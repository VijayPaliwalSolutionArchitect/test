# Environment Variables Reference

Complete guide to all environment variables in `.env`

---

## Database

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | MongoDB connection string |

**Examples:**
```bash
# Local MongoDB
DATABASE_URL="mongodb://localhost:27017/superstore"

# MongoDB Atlas
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/superstore?retryWrites=true&w=majority"
```

---

## Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXTAUTH_URL` | ✅ Yes | - | App URL (e.g., http://localhost:3000) |
| `NEXTAUTH_SECRET` | ✅ Yes | - | 32+ char secret for JWT encryption |
| `GOOGLE_CLIENT_ID` | For Google Auth | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google Auth | - | Google OAuth secret |

**Generate secret:**
```bash
openssl rand -base64 32
```

---

## Caching (Redis)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CACHE_MODE` | No | `mock` | `mock` or `redis` |
| `UPSTASH_REDIS_REST_URL` | If redis | - | Upstash REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | If redis | - | Upstash REST token |

**Note:** Mock mode uses in-memory cache - perfect for development.

---

## File Storage

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STORAGE_MODE` | No | `local` | `local` or `cloud` |
| `LOCAL_STORAGE_PATH` | No | `/uploads` | Local upload path |
| `UPLOADTHING_SECRET` | If cloud | - | Uploadthing secret |
| `UPLOADTHING_APP_ID` | If cloud | - | Uploadthing app ID |

---

## Payments (Stripe)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STRIPE_PUBLISHABLE_KEY` | For payments | - | Stripe public key |
| `STRIPE_SECRET_KEY` | For payments | - | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | - | Stripe webhook secret |
| `ENABLED_PAYMENT_METHODS` | No | `card,cod,upi` | Enabled methods |

---

## AI Chat

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_CHAT_MODE` | No | `mock` | `mock` or `live` |
| `OPENAI_API_KEY` | If live | - | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4-turbo-preview` | Model to use |

---

## Email

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_MODE` | No | `mock` | `mock` or `live` |
| `RESEND_API_KEY` | If live | - | Resend API key |
| `EMAIL_FROM` | No | `noreply@domain.com` | From address |

---

## Application

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_APP_NAME` | No | `SuperStore` | App display name |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Public URL |
| `DEFAULT_CURRENCY` | No | `USD` | Default currency |

---

## Admin

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ADMIN_EMAIL` | No | `admin@superstore.com` | Default admin email |
| `ADMIN_PASSWORD` | No | `admin123` | Default admin password |

**⚠️ Change these immediately in production!**

---

## Minimum Production .env

```bash
# Required for production
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-32-char-secret-here"

# Optional but recommended
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
CACHE_MODE="redis"
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```
