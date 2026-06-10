# Raina Design System

## Purpose

Phase 3 establishes the shared UI foundation for Raina web and owner admin surfaces. It provides design tokens, React primitives, RTL rules, mobile-first layout guidance, and accessibility expectations.

This phase does not implement product screens, authentication, backend behavior, database work, Flutter code, commerce flows, product comparison, or Likes.

## Identity

- Product: Raina — رأينا.
- Language: Arabic first.
- Direction: RTL by default.
- Layout approach: Mobile First.
- Font stack: IBM Plex Sans Arabic, Tajawal, Cairo, system fonts.
- Rating convention: 1 to 10.
- Bookmark is the saving metaphor. Heart, Like, and reaction patterns are not part of Raina.

## Tokens

Tokens live in `packages/design-tokens`.

### Colors

- Brand primary: `#FFCE00`
- Brand secondary: `#171717`
- Surface page: `#F8F8F6`
- Surface card: `#FFFFFF`
- Surface muted: `#F1F1ED`
- Text primary: `#171717`
- Text secondary: `#6B6B66`
- Text muted: `#9A9A94`
- Border subtle: `#E6E6E0`
- Border strong: `#D2D2CB`
- Support purple: `#5B3FD6`
- Success: `#2E9D68`
- Error: `#D94A4A`
- Warning: `#F59E0B`
- Information: `#3478F6`

Primary yellow is for primary actions, active state, and rating emphasis. It must not dominate large surfaces or every button.

### Spacing

The shared spacing scale is:

```text
0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

Use token variables instead of arbitrary spacing.

### Radius

- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `2xl`: 24px
- `full`: 9999px

### Shadows

Use light shadows only:

- `xs`
- `sm`
- `md`
- `floating`
- `overlay`

### Typography

The scale includes display, heading 1, heading 2, heading 3, body large, body, body small, label, and caption tokens.

### Motion

Motion tokens include fast, normal, and slow durations plus standard and emphasized easing. Components must respect `prefers-reduced-motion`.

### Z-index

The shared z-index scale is:

```text
base, sticky, dropdown, sheet, modal, toast
```

### Touch

Interactive controls use a minimum touch target of 44px.

## Shared UI Package

Shared React primitives live in `packages/ui`.

The package contains no business logic, data fetching, routing, database access, feature state, or prototype code.

Current primitives:

- Button
- IconButton
- Input
- OtpInput
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Chip
- Avatar
- Card
- Separator
- Tabs
- Accordion
- Dialog
- BottomSheet
- DropdownMenu
- Toast
- Alert
- Skeleton
- EmptyState
- ErrorState
- Spinner
- Progress
- Tooltip
- Container
- Stack
- Inline
- Grid
- AppShell
- DataTable
- Pagination
- Breadcrumb
- StatCard

## Component Rules

- Use tokens for color, spacing, radius, shadow, typography, motion, and z-index.
- Do not hardcode component colors.
- Do not duplicate primitives inside apps when `packages/ui` has the needed component.
- Use semantic HTML first.
- Preserve native attributes where possible.
- Icon-only buttons require accessible labels.
- Inputs require visible labels.
- Error text must be associated with the field.
- Loading states must prevent duplicate activation when needed.
- Disabled state must not rely on color alone.

## RTL Rules

- App roots must use `lang="ar"` and `dir="rtl"`.
- Prefer logical CSS properties such as `margin-inline`, `padding-inline`, `inset-inline`, and `border-inline`.
- Prefix and suffix field content must preserve readable order in RTL.
- Phone and OTP numeric values may use LTR inside the control while the surrounding UI remains RTL.
- Tabs, dropdowns, sheets, dialogs, breadcrumbs, tables, and pagination must be checked in RTL.

## Accessibility

Minimum requirements:

- Keyboard navigation.
- Visible focus.
- ARIA labels for icon-only controls.
- Label association for fields.
- Error association for invalid fields.
- Semantic `dialog`, `alert`, `status`, `tablist`, `tab`, `tabpanel`, and table markup.
- Touch target minimum of 44px.
- Sufficient contrast.
- Reduced-motion handling.

## Web and Admin Difference

Web and admin share primitives and tokens.

Web examples should stay consumer-facing and generic during this phase. Admin examples may show table, sidebar, breadcrumb, pagination, and stat primitives, but they must not become a real dashboard.

## Flutter Guidance

Do not share React components with Flutter. Share only:

- Token names.
- Color and type scales.
- Component behavior rules.
- Accessibility expectations.
- RTL rules.

Flutter must later consume the backend API directly and must not wrap the web app in a WebView.

## Do

- Use `@raina/ui` for new shared UI.
- Use `@raina/design-tokens` and CSS variables.
- Keep Arabic copy clear and concise.
- Test mobile widths early.
- Keep primary yellow meaningful.
- Use Bookmark language for saving.

## Do Not

- Do not add Likes, hearts, reactions, Like counters, or Like tables.
- Do not add product comparison flows, tables, buttons, or state.
- Do not add cart, checkout, payment, shipping, private chat, live shopping, or influencer commission UI.
- Do not move prototype screens into Next.js in this phase.
- Do not implement auth, backend features, database schemas, Flutter, or real admin CRUD.
- Do not hide focus outlines.
- Do not use clickable `div` elements without semantic roles.

## Showcase Routes

- Web: `/design-system`
- Admin: `/design-system`

These pages are component showcases only. They use general sample content and do not represent product or admin feature implementation.

## Storybook Decision

Storybook was not added in Phase 3 to avoid extra tooling and dependency surface. The web and admin `/design-system` routes serve as the current showcase and QA surface.
