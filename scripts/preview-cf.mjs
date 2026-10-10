#!/usr/bin/env node
/**
 * Cloudflare preview wrapper: forwards SIGINT/SIGTERM to wrangler and surfaces port conflicts.
 */
import { spawn } from "node:child_process";
import net from "node:net";

const PORT = Number(process.env.PREVIEW_PORT ?? 8787);
const HOST = process.env.PREVIEW_HOST ?? "127.0.0.1";

function checkPortFree() {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err) => {
      resolve(err.code === "EADDRINUSE" ? false : true);
    });
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(PORT, HOST);
  });
}

const portFree = await checkPortFree();
if (!portFree) {
  console.error(
    `Port ${HOST}:${PORT} is already in use. Stop the other preview/dev server or set PREVIEW_PORT to a free port.`,
  );
  process.exit(1);
}

const child = spawn("npx", ["opennextjs-cloudflare", "preview"], {
  stdio: "inherit",
  shell: false,
  env: { ...process.env, PORT: String(PORT) },
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (!child.killed) {
    child.kill(signal);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child.on("exit", (code, signal) => {
  if (shuttingDown || signal === "SIGINT") {
    process.exit(0);
  }
  process.exit(code ?? 1);
});
