import { copyFile, cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await mkdir(resolve(dist, "src"), { recursive: true });
await copyFile(resolve(root, "index.html"), resolve(dist, "index.html"));
await copyFile(resolve(root, "src", "styles.css"), resolve(dist, "src", "styles.css"));
await copyFile(resolve(root, "raina_logo.svg"), resolve(dist, "raina_logo.svg"));
await cp(resolve(root, "assets"), resolve(dist, "assets"), { recursive: true, force: true });

const css = await readFile(resolve(root, "src", "styles.css"), "utf8");
const dataJs = (await readFile(resolve(dist, "src", "data.js"), "utf8")).replace(/^export const /gm, "const ");
const stateJs = (await readFile(resolve(dist, "src", "state.js"), "utf8"))
  .replace(/^import .+;\r?\n/gm, "")
  .replace(/^export function /gm, "function ");
const appJs = (await readFile(resolve(dist, "src", "app.js"), "utf8")).replace(/^import .+;\r?\n/gm, "");
const standaloneScript = [dataJs, stateJs, appJs].join("\n").replace(/<\/script/gi, "<\\/script");

await writeFile(
  resolve(dist, "raina-standalone.html"),
  `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#f8f8f6" />
    <title>رأينا | Raina</title>
    <style>${css}</style>
  </head>
  <body>
    <noscript>يحتاج تطبيق رأينا إلى تفعيل JavaScript لعرض التجربة التفاعلية.</noscript>
    <main id="app" aria-live="polite"></main>
    <script>${standaloneScript}</script>
  </body>
</html>
`,
  "utf8"
);

console.log("تم تجهيز نسخة العرض داخل dist");
