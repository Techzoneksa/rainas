import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scanRoots = [resolve(root, "src"), resolve(root, "index.html")];
const blocked = [
  [82, 101, 118, 105, 101, 119, 108, 121],
  [114, 101, 118, 105, 101, 119, 108, 121],
  [76, 105, 107, 101],
  [76, 105, 107, 101, 115],
  [108, 105, 107, 101],
  [108, 105, 107, 101, 115],
  [72, 101, 97, 114, 116],
  [104, 101, 97, 114, 116]
].map((codes) => String.fromCharCode(...codes));

async function listFiles(path) {
  if (extname(path)) return [path];
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => listFiles(join(path, entry.name)))
  );
  return nested.flat();
}

const files = (await Promise.all(scanRoots.map((path) => listFiles(path)))).flat();
const issues = [];

for (const file of files) {
  if (![".ts", ".css", ".html"].includes(extname(file))) continue;
  const text = await readFile(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/\s+$/.test(line)) issues.push(`${file}:${index + 1} trailing whitespace`);
  });
  for (const term of blocked) {
    if (text.includes(term)) issues.push(`${file}: blocked term found`);
  }
}

const indexText = await readFile(resolve(root, "index.html"), "utf8");
if (!indexText.includes('lang="ar"') || !indexText.includes('dir="rtl"')) {
  issues.push("index.html must declare Arabic RTL");
}

const cssText = await readFile(resolve(root, "src", "styles.css"), "utf8");
if (!cssText.includes("overflow-x: hidden")) {
  issues.push("styles.css must prevent horizontal overflow");
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log("الفحص الخفيف اكتمل بنجاح");
