# Raina — رأينا

رأينا منصة اجتماعية عربية لاكتشاف المنتجات وقراءة التجارب ومقارنة الخيارات قبل قرار الشراء.

هذه المرحلة هي **Phase 2 — Monorepo Foundation** فقط. لا تحتوي هذه المرحلة على نقل شاشات prototype أو تنفيذ ميزات المنتج.

## المعمارية

```text
apps/web      Next.js web foundation
apps/admin    Owner-only dashboard foundation
apps/api      Independent NestJS API foundation
packages/*    Shared configs, tokens, types, validation, contracts
prototype/    Preserved reference demo
```

## القرارات الثابتة

- اللغة الأساسية: العربية.
- الاتجاه: RTL.
- التصميم: Mobile First.
- الويب: Next.js + React + TypeScript.
- لوحة الإدارة: للمالك فقط.
- الـ API: Node.js مستقل باستخدام NestJS.
- Flutter لاحقاً كتطبيق مستقل، وليس WebView.
- التقييم من 1 إلى 10.
- لا توجد Likes أو Hearts أو Reactions.
- الشراء والدفع والسلة والشحن خارج MVP.

## المتطلبات

- Node.js LTS/compatible runtime. البيئة الحالية تستخدم Node `v24.15.0`.
- pnpm. البيئة الحالية تستخدم pnpm `11.0.9`.

## التثبيت

```bash
pnpm install
```

## التشغيل

```bash
pnpm dev
```

المنافذ المعتمدة:

- Web: `http://localhost:3000`
- Admin: `http://localhost:3001`
- API: `http://localhost:4000/api/v1/health`

## أوامر الفحص

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
```

## ملفات البيئة

انسخ ملفات `.env.example` عند الحاجة. لا تضع أسراراً في المستودع.

- `.env.example`
- `apps/web/.env.example`
- `apps/admin/.env.example`
- `apps/api/.env.example`

## Prototype

النسخة التجريبية المرجعية محفوظة في:

```text
prototype/
```

هذه النسخة مرجع للتصميم والتدفقات فقط، وليست Production Architecture. يمنع حذفها قبل Feature Parity واعتماد صريح.

## Security Notes

- لا تستخدم `dangerouslySetInnerHTML` في Web/Admin.
- لا تضع أسراراً في Client أو `.env.example`.
- لا تستخدم LocalStorage للمصادقة الإنتاجية.
- لا تضف Fake JWT.
- API لا يسجل OTP أو Tokens أو Cookies أو Authorization headers أو أرقام جوال أو أسرار.

## Phase Stop

بعد Phase 2 لا تبدأ Phase 3 أو Design System الكامل أو Backend Core أو نقل الشاشات بدون موافقة صريحة.
