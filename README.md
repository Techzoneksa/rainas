# Raina — رأينا

Raina is an Arabic-first, RTL, mobile-first social product discovery platform. The MVP is not an e-commerce product.

Current status: **Phase 4 - Backend Core is complete locally**.

## Architecture

```text
apps/web       Next.js web foundation
apps/admin     Owner-only dashboard foundation
apps/api       Independent NestJS API with PostgreSQL/Prisma backend core
packages/ui    Shared React UI primitives
packages/*     Tokens, configs, types, validation, contracts
prototype/     Preserved reference demo
```

## Fixed Decisions

- Primary language: Arabic.
- Direction: RTL.
- Design approach: Mobile First.
- Web/Admin: Next.js + React + TypeScript.
- API: independent Node.js/NestJS.
- Mobile: Flutter later as a native app, not a WebView wrapper.
- Rating scale: 1 to 10.
- No Likes, hearts, or reactions.
- No product comparison flows.
- No cart, checkout, payment, shipping, inventory, private chat, live shopping, or influencer commissions in MVP.
- Bookmark is allowed for saving.

## Requirements

- Node.js compatible runtime.
- pnpm `11.0.9`.
- Docker for local PostgreSQL.

On Windows PowerShell, prefer `pnpm.cmd` if script execution policy blocks `pnpm.ps1`.

## Install

```bash
pnpm install
```

## Run

```bash
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Ports:

- Web: `http://localhost:3000`
- Admin: `http://localhost:3001`
- API health: `http://localhost:4000/api/v1/health`
- API docs: `http://localhost:4000/api/docs`
- API live: `http://localhost:4000/health/live`
- API ready: `http://localhost:4000/health/ready`

Design-system showcases:

- Web Design System: `http://localhost:3000/design-system`
- Admin Design System: `http://localhost:3001/design-system`

## Checks

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
```

## Backend and Database

Phase 4 added:

- Docker Compose PostgreSQL service.
- Prisma schema, migration, and seed script.
- NestJS modules for users, profiles, categories, brands, products, posts, comments, follows, lists, saved items, notifications, reports, settings, health, and database access.
- Swagger documentation at `/api/docs`.
- Demo development identity through `X-Demo-User-Id`.

Database commands:

```bash
pnpm db:up
pnpm db:down
pnpm db:logs
pnpm db:generate
pnpm db:migrate
pnpm db:migrate:deploy
pnpm db:seed
pnpm db:reset
pnpm db:studio
```

Backend docs:

- `docs/BACKEND.md`
- `docs/DATABASE.md`

## Design System

Phase 3 added:

- Expanded semantic design tokens in `packages/design-tokens`.
- Shared UI primitives in `packages/ui`.
- Web and Admin `/design-system` showcase routes.
- Component tests for core primitives.
- Documentation in `docs/DESIGN_SYSTEM.md`.

Storybook is not installed in this phase. The showcase routes are the current review and QA surface.

## Prototype

The reference prototype remains preserved in:

```text
prototype/
```

It is a visual and flow reference only. Do not delete it before feature parity and explicit approval.

## Security Notes

- Do not use `dangerouslySetInnerHTML` in Web/Admin.
- Do not put secrets in client code or `.env.example`.
- Do not use LocalStorage for production authentication.
- Do not add fake JWT behavior.
- API must not log OTPs, tokens, cookies, authorization headers, phone numbers, or secrets.

## Phase Stop

Stop after Phase 4 unless Phase 5 is explicitly approved.

Do not start web authentication, web feature migration, Flutter work, or real admin UI work without explicit approval.
