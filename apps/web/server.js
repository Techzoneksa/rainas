import { createServer } from "http";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import next from "next";

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = Number(process.env.PORT || 3000);
const hostname = "0.0.0.0";

const nextDir = __dirname;
const buildIdPath = join(nextDir, ".next", "BUILD_ID");

console.log(`[server] Starting Raina web...`);
console.log(`[server] dir=${nextDir}`);
console.log(`[server] NODE_ENV=${process.env.NODE_ENV || "unset"}`);
console.log(`[server] PORT=${port}`);
console.log(`[server] BUILD_ID=${existsSync(buildIdPath) ? "found" : "MISSING"}`);

if (!existsSync(buildIdPath)) {
  console.error(`[server] FATAL: .next/BUILD_ID not found at ${buildIdPath}`);
  console.error(`[server] Run 'pnpm --filter @raina/web build' first`);
  process.exit(1);
}

const app = next({ dev: false, dir: nextDir, hostname, port });
const handle = app.getRequestHandler();

process.on("uncaughtException", (err) => {
  console.error("[server] UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[server] UNHANDLED REJECTION:", reason);
});

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, hostname, () => {
      console.log(`[server] Raina web ready http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("[server] Failed to start:", err);
    process.exit(1);
  });
