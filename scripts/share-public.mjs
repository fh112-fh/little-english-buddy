import { existsSync, writeFileSync } from "node:fs";
import { platform } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { createStaticServer } from "./static-server.mjs";

const port = Number(process.env.PORT || 4173);
const tunnelUrlPattern = /https:\/\/[-a-z0-9]+\.trycloudflare\.com/i;

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html not found. Run npm.cmd run build first.");
  process.exit(1);
}

function cloudflaredBin() {
  const name = platform() === "win32" ? "cloudflared.cmd" : "cloudflared";
  return resolve(join("node_modules", ".bin", name));
}

const server = createStaticServer();
let tunnelProcess;

server.listen(port, "127.0.0.1", () => {
  tunnelProcess = spawn(
    cloudflaredBin(),
    ["tunnel", "--url", `http://127.0.0.1:${port}`, "--no-autoupdate"],
    {
      cwd: process.cwd(),
      shell: platform() === "win32",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  const handleOutput = (chunk) => {
    const text = chunk.toString();
    process.stdout.write(text);
    const match = text.match(tunnelUrlPattern);
    if (match) {
      writeFileSync(".public-share-url", `${match[0]}\n`, "utf8");
      console.log("");
      console.log("Public HTTPS URL:");
      console.log(match[0]);
      console.log("");
      console.log("Send this HTTPS URL in WeChat. It works from different networks while this command stays running.");
    }
  };

  tunnelProcess.stdout.on("data", handleOutput);
  tunnelProcess.stderr.on("data", handleOutput);
  tunnelProcess.on("exit", (code) => {
    server.close();
    if (code) process.exit(code);
  });
});

process.on("SIGINT", () => {
  tunnelProcess?.kill();
  server.close();
  process.exit(0);
});
