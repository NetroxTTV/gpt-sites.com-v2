const { spawn } = require("node:child_process");
const { resolve } = require("node:path");

const port = process.env.PORT || "4173";
const viteBin = resolve(__dirname, "..", "node_modules", "vite", "bin", "vite.js");

const child = spawn(
  process.execPath,
  [viteBin, "preview", "--host", "0.0.0.0", "--port", port],
  { stdio: "inherit" }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
