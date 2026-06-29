import { createServer } from "http";
import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import next from "next";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const port = Number(process.env.PORT || 3000);
const hostname = "0.0.0.0";

console.log(`[server] Starting Raina web...`);
console.log(`[server] dir=${__dirname}`);
console.log(`[server] cwd=${cwd}`);
console.log(`[server] NODE_ENV=${process.env.NODE_ENV || "unset"}`);
console.log(`[server] PORT=${port}`);

const buildIdCandidates = [
  { label: "next to dir", path: join(__dirname, ".next", "BUILD_ID") },
  { label: "next to cwd", path: join(cwd, ".next", "BUILD_ID") },
  { label: "apps/web from cwd", path: join(cwd, "apps", "web", ".next", "BUILD_ID") },
];

let buildIdPath = null;
for (const candidate of buildIdCandidates) {
  if (existsSync(candidate.path)) {
    buildIdPath = candidate.path;
    console.log(`[server] BUILD_ID found (${candidate.label}): ${candidate.path}`);
    break;
  }
}

if (!buildIdPath) {
  console.error(`[server] FATAL: .next/BUILD_ID not found`);
  for (const candidate of buildIdCandidates) {
    console.error(`[server]   checked ${candidate.label}: ${candidate.path} => ${existsSync(candidate.path) ? "EXISTS" : "missing"}`);
  }
  console.error(`[server] Listing ${__dirname}:`);
  try {
    for (const entry of readdirSync(__dirname)) {
      console.error(`[server]   ${entry}`);
    }
  } catch (e) {
    console.error(`[server]   (cannot read dir: ${e.message})`);
  }
  console.error(`[server] Listing ${cwd}:`);
  try {
    for (const entry of readdirSync(cwd)) {
      console.error(`[server]   ${entry}`);
    }
  } catch (e) {
    console.error(`[server]   (cannot read cwd: ${e.message})`);
  }
  process.exit(1);
}

let app;
try {
  app = next({ dev: false, dir: __dirname, hostname, port });
} catch (err) {
  console.error(`[server] next() constructor failed:`, err);
  process.exit(1);
}

const handle = app.getRequestHandler();

process.on("uncaughtException", (err) => {
  console.error(`[server] UNCAUGHT EXCEPTION:`, err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error(`[server] UNHANDLED REJECTION:`, reason);
});

app
  .prepare()
  .then(() => {
    console.log(`[server] app.prepare() succeeded`);
    createServer((req, res) => {
      if (!req.url || req.url === "/__health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
        return;
      }

      const startMs = Date.now();
      const logReq = () => {
        console.log(`[server] ${req.method} ${req.url} ${res.statusCode} ${Date.now() - startMs}ms`);
      };
      res.on("finish", logReq);

      try {
        handle(req, res).catch((err) => {
          res.off("finish", logReq);
          console.error(`[server] REQUEST ERROR: ${req.method} ${req.url}:`, err);
          if (!res.headersSent) {
            try {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Internal Server Error");
            } catch {
              // ignore write errors after headers sent
            }
          }
        });
      } catch (err) {
        res.off("finish", logReq);
        console.error(`[server] REQUEST CRASH: ${req.method} ${req.url}:`, err);
        if (!res.headersSent) {
          try {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          } catch {
            // ignore write errors after headers sent
          }
        }
      }
    }).listen(port, hostname, () => {
      console.log(`[server] Raina web ready http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error(`[server] FAILED: app.prepare() error:`, err);
    process.exit(1);
  });
