# MIGRATION_PLAN.md

## Phase 2 Migration Status

Phase 2 Monorepo Foundation is complete.

- The original prototype has been moved into `prototype/` and remains available as the reference demo.
- The new workspace has `apps/web`, `apps/admin`, `apps/api`, and shared `packages/*`.
- No prototype screen or business logic was moved into the new apps.
- No database, auth, migrations, or production feature implementation was added.
- The next phase must not start without explicit approval.

## Current State

The current project is a working frontend prototype for Raina — رأينا. It is a TypeScript single-page app rendered with direct DOM strings, custom routing, LocalStorage state, and plain CSS. It can be viewed as a standalone single HTML file.

It is valuable as a demo and product reference, but it is not the target architecture.

## Target State

Target architecture:

- Monorepo.
- Next.js web app.
- Separate owner admin dashboard.
- Independent Node.js/NestJS API.
- PostgreSQL database.
- Flutter mobile apps for Android and iOS.
- Shared API contract and generated clients.
- Prototype preserved until feature parity.

## Preserve

Preserve these from the current prototype:

- Product identity and logo usage.
- Arabic copy that works well.
- RTL behavior and mobile-first intent.
- Existing route inventory.
- Demo product/category/post/user data as seed reference.
- Main user flows: splash, onboarding, OTP, guest mode, discovery, product, post, save, lists, follow, comments, drafts, profile, settings.
- Color tokens and general visual language.
- No Likes rule.
- Rating from 1 to 10.
- Current LocalStorage migration keeps saves, lists, following, comments, drafts, notifications, and settings while ignoring old side-by-side product weighing data.
- Preserve the current profile split: My Posts, public publisher lists, and owner-only saved content.
- Preserve the distinction between `personal_save/private` lists and `publisher_public/public` lists.

## Rewrite

Rewrite these in target architecture:

- Monolithic `src/app.ts`.
- String-based rendering.
- Global DOM event delegation.
- LocalStorage as source of truth.
- Generated standalone HTML.
- Custom hash routing.
- Large CSS file into organized tokens/components/layout utilities.
- UI-only report/auth/moderation behavior.

## Profile Experience Migration Note

When the prototype is rebuilt in later approved phases, the completed profile behavior must be carried into:

- Next.js Web: route-backed profile tabs, owner-only saved content, and public publisher-list pages.
- Node.js Backend: authorization rules that prevent private save-list access by other users and enforce list purpose/visibility pairs.
- Flutter: the same Arabic RTL tabs, public profile behavior, private saved content, and publisher-list flows.

This note is planning only. It does not start Phase 3, backend work, database work, or Flutter work.

## Migration Phases

1. Keep prototype in place and document current behavior.
2. Create monorepo foundation after approval.
3. Move current prototype into `prototype/` or `legacy-demo/`.
4. Build shared config and design tokens.
5. Build backend data model and API contract.
6. Seed backend with current demo data.
7. Rebuild web flows feature by feature in Next.js.
8. Validate each rebuilt flow against prototype behavior.
9. Add admin dashboard.
10. Add Flutter foundations and feature parity.
11. Retire prototype only after explicit approval.

## Feature Parity Checklist

- Splash/onboarding.
- Phone OTP.
- Guest mode.
- Protected actions.
- Home discovery.
- Search/filter/sort.
- Categories.
- Product detail.
- Post detail.
- Public profiles.
- Saves.
- Personal save lists.
- Public publisher lists.
- Following.
- Comments/replies.
- Reports.
- Notifications.
- Create post.
- Drafts.
- Profile edit.
- Settings.
- Legal pages.
- Arabic RTL responsive UI.
- No Likes.

## Demo Preservation

Current demo should be preserved as:

```text
prototype/
  index.html
  src/
  scripts/
  dist/
```

The demo should remain runnable until the new web app passes feature parity and client approval.

## Rollback

Rollback plan:

- Keep prototype untouched during Phase 2-4.
- If the new app foundation fails, continue demo review from prototype.
- Avoid destructive moves until Git is initialized and a branch exists.
- Use feature flags or route-level parity checks during migration.

## Risks

| Risk                                        | Mitigation                                                  |
| ------------------------------------------- | ----------------------------------------------------------- |
| Prototype behavior lost during rewrite      | Maintain route/feature parity checklist                     |
| Copy drift between prototype and new app    | Extract copy/data fixtures                                  |
| Backend model misses UI needs               | Derive API from current screens and future moderation needs |
| Flutter blocked by web-specific assumptions | Backend-first API contract and generated Dart client        |
| No Git history                              | Initialize Git before Phase 2 after approval                |

## Acceptance Criteria

- Current prototype remains available.
- Monorepo has clear app/package boundaries.
- New architecture does not copy `src/app.ts` as one component.
- Current demo data exists as seed/reference.
- Feature parity checklist exists and is updated per phase.
- No Likes are introduced.
- No e-commerce scope is introduced.
