const fs = require("fs");
const path = require("path");

if (process.platform === "win32") {
  console.log("[fix-turbo-permissions] skipped on Windows");
  process.exit(0);
}

const root = process.cwd();
const candidates = new Set();

function addCandidate(filePath) {
  if (filePath) {
    candidates.add(filePath);
  }
}

addCandidate(path.join(root, "node_modules/.bin/turbo"));
addCandidate(path.join(root, "node_modules/@turbo/linux-64/bin/turbo"));

const pnpmDir = path.join(root, "node_modules/.pnpm");

try {
  if (fs.existsSync(pnpmDir)) {
    const entries = fs.readdirSync(pnpmDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const name = entry.name;

      if (name.startsWith("@turbo+linux-64@")) {
        addCandidate(
          path.join(
            pnpmDir,
            name,
            "node_modules/@turbo/linux-64/bin/turbo",
          ),
        );
      }

      if (name.startsWith("@turbo+") && name.includes("-64@")) {
        const turboPackageName = name.split("@")[0].replace("+", "/");

        addCandidate(
          path.join(
            pnpmDir,
            name,
            "node_modules",
            turboPackageName,
            "bin/turbo",
          ),
        );
      }
    }
  }
} catch (error) {
  console.warn(
    `[fix-turbo-permissions] Could not scan pnpm store: ${error.message}`,
  );
}

let fixedCount = 0;

for (const file of candidates) {
  try {
    if (!fs.existsSync(file)) {
      continue;
    }

    let stat;
    try {
      stat = fs.lstatSync(file);
    } catch {
      continue;
    }

    if (!stat.isFile() && !stat.isSymbolicLink()) {
      continue;
    }

    fs.chmodSync(file, 0o755);
    fixedCount += 1;
    console.log(`[fix-turbo-permissions] chmod 755 ${file}`);
  } catch (error) {
    console.warn(
      `[fix-turbo-permissions] Could not chmod ${file}: ${error.message}`,
    );
  }
}

if (fixedCount === 0) {
  console.log("[fix-turbo-permissions] no Turbo binaries found");
} else {
  console.log(`[fix-turbo-permissions] fixed ${fixedCount} Turbo binaries`);
}
