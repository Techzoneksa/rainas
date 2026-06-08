export const adminAppConfig = {
  name: "Raina Owner Dashboard",
  environment: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  status: "ok",
  foundationLabel: "Admin Foundation",
  message: "لوحة الإدارة قيد التأسيس"
} as const;
