"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AppShell, Container } from "@raina/ui";

import { navCategories } from "@/lib/config/discovery";

const bottomNavLinks: { href: Route; label: string; icon: BottomNavIconName }[] = [
  { href: "/" as Route, label: "الرئيسية", icon: "home" },
  { href: "/products" as Route, label: "البحث", icon: "search" },
  { href: "/posts" as Route, label: "المنشورات", icon: "posts" },
  { href: "/categories" as Route, label: "التصنيفات", icon: "categories" }
];

type BottomNavIconName = "home" | "search" | "posts" | "categories" | "account";

function BottomNavIcon({ name }: Readonly<{ name: BottomNavIconName }>) {
  switch (name) {
    case "home":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12l9-9 9 9" />
          <path d="M5 10v10a1 1 0 001 1h3v-5a1 1 0 011-1h2a1 1 0 011 1v5h3a1 1 0 001-1V10" />
        </svg>
      );
    case "search":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5L21 21" />
        </svg>
      );
    case "posts":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h12" />
        </svg>
      );
    case "categories":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "account":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0112 0v1" />
        </svg>
      );
    default:
      return null;
  }
}

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppShell
      header={
        <>
          <header className="web-header-top">
            <Container size="lg" className="web-header-top__inner">
              <div className="web-header-top__start">
                <button
                  type="button"
                  className="web-header-menu-btn"
                  aria-label="القائمة"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <Link className="web-header-logo" href="/">
                  <Image src="/raina_logo.svg" alt="Raina — رأينا" className="web-header-logo__img" width={90} height={36} unoptimized />
                </Link>
                <div className="web-header-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>الرياض</span>
                </div>
              </div>
              <div className="web-header-top__center">
                <div className="web-header-search">
                  <svg className="web-header-search__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <input type="search" className="web-header-search__input" placeholder="ابحث عن منتجات وتجارب..." aria-label="بحث" />
                </div>
              </div>
              <div className="web-header-top__end">
                <Link href="/products" className="web-header-icon-btn" aria-label="المفضلة">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <span className="web-header-icon-btn" aria-label="الإشعارات">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <Link href="/" className="web-header-icon-btn" aria-label="حسابي">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 21v-1a6 6 0 0112 0v1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </Link>
              </div>
            </Container>
          </header>
          <nav className="web-header-nav" aria-label="التصنيفات">
            <Container size="lg" className="web-header-nav__inner">
              <div className="web-header-nav__menu">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>جميع الأقسام</span>
              </div>
              <ul className="web-header-nav__list">
                {navCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={cat.href as Route}>{cat.nameAr}</Link>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>
          {menuOpen && (
            <div className="web-header-menu-overlay" onClick={() => setMenuOpen(false)}>
              <nav className="web-header-menu-drawer" onClick={(e) => e.stopPropagation()} aria-label="التصنيفات">
                <div className="web-header-menu-drawer__head">
                  <strong>جميع الأقسام</strong>
                  <button type="button" onClick={() => setMenuOpen(false)} aria-label="إغلاق">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <ul className="web-header-menu-drawer__list">
                  {navCategories.map((cat) => (
                    <li key={cat.slug}>
                      <Link href={cat.href as Route} onClick={() => setMenuOpen(false)}>
                        {cat.nameAr}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
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
