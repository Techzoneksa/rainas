import type { Route } from "next";
import Link from "next/link";
import { AppShell, Container } from "@raina/ui";

const navLinks = [
  { href: "/" as Route, label: "الرئيسية" },
  { href: "/categories" as Route, label: "التصنيفات" },
  { href: "/products" as Route, label: "المنتجات" },
  { href: "/posts" as Route, label: "المنشورات" }
];

type BottomNavIconName = "home" | "search" | "posts" | "categories" | "account";

const bottomNavLinks = [
  { href: "/" as Route, label: "الرئيسية", icon: "home" },
  { href: "/products" as Route, label: "البحث", icon: "search" },
  { href: "/posts" as Route, label: "المنشورات", icon: "posts" },
  { href: "/categories" as Route, label: "التصنيفات", icon: "categories" }
] satisfies Array<{ href: Route; label: string; icon: BottomNavIconName }>;

function BottomNavIcon({ name }: Readonly<{ name: BottomNavIconName }>) {
  const paths = {
    home: "M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z",
    search: "M11 18a7 7 0 1 1 4.95-2.05L21 21l-1.8 1.8-5.05-5.05A6.97 6.97 0 0 1 11 18Z",
    posts: "M6 4h12a1 1 0 0 1 1 1v14l-4-2H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm2 4h8M8 12h6",
    categories: "M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z",
    account: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
  } satisfies Record<BottomNavIconName, string>;

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}

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
            {bottomNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <BottomNavIcon name={link.icon} />
                <span>{link.label}</span>
              </Link>
            ))}
            <span aria-disabled="true">
              <BottomNavIcon name="account" />
              <span>حسابي</span>
            </span>
          </nav>
        </Container>
      }
    >
      {children}
    </AppShell>
  );
}
