const express = require("express");
const next = require("next");
const crypto = require("crypto");
const keys = require("../keys.json");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

function authenticate(key) {
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  if (keys.key === hash) {
    return true;
  }
}

app.prepare().then(() => {
  const server = express();

  server.get("/api", (req, res) => {
    if (authenticate(req.query.key)) {
      res.send("hi");
    } else {
      res.send("no");
    }
  });
  server.all("*", handle);

  server.listen(port);
});
