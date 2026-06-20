# DATA_MODEL.md

## Phase 4 Data Status

PostgreSQL and Prisma are implemented for the backend core.

Primary files:

- `docker-compose.yml`
- `apps/api/prisma.config.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260620000000_init_backend_core/migration.sql`
- `apps/api/prisma/seed.ts`

## Principles

- PostgreSQL is the development database.
- Prisma is the ORM.
- Rating scale is 1 to 10.
- Soft deletion is used for user-generated or recoverable records.
- Backend owns validation, authorization, moderation, and notification rules.
- Personal save lists are private.
- Publisher lists are public and tied to publisher profiles.

## Models

### User

Fields: `id`, `phone`, `role`, `status`, `lastSeenAt`, `createdAt`, `updatedAt`, `deletedAt`.

Relations: profile, posts, comments, reports, lists, saved items, notifications, follows, audit logs, settings.

### Profile

Fields: `id`, `userId`, `username`, `displayName`, `bio`, `city`, `avatarUrl`, `visibility`, `createdAt`, `updatedAt`, `deletedAt`.

### Category

Fields: `id`, `slug`, `nameAr`, `descriptionAr`, `status`, `sortOrder`, `createdAt`, `updatedAt`.

### Brand

Fields: `id`, `slug`, `name`, `description`, `status`, `createdAt`, `updatedAt`.

### Product

Fields: `id`, `slug`, `brandId`, `categoryId`, `nameAr`, `summaryAr`, `descriptionAr`, `priceMin`, `priceMax`, `currency`, `status`, `ratingAverage`, `ratingCount`, `createdAt`, `updatedAt`, `deletedAt`.

Relations: brand, category, media, specifications, posts, comments.

### ProductMedia

Fields: `id`, `productId`, `type`, `url`, `altAr`, `sortOrder`, `moderationStatus`, `createdAt`, `deletedAt`.

### ProductSpecification

Fields: `id`, `productId`, `nameAr`, `valueAr`, `sortOrder`, `createdAt`, `updatedAt`.

### Post

Fields: `id`, `authorId`, `productId`, `publicListId`, `rating`, `title`, `body`, `status`, `publishedAt`, `createdAt`, `updatedAt`, `deletedAt`.

Relations: author, product, optional public publisher list, media, pros, cons, comments.

### PostMedia

Fields: `id`, `postId`, `type`, `url`, `altAr`, `sortOrder`, `moderationStatus`, `createdAt`, `deletedAt`.

### PostPro and PostCon

Fields: `id`, `postId`, `body`, `sortOrder`, `createdAt`.

### Comment

Fields: `id`, `authorId`, `targetType`, `postId`, `productId`, `parentId`, `body`, `status`, `createdAt`, `updatedAt`, `deletedAt`.

Rules:

- A comment targets either a post or a product.
- Replies are limited in service logic to one level.

### Follow

Fields: `followerId`, `followingId`, `createdAt`.

Rules:

- Composite primary key: `followerId`, `followingId`.
- Database check prevents self-follow.

### UserList

Fields: `id`, `ownerId`, `slug`, `title`, `description`, `purpose`, `visibility`, `createdAt`, `updatedAt`, `deletedAt`.

Rules:

- `PERSONAL_SAVE` must be `PRIVATE`.
- `PUBLISHER_PUBLIC` must be `PUBLIC`.
- Slug is unique per owner.

### UserListItem

Fields: `id`, `listId`, `targetType`, `targetId`, `sortOrder`, `createdAt`.

Rules:

- Unique target per list.
- Publisher public lists can contain the publisher's own published posts and related products.

### SavedItem

Fields: `id`, `userId`, `targetType`, `targetId`, `createdAt`.

Rules:

- Unique saved target per user.
- Visible through owner-only routes.

### Notification

Fields: `id`, `userId`, `type`, `title`, `body`, `payload`, `readAt`, `createdAt`.

### Report

Fields: `id`, `reporterId`, `targetType`, `targetId`, `reason`, `details`, `status`, `assignedAdminId`, `createdAt`, `updatedAt`, `resolvedAt`.

### AppSetting

Fields: `key`, `value`, `valueType`, `description`, `updatedById`, `updatedAt`.

### AdminAuditLog

Fields: `id`, `actorId`, `action`, `targetType`, `targetId`, `metadata`, `createdAt`.

## Enums

- `UserRole`: `OWNER`, `ADMIN`, `MODERATOR`, `SUPPORT`, `USER`.
- `UserStatus`: `ACTIVE`, `DISABLED`, `DELETED`.
- `Visibility`: `PUBLIC`, `PRIVATE`.
- `RecordStatus`: `ACTIVE`, `HIDDEN`, `REMOVED`.
- `ContentStatus`: `DRAFT`, `PUBLISHED`, `HIDDEN`, `REMOVED`.
- `MediaType`: `IMAGE`, `VIDEO`.
- `ModerationStatus`: `PENDING`, `APPROVED`, `REJECTED`.
- `ListPurpose`: `PERSONAL_SAVE`, `PUBLISHER_PUBLIC`.
- `ListVisibility`: `PRIVATE`, `PUBLIC`.
- `ListItemTargetType`: `POST`, `PRODUCT`.
- `SavedTargetType`: `POST`, `PRODUCT`.
- `CommentTargetType`: `POST`, `PRODUCT`.
- `ReportTargetType`: `USER`, `PROFILE`, `PRODUCT`, `POST`, `COMMENT`.
- `ReportStatus`: `OPEN`, `REVIEWING`, `RESOLVED`, `REJECTED`.
- `NotificationType`: `FOLLOW_CREATED`, `COMMENT_CREATED`, `REPLY_CREATED`, `POST_PUBLISHED`, `REPORT_UPDATED`, `SYSTEM`.
- `SettingValueType`: `STRING`, `BOOLEAN`, `NUMBER`, `JSON`.

## Database Checks

The initial migration adds checks for:

- `Post.rating` between 1 and 10.
- Product rating summary from 0 to 10 with non-negative count.
- `Product.priceMin <= Product.priceMax` when both values exist.
- Comment single target.
- User list purpose and visibility pairing.
- Follow cannot point to the same user on both sides.

## Seed

Seed data creates owner/user accounts, profiles, categories, brands, products, posts, comments/replies, follows, public publisher lists, private personal lists, saved items, notifications, reports, settings, and one audit record.
