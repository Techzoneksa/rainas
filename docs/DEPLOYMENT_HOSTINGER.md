# Hostinger Deployment Guide

Deploy **Raina** on a Hostinger VPS with PostgreSQL, Node.js, pnpm, and PM2.

## Prerequisites

- Hostinger VPS (Ubuntu 22.04+ recommended)
- Domain pointed to VPS IP
- SSH access to VPS

## 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v22 LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
corepack enable
corepack prepare pnpm@11.0.9 --activate

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database user and database
sudo -u postgres psql -c "CREATE USER raina WITH PASSWORD 'strong_password_here';"
sudo -u postgres psql -c "CREATE DATABASE raina_prod OWNER raina;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE raina_prod TO raina;"

# Install PM2 for process management
pnpm add -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
sudo systemctl enable nginx
```

## 2. Clone Repository

```bash
cd /var/www
git clone https://github.com/Techzoneksa/rainas.git
cd rainas
git checkout main
```

## 3. Environment Configuration

```bash
# Root env (used by docker-compose locally — not needed in prod VPS)
cp .env.example .env
# Edit .env with production values

# API env
cp apps/api/.env.example apps/api/.env
# Edit with production values:
#   NODE_ENV=production
#   PORT=4000
#   DATABASE_URL=postgresql://raina:strong_password_here@localhost:5432/raina_prod?schema=public
#   WEB_ORIGIN=https://yourdomain.com
#   ADMIN_ORIGIN=https://admin.yourdomain.com
#   CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com

# Web env
cp apps/web/.env.example apps/web/.env
# Edit with production values:
#   NEXT_PUBLIC_APP_NAME=Raina
#   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
#   NEXT_PUBLIC_APP_ENV=production
```

## 4. Build

```bash
pnpm install
pnpm --filter @raina/api db:generate
pnpm --filter @raina/api db:migrate:deploy
pnpm --filter @raina/api db:seed       # one-time seed
pnpm build
```

## 5. Run with PM2

```bash
# Start API
pm2 start pnpm --name "raina-api" --filter @raina/api start

# Start Web
pm2 start pnpm --name "raina-web" --filter @raina/web start

# Save PM2 process list
pm2 save
pm2 startup
```

## 6. Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/api.yourdomain.com
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
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

# /etc/nginx/sites-available/yourdomain.com
server {
    listen 80;
    server_name yourdomain.com;

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

    # Optional: gzip static assets
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. SSL with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## 8. Maintenance

```bash
# Deploy updates
cd /var/www/rainas
git pull origin main
pnpm install
pnpm --filter @raina/api db:migrate:deploy
pnpm build
pm2 restart raina-api raina-web

# View logs
pm2 logs raina-api
pm2 logs raina-web

# Database backup
pg_dump -U raina raina_prod > backup_$(date +%F).sql
```

## Branch Strategy

| Branch  | Purpose     |
|---------|-------------|
| `main`  | Production  |
| `develop` | Development (feature branches) |

## Required Environment Variables

### Root `.env`
- `RAINA_ENV=production`

### API `apps/api/.env`
- `NODE_ENV`, `PORT`, `DATABASE_URL`, `CORS_ORIGINS`, `RATE_LIMIT_*`

### Web `apps/web/.env`
- `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_ENV`

## Notes

- `DEMO_AUTH_ENABLED` is not set by default — remove demo user guard in production.
- Never commit `.env` files to git.
- Use a managed PostgreSQL provider (e.g., Aiven, Supabase) for higher reliability.
- For admin panel, deploy with the same `pnpm build` and proxy to port 3001.
