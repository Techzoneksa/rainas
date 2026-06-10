# PHASES.md

## Phase 1 — Audit and Architecture

Goal: inspect current prototype, define target architecture, and create documentation only.

Scope:

- Repository audit.
- Current stack and file map.
- No Likes audit.
- Architecture plan.
- Data model.
- API plan.
- Migration plan.

Files expected:

- `AGENTS.md`
- `PROJECT_MAP.md`
- `MIGRATION_PLAN.md`
- `API_PLAN.md`
- `DATA_MODEL.md`
- `PHASES.md`

Dependencies: current prototype only.

Risks: incomplete audit if local browser or Git is unavailable.

Tests: current typecheck, lint, build, smoke.

Acceptance criteria:

- Documentation exists.
- Current prototype remains unchanged.
- No Phase 2 implementation starts.

Definition of Done:

- All required docs created.
- Verification results recorded.
- Explicit stop after report.

Rollback: remove docs only if requested.

Out of phase: code rewrite, installs, monorepo creation.

## Phase 2 — Monorepo Foundation

Status: complete.

Goal: create production-ready workspace boundaries.

Scope: pnpm workspaces, Turborepo, `apps/web`, `apps/admin`, `apps/api`, shared packages, lint/typecheck/test/build scripts, env examples, CI, Git initialization, and prototype preservation.

Dependencies: approval after Phase 1.

Risks: breaking prototype if moved too early.

Tests: install, format, lint, typecheck, test, build, smoke.

Acceptance criteria: monorepo runs with no app feature implementation. Met.

Definition of Done: prototype preserved and project map updated. Met.

Rollback: keep prototype untouched, remove new workspace branch if needed.

Out of phase: feature implementation.

## Phase 3 — Design System

Status: complete.

Goal: establish reusable RTL design primitives.

Scope: tokens, typography, buttons, inputs, cards, sheets, dialogs, navigation, loading, empty/error states.

Dependencies: monorepo foundation.

Risks: visual drift from approved Raina identity.

Tests: component checks, RTL visual QA, accessibility checks.

Acceptance criteria: primitives cover current prototype needs. Met for shared foundation primitives and showcase routes.

Definition of Done: documented tokens and examples. Met with `docs/DESIGN_SYSTEM.md`, `packages/ui`, and `/design-system` routes.

Rollback: revert design package.

Out of phase: business features.

## Phase 4 — Backend Core

Goal: create backend foundation and data model.

Scope: NestJS app, PostgreSQL, ORM, migrations, auth foundation, users, profiles, categories, brands, products, posts, API docs, demo seed.

Dependencies: provider decisions.

Risks: data model underfits moderation/media.

Tests: unit/integration tests and migration tests.

Acceptance criteria: API starts, OpenAPI generated, seed data exists.

Definition of Done: backend core deployable to development.

Rollback: revert migrations and seed.

Out of phase: full web UI rewrite.

## Phase 5 — Web Authentication and Entry Flow

Goal: rebuild entry flow in Next.js.

Scope: splash, onboarding, login, OTP demo/integration, guest mode, protected actions.

Dependencies: backend auth foundation or demo adapter.

Risks: token/cookie domain decisions.

Tests: E2E auth flow, guest protected route flow.

Acceptance criteria: user can enter as guest or authenticated user.

Definition of Done: parity with prototype entry flow.

Rollback: feature flag route back to prototype reference.

Out of phase: discovery features.

## Phase 6 — Web Discovery

Goal: rebuild product discovery.

Scope: home, search, categories, product details, post details, public profiles.

Dependencies: backend product/post/category endpoints.

Risks: SEO and dynamic route hosting decisions.

Tests: E2E discovery flow, responsive/RTL QA.

Acceptance criteria: user can discover and open products/posts.

Definition of Done: parity with prototype discovery.

Rollback: disable new routes.

Out of phase: create post and admin.

## Phase 7 — Web User Interaction

Goal: rebuild interactions.

Scope: saves, lists, follow, comments, replies, reports, notifications.

Dependencies: backend interaction endpoints.

Risks: moderation and notification complexity.

Tests: integration and E2E user interaction flows.

Acceptance criteria: all interactions persist through backend.

Definition of Done: no LocalStorage source of truth for real user data.

Rollback: feature flags for interaction modules.

Out of phase: media upload and dashboard.

## Phase 8 — Web Content Creation

Goal: rebuild user-generated posts.

Scope: create post, media, draft, preview, publish, edit profile.

Dependencies: media and post APIs.

Risks: upload validation, moderation, drafts.

Tests: create/draft/publish E2E, upload constraints.

Acceptance criteria: user can create and publish a valid product experience.

Definition of Done: moderation-ready content pipeline.

Rollback: disable publishing while keeping drafts.

Out of phase: admin reporting UI beyond needed moderation hooks.

## Phase 9 — Saves and Public Lists Hardening

Goal: harden personal saves, publisher public lists, and profile list visibility.

Scope: personal save organization, private list permissions, public publisher lists, post-to-list linking, and migration parity from prototype behavior.

Dependencies: user interaction and content creation modules.

Risks: confusing private personal lists with public publisher lists.

Tests: save to private list, remove from private list, open public list, link post to public list, verify unauthorized private-list access.

Acceptance criteria: personal saves remain private, publisher lists are public, and post list chips resolve to public list routes.

Definition of Done: web/API behavior matches approved prototype list behavior.

Rollback: hide public-list linking while keeping private saves.

Out of phase: purchase recommendations.

## Phase 10 — Owner Dashboard

Goal: owner-only administration.

Scope: overview, users, products, categories, brands, posts, comments, reports, settings, audit logs.

Dependencies: admin roles, backend modules.

Risks: authorization mistakes.

Tests: role-based access, audit log coverage.

Acceptance criteria: owner can moderate and manage core platform data.

Definition of Done: no admin UI mixed with user app.

Rollback: restrict admin access and use API scripts temporarily.

Out of phase: merchant dashboard.

## Phase 11 — Quality and Security

Goal: harden the platform.

Scope: unit, integration, E2E, RTL, accessibility, performance, security, rate limiting, logging, monitoring.

Dependencies: core feature completion.

Risks: late security fixes may require API changes.

Tests: full suite.

Acceptance criteria: release candidate quality bar met.

Definition of Done: documented security and QA sign-off.

Rollback: block staging release.

Out of phase: new features.

## Phase 12 — Staging Web Launch

Goal: deploy staging web/admin/api for review.

Scope: staging deployment, seed data, QA, client review, fixes.

Dependencies: hosting decisions.

Risks: environment drift.

Tests: smoke, E2E, visual QA on staging.

Acceptance criteria: client can review stable staging.

Definition of Done: staging checklist signed off.

Rollback: revert deployment.

Out of phase: production launch.

## Phase 13 — Flutter Foundation

Goal: create mobile foundation.

Scope: Flutter architecture, theme, RTL, networking, authentication, secure storage, navigation, generated API client.

Dependencies: OpenAPI and stable auth.

Risks: web assumptions leaking into mobile.

Tests: mobile unit/widget tests and auth smoke.

Acceptance criteria: app shell authenticates and navigates.

Definition of Done: Flutter can consume backend directly.

Rollback: keep mobile branch separate.

Out of phase: full mobile features.

## Phase 14 — Flutter Features

Goal: implement mobile feature parity.

Scope: entry flow, home, search, products, posts, saves, lists, following, comments, create post, notifications, profile.

Dependencies: Flutter foundation and stable API.

Risks: media and notification platform differences.

Tests: Android/iOS QA and E2E flows.

Acceptance criteria: mobile matches approved web behavior.

Definition of Done: feature parity checklist passes.

Rollback: defer incomplete modules behind feature flags.

Out of phase: store release.

## Phase 15 — Mobile Release

Goal: prepare and release mobile apps.

Scope: Android QA, iOS QA, store assets, privacy declarations, beta testing, Google Play, App Store.

Dependencies: Flutter feature parity.

Risks: store policy, privacy metadata, account readiness.

Tests: release build QA and beta feedback.

Acceptance criteria: apps accepted for beta/production as approved.

Definition of Done: release artifacts and store listings complete.

Rollback: pause rollout or revert store version.

Out of phase: major new features.
