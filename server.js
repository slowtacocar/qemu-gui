const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "disks/" });
const next = require("next");
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const { exec, spawn } = require("child_process");
const keys = require("./keys.json");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const processes = {};

  server.use(function (req, res, next) {
    if (req.secure) {
      next();
    } else {
      res.redirect("https://" + req.headers.host + req.url);
    }
  });

  server.use(function (req, res, next) {
    if (req.header("Authorization") === keys.header) {
      next();
    } else {
      res.header("WWW-Authenticate", 'Basic realm="QEMU GUI"').sendStatus(401);
    }
  });

  server.get("/vms", (req, res, next) => {
    fs.readdir(path.join(__dirname, "vms"), (err, files) => {
      if (err) {
        next(err);
      } else {
        res.json(files);
      }
    });
  });

  server.get("/vms/:vm", (req, res, next) => {
    fs.readFile(path.join(__dirname, "vms", req.params.vm), (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json(JSON.parse(data));
      }
    });
  });

  server.put("/vms/:vm", (req, res, next) => {
    fs.writeFile(
      path.join(__dirname, "vms", req.params.vm),
      JSON.stringify({
        hda: req.query.hda,
        cdrom: req.query.cdrom,
        memory: req.query.memory,
        port: req.query.port,
        password: req.query.password,
      }),
      (err) => {
        if (err) {
          next(err);
        } else {
          res.sendStatus(201);
        }
      }
    );
  });

  server.delete("/vms/:vm", (req, res, next) => {
    fs.unlink(path.join(__dirname, "vms", req.params.vm), (err) => {
      if (err) {
        next(err);
      } else {
        if (processes[req.params.vm]) {
          processes[req.params.vm][0].kill();
          processes[req.params.vm][1].kill();
        }
        res.sendStatus(204);
      }
    });
  });

  server.get("/vms/:vm/process", (req, res) => {
    res.json(!!(processes[req.params.vm] && processes[req.params.vm][2]));
  });

  server.put("/vms/:vm/process", (req, res, next) => {
    fs.readFile(path.join(__dirname, "vms", req.params.vm), (err, data) => {
      if (err) {
        next(err);
      } else {
        if (processes[req.params.vm]) {
          processes[req.params.vm][0].kill();
          processes[req.params.vm][1].kill();
        }
        const json = JSON.parse(data);
        let args = ["--enable-kvm"];
        if (json.hda !== "") {
          args.push("-hda");
          args.push(path.join(__dirname, "disks", json.hda));
        }
        if (json.cdrom !== "") {
          args.push("-cdrom");
          args.push(path.join(__dirname, "disks", json.cdrom));
        }
        if (json.memory !== "") {
          args.push("-m");
          args.push(json.memory);
        }
        if (json.port !== "") {
          args.push("-spice");
          args.push(
            `port=${parseInt(json.port, 10) - 1000},tls-port=${json.port}${
              json.password !== "" ? `,password=${json.password}` : ""
            },x509-cert-file=/etc/letsencrypt/live/qemu-gui.slowtacocar.com/cert.pem,x509-key-file=/etc/letsencrypt/live/qemu-gui.slowtacocar.com/privkey.pem,x509-cacert-file=/etc/letsencrypt/live/qemu-gui.slowtacocar.com/chain.pem`
          );
        }
        processes[req.params.vm] = [];
        processes[req.params.vm][0] = spawn("qemu-system-x86_64", args);
        processes[req.params.vm][0].on("close", () => {
          processes[req.params.vm][2] = false;
          processes[req.params.vm][1].kill();
        });
        args = [
          parseInt(json.port, 10) + 8000,
          `localhost:${parseInt(json.port, 10) - 1000}`,
          "--cert",
          "/etc/letsencrypt/live/qemu-gui.slowtacocar.com/fullchain.pem",
          "--key",
          "/etc/letsencrypt/live/qemu-gui.slowtacocar.com/privkey.pem",
        ];
        processes[req.params.vm][1] = spawn("websockify", args);
        
        processes[req.params.vm][1].on("close", () => {
          processes[req.params.vm][2] = false;
          processes[req.params.vm][0].kill();
        });
        processes[req.params.vm][2] = true;
        res.sendStatus(201);
      }
    });
  });

  server.delete("/vms/:vm/process", (req, res) => {
    if (processes[req.params.vm]) {
      processes[req.params.vm][0].kill();
      processes[req.params.vm][1].kill();
      processes[req.params.vm][2] = false;
    }
    res.sendStatus(204);
  });

  server.get("/disks", (req, res, next) => {
    fs.readdir(path.join(__dirname, "disks"), (err, files) => {
      if (err) {
        next(err);
      } else {
        res.json(files);
      }
    });
  });

  server.post("/disks", upload.single("file"), (req, res) => {
    res.sendStatus(204);
  });

  server.get("/disks/:disk", (req, res, next) => {
    exec(
      `qemu-img info --output=json "${path.join(
        __dirname,
        "disks",
        req.params.disk
      )}"`,
      (err, stdout) => {
        if (err) {
          next(err);
        } else {
          res.json(JSON.parse(stdout));
        }
      }
    );
  });

  server.put("/disks/:disk", (req, res, next) => {
    exec(
      `qemu-img create "${path.join(__dirname, "disks", req.params.disk)}" "${
        req.query.size
      }"`,
      (err, stdout) => {
        if (err) {
          next(err);
        } else {
          res.send(stdout);
        }
      }
    );
  });

  server.delete("/disks/:disk", (req, res, next) => {
    fs.unlink(path.join(__dirname, "appdisks", req.params.disk), (err) => {
      if (err) {
        next(err);
      } else {
        res.end();
      }
    });
  });

  server.use(express.static("spice-html5"));

  server.all("*", handle);
  app;

  https
    .createServer(
      {
        key: fs.readFileSync(
          "/etc/letsencrypt/live/qemu-gui.slowtacocar.com/privkey.pem"
        ),
        cert: fs.readFileSync(
          "/etc/letsencrypt/live/qemu-gui.slowtacocar.com/fullchain.pem"
        ),
      },
      server
    )
    .listen(8443);
  http.createServer(server).listen(8080);
});
