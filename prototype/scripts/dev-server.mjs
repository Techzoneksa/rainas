import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const build = spawnSync("npm", ["run", "build"], {
  cwd: root,
  shell: true,
  stdio: "inherit"
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const dist = resolve(root, "dist");
const port = Number(process.env.PORT ?? 4173);
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"]
]);

function toFilePath(url) {
  const rawPath = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const cleanPath = normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
  return join(dist, cleanPath === "/" ? "index.html" : cleanPath);
}

const server = createServer(async (req, res) => {
  try {
    const target = toFilePath(req.url ?? "/");
    const info = await stat(target).catch(() => null);
    const filePath = info?.isFile() ? target : join(dist, "index.html");
    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mime.get(extname(filePath)) ?? "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(error instanceof Error ? error.message : "Server error");
  }
});

server.listen(port, () => {
  console.log(`رأينا تعمل الآن على http://localhost:${port}`);
});
