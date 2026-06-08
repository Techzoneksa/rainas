import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Raina — رأينا",
  description: "Raina web foundation for an Arabic-first product discovery platform."
};

export const viewport: Viewport = {
  themeColor: "#F8F8F6",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
