const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const migrateOnly = process.argv.includes("--migrate-only");
const shouldMigrate = process.env.RUN_DB_MIGRATIONS === "true" || migrateOnly;
const shouldBuild = !migrateOnly;

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

function runWithPnpm(args) {
  const pkgMgr = readPackageManager();
  const pnpmVersion = pkgMgr.startsWith("pnpm@") ? pkgMgr : "pnpm@11.9.0";

  const localBinPnpm =
    process.platform === "win32"
      ? path.join(root, "node_modules", ".bin", "pnpm.cmd")
      : path.join(root, "node_modules", ".bin", "pnpm");

  const localPnpmCjs = path.join(root, "node_modules", "pnpm", "bin", "pnpm.cjs");

  if (exists(localBinPnpm)) {
    console.log(`[hostinger-build-api] using local pnpm bin: ${localBinPnpm}`);
    if (run(localBinPnpm, args)) return true;
    console.warn("[hostinger-build-api] local pnpm bin failed, trying next method...");
  }

  if (exists(localPnpmCjs)) {
    console.log(`[hostinger-build-api] using local pnpm cjs: ${localPnpmCjs}`);
    if (run(process.execPath, [localPnpmCjs, ...args])) return true;
    console.warn("[hostinger-build-api] local pnpm cjs failed, trying next method...");
  }

  console.log("[hostinger-build-api] trying global pnpm from PATH");
  if (run("pnpm", args)) return true;

  console.log(`[hostinger-build-api] trying npx ${pnpmVersion}`);
  if (run("npx", ["--yes", pnpmVersion, ...args])) return true;

  return false;
}

function chmodIfExists(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;

    const stat = fs.lstatSync(filePath);
    if (!stat.isFile() && !stat.isSymbolicLink()) return false;

    fs.chmodSync(filePath, 0o755);
    console.log(`[hostinger-build-api] chmod 755 ${filePath}`);
    return true;
  } catch (error) {
    console.warn(
      `[hostinger-build-api] Could not chmod ${filePath}: ${error.message}`,
    );
    return false;
  }
}

function fixPrismaEnginePermissions() {
  if (process.platform === "win32") {
    console.log("[hostinger-build-api] skipped Prisma chmod on Windows");
    return;
  }

  const candidates = new Set();

  const directEnginesDir = path.join(
    root,
    "node_modules",
    "@prisma",
    "engines",
  );

  const pnpmDir = path.join(root, "node_modules", ".pnpm");

  function addEnginesFromDir(dir) {
    try {
      if (!fs.existsSync(dir)) return;

      for (const file of fs.readdirSync(dir)) {
        if (
          file.startsWith("schema-engine-") ||
          file.startsWith("query-engine-") ||
          file.startsWith("migration-engine-") ||
          file.startsWith("introspection-engine-") ||
          file.startsWith("libquery_engine-")
        ) {
          candidates.add(path.join(dir, file));
        }
      }
    } catch (error) {
      console.warn(
        `[hostinger-build-api] Could not scan ${dir}: ${error.message}`,
      );
    }
  }

  addEnginesFromDir(directEnginesDir);

  try {
    if (fs.existsSync(pnpmDir)) {
      for (const entry of fs.readdirSync(pnpmDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;

        if (entry.name.startsWith("@prisma+engines@")) {
          addEnginesFromDir(
            path.join(
              pnpmDir,
              entry.name,
              "node_modules",
              "@prisma",
              "engines",
            ),
          );
        }
      }
    }
  } catch (error) {
    console.warn(
      `[hostinger-build-api] Could not scan pnpm dir: ${error.message}`,
    );
  }

  let fixed = 0;
  for (const candidate of candidates) {
    if (chmodIfExists(candidate)) fixed += 1;
  }

  console.log(`[hostinger-build-api] fixed ${fixed} Prisma engine binaries`);
}

const packageManager = readPackageManager();

console.log("[hostinger-build-api] Starting Hostinger API build...");
console.log(`[hostinger-build-api] Platform: ${process.platform}`);
console.log(`[hostinger-build-api] CWD: ${root}`);
console.log(`[hostinger-build-api] packageManager=${packageManager}`);
console.log(`[hostinger-build-api] RUN_DB_MIGRATIONS=${process.env.RUN_DB_MIGRATIONS ?? "unset"}`);
console.log(`[hostinger-build-api] migrateOnly=${migrateOnly}`);

fixPrismaEnginePermissions();

if (shouldMigrate) {
  console.log("[hostinger-build-api] Running prisma migrate deploy...");
  const migrateArgs = ["--filter", "@raina/api", "exec", "prisma", "migrate", "deploy"];

  if (!runWithPnpm(migrateArgs)) {
    console.error("[hostinger-build-api] Migration failed.");
    process.exit(1);
  }

  console.log("[hostinger-build-api] Migration completed successfully.");
}

if (!shouldBuild) {
  console.log("[hostinger-build-api] --migrate-only specified, skipping build.");
  process.exit(0);
}

console.log("[hostinger-build-api] Building @raina/api...");
const buildArgs = ["--filter", "@raina/api", "build"];

if (runWithPnpm(buildArgs)) {
  console.log("[hostinger-build-api] Build completed successfully.");
  process.exit(0);
}

console.error("[hostinger-build-api] Build failed after all methods.");
console.error("[hostinger-build-api] Hostinger should use:");
console.error("  Package manager: npm");
console.error("  Build command: npm run build:api");
console.error("  Output directory: apps/api/dist");
console.error("  Entry file: apps/api/dist/main.js");
process.exit(1);
