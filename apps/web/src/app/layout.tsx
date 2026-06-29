import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";

import { SiteShell } from "@/components/site-shell";
import { Providers } from "./providers";

import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--raina-font-arabic"
});

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
      <body className={tajawal.variable}>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
