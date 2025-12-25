# VPS Deployment Guide

Detailed instructions for deploying to a private VPS (Ubuntu 22.04+)

---

## 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y curl git nginx certbot python3-certbot-nginx

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Install MongoDB
sudo apt install -y mongodb
sudo systemctl enable mongodb
sudo systemctl start mongodb
```

---

## 2. Application Setup

```bash
# Create app directory
sudo mkdir -p /var/www/superstore
sudo chown $USER:$USER /var/www/superstore

# Clone/upload your code
cd /var/www/superstore
git clone <your-repo> .
# OR upload via SFTP

# Install dependencies
yarn install --production=false

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Generate Prisma & Build
npx prisma generate
npx prisma db push
yarn build
```

---

## 3. Systemd Service

```bash
sudo nano /etc/systemd/system/superstore.service
```

Content:
```ini
[Unit]
Description=SuperStore E-Commerce
After=network.target mongodb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/superstore
ExecStart=/usr/bin/yarn start
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable superstore
sudo systemctl start superstore

# Check status
sudo systemctl status superstore
```

---

## 4. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/superstore
```

Content:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/superstore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. SSL Certificate (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

## 6. Firewall Setup

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 7. Maintenance Commands

```bash
# View logs
sudo journalctl -u superstore -f

# Restart app
sudo systemctl restart superstore

# Update application
cd /var/www/superstore
git pull
yarn install
yarn build
sudo systemctl restart superstore

# Database backup
mongodump --out=/backup/$(date +%Y%m%d)
```

---

## 8. Optional: Docker Deployment

See `DEPLOYMENT.md` for Docker Compose setup.
