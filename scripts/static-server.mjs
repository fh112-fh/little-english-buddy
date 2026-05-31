import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { networkInterfaces } from "node:os";
import { extname, join, resolve } from "node:path";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

export function localAddresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter(Boolean)
    .filter((item) => item.family === "IPv4" && !item.internal)
    .map((item) => item.address);
}

export function createStaticServer({ directory = "dist" } = {}) {
  const distDir = resolve(directory);

  return createServer((request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);
    const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const requested = resolve(distDir, cleanPath);
    const indexPath = join(distDir, "index.html");
    const insideDist =
      requested === distDir ||
      requested.startsWith(`${distDir}\\`) ||
      requested.startsWith(`${distDir}/`);

    if (!insideDist) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const filePath =
      existsSync(requested) && statSync(requested).isFile() ? requested : indexPath;
    const type = mimeTypes[extname(filePath)] || "application/octet-stream";

    response.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "no-store",
    });
    createReadStream(filePath).pipe(response);
  });
}
