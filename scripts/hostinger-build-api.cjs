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

  return result;
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
    const r = run(localBinPnpm, args);
    if (r.status === 0) return r;
    console.warn("[hostinger-build-api] local pnpm bin failed, trying next method...");
  }

  if (exists(localPnpmCjs)) {
    console.log(`[hostinger-build-api] using local pnpm cjs: ${localPnpmCjs}`);
    const r = run(process.execPath, [localPnpmCjs, ...args]);
    if (r.status === 0) return r;
    console.warn("[hostinger-build-api] local pnpm cjs failed, trying next method...");
  }

  console.log("[hostinger-build-api] trying global pnpm from PATH");
  const r = run("pnpm", args);
  if (r.status === 0) return r;

  console.log(`[hostinger-build-api] trying npx ${pnpmVersion}`);
  return run("npx", ["--yes", pnpmVersion, ...args]);
}

function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
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

function parseDbUrl(url) {
  try {
    if (!url || typeof url !== "string") return null;
    const match = url.match(/^postgres(?:ql)?:\/\/([^:]+):[^@]+@([^:]+):(\d+)\/([^?]+)/);
    if (!match) return { raw: "(unparseable)" };
    return { host: match[2], port: match[3], database: match[4] };
  } catch {
    return null;
  }
}

function printDbDiagnostic() {
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  console.log("");
  console.log("[hostinger-build-api] === Database Environment Diagnostic ===");
  console.log(`[hostinger-build-api] DATABASE_URL   ${dbUrl ? "set" : "NOT SET"}`);
  console.log(`[hostinger-build-api] DIRECT_URL     ${directUrl ? "set" : "NOT SET"}`);

  const db = parseDbUrl(dbUrl);
  if (db) {
    console.log(`[hostinger-build-api] DATABASE_URL   -> host=${db.host} port=${db.port} database=${db.database}`);
  } else if (dbUrl) {
    console.log(`[hostinger-build-api] DATABASE_URL   -> (unable to parse host/port/database)`);
  }

  const dd = parseDbUrl(directUrl);
  if (dd) {
    console.log(`[hostinger-build-api] DIRECT_URL     -> host=${dd.host} port=${dd.port} database=${dd.database}`);
  } else if (directUrl) {
    console.log(`[hostinger-build-api] DIRECT_URL     -> (unable to parse host/port/database)`);
  }

  console.log("[hostinger-build-api] =======================================");
  console.log("");
}

function printSchemaPath() {
  const paths = [
    path.join(root, "apps", "api", "prisma", "schema.prisma"),
    path.join(root, "prisma", "schema.prisma"),
  ];
  for (const p of paths) {
    if (exists(p)) return p;
  }
  return "(not found)";
}

function runPrismaStep(label, args) {
  const migrateArgs = ["--filter", "@raina/api", "exec", ...args];
  const fullLabel = `prisma ${args.join(" ")}`;

  console.log(`[hostinger-build-api] >>> Step: ${label}`);
  console.log(`[hostinger-build-api] >>> Command: pnpm --filter @raina/api exec ${fullLabel}`);

  const result = runWithPnpm(migrateArgs);
  const exitCode = result ? result.status : -1;

  if (exitCode !== 0) {
    console.error(`[hostinger-build-api] ### FAILED: ${fullLabel}`);
    console.error(`[hostinger-build-api] ### Exit code: ${exitCode}`);
    console.error(`[hostinger-build-api] ### Schema path: ${printSchemaPath()}`);

    const dbUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DIRECT_URL;
    const db = parseDbUrl(dbUrl);
    const dd = parseDbUrl(directUrl);

    if (db) {
      console.error(`[hostinger-build-api] ### DATABASE_URL host=${db.host} port=${db.port} database=${db.database}`);
    } else if (dbUrl) {
      console.error(`[hostinger-build-api] ### DATABASE_URL is set but could not parse (check format)`);
    } else {
      console.error(`[hostinger-build-api] ### DATABASE_URL is NOT SET`);
    }

    if (dd) {
      console.error(`[hostinger-build-api] ### DIRECT_URL host=${dd.host} port=${dd.port} database=${dd.database}`);
    } else if (directUrl) {
      console.error(`[hostinger-build-api] ### DIRECT_URL is set but could not parse (check format)`);
    } else {
      console.error(`[hostinger-build-api] ### DIRECT_URL is NOT SET`);
    }

    if (!dbUrl) {
      console.error(`[hostinger-build-api] ### TIP: Set DATABASE_URL in Hostinger env vars`);
    }
    if (!directUrl && dbUrl) {
      console.error(`[hostinger-build-api] ### TIP: Set DIRECT_URL to the same value as DATABASE_URL for direct migrations`);
    }
  }

  return result;
}

const packageManager = readPackageManager();

console.log("[hostinger-build-api] Starting Hostinger API build...");
console.log(`[hostinger-build-api] Platform: ${process.platform}`);
console.log(`[hostinger-build-api] CWD: ${root}`);
console.log(`[hostinger-build-api] packageManager=${packageManager}`);
console.log(`[hostinger-build-api] RUN_DB_MIGRATIONS=${process.env.RUN_DB_MIGRATIONS ?? "unset"}`);
console.log(`[hostinger-build-api] migrateOnly=${migrateOnly}`);

printDbDiagnostic();

fixPrismaEnginePermissions();

if (shouldMigrate) {
  console.log("[hostinger-build-api] >>> RUN_DB_MIGRATIONS=true, running migrations...");

  const statusResult = runPrismaStep("prisma migrate status", ["prisma", "migrate", "status"]);
  if (!statusResult || statusResult.status !== 0) {
    process.exit(1);
  }

  const deployResult = runPrismaStep("prisma migrate deploy", ["prisma", "migrate", "deploy"]);
  if (!deployResult || deployResult.status !== 0) {
    process.exit(1);
  }

  console.log("[hostinger-build-api] Migrations completed successfully.");
} else {
  console.log("[hostinger-build-api] >>> RUN_DB_MIGRATIONS is not true. Skipping migrations.");
}

console.log("[hostinger-build-api] >>> Step: prisma generate");
const generateArgs = ["--filter", "@raina/api", "exec", "prisma", "generate"];
const generateResult = runWithPnpm(generateArgs);
if (!generateResult || generateResult.status !== 0) {
  console.error("[hostinger-build-api] ### FAILED: prisma generate");
  process.exit(1);
}
console.log("[hostinger-build-api] prisma generate completed successfully.");

if (!shouldBuild) {
  console.log("[hostinger-build-api] --migrate-only specified, skipping build.");
  process.exit(0);
}

console.log("[hostinger-build-api] >>> Step: tsc build");
const buildArgs = ["--filter", "@raina/api", "build"];
const buildResult = runWithPnpm(buildArgs);

if (buildResult && buildResult.status === 0) {
  console.log("[hostinger-build-api] Build completed successfully.");
  process.exit(0);
}

console.error("[hostinger-build-api] ### FAILED: tsc build");
console.error("[hostinger-build-api] Build failed after all methods.");
console.error("[hostinger-build-api] Hostinger should use:");
console.error("  Package manager: npm");
console.error("  Build command: npm run build:api");
console.error("  Output directory: apps/api/dist");
console.error("  Entry file: apps/api/dist/main.js");
process.exit(1);
