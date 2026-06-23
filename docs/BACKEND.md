# Raina Backend

Phase 4 establishes the independent NestJS REST API under `apps/api`.

## Runtime

- Framework: NestJS.
- API prefix: `/api/v1`.
- Swagger: `/api/docs`.
- Local port: `4000`.
- Demo identity header: `X-Demo-User-Id`.
- Demo identity works only in `development` and `test`; production rejects it.

## Core Modules

- `DatabaseModule` with `PrismaService`.
- `HealthModule`.
- `UsersModule`.
- `ProfilesModule`.
- `CategoriesModule`.
- `BrandsModule`.
- `ProductsModule`.
- `PostsModule`.
- `CommentsModule`.
- `FollowsModule`.
- `ListsModule`.
- `SavedItemsModule`.
- `NotificationsModule`.
- `ReportsModule`.
- `SettingsModule`.

## Security Foundation

- Helmet is enabled.
- CORS reads `CORS_ORIGINS`, falling back to web and admin origins.
- ValidationPipe uses whitelist, transform, and forbid non-whitelisted fields.
- Global exception filter returns `{ code, message, details, requestId }`.
- Request IDs are generated or accepted from safe `x-request-id` values.
- Rate limiting is enabled through `@nestjs/throttler`.
- Request body size is controlled by `REQUEST_BODY_LIMIT`.
- Logs avoid database URLs, tokens, phone details, cookies, and secrets.

## Health

- `GET /api/v1/health`: API health metadata.
- `GET /api/v1/health/live` and `GET /health/live`: process liveness.
- `GET /api/v1/health/ready` and `GET /health/ready`: readiness with database check.

## Demo Identity

Protected development endpoints require:

```text
X-Demo-User-Id: usr_01
```

The seed creates `usr_owner` plus eight user accounts. Use `usr_owner` for owner-only demo routes such as report and setting administration.

## REST Surface

Public:

- `GET /api/v1/categories`
- `GET /api/v1/categories/:slug`
- `GET /api/v1/brands`
- `GET /api/v1/brands/:slug`
- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `GET /api/v1/products/:id/posts`
- `GET /api/v1/products/:id/comments`
- `GET /api/v1/posts`
- `GET /api/v1/posts/:id`
- `GET /api/v1/posts/:id/comments`
- `GET /api/v1/comments/:id`
- `GET /api/v1/profiles/:username`
- `GET /api/v1/users/:username/lists`
- `GET /api/v1/users/:username/lists/:id`
- `GET /api/v1/settings`

Demo protected:

- `GET /api/v1/me`
- `GET /api/v1/me/profile`
- `PATCH /api/v1/me/profile`
- `POST /api/v1/posts`
- `PATCH /api/v1/posts/:id`
- `PATCH /api/v1/posts/:id/publish`
- `DELETE /api/v1/posts/:id`
- `POST /api/v1/posts/:postId/comments`
- `POST /api/v1/products/:productId/comments`
- `POST /api/v1/comments/:id/replies`
- `PATCH /api/v1/comments/:id`
- `DELETE /api/v1/comments/:id`
- `GET /api/v1/me/following`
- `POST /api/v1/users/:id/follow`
- `DELETE /api/v1/users/:id/follow`
- `GET /api/v1/me/lists`
- `POST /api/v1/me/lists`
- `GET /api/v1/me/lists/:id`
- `PATCH /api/v1/me/lists/:id`
- `DELETE /api/v1/me/lists/:id`
- `POST /api/v1/me/lists/:id/items`
- `DELETE /api/v1/me/lists/:id/items/:itemId`
- `GET /api/v1/me/saved`
- `POST /api/v1/me/saved`
- `DELETE /api/v1/me/saved/:id`
- `GET /api/v1/me/notifications`
- `PATCH /api/v1/me/notifications/:id/read`
- `PATCH /api/v1/me/notifications/read-all`
- `POST /api/v1/reports`
- `GET /api/v1/reports`
- `PATCH /api/v1/reports/:id`
- `PATCH /api/v1/settings/:key`

## Pagination

Collection endpoints use:

```text
?page=1&limit=20
```

Responses include:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

## Local Commands

From the repository root:

```bash
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm --filter @raina/api dev
```

On Windows PowerShell, `pnpm.cmd` can be used instead of `pnpm`.
