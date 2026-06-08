import { adminAppConfig } from "@/config/app";

export default function HealthPage() {
  const buildTime = new Date().toISOString();

  return (
    <main className="foundation-page">
      <section className="foundation-panel" aria-labelledby="admin-health-title">
        <span className="foundation-badge">Health</span>
        <h1 id="admin-health-title" className="foundation-title">
          {adminAppConfig.name}
        </h1>
        <p className="foundation-copy">Environment: {adminAppConfig.environment}</p>
        <p className="foundation-copy">Status: {adminAppConfig.status}</p>
        <p className="foundation-copy">Build timestamp: {buildTime}</p>
      </section>
    </main>
  );
}
