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
  console.log(`[hostinger-build-web] $ ${command} ${args.join(" ")}`);

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

const buildArgs = ["--filter", "@raina/web", "build"];

const localBinPnpm =
  process.platform === "win32"
    ? path.join(root, "node_modules", ".bin", "pnpm.cmd")
    : path.join(root, "node_modules", ".bin", "pnpm");

const localPnpmCjs = path.join(root, "node_modules", "pnpm", "bin", "pnpm.cjs");

console.log("[hostinger-build-web] Starting Hostinger web build...");
console.log(`[hostinger-build-web] Platform: ${process.platform}`);
console.log(`[hostinger-build-web] CWD: ${root}`);
console.log(`[hostinger-build-web] packageManager=${packageManager}`);
console.log("[hostinger-build-web] building @raina/web only");

if (exists(localBinPnpm)) {
  console.log(`[hostinger-build-web] using local pnpm bin: ${localBinPnpm}`);
  if (run(localBinPnpm, buildArgs)) {
    console.log("[hostinger-build-web] Build completed successfully.");
    process.exit(0);
  }
  console.warn("[hostinger-build-web] local pnpm bin failed, trying next method...");
}

if (exists(localPnpmCjs)) {
  console.log(`[hostinger-build-web] using local pnpm cjs: ${localPnpmCjs}`);
  if (run(process.execPath, [localPnpmCjs, ...buildArgs])) {
    console.log("[hostinger-build-web] Build completed successfully.");
    process.exit(0);
  }
  console.warn("[hostinger-build-web] local pnpm cjs failed, trying next method...");
}

console.log("[hostinger-build-web] trying global pnpm from PATH");
if (run("pnpm", buildArgs)) {
  console.log("[hostinger-build-web] Build completed successfully.");
  process.exit(0);
}

console.log(`[hostinger-build-web] trying npx ${pnpmVersion}`);
if (run("npx", ["--yes", pnpmVersion, ...buildArgs])) {
  console.log("[hostinger-build-web] Build completed successfully.");
  process.exit(0);
}

console.error("[hostinger-build-web] failed to run pnpm by all available methods");
console.error("[hostinger-build-web] Hostinger should use:");
console.error("  Package manager: npm");
console.error("  Build command: npm run build");
console.error("  Output directory: apps/web/.next");
console.error("  Entry file: apps/web/server.js");
process.exit(1);
