#!/usr/bin/env node
/**
 * Cloudflare preview wrapper: forwards SIGINT/SIGTERM to the wrangler process group.
 */
import { execFile } from "node:child_process";
import { spawn } from "node:child_process";
import net from "node:net";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

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

function waitForPortFree(timeoutMs = 15_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (await checkPortFree()) {
        resolve(true);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Port ${HOST}:${PORT} still in use after shutdown`));
        return;
      }
      setTimeout(tick, 200);
    };
    tick();
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
  detached: true,
  env: { ...process.env, PORT: String(PORT) },
});

let shuttingDown = false;

function killProcessGroup(signal) {
  if (!child.pid) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    child.kill(signal);
  }
}

async function killListenersOnPort() {
  if (process.platform !== "linux") return;
  try {
    const { stdout } = await execFileAsync("fuser", [`${PORT}/tcp`]);
    for (const pid of stdout.trim().split(/\s+/)) {
      if (!pid) continue;
      try {
        process.kill(Number(pid), "SIGKILL");
      } catch {
        // already exited
      }
    }
  } catch {
    // nothing listening
  }
}

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  killProcessGroup(signal);
  const forceTimer = setTimeout(() => killProcessGroup("SIGKILL"), 5_000);
  child.once("exit", () => clearTimeout(forceTimer));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child.on("exit", async (code, signal) => {
  if (shuttingDown) {
    await killListenersOnPort();
  }
  try {
    if (shuttingDown) await waitForPortFree();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
  if (shuttingDown || signal === "SIGINT" || signal === "SIGTERM") {
    process.exit(0);
  }
  process.exit(code ?? 1);
});
