const fs = require("fs");
const path = require("path");

if (process.platform === "win32") {
  process.exit(0);
}

const root = process.cwd();

function fixPermissions(dir, binaryName) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith("@turbo+") && entry.name.endsWith("-64")) {
          const binDir = path.join(fullPath, "node_modules", "@turbo");
          try {
            const archDirs = fs.readdirSync(binDir, { withFileTypes: true });
            for (const archDir of archDirs) {
              if (archDir.isDirectory() && archDir.name.endsWith("-64")) {
                const turboFile = path.join(
                  binDir,
                  archDir.name,
                  "bin",
                  "turbo",
                );
                if (fs.existsSync(turboFile)) {
                  fs.chmodSync(turboFile, 0o755);
                  console.log(`[fix-turbo-permissions] chmod 755 ${turboFile}`);
                }
              }
            }
          } catch {
            // no @turbo subfolder found
          }
        }
        if (entry.name.includes("@") || entry.name === binaryName) {
          const binFile = path.join(fullPath, "bin", binaryName);
          if (fs.existsSync(binFile)) {
            fs.chmodSync(binFile, 0o755);
            console.log(`[fix-turbo-permissions] chmod 755 ${binFile}`);
          }
        }
      }
    }
  } catch {
    // directory not found
  }
}

const pnpmStore = path.join(root, "node_modules", ".pnpm");
if (fs.existsSync(pnpmStore)) {
  fixPermissions(pnpmStore, "turbo");
}

const localBin = path.join(root, "node_modules", ".bin", "turbo");
if (fs.existsSync(localBin)) {
  try {
    fs.chmodSync(localBin, 0o755);
    console.log(`[fix-turbo-permissions] chmod 755 ${localBin}`);
  } catch (error) {
    console.warn(
      `[fix-turbo-permissions] Could not chmod ${localBin}: ${error.message}`,
    );
  }
}
