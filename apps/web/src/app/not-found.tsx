import Link from "next/link";

export default function NotFound() {
  return (
    <main className="foundation-page">
      <section className="foundation-panel">
        <span className="foundation-badge">404</span>
        <h1 className="foundation-title">الصفحة غير موجودة</h1>
        <p className="foundation-copy">هذا مسار غير معرف في Foundation الحالي.</p>
        <nav className="foundation-links" aria-label="روابط">
          <Link className="foundation-link" href="/">
            العودة
          </Link>
        </nav>
      </section>
    </main>
  );
}
