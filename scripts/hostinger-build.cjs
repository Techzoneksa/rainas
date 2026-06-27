const { spawnSync } = require("child_process");

const app = (process.env.HOSTINGER_APP || "web").toLowerCase().trim();

const target =
  app === "api"
    ? "scripts/hostinger-build-api.cjs"
    : "scripts/hostinger-build-web.cjs";

console.log(`[hostinger-build] HOSTINGER_APP=${app}`);
console.log(`[hostinger-build] running ${target}`);

const result = spawnSync("node", [target], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}
