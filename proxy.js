const { spawn } = require("child_process");
const fs = require("fs");
const httpProxy = require("http-proxy");
const keys = require("./keys.json");

spawn("npm", ["start"], { stdio: "inherit" });

if (keys.tls) {
  httpProxy
    .createServer({
      target: {
        host: "localhost",
        port: 3000,
      },
      ssl: {
        key: fs.readFileSync(keys.tls.key),
        cert: fs.readFileSync(keys.tls.fullchain),
      },
    })
    .listen(5000);
}
