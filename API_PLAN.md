# API_PLAN.md

## Phase 2 API Foundation Status

The current API app is a NestJS foundation only.

Implemented now:

- `GET /api/v1/health`.
- Helmet.
- CORS configured from environment examples.
- Global validation pipe.
- Request ID middleware.
- Standard exception filter.
- Minimal bootstrap logging.

Not implemented yet:

- Auth.
- Database.
- ORM.
- OpenAPI generation.
- Feature modules.
- Migrations.
- Production business logic.

## API Style

- REST API.
- JSON request/response.
- Version prefix: `/v1`.
- OpenAPI is the source of truth.
- Generated TypeScript client for web/admin.
- Generated Dart client for Flutter.
- Backend is independent from Next.js UI.

## Versioning

Initial version:

```text
/v1
```

Breaking changes require a new major route prefix such as `/v2`. Minor additive changes stay under `/v1`.

## Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable Arabic or localized message",
    "details": {},
    "requestId": "req_..."
  }
}
```

## Pagination

Feed endpoints should prefer cursor pagination:

```text
?cursor=...&limit=20
```

Admin table endpoints may support page pagination:

```text
?page=1&pageSize=50
```

## Filtering and Sorting

Use explicit query parameters:

```text
?categoryId=...
?q=...
?sort=rating_desc
?status=published
```

## Modules and Endpoints

### Auth

- `POST /v1/auth/otp/start`
- `POST /v1/auth/otp/verify`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `GET /v1/auth/me`

### Users and Profiles

- `GET /v1/users/:username`
- `GET /v1/me/profile`
- `PATCH /v1/me/profile`
- `PATCH /v1/me/settings`
- `DELETE /v1/me`

### Categories

- `GET /v1/categories`
- `GET /v1/categories/:slug`

### Brands

- `GET /v1/brands`
- `GET /v1/brands/:slug`

### Products

- `GET /v1/products`
- `GET /v1/products/:slug`
- `GET /v1/products/:id/posts`
- `GET /v1/products/:id/comments`
- `POST /v1/products/:id/comments`
- `POST /v1/products/:id/report`

### Posts

- `GET /v1/posts`
- `GET /v1/posts/:id`
- `POST /v1/posts`
- `PATCH /v1/posts/:id`
- `DELETE /v1/posts/:id`
- `POST /v1/posts/:id/comments`
- `POST /v1/posts/:id/report`

### Drafts

- `GET /v1/me/drafts`
- `POST /v1/me/drafts`
- `PATCH /v1/me/drafts/:id`
- `POST /v1/me/drafts/:id/publish`
- `DELETE /v1/me/drafts/:id`

### Comments

- `GET /v1/comments/:id`
- `POST /v1/comments/:id/replies`
- `PATCH /v1/comments/:id`
- `DELETE /v1/comments/:id`
- `POST /v1/comments/:id/report`

### Saves and Lists

- `GET /v1/me/saves`
- `POST /v1/me/saves`
- `DELETE /v1/me/saves/:id`
- `GET /v1/me/lists`
- `POST /v1/me/lists`
- `GET /v1/me/lists/:id`
- `PATCH /v1/me/lists/:id`
- `DELETE /v1/me/lists/:id`
- `POST /v1/me/lists/:id/items`
- `DELETE /v1/me/lists/:id/items/:itemId`

### Publisher Public Lists

- `GET /v1/users/:username/lists`
- `GET /v1/users/:username/lists/:id`
- `GET /v1/me/public-lists`
- `POST /v1/me/public-lists`
- `PATCH /v1/me/public-lists/:id`
- `DELETE /v1/me/public-lists/:id`
- `POST /v1/me/public-lists/:id/items`
- `DELETE /v1/me/public-lists/:id/items/:itemId`

### Follows

- `GET /v1/me/following`
- `POST /v1/users/:id/follow`
- `DELETE /v1/users/:id/follow`

### Notifications

- `GET /v1/me/notifications`
- `PATCH /v1/me/notifications/:id/read`
- `PATCH /v1/me/notifications/read-all`
- `PATCH /v1/me/notification-settings`

### Media

- `POST /v1/media/upload-intent`
- `POST /v1/media/:id/complete`
- `DELETE /v1/media/:id`

### Reports and Moderation

- `POST /v1/reports`
- `GET /v1/admin/reports`
- `PATCH /v1/admin/reports/:id`
- `POST /v1/admin/moderation/actions`

### Owner Admin

- `GET /v1/admin/overview`
- `GET /v1/admin/users`
- `PATCH /v1/admin/users/:id`
- `GET /v1/admin/products`
- `POST /v1/admin/products`
- `PATCH /v1/admin/products/:id`
- `GET /v1/admin/posts`
- `PATCH /v1/admin/posts/:id`
- `GET /v1/admin/comments`
- `PATCH /v1/admin/comments/:id`
- `GET /v1/admin/audit-logs`
- `GET /v1/admin/settings`
- `PATCH /v1/admin/settings`

## Authentication

- Phone OTP for users.
- Admin authentication with owner/admin roles.
- Access token + refresh token.
- Flutter uses secure storage.
- Web strategy depends on final domain/CORS decision.

## Security

- Rate limiting on OTP, auth, comments, reports, media.
- Validation DTOs.
- Authorization guards per route.
- Request ID logging.
- Audit logs for admin actions.
- Upload size/type limits.
- No Like-related endpoints.

## OpenAPI

OpenAPI must describe:

- Request bodies.
- Response schemas.
- Error schemas.
- Auth requirements.
- Pagination metadata.
- Enum values.

Clients:

- `packages/api-client-ts`
- Flutter generated client under `apps/mobile` or `packages/api-client-dart`.
