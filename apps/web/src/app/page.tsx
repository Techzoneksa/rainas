import Link from "next/link";

import { webAppConfig } from "@/config/app";

export default function Page() {
  return (
    <main className="foundation-page">
      <section className="foundation-panel" aria-labelledby="web-foundation-title">
        <span className="foundation-badge">{webAppConfig.foundationLabel}</span>
        <h1 id="web-foundation-title" className="foundation-title">
          {webAppConfig.name}
        </h1>
        <p className="foundation-copy">{webAppConfig.message}</p>
        <nav className="foundation-links" aria-label="روابط فحص داخلية">
          <Link className="foundation-link" href="/health">
            Health
          </Link>
        </nav>
      </section>
    </main>
  );
}
