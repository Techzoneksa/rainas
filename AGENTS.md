# AGENTS.md

## Project Rules

- Product name: Raina — رأينا.
- Primary language: Arabic.
- Direction: RTL by default.
- Design approach: Mobile First.
- Web target: Next.js + React + TypeScript using App Router in the next implementation phases.
- Mobile target: Flutter for Android and iOS in later phases.
- Backend target: independent Node.js API, recommended framework NestJS.
- Admin target: separate owner-only dashboard, not mixed with user screens.
- Rating scale: 1 to 10.
- Likes are not supported. Do not add Like buttons, counters, heart reactions, reactions, or Like-related tables.
- Side-by-side product weighing is not supported. Raina must not include related routes, UI, state, APIs, or data models.
- Saving with Bookmark is allowed and is not a Like.
- Bottom navigation order is: الرئيسية, البحث, النشر, المتابَعون, حسابي.
- Saves live inside حسابي, not in bottom navigation.
- حسابي contains three primary tabs: منشوراتي, قوائم منشوراتي, and المحفوظات.
- منشوراتي shows only posts authored by the current user.
- قوائم منشوراتي shows public publisher lists for the current user's own posts and related products.
- المحفوظات shows saved posts, saved products, and private save lists only to the account owner.
- Personal save lists are private and visible only to their owner.
- Publisher lists are public, always belong to the publisher profile, and can be linked from posts.
- Post headers show follow/unfollow beside the account name. Share, copy link, report, edit, and delete actions live inside the three-dot menu.
- OTP uses four separate numeric inputs, numeric keyboard hints, paste support, backspace navigation, and demo code `1234`.
- MVP excludes purchase, payment, cart, shipping, delivery, inventory, private chat, live shopping, and influencer commissions.
- Flutter must not be a WebView wrapper around the web app.
- Do not connect Flutter directly to the database.
- Backend is the source of truth for business logic, permissions, validation, moderation, and notifications.
- Do not use `any` in final implementation code unless a migration note explicitly justifies a temporary boundary.
- Do not use deprecated APIs.
- Do not leave TODO comments in final implementation phases.
- Do not delete the current prototype before feature parity and explicit approval.
- New shared UI must use `@raina/ui` primitives when available.
- New visual styles must use `@raina/design-tokens` and CSS variables.
- Do not hardcode colors, spacing, radius, shadows, or typography in reusable UI.
- Do not duplicate shared components inside apps when a primitive exists in `packages/ui`.
- RTL, Mobile First, visible focus, semantic HTML, labels, and accessibility basics are mandatory for new UI.
- Run lint, typecheck, tests when available, build, and smoke checks before handoff.
- Update `PROJECT_MAP.md` after every phase.
- Do not skip phases.
- Do not change identity, colors, logo, typography, or core product scope without explicit request.

## Current Phase Guard

Current phase: Phase 4 Backend Core is complete locally. Stop before Phase 5 unless the user explicitly approves the next phase.

Allowed in the completed backend foundation:

- Maintain the pnpm/Turborepo workspace.
- Maintain the Next.js foundations and design-system showcase routes in `apps/web` and `apps/admin`.
- Maintain the NestJS API foundation and Phase 4 backend modules in `apps/api`.
- Maintain Docker Compose PostgreSQL setup.
- Maintain Prisma schema, migration, seed, and database scripts.
- Maintain shared packages under `packages/`.
- Maintain `packages/design-tokens`.
- Maintain `packages/ui`.
- Maintain Web/Admin `/design-system` showcase routes.
- Keep the preserved prototype under `prototype/`.
- Run install, format, lint, typecheck, test, build, smoke checks, and database checks.
- Update documentation to match the backend foundation.

Not allowed without explicit approval:

- Start Phase 5 Web Authentication and Entry Flow.
- Move prototype screens or business logic into Next.js.
- Connect Web/Admin screens to the new API.
- Add production auth, OTP provider integration, media uploads, admin dashboard UI, database provider deployment, or Flutter features.
- Add side-by-side product weighing in any form.
- Add payment, cart, shipping, merchant, private chat, live shopping, influencer, Like, heart, or reaction scope.
