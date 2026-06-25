# PROJECT_MAP.md

## [PHASE_5_WEB_READ_ONLY_STATUS]

Phase 5 Web Read-Only API Integration is complete locally.

Current web integration:

- `apps/web/src/lib/api` provides a unified API client with base URL handling, query param serialization, JSON parsing, timeout handling, standard API error normalization, and typed page/item responses.
- `apps/web/src/components` provides read-only feature components for categories, the rounded home category carousel, products, posts, public profiles, public lists, rating badges, rating summaries, pagination, filters, media galleries, page headers, and safe data states.
- `apps/web/src/app/page.tsx` reads categories, posts, and products from the backend and renders a modern hero with integrated stats from API data, rounded category carousel, and horizontal scroll section carousels for posts and products.
- `apps/web/src/components/section-carousel.tsx` is a reusable horizontal scroll carousel for home sections with RTL-safe scroll-snap behavior.
- Bottom navigation includes SVG icons, safe-area padding for iOS, and is hidden on desktop.
- Home hero features dynamic stats cards (products, posts, categories count) from API data.
- `apps/web/src/app/categories` reads category lists and category product pages.
- `apps/web/src/app/products` reads product lists and product detail pages.
- `apps/web/src/app/posts` reads post lists, post details, and post comments.
- `apps/web/src/app/users/[username]` reads public profile data, public posts, and public publisher lists.
- `apps/web/src/app/users/[username]/lists/[slug]` resolves public publisher lists by slug and renders public list posts/products only.
- `apps/api/prisma/seed.ts` now seeds direct Unsplash demo images for categories, product media, and post media.
- `apps/web/src/components/remote-image.tsx` renders remote demo images with a design-system fallback if loading fails, and API-backed media galleries consume it instead of raw image tags.
- `apps/web/.env.example` declares `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1`.
- `scripts/smoke-foundation.mjs` includes Phase 5 web routes and keeps runtime route checks optional when the web server is not running.

Current Phase 5 guard:

- Web must use `apps/web/src/lib/api` for backend requests.
- Public pages are read-only.
- No direct random fetch calls inside pages or read-only feature components.
- No LocalStorage or prototype data fallback for API-backed pages.
- No production auth, OTP, write actions, admin API integration, Flutter, Likes, product comparison, cart, checkout, payment, or shipping work started.

## [PHASE_4_BACKEND_CORE_STATUS]

Phase 4 Backend Core is complete locally.

Current backend foundation:

- `docker-compose.yml` provides a local PostgreSQL service with healthcheck and persistent volume.
- `apps/api/prisma.config.ts` configures Prisma 7 with PostgreSQL.
- `apps/api/prisma/schema.prisma` defines the backend core data model.
- `apps/api/prisma/migrations/20260620000000_init_backend_core/migration.sql` is the initial database migration.
- `apps/api/prisma/seed.ts` creates development seed data.
- `apps/api/src/database` provides `DatabaseModule` and `PrismaService`.
- `apps/api/src/common/auth` provides the development-only `X-Demo-User-Id` guard.
- `apps/api/src/common/decorators` provides `@CurrentDemoUser()`.
- `apps/api/src/common/pagination` provides page/limit pagination helpers.
- `apps/api/src/users`, `profiles`, `categories`, `brands`, `products`, `posts`, `comments`, `follows`, `lists`, `saved-items`, `notifications`, `reports`, and `settings` provide Phase 4 REST modules.
- `apps/api/src/health` now includes live and ready health routes.
- Swagger is available at `/api/docs`.
- Backend documentation lives in `docs/BACKEND.md` and `docs/DATABASE.md`.

Current Phase 4 verification:

- Prisma schema validation passed.
- Prisma client generation passed.
- API typecheck passed.
- API tests passed.
- Further full workspace verification is recorded in the handoff report.

Current phase guard:

- Stop before Phase 5 Web Authentication and Entry Flow unless the user explicitly approves the next phase.
- Do not connect Web/Admin UI to the API yet.
- Do not start Flutter work yet.

## [PHASE_3_DESIGN_SYSTEM_STATUS]

Phase 3 Design System is complete.

Current design-system foundation:

- `packages/design-tokens` now exposes semantic color, spacing, radius, shadow, typography, motion, z-index, and touch-target tokens.
- `packages/ui` provides shared React UI primitives for Web and Admin.
- `apps/web/src/app/design-system/page.tsx` exposes the Web design-system showcase route at `/design-system`.
- `apps/admin/src/app/design-system/page.tsx` exposes the Admin design-system showcase route at `/design-system`.
- Web and Admin import the same token CSS and shared UI CSS.
- Storybook was intentionally not added in Phase 3; showcase routes are the current QA surface.
- No prototype screen, route, LocalStorage behavior, feature state, backend feature, database schema, Flutter code, Like scope, product comparison scope, or e-commerce scope was added.

Current shared UI primitives:

- Button and IconButton.
- Input, OTP Input, Textarea, Select, Checkbox, Radio, and Switch.
- Badge, Chip, Avatar, Card, and Separator.
- Tabs and Accordion.
- Dialog, Bottom Sheet, Dropdown Menu, Toast, and Alert.
- Skeleton, EmptyState, ErrorState, Spinner, and Progress.
- Tooltip.
- Container, Stack, Inline, Grid, and AppShell.
- DataTable, Pagination, Breadcrumb, and StatCard.

Current design-system routes:

- Web: `http://localhost:3000/design-system`
- Admin: `http://localhost:3001/design-system`

Current Phase 3 verification:

- Component tests exist in `packages/ui`.
- Design-token tests were expanded in `packages/design-tokens`.
- Foundation smoke checks include `packages/ui` and the two `/design-system` routes.
- Runtime forbidden-term checks cover apps and packages for disallowed Like/product-comparison vocabulary.

## [PHASE_2_FOUNDATION_STATUS]

Phase 2 Monorepo Foundation is complete.

Current foundation:

- Git initialized with `main` and `develop`; active branch is `develop`.
- pnpm workspaces and Turborepo are configured.
- `apps/web` is a Next.js foundation with `/`, `/health`, and the Phase 3 `/design-system` showcase route.
- `apps/admin` is a separate Next.js owner dashboard foundation with `/`, `/health`, and the Phase 3 `/design-system` showcase route.
- `apps/api` is an independent NestJS backend foundation. Phase 4 adds PostgreSQL, Prisma, Swagger, and core REST modules.
- `packages/design-tokens`, `packages/ui`, `packages/shared-types`, `packages/validation`, `packages/api-contracts`, `packages/eslint-config`, and `packages/typescript-config` are in place.
- The original prototype is preserved under `prototype/`.
- No prototype feature logic was moved into the new apps.
- No database, migrations, auth, real product features, Flutter app, or e-commerce scope was added.

Current ports:

- Web: `3000`
- Admin: `3001`
- API: `4000`

Known local stray file:

- Root `route.ts` was inspected and removed as an orphaned file during Phase 2 cleanup. It was outside all apps/packages, was not referenced by build/test/runtime paths, and contained invalid, unrelated Next.js route code for storage/proof-file handling.

## [PROJECT_IDENTITY]

Raina — رأينا is an Arabic-first social product discovery platform. The product helps users discover products, read real user experiences, save products/posts into lists, follow accounts, comment, reply, report content, and publish product experiences.

The MVP is not an e-commerce product. Purchase, cart, payment, shipping, delivery, inventory, private chat, live shopping, and influencer commissions are out of scope.

## [PRODUCT_SCOPE]

In scope for the product direction:

- Product discovery.
- Product and post ratings from 1 to 10.
- User experiences/posts.
- Saves and lists.
- Following.
- Comments and replies.
- Reports and moderation.
- Notifications.
- Media in later backend phases.
- Owner-only admin dashboard.

Explicitly out of scope:

- Likes, hearts, reactions, Like notifications, Like counters, Like tables.
- Side-by-side product weighing flows.
- E-commerce flows.
- Merchant dashboard in MVP.
- Flutter WebView wrapper.

## [PLATFORM_DECISIONS]

- Web: Next.js + React + TypeScript + App Router, Mobile First, Arabic First, RTL.
- Mobile: Flutter for Android and iOS, consuming the same backend API as web.
- Backend: independent Node.js API, recommended NestJS with REST and OpenAPI.
- Database: PostgreSQL.
- Admin: separate owner-only dashboard, preferably separate app inside a future monorepo.
- API: versioned REST API, generated TypeScript and Dart clients.

## [CURRENT_REPOSITORY_STATE]

The repository is now a Git repository with `main` and `develop` branches. The current branch is `develop`.

Current workspace is a monorepo foundation plus a preserved standalone prototype/demo. The prototype remains under `prototype/` and is not the production architecture.

## [CURRENT_TECH_STACK]

- Workspace: pnpm workspaces.
- Task runner: Turborepo.
- Language: TypeScript.
- Web/Admin foundation: Next.js + React + App Router.
- API foundation: NestJS.
- Shared validation: Zod.
- Shared UI primitives: `@raina/ui`.
- Tests: Vitest.
- Linting: ESLint shared config.
- Formatting: Prettier.
- Prototype: preserved under `prototype/` with its original TypeScript SPA, direct DOM rendering, plain CSS, and LocalStorage demo state.

## [CURRENT_PROJECT_STRUCTURE]

Important files:

- `package.json`: root workspace scripts.
- `pnpm-workspace.yaml`: workspace membership.
- `turbo.json`: task graph.
- `.env.example`: root environment example.
- `.github/workflows/ci.yml`: CI checks.
- `scripts/smoke-foundation.mjs`: foundation smoke checks.
- `scripts/clean.mjs`: generated-output cleanup.
- `apps/web`: public Next.js foundation.
- `apps/admin`: owner dashboard Next.js foundation.
- `apps/api`: independent NestJS API with Phase 4 backend core.
- `apps/web/src/app/design-system`: Web design-system showcase route.
- `apps/admin/src/app/design-system`: Admin design-system showcase route.
- `packages/*`: shared foundation packages.
- `packages/ui`: shared React UI primitives.
- `docs/DESIGN_SYSTEM.md`: design-system rules and component documentation.
- `prototype/`: preserved standalone prototype/demo.

Generated files:

- `apps/web/.next`
- `apps/admin/.next`
- `apps/api/dist`
- `prototype/dist`

Potentially unused or pending:

- Root `route.ts` was removed after verification as an orphaned file unrelated to the Phase 2 foundation.
- PRD PDF exists as reference material.

Risky files:

- `prototype/src/app.ts` is large and monolithic.
- `prototype/dist/raina-standalone.html` is generated; do not edit manually.

## [CURRENT_RUNTIME_FLOW]

The app starts from `index.html` or `dist/raina-standalone.html`, finds `#app`, loads state from LocalStorage, resolves the current route, renders HTML strings, and attaches global click/submit listeners.

Standalone mode uses `file://` and hash routes such as `#/home`. Server mode can use clean paths such as `/home`.

Protected routes call `requireMember`. Guest users are shown auth-required UI or auth sheet and the intended path is preserved.

## [CURRENT_ROUTES_AND_VIEWS]

Implemented route signals:

- `/`, `/splash`
- `/onboarding`
- `/login`
- `/verify-otp`
- `/home`
- `/search`
- `/categories`
- `/category/[slug]`
- `/product/[slug]`
- `/post/[id]`
- `/create`
- `/drafts`
- `/profile?tab=posts`
- `/profile?tab=public-lists`
- `/profile?tab=saved`
- `/profile/saved`
- `/profile/saved?type=posts`
- `/profile/saved?type=products`
- `/profile/saved?type=lists`
- `/profile/saved/lists`
- `/profile/saved/lists/[id]`
- `/profile/public-lists`
- `/profile/public-lists/[id]`
- `/profile/[username]/lists`
- `/profile/[username]/lists/[id]`
- `/following`
- `/notifications`
- `/profile`
- `/profile/edit`
- `/profile/[username]`
- `/settings`
- `/settings/privacy`
- `/settings/notifications`
- `/help`
- `/terms`
- `/privacy`

## [CURRENT_FEATURES]

Feature status:

| Feature              | Current status                            |
| -------------------- | ----------------------------------------- |
| Splash               | Prototype implemented                     |
| Onboarding           | Prototype implemented                     |
| Login by phone       | Prototype implemented                     |
| OTP                  | Four numeric demo inputs with code `1234` |
| Guest mode           | Prototype implemented                     |
| Home feed            | Demo data                                 |
| Search/filter/sort   | Local demo                                |
| Categories           | Demo data                                 |
| Product details      | Demo data                                 |
| Post details         | Demo data                                 |
| Save product/post    | LocalStorage inside profile               |
| Personal save lists  | LocalStorage, private                     |
| Publisher lists      | LocalStorage, public profile lists        |
| Follow accounts      | LocalStorage and Following page           |
| Profile tabs         | My posts, public publisher lists, saves   |
| Comments/replies     | LocalStorage                              |
| Drafts               | LocalStorage                              |
| Publish demo post    | LocalStorage                              |
| Notifications        | Local demo                                |
| Report content       | Prototype UI demo; Phase 4 API endpoint   |
| Profile edit         | LocalStorage                              |
| Settings             | LocalStorage                              |
| Admin dashboard      | Not implemented                           |
| Backend/API/database | Phase 4 backend core implemented locally  |
| Media upload         | Not implemented                           |

## [CURRENT_DEMO_DATA]

Current demo data includes:

- 4 categories: skincare, haircare, home, coffee.
- 6 products.
- 4 public users.
- 4 seed posts.
- 3 current-user published posts.
- 2 current-user public publisher lists.
- 3 saved posts.
- 3 saved products.
- 2 private personal save lists.
- Seed comments and notifications.
- Demo phone: `501234567`.
- Demo OTP: `1234`.
- Demo user: `رنا العبدالله`.

Potential issue: demo text is embedded in TypeScript and generated into standalone HTML. In a future Next.js implementation, demo seed data should move into structured fixtures or backend seed scripts.

## [CURRENT_LOCAL_STORAGE]

Key:

- `raina.demo.state.v1`

Persisted state:

- Session mode and phone.
- Intended path.
- Profile.
- Saved products/posts.
- Personal saved lists.
- Public publisher lists.
- Following usernames.
- Comments by post/product.
- Drafts.
- Published demo posts.
- Notifications.
- Settings.

Risks:

- No schema migration beyond simple merge.
- No user separation.
- No encryption.
- No backend truth.
- LocalStorage can be cleared by user/browser.

## [CURRENT_PROFILE_STRUCTURE]

The current prototype profile for the signed-in user has three primary tabs:

- `منشوراتي`: posts authored by the current user, including linked product, rating, date, linked public list, and owner actions through the three-dot menu.
- `قوائم منشوراتي`: public publisher lists owned by the current user. They are visible to visitors and can include the user's posts and products linked to those posts.
- `المحفوظات`: owner-only saved content with inner tabs for saved posts, saved products, and private save lists.

Public profiles for other users show only public identity, posts, public publisher lists, follow state, and a three-dot action menu for sharing or reporting. They do not expose saved posts, saved products, private save lists, drafts, settings, or notifications.

Direct private save-list routes resolve only against the current user's private lists. Missing or unauthorized list access returns a blocked/missing state without leaking list contents.

## [CURRENT_DESIGN_SYSTEM]

Current design uses CSS variables:

- Primary Yellow `#FFCE00`
- Charcoal `#171717`
- Background `#F8F8F6`
- Card `#FFFFFF`
- Secondary surfaces and borders
- Support Purple
- Success/Error/Warning/Info colors

Typography uses Arabic-friendly fallbacks: IBM Plex Sans Arabic, Tajawal, Cairo, system fonts.

Current UI patterns include bottom navigation, desktop rail, cards, search bar, chips, tabs, sheets, toast, empty states, skeletons, rating badges, and responsive app shell.

## [CURRENT_RTL_AND_RESPONSIVE]

Document has `lang="ar"` and `dir="rtl"`.

CSS uses RTL-safe properties where practical, includes mobile-first layout, desktop preview container, and `overflow-x: hidden`.

Further audit needed in future phases:

- Full visual QA at 360, 375, 390, 414, tablet, desktop.
- Keyboard navigation coverage.
- Screen reader labels for every icon-only action.

## [CURRENT_SECURITY]

Current prototype has no backend security boundary.

Known constraints:

- OTP is demo-only.
- Auth is local client state.
- Reports are UI-only.
- No rate limiting.
- No moderation enforcement.
- No server-side validation.
- No secure storage.

This is acceptable for prototype/demo only, not production.

## [CURRENT_PERFORMANCE]

Current app is small but `src/app.ts` is monolithic and renders full HTML strings. It has no framework-level code splitting, memoization, image optimization, or SSR.

The standalone HTML is convenient for demo but should not be used as target production architecture.

## [TARGET_MONOREPO]

Recommended future structure:

```text
raina/
  apps/
    web/
    admin/
    api/
    mobile/
  packages/
    config/
    types/
    api-client-ts/
    api-contract/
    ui/
    validation/
  docs/
  prototype/
```

Keep the current prototype under `prototype/` or `legacy-demo/` until feature parity is confirmed.

## [TARGET_WEB_ARCHITECTURE]

- Next.js App Router.
- Route groups for public, authenticated, settings, and legal.
- Server components where suitable.
- Client components for interactions.
- Feature-based folders.
- Shared design tokens and UI primitives.
- API client generated from OpenAPI.
- No direct database access from web app.

## [TARGET_FLUTTER_ARCHITECTURE]

- Flutter app for Android and iOS.
- RTL and Arabic-first theme.
- Feature-first modules.
- Typed API client generated from OpenAPI.
- Secure token storage.
- State management decided during Flutter foundation phase.
- No WebView replacement for core UX.
- No direct database access.

## [TARGET_BACKEND_ARCHITECTURE]

- NestJS recommended.
- REST API.
- PostgreSQL.
- ORM: Prisma or Drizzle; Prisma is recommended for MVP speed and ecosystem unless migration/control needs favor Drizzle.
- Modules: auth, users, profiles, categories, brands, products, posts, comments, saves, lists, follows, reports, notifications, media, admin, audit.
- OpenAPI documentation.
- Central validation, authorization, rate limiting, logging, and error format.

## [TARGET_ADMIN_ARCHITECTURE]

- Owner-only dashboard.
- Separate app in monorepo.
- Role-based access.
- Screens for users, products, brands, categories, posts, comments, reports, media, notifications, settings, legal pages, analytics, audit logs.
- No merchant or brand dashboard in MVP.

## [TARGET_DATABASE_MODEL]

Core entities:

- User
- Profile
- Session/AuthAccount/OtpChallenge
- Category
- Brand
- Product
- ProductMedia
- Post
- PostMedia
- Rating
- Comment
- Save
- SavedList
- SavedListItem
- Follow
- Report
- Notification
- AdminRole
- AuditLog
- PlatformSetting

No Like, Reaction, Heart, PostLike, or CommentLike entities.

## [TARGET_API_CONTRACT]

API style:

- REST.
- Version prefix `/v1`.
- JSON.
- OpenAPI as contract.
- Standard error envelope.
- Cursor pagination for feeds.
- Offset/page pagination allowed for admin lists.
- Generated clients for TypeScript and Dart.

## [TARGET_AUTHENTICATION]

MVP recommendation:

- Phone OTP login.
- Backend-issued access and refresh tokens.
- Web stores refresh token in secure HTTP-only cookie if hosted same-site with API strategy, or secure token strategy depending deployment.
- Flutter stores tokens in secure storage.
- Owner dashboard uses separate admin roles and stronger session controls.

## [TARGET_MEDIA_STRATEGY]

- Object storage with CDN.
- Backend signs uploads.
- Media moderation status.
- Image resizing/optimization.
- Video length and size limits must be decided before implementation.

## [TARGET_NOTIFICATION_STRATEGY]

- In-app notification table.
- Push notifications later through FCM/APNs.
- Notification preferences.
- No Like notifications.

## [TARGET_TEST_STRATEGY]

- Unit tests for validation and business logic.
- Integration tests for API modules.
- E2E tests for core web flows.
- Component tests for critical UI primitives.
- Accessibility checks.
- RTL and responsive visual QA.
- Security tests for auth, authorization, rate limiting, and upload constraints.

## [TARGET_DEPLOYMENT]

Recommended:

- Web/Admin: Vercel or equivalent Next.js hosting.
- API: Railway, Render, Fly.io, VPS, or managed Node.js hosting.
- Database: managed PostgreSQL.
- Storage: object storage + CDN.
- Environments: Development, Staging, Production.

Hostinger may be possible for simple Node.js hosting, but must be evaluated for persistent Node runtime, env vars, logs, SSL, database access, process manager, file storage strategy, and deployment workflow. Do not assume static export is enough.

## [MIGRATION_STRATEGY]

- Preserve current prototype.
- Move it to `prototype/` in Phase 2 only after approval.
- Extract product copy, demo data, route list, flows, and visual tokens as references.
- Rebuild target apps with proper architecture rather than copying HTML strings into React.
- Validate feature parity before retiring prototype.

## [PHASES]

Approved phases:

1. Audit and Architecture.
2. Monorepo Foundation.
3. Design System.
4. Backend Core.
5. Web Authentication and Entry Flow.
6. Web Discovery.
7. Web User Interaction.
8. Web Content Creation.
9. Saves and Public Lists Hardening.
10. Owner Dashboard.
11. Quality and Security.
12. Staging Web Launch.
13. Flutter Foundation.
14. Flutter Features.
15. Mobile Release.

## [RISKS]

- Current prototype is monolithic and not directly portable.
- No Git repository means no version history or sync status.
- Standalone demo can hide architecture debt.
- LocalStorage state differs from backend reality.
- Media, moderation, and notifications are not designed in implementation yet.
- Arabic RTL needs repeated visual QA in target frameworks.

## [DECISIONS]

- Keep Raina — رأينا identity.
- Arabic First, RTL, Mobile First.
- Next.js for web.
- Flutter for mobile apps.
- Independent NestJS backend.
- PostgreSQL database.
- Owner-only admin dashboard.
- Rating scale 1 to 10.
- No Likes.
- No side-by-side product weighing flow.
- E-commerce out of MVP.

## [ORPHANS_AND_PENDING]

- Root `route.ts`: removed as orphaned cleanup after confirming it was outside workspace apps/packages and unused by build, tests, runtime, and smoke checks.
- PRD PDF: reference only.
- Remote setup: pending explicit decision.
- Hosting provider: open decision.
- OTP provider, storage provider, push provider: open decisions.

## Open Questions

| Question                | Required decision            | Default recommendation                                 | Reason                                | Impact                         | Decide before |
| ----------------------- | ---------------------------- | ------------------------------------------------------ | ------------------------------------- | ------------------------------ | ------------- |
| OTP provider            | Select vendor                | Start with backend abstraction and plug provider later | Avoid coupling auth to a vendor       | Affects auth API and cost      | Phase 4       |
| PostgreSQL provider     | Select managed provider      | Managed PostgreSQL                                     | Lower ops burden                      | Affects deployment and backups | Phase 4       |
| Storage provider        | Select object storage        | S3-compatible storage + CDN                            | Portable media strategy               | Affects upload API             | Phase 4       |
| Video in first MVP      | Include or defer             | Defer video, support images first                      | Reduces moderation/storage complexity | Affects media model            | Phase 4       |
| Video length            | Define limits                | 30-60 seconds if included                              | Keeps cost and moderation bounded     | Affects mobile UX              | Phase 8       |
| Private profile         | MVP or later                 | Include basic private profile flag                     | Requested by product scope            | Affects authorization          | Phase 4       |
| User-submitted products | Allow or admin-only          | Admin/owner manages products in MVP                    | Quality control                       | Affects moderation             | Phase 6       |
| Account verification    | Needed in MVP?               | Defer public badges                                    | Avoid extra ops                       | Affects profile model          | Phase 10      |
| Domains                 | Decide web/api/admin domains | `app`, `api`, `admin` subdomains                       | Clear separation                      | Affects cookies/CORS           | Phase 2       |
| Account deletion        | Policy                       | Soft delete + retention window                         | Compliance and recovery               | Affects data model             | Phase 4       |
