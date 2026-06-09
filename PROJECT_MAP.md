# PROJECT_MAP.md

## [PHASE_2_FOUNDATION_STATUS]

Phase 2 Monorepo Foundation is complete.

Current foundation:

- Git initialized with `main` and `develop`; active branch is `develop`.
- pnpm workspaces and Turborepo are configured.
- `apps/web` is a Next.js foundation with `/` and `/health` only.
- `apps/admin` is a separate Next.js owner dashboard foundation with `/` and `/health` only.
- `apps/api` is an independent NestJS foundation with `/api/v1/health` only.
- `packages/design-tokens`, `packages/shared-types`, `packages/validation`, `packages/api-contracts`, `packages/eslint-config`, and `packages/typescript-config` are in place.
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
- `apps/api`: independent NestJS API foundation.
- `packages/*`: shared foundation packages.
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
- `/profile/saved`
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
| Comments/replies     | LocalStorage                              |
| Drafts               | LocalStorage                              |
| Publish demo post    | LocalStorage                              |
| Notifications        | Local demo                                |
| Report content       | UI-only demo                              |
| Profile edit         | LocalStorage                              |
| Settings             | LocalStorage                              |
| Admin dashboard      | Not implemented                           |
| Backend/API/database | Not implemented                           |
| Media upload         | Not implemented                           |

## [CURRENT_DEMO_DATA]

Current demo data includes:

- 4 categories: skincare, haircare, home, coffee.
- 6 products.
- 4 public users.
- 4 seed posts.
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
