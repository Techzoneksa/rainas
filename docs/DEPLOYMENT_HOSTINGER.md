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
corepack prepare pnpm@11.9.0 --activate

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

| Branch    | Purpose                        |
| --------- | ------------------------------ |
| `main`    | Production                     |
| `develop` | Development (feature branches) |

## Required Environment Variables

### Root `.env`

- `RAINA_ENV=production`

### API `apps/api/.env`

- `NODE_ENV`, `PORT`, `DATABASE_URL`, `CORS_ORIGINS`, `RATE_LIMIT_*`

### Web `apps/web/.env`

- `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_ENV`

## pnpm Build Approvals

Hostinger uses pnpm v11.9.0 which requires explicit approval for dependency build scripts.

Build approvals are configured in `pnpm-workspace.yaml` via `onlyBuiltDependencies` + `allowBuilds`:

| Package           | Purpose                        |
| ----------------- | ------------------------------ |
| `esbuild`         | Bundler (used by Turborepo)    |
| `prisma`          | ORM CLI                        |
| `@prisma/client`  | Prisma client runtime          |
| `@prisma/engines` | Prisma engine binaries         |
| `sharp`           | Image processing               |
| `@scarf/scarf`    | Telemetry (approved for build) |

Do **not** place `pnpm.onlyBuiltDependencies` inside `package.json` —  
Hostinger's pnpm ignores it and prints a warning.

## Notes

- `DEMO_AUTH_ENABLED` is not set by default — remove demo user guard in production.
- Never commit `.env` files to git.
- Use a managed PostgreSQL provider (e.g., Aiven, Supabase) for higher reliability.
- For admin panel, deploy with `pnpm build:all` and proxy to port 3001.
- Hostinger should pull from the `main` branch for production deployment.

---

## Turbo EACCES on Hostinger

### Root Cause

Hostinger's environment may strip execute permissions from the Turbo binary after `pnpm install`:

```
node_modules/.pnpm/@turbo+linux-64@2.9.16/node_modules/@turbo/linux-64/bin/turbo cannot be executed
```

This affects `pnpm run build:all` (which invokes `turbo build`). The default `pnpm run build` now runs `next build` directly without Turbo — see "Hostinger Limited Build Command" below.

### Project-Level Fix

A `postinstall` script (`scripts/fix-turbo-permissions.cjs`) automatically fixes Turbo binary permissions after `pnpm install`. It runs on Linux/macOS only (skips Windows) and searches for Turbo binaries dynamically regardless of version, covering:

- `node_modules/.bin/turbo`
- `node_modules/@turbo/linux-64/bin/turbo`
- `node_modules/.pnpm/@turbo+linux-64@*/node_modules/@turbo/linux-64/bin/turbo`
- Any `@turbo+*-64@*` entry in the pnpm store

No manual action needed — it runs with every `pnpm install`.

### Emergency Fix

If `postinstall` does not run (e.g., `--ignore-scripts` was used):

```bash
chmod -R +x node_modules/.bin
chmod -R +x node_modules/.pnpm
```

### Node Version

| Version | Status                                                |
| ------- | ----------------------------------------------------- |
| 22.x    | Recommended — stable with TypeScript 6 and pnpm 11    |
| 20.x    | Alternative — works if Hostinger's Node 22 has issues |

---

## Hostinger npm + pnpm fallback

Hostinger may not expose `pnpm` in `PATH` during the build phase — only `npm` is available.
Additionally, `corepack enable` may fail because the Node.js installation directory is read-only.

The build script (`scripts/hostinger-build-web.cjs`) does **not** call `corepack enable`.
It tries multiple methods to run pnpm:

1. Local `node_modules/.bin/pnpm` (available because `pnpm` is a root devDependency)
2. `node_modules/pnpm/bin/pnpm.cjs` (via node)
3. Global `pnpm` from PATH
4. `npx --yes pnpm@11.9.0` (downloads pnpm if needed)

### Scripts

```json
{
  "scripts": {
    "build": "node scripts/hostinger-build.cjs",
    "build:web": "node scripts/hostinger-build-web.cjs",
    "build:api": "node scripts/hostinger-build-api.cjs",
    "build:all": "turbo build"
  }
}
```

- `npm run build` (Hostinger) → hostinger-build.cjs → dispatches to web or api build based on `HOSTINGER_APP`.
- `pnpm run build:web` — direct web build (local use).
- `pnpm run build:api` — direct API build (local use).
- `pnpm run build:all` — full monorepo build (local/CI).

### Why not convert to npm entirely

- The project is a pnpm monorepo with `pnpm-workspace.yaml` and `pnpm-lock.yaml`.
- `npm workspaces` field is added to root `package.json` only so Hostinger's npm can recognise the monorepo structure during `npm install` (if it runs it).
- `pnpm` is added as a root devDependency so `node_modules/pnpm/bin/pnpm.cjs` exists after any package manager installs.

### Workspaces compatibility

Root `package.json` includes:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

This helps `npm install` understand the monorepo structure without removing `pnpm-workspace.yaml` or `pnpm-lock.yaml`.

---

## Shared Hostinger build command

Hostinger's Node.js hosting UI typically only exposes a subset of scripts from `package.json` (e.g. `build`, `dev`, `postinstall`). It may **not** show `build:api` or `build:web`.

Both the Web app and API app use the same build command:

```bash
pnpm run build
```

Which runs `node scripts/hostinger-build.cjs`. This dispatcher checks the `HOSTINGER_APP` environment variable to decide what to build:

| `HOSTINGER_APP` | Builds                  | Script used                       |
| --------------- | ----------------------- | --------------------------------- |
| `web` (default) | `apps/web/.next`        | `scripts/hostinger-build-web.cjs` |
| `api`           | `apps/api/dist/main.js` | `scripts/hostinger-build-api.cjs` |

### How it works

```
pnpm run build
  └─► node scripts/hostinger-build.cjs
        ├─► HOSTINGER_APP=web  (or unset)  →  hostinger-build-web.cjs  →  next build
        └─► HOSTINGER_APP=api              →  hostinger-build-api.cjs  →  prisma generate → tsc
```

### Setup per app

| App | Domain                  | `HOSTINGER_APP` | Build command    | Output dir       | Entry file              |
| --- | ----------------------- | --------------- | ---------------- | ---------------- | ----------------------- |
| Web | `raina.promksa.com`     | `web` (default) | `pnpm run build` | `apps/web/.next` | `apps/web/server.js`    |
| API | `api-raina.promksa.com` | `api`           | `pnpm run build` | `apps/api/dist`  | `apps/api/dist/main.js` |

Both apps can now use the same build command. The environment variable determines the output.

### Script reference

| Script      | Command                                | When to use                               |
| ----------- | -------------------------------------- | ----------------------------------------- |
| `build`     | `node scripts/hostinger-build.cjs`     | Hostinger (dispatches by `HOSTINGER_APP`) |
| `build:web` | `node scripts/hostinger-build-web.cjs` | Direct web build (local/CI)               |
| `build:api` | `node scripts/hostinger-build-api.cjs` | Direct API build (local/CI)               |
| `api:build` | `node scripts/hostinger-build-api.cjs` | Alias for API build                       |
| `build:all` | `turbo build`                          | Full monorepo build (local/CI)            |

## Hostinger Web App — raina.promksa.com

This domain runs **Web** (`apps/web`), **not** API.

### Correct Settings

| Setting          | Value                |
| ---------------- | -------------------- |
| Framework preset | Other                |
| Branch           | `main`               |
| Node version     | 22.x                 |
| Root directory   | `./`                 |
| Package manager  | pnpm                 |
| Build command    | `pnpm run build`     |
| Output directory | `apps/web/.next`     |
| Entry file       | `apps/web/server.js` |

> **Warning:** Do not use `apps/api/dist/main.js` for `raina.promksa.com`.
> That entry file is only for the separate API app (`api-raina.promksa.com`).

### Environment Variables for Production

Set these in Hostinger's env vars UI (do **not** commit `.env` to git):

```env
HOSTINGER_APP=web
NEXT_PUBLIC_SITE_URL=https://raina.promksa.com
NEXT_PUBLIC_API_BASE_URL=https://api-raina.promksa.com/api/v1
NEXT_PUBLIC_APP_ENV=production
NODE_ENV=production
```

> If the API is not yet deployed, Web pages that depend on API data will render empty/error states gracefully (Phase 5 design).

---

## Hostinger API App — api-raina.promksa.com

This is a **separate** Hostinger Node.js app for the **API** (`apps/api`). It must be created as a new Hostinger project (not merged with the web app).

### Create a New Hostinger App

1. In Hostinger hPanel → **Node.js** → **Add new**.
2. Choose the same domain or a subdomain (e.g. `api-raina.promksa.com`).
3. Point the subdomain DNS A record to Hostinger's VPS IP.

### Correct Settings

| Setting          | Value                   |
| ---------------- | ----------------------- |
| Framework preset | Other                   |
| Branch           | `main`                  |
| Node version     | 22.x                    |
| Root directory   | `./`                    |
| Package manager  | pnpm                    |
| Build command    | `pnpm run build`        |
| Output directory | `apps/api/dist`         |
| Entry file       | `apps/api/dist/main.js` |

### Environment Variables for Production

Set these in Hostinger's env vars UI for this API app:

```env
HOSTINGER_APP=api
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://raina:your_password@your-db-host:5432/raina_prod?schema=public
DIRECT_URL=postgresql://raina:your_password@your-db-host:5432/raina_prod?schema=public
WEB_ORIGIN=https://raina.promksa.com
ADMIN_ORIGIN=https://admin.raina.promksa.com
CORS_ORIGINS=https://raina.promksa.com
API_PREFIX=api/v1
REQUEST_BODY_LIMIT=1mb
RATE_LIMIT_TTL_SECONDS=60
RATE_LIMIT_REQUESTS=120
RUN_DB_MIGRATIONS=false
```

> **Note:** `PORT` is informational. Hostinger assigns a random port and expects `process.env.PORT`. If the app fails to start, confirm Hostinger publishes the port as `PORT`.

### Database Setup (Manual via SQL)

Hostinger builds **cannot** run Prisma migrations (SSH shell lacks `node`/`npm` in `PATH`). Instead, database setup is manual using the provided SQL file.

**Prerequisites:**
- A Supabase project (or any PostgreSQL 14+) with your database URL
- Access to Supabase SQL Editor (or `psql` client)

**Steps:**

1. Open your Supabase project → **SQL Editor**.
2. Open `docs/supabase-raina-init.sql` and copy its contents.
3. Paste into SQL Editor and **Run**.
4. Verify: run `SELECT COUNT(*) FROM "Category";` — should return 8.

The SQL file is safe to run multiple times (uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`).

**After any schema changes** (e.g., after pulling new migrations from the repo):

1. Generate an updated SQL script using `prisma migrate diff` locally.
2. Run it manually via Supabase SQL Editor.
3. Deploy the API app normally (`RUN_DB_MIGRATIONS=false` always).

### Health Checks

After deployment, verify the API is running:

| Endpoint                 | Expected                                                            |
| ------------------------ | ------------------------------------------------------------------- |
| `GET /health/live`       | `{ status: "ok", service: "raina-api", environment: "production" }` |
| `GET /health/ready`      | `{ status: "ok", ... }` (checks database connectivity)              |
| `GET /api/docs`          | Swagger UI page (if enabled)                                        |
| `GET /api/v1/categories` | Array of categories (requires seeded data)                          |
| `GET /api/v1/products`   | Array of products (requires seeded data)                            |
| `GET /api/v1/posts`      | Array of posts (requires seeded data)                               |

### Post-Deploy Checklist

1. Confirm API health endpoints respond.
2. Confirm database connectivity (`/health/ready` returns `"ok"`).
3. Set `NEXT_PUBLIC_API_BASE_URL` on the Web app to `https://api-raina.promksa.com/api/v1`.
4. **Redeploy** the Web app (Next.js reads `NEXT_PUBLIC_*` at build time).
5. Verify Web pages load live API data (categories, products, posts).
6. If migrating an existing database, set `RUN_DB_MIGRATIONS=true`, redeploy, then set back to `false`.

### Notes

- The API is a standard NestJS app. It does **not** need `next start` or custom server config.
- Hostinger's Node.js hosting may restart the app automatically on file changes.
- If `npm run build:api` fails, check the build logs in Hostinger → Node.js → app → Logs.
- The build script (`scripts/hostinger-build-api.cjs`) uses the same local pnpm fallback methods as the web build script. It does **not** call `corepack enable`.

---

## Database Setup via SQL

### Problem

Hostinger SSH shell does **not** have `node` or `npm` in `PATH`:

```bash
~/domains/raina.promksa.com/nodejs$ node
node: command not found
```

Only the Hostinger Node.js App build/deploy environment has Node.js available. This means `prisma migrate deploy` cannot run via SSH.

### Solution

Database setup is done **once** via Supabase SQL Editor using `docs/supabase-raina-init.sql`.

The build script (`scripts/hostinger-build-api.cjs`) now always uses `RUN_DB_MIGRATIONS=false`. The `--migrate-only` flag exists but is **not** used for Hostinger deployments.

### Build order

```
1. fixPrismaEnginePermissions()
2. prisma generate
3. tsc -p tsconfig.build.json
```

Migrations are **not** part of the Hostinger build. All schema management is manual via SQL.

---

## Prisma Engine EACCES on Hostinger

### Problem

Hostinger may strip execute permissions from Prisma engine binaries inside `node_modules/.pnpm`:

```
schema-engine-debian-openssl-1.1.x
EACCES permission denied
```

This prevents `prisma migrate deploy` and `prisma generate` from running during the build phase.

### Solution

The API build script (`scripts/hostinger-build-api.cjs`) includes a `fixPrismaEnginePermissions()` function that runs **before** any Prisma command. It:

1. Scans `node_modules/@prisma/engines/` for engine binaries.
2. Scans `node_modules/.pnpm/@prisma+engines@*/node_modules/@prisma/engines/` (pnpm store paths).
3. Runs `chmod 755` on every engine binary found (`schema-engine-*`, `query-engine-*`, `migration-engine-*`, `introspection-engine-*`, `libquery_engine-*`).
4. Skips on Windows — only runs on Linux (Hostinger).
5. Logs each fixed file and total count.
6. Does **not** fail the build if no engines are found.

### Build order

The script runs in this order:

```
1. fixPrismaEnginePermissions()
2. prisma generate
3. tsc -p tsconfig.build.json
```

Migrations are handled manually via `docs/supabase-raina-init.sql`. Set `RUN_DB_MIGRATIONS=false` (default).
