const express = require("express");
const path = require("node:path");
const fs = require("node:fs");

const app = express();
const port = Number(process.env.PORT) || 4000;
const host = "0.0.0.0";
const distDir = path.resolve(__dirname, "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.warn("dist/index.html was not found. Run 'npm run build' before 'npm start'.");
}

app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

app.use(
  express.static(distDir, {
    index: false,
    maxAge: "1h",
    etag: true,
  })
);

app.get("*", (_req, res) => {
  res.sendFile(indexPath);
});

const server = app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});
