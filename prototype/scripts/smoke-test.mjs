import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "dist/index.html",
  "dist/raina-standalone.html",
  "dist/src/app.js",
  "dist/src/data.js",
  "dist/src/state.js",
  "dist/src/styles.css",
  "dist/raina_logo.svg"
];
const requiredRoutes = [
  "/",
  "/splash",
  "/onboarding",
  "/login",
  "/verify-otp",
  "/home",
  "/search",
  "/categories",
  "/create",
  "/drafts",
  "/compare",
  "/saved",
  "/saved/lists",
  "/following",
  "/notifications",
  "/profile",
  "/profile/edit",
  "/settings",
  "/settings/privacy",
  "/settings/notifications",
  "/help",
  "/terms",
  "/privacy"
];
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

const issues = [];

for (const file of requiredFiles) {
  await access(resolve(root, file)).catch(() => issues.push(`${file} missing`));
}

const index = await readFile(resolve(root, "dist", "index.html"), "utf8");
const standalone = await readFile(resolve(root, "dist", "raina-standalone.html"), "utf8");
const app = await readFile(resolve(root, "dist", "src", "app.js"), "utf8");
const data = await readFile(resolve(root, "dist", "src", "data.js"), "utf8");
const state = await readFile(resolve(root, "dist", "src", "state.js"), "utf8");
const css = await readFile(resolve(root, "dist", "src", "styles.css"), "utf8");
const combined = [index, standalone, app, data, state, css].join("\n");

if (!index.includes('lang="ar"') || !index.includes('dir="rtl"')) {
  issues.push("Arabic RTL document attributes missing");
}

if (!index.includes("./src/app.js") || !index.includes("./src/styles.css")) {
  issues.push("Direct-file asset paths missing");
}

if (!standalone.includes("<script>") || standalone.includes('src="./src/app.js"') || standalone.includes("import {")) {
  issues.push("Standalone file must inline app code without imports");
}

for (const route of requiredRoutes) {
  if (!app.includes(route)) issues.push(`Route signal missing: ${route}`);
}

for (const dynamicSignal of ["/category/", "/product/", "/post/", "/saved/lists/", "/profile/"]) {
  if (!app.includes(dynamicSignal)) issues.push(`Dynamic route signal missing: ${dynamicSignal}`);
}

if (!data.includes("1234") || !data.includes("501234567")) {
  issues.push("Demo OTP or phone missing");
}

if (!state.includes("localStorage")) {
  issues.push("LocalStorage persistence missing");
}

if (!css.includes("overflow-x: hidden")) {
  issues.push("Horizontal overflow guard missing");
}

for (const term of blocked) {
  if (combined.includes(term)) issues.push("Blocked term found in build");
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log("فحص العرض المحلي اكتمل بنجاح");
