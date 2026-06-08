import Link from "next/link";

import { adminAppConfig } from "@/config/app";

export default function Page() {
  return (
    <main className="foundation-page">
      <section className="foundation-panel" aria-labelledby="admin-foundation-title">
        <span className="foundation-badge">{adminAppConfig.foundationLabel}</span>
        <h1 id="admin-foundation-title" className="foundation-title">
          {adminAppConfig.name}
        </h1>
        <p className="foundation-copy">{adminAppConfig.message}</p>
        <nav className="foundation-links" aria-label="روابط فحص داخلية">
          <Link className="foundation-link" href="/health">
            Health
          </Link>
        </nav>
      </section>
    </main>
  );
}
