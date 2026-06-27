const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();

function readPackageManager() {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(root, "package.json"), "utf8"),
    );
    return pkg.packageManager || "pnpm@11.9.0";
  } catch {
    return "pnpm@11.9.0";
  }
}

function run(command, args, options = {}) {
  console.log(`[hostinger-build-api] $ ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    cwd: root,
    ...options,
  });

  return result.status === 0;
}

function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

const packageManager = readPackageManager();
const pnpmVersion = packageManager.startsWith("pnpm@")
  ? packageManager
  : "pnpm@11.9.0";

const buildArgs = ["--filter", "@raina/api", "build"];

const localBinPnpm =
  process.platform === "win32"
    ? path.join(root, "node_modules", ".bin", "pnpm.cmd")
    : path.join(root, "node_modules", ".bin", "pnpm");

const localPnpmCjs = path.join(root, "node_modules", "pnpm", "bin", "pnpm.cjs");

console.log("[hostinger-build-api] Starting Hostinger API build...");
console.log(`[hostinger-build-api] Platform: ${process.platform}`);
console.log(`[hostinger-build-api] CWD: ${root}`);
console.log(`[hostinger-build-api] packageManager=${packageManager}`);
console.log("[hostinger-build-api] building @raina/api only");

if (exists(localBinPnpm)) {
  console.log(`[hostinger-build-api] using local pnpm bin: ${localBinPnpm}`);
  if (run(localBinPnpm, buildArgs)) {
    console.log("[hostinger-build-api] Build completed successfully.");
    process.exit(0);
  }
  console.warn("[hostinger-build-api] local pnpm bin failed, trying next method...");
}

if (exists(localPnpmCjs)) {
  console.log(`[hostinger-build-api] using local pnpm cjs: ${localPnpmCjs}`);
  if (run(process.execPath, [localPnpmCjs, ...buildArgs])) {
    console.log("[hostinger-build-api] Build completed successfully.");
    process.exit(0);
  }
  console.warn("[hostinger-build-api] local pnpm cjs failed, trying next method...");
}

console.log("[hostinger-build-api] trying global pnpm from PATH");
if (run("pnpm", buildArgs)) {
  console.log("[hostinger-build-api] Build completed successfully.");
  process.exit(0);
}

console.log(`[hostinger-build-api] trying npx ${pnpmVersion}`);
if (run("npx", ["--yes", pnpmVersion, ...buildArgs])) {
  console.log("[hostinger-build-api] Build completed successfully.");
  process.exit(0);
}

console.error("[hostinger-build-api] failed to run pnpm by all available methods");
console.error("[hostinger-build-api] Hostinger should use:");
console.error("  Package manager: npm");
console.error("  Build command: npm run build:api");
console.error("  Output directory: apps/api/dist");
console.error("  Entry file: apps/api/dist/main.js");
process.exit(1);
