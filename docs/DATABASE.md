# Raina Database

Phase 4 adds PostgreSQL and Prisma for the backend core.

## Local PostgreSQL

`docker-compose.yml` defines one PostgreSQL service:

- Database: `raina_dev`
- User: `raina`
- Port: `5432`
- Volume: `raina_postgres_data`
- Healthcheck: `pg_isready`

Start and stop:

```bash
pnpm db:up
pnpm db:down
pnpm db:logs
```

## Prisma

Files:

- `apps/api/prisma.config.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260620000000_init_backend_core/migration.sql`
- `apps/api/prisma/seed.ts`

Commands:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:migrate:deploy
pnpm db:seed
pnpm db:reset
pnpm db:studio
```

The API package runs `prisma generate` before typecheck, test, and build.

## Models

The schema includes:

- User
- Profile
- Category
- Brand
- Product
- ProductMedia
- ProductSpecification
- Post
- PostMedia
- PostPro
- PostCon
- Comment
- Follow
- UserList
- UserListItem
- SavedItem
- Notification
- Report
- AppSetting
- AdminAuditLog

## Important Rules

- Ratings are enforced from 1 to 10 at DTO and database level.
- Follow records cannot point to the same user on both sides.
- Comment records must target either a post or a product.
- Personal save lists are private.
- Publisher lists are public.
- Saved items are visible through owner-only endpoints.
- Draft posts are visible only to their author through protected service paths.
- Product rating summaries are recalculated from published posts.

## Seed Data

`pnpm db:seed` creates at least:

- 1 owner account.
- 8 regular user profiles.
- 8 categories.
- 12 brands.
- 30 products.
- 24 posts.
- 40 comments plus 10 replies.
- 18 follow records.
- 5 public publisher lists.
- 5 private personal lists.
- 20 saved items.
- 15 notifications.
- 6 reports.
- App settings.

Useful demo user IDs:

- Owner: `usr_owner`
- Regular users: `usr_01` through `usr_08`

## Demo Media Sources

The seed data uses remote demo image URLs for categories, products, and posts.

- Source: Unsplash public image CDN (`https://images.unsplash.com`).
- License reference: `https://unsplash.com/license`.
- The images are used for demo and development presentation only.
- The image URLs are direct remote image URLs with crop/format parameters for card-friendly sizes.
- No protected images from commercial product sites are used.
- Demo image rendering requires an internet connection.
- If a remote image fails, the web UI shows a design-system fallback surface.
- These URLs can be replaced later with officially uploaded product media from the production media pipeline.

## Environment

`apps/api/.env.example` contains:

```text
DATABASE_URL=postgresql://raina:raina_local_password@localhost:5432/raina_dev?schema=public
```

Production and staging must override this value with managed PostgreSQL credentials.
