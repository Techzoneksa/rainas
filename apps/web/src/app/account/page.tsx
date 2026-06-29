"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Container, Button, Stack } from "@raina/ui";
import { useAuth } from "@/lib/auth/auth-context";

export default function AccountPage() {
  const { session, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!session) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="web-account">
      <Container size="sm">
        <div className="web-account__header">
          <div className="web-account__avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="currentColor" />
              <path d="M4 21v-1a6 6 0 0112 0v1" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="web-account__name">مرحباً بك في رأينا</h1>
            <p className="web-account__display-name">{session.displayName}</p>
          </div>
        </div>

        <Stack gap="16" className="web-account__sections">
          <Card className="web-account__section">
            <div className="web-account__section-head">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>المحفوظات</span>
            </div>
            <p className="web-account__section-desc">المنتجات والتجارب التي حفظتها تظهر هنا.</p>
          </Card>

          <Card className="web-account__section">
            <div className="web-account__section-head">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>منشوراتي</span>
            </div>
            <p className="web-account__section-desc">التجارب والمراجعات التي كتبتها تظهر هنا.</p>
          </Card>

          <Card className="web-account__section">
            <div className="web-account__section-head">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M4 21v-1a6 6 0 0112 0v1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>معلومات الحساب</span>
            </div>
            <div className="web-account__info">
              <div className="web-account__info-row">
                <span className="web-account__info-label">طريقة الدخول</span>
                <span className="web-account__info-value">
                  {session.loginMethod === "email" ? "بريد إلكتروني" : "رقم الجوال"}
                </span>
              </div>
              {session.email && (
                <div className="web-account__info-row">
                  <span className="web-account__info-label">البريد الإلكتروني</span>
                  <span className="web-account__info-value">{session.email}</span>
                </div>
              )}
              {session.phone && (
                <div className="web-account__info-row">
                  <span className="web-account__info-label">رقم الجوال</span>
                  <span className="web-account__info-value" dir="ltr">{session.phone}</span>
                </div>
              )}
            </div>
          </Card>

          <Button
            className="web-account__logout"
            variant="outline"
            onClick={handleLogout}
          >
            تسجيل الخروج
          </Button>
        </Stack>
      </Container>
    </main>
  );
}
