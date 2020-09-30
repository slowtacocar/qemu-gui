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
    if (req.header("Authorization") === keys.key) {
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
        cores: req.query.cores,
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
        let args = [
          "--enable-kvm",
          "-cpu",
          "host",
          "-device",
          "virtio-serial-pci,id=virtio-serial0,max_ports=16,bus=pci.0,addr=0x5",
          "-chardev",
          "spicevmc,name=vdagent,id=vdagent",
          "-device",
          "virtserialport,nr=1,bus=virtio-serial0.0,chardev=vdagent,name=com.redhat.spice.0",
          "-vga",
          "qxl",
        ];
        if (json.hda !== "") {
          args.push("-drive");
          args.push(`file=${path.join(__dirname, "disks", json.hda)},format=raw,media=disk,if=virtio`);
        }
        if (json.cdrom !== "") {
          args.push("-drive");
          args.push(`file=${path.join(__dirname, "disks", json.cdrom)},format=raw,media=cdrom,if=virtio`);
        }
        if (json.memory !== "") {
          args.push("-m");
          args.push(json.memory);
        }
        if (json.port !== "") {
          args.push("-spice");
          args.push(
            `port=${json.port}${
              json.password !== "" ? `,password=${json.password}` : ""
            }`
          );
        }
        if (json.cores !== "") {
          args.push("-smp");
          args.push(json.cores);
        }
        processes[req.params.vm] = [];
        processes[req.params.vm][0] = spawn("qemu-system-x86_64", args);
        processes[req.params.vm][0].on("close", () => {
          processes[req.params.vm][2] = false;
          processes[req.params.vm][1].kill();
        });
        processes[req.params.vm][0].stdout.on('data', (data) => {
          console.log(`qemu-system-x86_64: ${data}`);
        });
        processes[req.params.vm][0].stderr.on('data', (data) => {
          console.error(`qemu-system-x86_64: ${data}`);
        });
        args = [
          parseInt(json.port, 10) - 100,
          `localhost:${json.port}`,
          "--cert",
          "/etc/letsencrypt/live/qemu-gui.slowtacocar.com/fullchain.pem",
          "--key",
          "/etc/letsencrypt/live/qemu-gui.slowtacocar.com/privkey.pem",
        ];
        processes[req.params.vm][1] = spawn("websockify", args);
        processes[req.params.vm][1].stdout.on('data', (data) => {
          console.log(`websockify: ${data}`);
        });
        processes[req.params.vm][1].stderr.on('data', (data) => {
          console.error(`websockify: ${data}`);
        });
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
    .listen(443);
  http.createServer(server).listen(80);
});
