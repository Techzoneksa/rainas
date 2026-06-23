import type { Route } from "next";
import Link from "next/link";
import { AppShell, Container } from "@raina/ui";

const navLinks = [
  { href: "/" as Route, label: "الرئيسية" },
  { href: "/categories" as Route, label: "التصنيفات" },
  { href: "/products" as Route, label: "المنتجات" },
  { href: "/posts" as Route, label: "المنشورات" }
];

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell
      header={
        <Container size="lg">
          <div className="web-header">
            <Link className="web-brand" href="/">
              <span aria-hidden="true">R</span>
              <strong>Raina — رأينا</strong>
            </Link>
            <nav className="web-nav" aria-label="التنقل الرئيسي">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <span aria-disabled="true">حسابي</span>
            </nav>
          </div>
        </Container>
      }
      footer={
        <Container size="lg">
          <nav className="web-bottom-nav" aria-label="التنقل السفلي">
            <Link href="/">الرئيسية</Link>
            <Link href={"/products" as Route}>البحث</Link>
            <Link href={"/posts" as Route}>المنشورات</Link>
            <Link href={"/categories" as Route}>التصنيفات</Link>
            <span aria-disabled="true">حسابي</span>
          </nav>
        </Container>
      }
    >
      {children}
    </AppShell>
  );
}
