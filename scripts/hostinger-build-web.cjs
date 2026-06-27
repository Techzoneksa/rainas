const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(command, args, options = {}) {
  const joined = [command, ...args].join(" ");
  console.log(`[hostinger-build-web] $ ${joined}`);

  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.status !== 0) {
    const msg = `Failed: ${joined} (exit ${result.status})`;
    return { ok: false, error: msg, status: result.status };
  }

  return { ok: true };
}

function readPackageManager() {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"),
    );
    return pkg.packageManager || "pnpm@11.9.0";
  } catch {
    return "pnpm@11.9.0";
  }
}

function detectPnpm() {
  const result = spawnSync(
    process.platform === "win32" ? "where" : "which",
    ["pnpm"],
    { encoding: "utf8" },
  );
  return result.status === 0;
}

console.log("[hostinger-build-web] Starting Hostinger web build...");
console.log(`[hostinger-build-web] Platform: ${process.platform}`);
console.log(`[hostinger-build-web] CWD: ${process.cwd()}`);

const packageManager = readPackageManager();
console.log(`[hostinger-build-web] packageManager: ${packageManager}`);

const coreEnabled = run("corepack", ["enable"]);
if (!coreEnabled.ok) {
  console.warn(
    "[hostinger-build-web] corepack enable failed (expected on some environments). Trying direct pnpm...",
  );
  if (detectPnpm()) {
    console.log("[hostinger-build-web] Found pnpm in PATH, running build...");
    run("pnpm", ["--filter", "@raina/web", "build"]);
    console.log("[hostinger-build-web] Build completed successfully.");
    process.exit(0);
  } else {
    console.error(
      "[hostinger-build-web] pnpm not found in PATH and corepack enable failed.",
    );
    console.error(
      "[hostinger-build-web] On Hostinger, corepack enable requires write access to Node.js install dir.",
    );
    process.exit(1);
  }
}

const prepared = run("corepack", ["prepare", packageManager, "--activate"]);
if (!prepared.ok) {
  console.error("[hostinger-build-web] corepack prepare failed");
  process.exit(1);
}

console.log("[hostinger-build-web] Corepack ready, building Web...");
run("corepack", ["pnpm", "--filter", "@raina/web", "build"]);
console.log("[hostinger-build-web] Build completed successfully.");
