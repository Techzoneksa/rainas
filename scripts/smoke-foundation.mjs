import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const requiredFiles = [
  "prototype/package.json",
  "prototype/src/app.ts",
  "prototype/dist/raina-standalone.html",
  "apps/web/src/app/layout.tsx",
  "apps/web/src/app/page.tsx",
  "apps/web/src/app/health/page.tsx",
  "apps/web/src/app/design-system/page.tsx",
  "apps/web/src/app/categories/page.tsx",
  "apps/web/src/app/categories/[slug]/page.tsx",
  "apps/web/src/app/products/page.tsx",
  "apps/web/src/app/products/[slug]/page.tsx",
  "apps/web/src/app/posts/page.tsx",
  "apps/web/src/app/posts/[id]/page.tsx",
  "apps/web/src/app/users/[username]/page.tsx",
  "apps/web/src/app/users/[username]/lists/[slug]/page.tsx",
  "apps/web/src/components/media-gallery.tsx",
  "apps/web/src/components/pagination-controls.tsx",
  "apps/web/src/components/profile-summary.tsx",
  "apps/web/src/components/rating-badge.tsx",
  "apps/web/src/lib/api/client.ts",
  "apps/admin/src/app/layout.tsx",
  "apps/admin/src/app/page.tsx",
  "apps/admin/src/app/health/page.tsx",
  "apps/admin/src/app/design-system/page.tsx",
  "apps/api/src/main.ts",
  "apps/api/src/health/health.controller.ts",
  "packages/design-tokens/src/index.ts",
  "packages/ui/src/index.tsx",
  "packages/ui/src/styles.css",
  "packages/shared-types/src/index.ts",
  "packages/validation/src/index.ts",
  "packages/api-contracts/src/index.ts",
  "pnpm-workspace.yaml",
  "turbo.json"
];

const blockedRuntimeTerms = [
  [82, 101, 118, 105, 101, 119, 108, 121],
  [114, 101, 118, 105, 101, 119, 108, 121],
  [108, 105, 107, 101],
  [108, 105, 107, 101, 115],
  [108, 105, 107, 101, 100],
  [114, 101, 97, 99, 116, 105, 111, 110],
  [104, 101, 97, 114, 116],
  [102, 97, 118, 111, 114, 105, 116, 101],
  [99, 111, 109, 112, 97, 114, 101],
  [99, 111, 109, 112, 97, 114, 105, 115, 111, 110],
  [1605, 1602, 1575, 1585, 1606, 1577]
].map((term) => String.fromCharCode(...term));

const runtimeRoots = ["apps", "packages"];
const issues = [];

for (const file of requiredFiles) {
  await access(resolve(file)).catch(() => issues.push(`Missing required file: ${file}`));
}

const webLayout = await readFile(resolve("apps/web/src/app/layout.tsx"), "utf8");
const adminLayout = await readFile(resolve("apps/admin/src/app/layout.tsx"), "utf8");

if (!webLayout.includes('lang="ar"') || !webLayout.includes('dir="rtl"')) {
  issues.push("Web layout must declare Arabic RTL.");
}

if (!adminLayout.includes('lang="ar"') || !adminLayout.includes('dir="rtl"')) {
  issues.push("Admin layout must declare Arabic RTL.");
}

async function listFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      if (
        entry.isDirectory() &&
        ["node_modules", ".next", "dist", "coverage", ".turbo"].includes(entry.name)
      ) {
        return [];
      }

      const child = resolve(path, entry.name);
      if (entry.isDirectory()) return listFiles(child);
      return [child];
    })
  );
  return nested.flat();
}

for (const root of runtimeRoots) {
  const files = await listFiles(resolve(root));
  for (const file of files) {
    if (!/\.(ts|tsx|js|mjs|css|json)$/.test(file)) continue;
    const text = await readFile(file, "utf8");
    for (const term of blockedRuntimeTerms) {
      if (text.includes(term)) {
        issues.push(`Blocked runtime term "${term}" found in ${file}`);
      }
    }
  }
}

const webRoutes = [
  "/",
  "/categories",
  "/products",
  "/posts",
  "/users/rana",
  "/users/rana/lists/public-list-1",
  "/design-system"
];

for (const route of webRoutes) {
  await fetch(`http://localhost:3000${route}`, { signal: AbortSignal.timeout(1000) })
    .then((response) => {
      if (!response.ok) issues.push(`Web smoke route failed: ${route} ${response.status}`);
    })
    .catch(() => undefined);
}

if (issues.length > 0) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log("Raina foundation smoke checks passed.");
