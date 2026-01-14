# VPS Deployment Guide

This guide covers deploying HOS Hospital Management System on a VPS (Virtual Private Server).

## Prerequisites

- VPS with Ubuntu 22.04 LTS (recommended)
- Minimum specs: 2 vCPU, 4GB RAM, 40GB SSD
- Domain name (optional, for SSL)
- SSH access to the server

## Step 1: Initial Server Setup

### Connect to Server

```bash
ssh root@your-server-ip
```

### Update System

```bash
apt update && apt upgrade -y
```

### Create Non-Root User

```bash
adduser hosadmin
usermod -aG sudo hosadmin

# Switch to new user
su - hosadmin
```

### Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Step 2: Install Node.js

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
npm --version
```

## Step 3: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

In PostgreSQL shell:

```sql
CREATE USER hosuser WITH PASSWORD 'your-secure-password';
CREATE DATABASE hos_db OWNER hosuser;
GRANT ALL PRIVILEGES ON DATABASE hos_db TO hosuser;
\q
```

## Step 4: Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 5: Clone and Configure Application

```bash
# Create app directory
mkdir -p ~/apps
cd ~/apps

# Clone repository
git clone <repository-url> hos-system
cd hos-system

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.production
nano .env.production
```

### Configure .env.production

```env
# Database
DATABASE_URL="postgresql://hosuser:your-secure-password@localhost:5432/hos_db?schema=public"

# Authentication
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.com"
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRATION="604800"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-key"
OPENAI_MODEL="gpt-4-turbo-preview"
AI_ENABLED="true"

# Application
APP_URL="https://your-domain.com"
NODE_ENV="production"
DEBUG_MODE="false"
```

## Step 6: Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed
```

## Step 7: Build Application

```bash
npm run build
```

## Step 8: Setup PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
nano ecosystem.config.js
```

**ecosystem.config.js:**

```javascript
module.exports = {
  apps: [
    {
      name: 'hos-system',
      script: 'npm',
      args: 'start',
      cwd: '/home/hosadmin/apps/hos-system',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_file: '.env.production',
    },
  ],
};
```

```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

## Step 9: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/hos-system
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hos-system /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 10: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

## Step 11: Verify Deployment

1. Visit https://your-domain.com
2. Login with admin credentials
3. Test all dashboards

## Maintenance Commands

```bash
# View logs
pm2 logs hos-system

# Monitor
pm2 monit

# Restart application
pm2 restart hos-system

# Update application
cd ~/apps/hos-system
git pull
npm install
npm run build
pm2 restart hos-system

# Database backup
pg_dump -U hosuser hos_db > backup_$(date +%Y%m%d).sql

# Reset database
npm run db:reset
npm run db:seed
```

## Security Best Practices

1. **Firewall**: Only expose ports 22, 80, 443
2. **SSH**: Disable root login, use key-based auth
3. **Database**: Use strong passwords, restrict connections
4. **SSL**: Keep certificates updated
5. **Updates**: Regular system and npm updates
6. **Backups**: Daily database backups
7. **Monitoring**: Set up PM2 monitoring

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs hos-system --lines 100

# Check if port is in use
sudo lsof -i :3000
```

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U hosuser -d hos_db -h localhost
```

### Nginx Errors

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

## Scaling Considerations

For high traffic:

1. Use Redis for session storage
2. Add load balancer
3. Separate database server
4. Use CDN for static assets
5. Implement caching strategies
