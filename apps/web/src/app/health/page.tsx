import { webAppConfig } from "@/config/app";

export default function HealthPage() {
  const buildTime = new Date().toISOString();

  return (
    <main className="foundation-page">
      <section className="foundation-panel" aria-labelledby="web-health-title">
        <span className="foundation-badge">Health</span>
        <h1 id="web-health-title" className="foundation-title">
          {webAppConfig.name}
        </h1>
        <p className="foundation-copy">Environment: {webAppConfig.environment}</p>
        <p className="foundation-copy">Status: {webAppConfig.status}</p>
        <p className="foundation-copy">Build timestamp: {buildTime}</p>
      </section>
    </main>
  );
}
