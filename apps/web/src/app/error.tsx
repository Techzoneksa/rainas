"use client";

export default function ErrorPage({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <main className="foundation-page">
      <section className="foundation-panel">
        <span className="foundation-badge">Error</span>
        <h1 className="foundation-title">حدث خطأ غير متوقع</h1>
        <p className="foundation-copy">{error.message}</p>
        <button className="foundation-link" type="button" onClick={reset}>
          إعادة المحاولة
        </button>
      </section>
    </main>
  );
}
