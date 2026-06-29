"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Container, Button, Input, Tabs, OtpInput } from "@raina/ui";
import { useAuth } from "@/lib/auth/auth-context";

function isValidSaudiPhone(phone: string): boolean {
  return /^(\+9665|05|5)\d{8}$/.test(phone);
}

function normalizePhone(phone: string): string {
  if (phone.startsWith("05")) return "+966" + phone.slice(1);
  if (phone.startsWith("5")) return "+966" + phone;
  return phone;
}

function generateOtpCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function LoginPage() {
  const { isLoggedIn, loginWithEmail, loginWithOtp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.replace("/account");
  }, [isLoggedIn, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone");
  const [currentOtp, setCurrentOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleEmailLogin = async () => {
    setEmailError("");
    if (!email.trim()) {
      setEmailError("يرجى إدخال البريد الإلكتروني");
      return;
    }
    if (!password) {
      setEmailError("يرجى إدخال كلمة المرور");
      return;
    }
    setEmailLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = loginWithEmail(email.trim(), password);
    setEmailLoading(false);
    if (!result.ok) {
      setEmailError(result.error);
    } else {
      router.push("/account");
    }
  };

  const handleRequestOtp = () => {
    setPhoneError("");
    if (!phone.trim()) {
      setPhoneError("يرجى إدخال رقم الجوال");
      return;
    }
    if (!isValidSaudiPhone(phone.trim())) {
      setPhoneError("يرجى إدخال رقم جوال سعودي صحيح");
      return;
    }
    const code = generateOtpCode();
    setCurrentOtp(code);
    setOtpStep("otp");
    setOtpValue("");
    setOtpError("");
  };

  const handleVerifyOtp = async () => {
    if (otpValue !== currentOtp) {
      setOtpError("رمز التحقق غير صحيح");
      return;
    }
    setOtpLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    loginWithOtp(normalizePhone(phone.trim()));
    setOtpLoading(false);
    router.push("/account");
  };

  const handleResend = () => {
    const code = generateOtpCode();
    setCurrentOtp(code);
    setOtpValue("");
    setOtpError("");
  };

  return (
    <main className="web-login">
      <Container size="sm">
        <Card className="web-login__card">
          <div className="web-login__header">
            <h1 className="web-login__title">تسجيل الدخول</h1>
            <p className="web-login__subtitle">أهلاً بك في رأينا</p>
          </div>

          <Tabs
            ariaLabel="طريقة تسجيل الدخول"
            tabs={[
              {
                id: "email",
                label: "بريد إلكتروني",
                content: (
                  <div className="web-login__tab-content">
                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      placeholder="raina@raina.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                      {...(emailError && !emailError.includes("كلمة المرور") ? { errorText: emailError } : {})}
                    />
                    <Input
                      label="كلمة المرور"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                      {...(emailError && emailError.includes("كلمة المرور") ? { errorText: emailError } : {})}
                    />
                    <p className="web-login__hint">بيانات الدخول التجريبية: raina@raina.com / Rs2060@</p>
                    <Button
                      className="web-login__submit"
                      onClick={handleEmailLogin}
                      isLoading={emailLoading}
                    >
                      تسجيل الدخول
                    </Button>
                  </div>
                ),
              },
              {
                id: "phone",
                label: "رقم الجوال",
                content: (
                  <div className="web-login__tab-content">
                    {otpStep === "phone" ? (
                      <>
                        <Input
                          label="رقم الجوال"
                          type="tel"
                          placeholder="05xxxxxxxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleRequestOtp()}
                          {...(phoneError ? { errorText: phoneError } : {})}
                        />
                        <Button
                          className="web-login__submit"
                          onClick={handleRequestOtp}
                        >
                          إرسال رمز التحقق
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="web-otp-display">
                          <span className="web-otp-display__label">رمز التحقق:</span>
                          <span className="web-otp-display__code" dir="ltr">{currentOtp}</span>
                        </div>
                        <OtpInput
                          value={otpValue}
                          onValueChange={setOtpValue}
                          onComplete={handleVerifyOtp}
                          {...(otpError ? { errorText: otpError } : {})}
                          isLoading={otpLoading}
                          label="أدخل رمز التحقق"
                        />
                        <Button
                          className="web-login__submit"
                          onClick={handleVerifyOtp}
                          isLoading={otpLoading}
                        >
                          تسجيل الدخول
                        </Button>
                        <button
                          type="button"
                          className="web-login__resend"
                          onClick={handleResend}
                        >
                          إعادة إرسال الرمز
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </Container>
    </main>
  );
}
