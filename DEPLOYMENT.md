# SuperStore E-Commerce Super App

## 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying the SuperStore e-commerce application.

---

## 📝 Prerequisites

- Node.js 18.x or later
- MongoDB (local or Atlas)
- Docker (optional, for containerized deployment)
- Nginx (for production reverse proxy)

---

## 🔧 Local Development Setup

### 1. Clone and Install Dependencies

```bash
cd /app/ecommerce
yarn install
```

### 2. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

### 4. Run Development Server

```bash
yarn dev
```

Visit `http://localhost:3000`

---

## 🌐 Production Deployment

### Option 1: Docker Deployment (Recommended)

#### 1. Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN yarn build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Create docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
```

#### 3. Create Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /_next/static {
            proxy_pass http://app;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
    }
}
```

#### 4. Deploy with Docker

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

### Option 2: Manual VPS Deployment

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb
sudo systemctl enable mongodb
sudo systemctl start mongodb

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Clone and Build Application

```bash
cd /var/www
git clone <your-repo-url> superstore
cd superstore
yarn install
npx prisma generate
npx prisma db push
yarn build
```

#### 3. Create Systemd Service

```bash
sudo nano /etc/systemd/system/superstore.service
```

```ini
[Unit]
Description=SuperStore E-Commerce App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/superstore
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable superstore
sudo systemctl start superstore
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/superstore
```

```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/superstore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Set Up SSL

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## ☁️ Cloud Platform Deployment

### Vercel (Easiest)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Railway

1. Push code to GitHub
2. Create new project in Railway
3. Add MongoDB plugin
4. Configure environment variables
5. Deploy!

---

## 🔐 Environment Variables for Production

```env
# Database (MongoDB Atlas recommended)
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/superstore"

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Redis (Upstash)
CACHE_MODE="redis"
UPSTASH_REDIS_REST_URL="https://your-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# Storage (Cloud)
STORAGE_MODE="cloud"
UPLOADTHING_SECRET="sk_live_xxx"
UPLOADTHING_APP_ID="your-app-id"

# Payments (Stripe)
STRIPE_PUBLISHABLE_KEY="pk_live_xxx"
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# AI (OpenAI)
AI_CHAT_MODE="live"
OPENAI_API_KEY="sk-xxx"

# Email (Resend)
EMAIL_MODE="live"
RESEND_API_KEY="re_xxx"

# Application
NEXT_PUBLIC_APP_NAME="SuperStore"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

---

## 📋 Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] Database connection verified
- [ ] Admin account created
- [ ] Payment gateway tested (use test mode first)
- [ ] Email delivery tested
- [ ] AI chat functionality tested
- [ ] All environment variables configured
- [ ] Backup strategy implemented
- [ ] Monitoring set up (optional: PostHog, Sentry)
- [ ] CDN configured for static assets (optional)

---

## 🛠️ Maintenance Commands

```bash
# View logs
sudo journalctl -u superstore -f

# Restart service
sudo systemctl restart superstore

# Update application
cd /var/www/superstore
git pull
yarn install
npx prisma generate
yarn build
sudo systemctl restart superstore

# Database backup
mongodump --uri="<connection-string>" --out=/backup/$(date +%Y%m%d)

# Database restore
mongorestore --uri="<connection-string>" /backup/<date>
```

---

## 🆘 Troubleshooting

### Common Issues

1. **500 Error on Production**
   - Check logs: `journalctl -u superstore -n 100`
   - Verify environment variables
   - Check database connection

2. **Database Connection Failed**
   - Verify DATABASE_URL format
   - Check IP whitelist in MongoDB Atlas
   - Ensure MongoDB service is running

3. **Auth Not Working**
   - Verify NEXTAUTH_URL matches your domain
   - Check Google OAuth callback URLs
   - Regenerate NEXTAUTH_SECRET

4. **Images Not Loading**
   - Check STORAGE_MODE configuration
   - Verify cloud storage credentials
   - Check file permissions for local storage

---

## 📞 Support

For additional help:
- Documentation: `/docs`
- GitHub Issues: `<repo-url>/issues`
- Email: support@superstore.com
