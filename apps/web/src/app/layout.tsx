import type { Metadata, Viewport } from "next";

import { SiteShell } from "@/components/site-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Raina — رأينا | تجارب منتجات حقيقية",
  description: "رأينا مجتمع عربي لاكتشاف المنتجات وقراءة تجارب المستخدمين وتقييماتهم من 10.",
  openGraph: {
    title: "Raina — رأينا",
    description: "تجارب منتجات حقيقية تساعدك تختار بثقة.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#F8F8F6",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
