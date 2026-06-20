# API_PLAN.md

## Phase 4 API Status

The API is now a NestJS backend core with PostgreSQL, Prisma, Swagger, validation, rate limiting, request IDs, and a demo development identity.

Implemented:

- `GET /api/v1/health`.
- `GET /health/live`.
- `GET /health/ready`.
- Swagger at `/api/docs`.
- Standard error format: `{ code, message, details, requestId }`.
- Page/limit pagination metadata.
- Demo protected routes using `X-Demo-User-Id` in development/test only.
- Modules for users, profiles, categories, brands, products, posts, comments, follows, lists, saved items, notifications, reports, settings, health, and database.

Not implemented in Phase 4:

- Production OTP auth.
- Access/refresh token sessions.
- Media upload signing.
- Web/Admin API integration.
- Flutter API client.
- Owner dashboard UI.

## API Style

- REST API.
- JSON request/response.
- Version prefix: `/api/v1`.
- OpenAPI/Swagger is exposed at `/api/docs`.
- Backend is independent from Next.js UI.

## Error Format

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Human-readable Arabic or localized message",
  "details": {},
  "requestId": "req_..."
}
```

## Pagination

Collection endpoints use:

```text
?page=1&limit=20
```

Response metadata:

```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Public Endpoints

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
- `GET /api/v1/comments/:id`
- `GET /api/v1/profiles/:username`
- `GET /api/v1/users/:username/lists`
- `GET /api/v1/users/:username/lists/:id`
- `GET /api/v1/settings`

## Demo Protected Endpoints

Header:

```text
X-Demo-User-Id: usr_01
```

Routes:

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

## Authorization Rules in Phase 4

- Demo identity is rejected in production.
- Private save lists are owner-only.
- Saved items are owner-only.
- Public publisher lists are visible by username.
- Public publisher list items must belong to the publisher's own published posts or related products.
- Draft posts are only mutable by their author.
- Reports/settings administrative routes require seeded owner/admin/moderation roles.

## Security

- Helmet.
- Configurable CORS.
- Global ValidationPipe.
- Global exception filter.
- Request ID middleware.
- `@nestjs/throttler` rate limiting.
- Configurable request body size.
- Safe logging without secrets.

## Future API Work

Phase 5 can build web authentication only after explicit approval. Production auth must replace the demo header before real users connect to the API.
