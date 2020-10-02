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
const tls = false;
const app = next({ dev });
const handle = app.getRequestHandler();

const vmFeatures = [
  {
    name: "hda",
    args: (query, fullQuery) => [
      "-drive",
      `file=disks/${query}` +
        ",format=raw" +
        ",media=disk" +
        (fullQuery.virtio && ",if=virtio"),
    ],
  },
  {
    name: "cdrom",
    args: (query) => ["-drive", `file=disks/${query},format=raw,media=cdrom`],
  },
  {
    name: "cdrom2",
    args: (query) => ["-drive", `file=disks/${query},format=raw,media=cdrom`],
  },
  { name: "memory", args: (query) => ["-m", query] },
  { name: "port", args: () => [] },
  { name: "tlsport", args: () => [] },
  { name: "wssport", args: () => [] },
  {
    name: "password",
    args: (query, fullQuery) => [
      "-spice",
      `password=${query}` +
        (fullQuery.port && `,port=${fullQuery.port}`) +
        (fullQuery.tlsport &&
          `,tls-port=${fullQuery.tlsport}` +
            ",x509-cert-file=/etc/letsencrypt/live/qemu-gui.slowtacocar.com/cert.pem" +
            ",x509-key-file=/etc/letsencrypt/live/qemu-gui.slowtacocar.com/privkey.pem" +
            ",x509-cacert-file=/etc/letsencrypt/live/qemu-gui.slowtacocar.com/chain.pem"),
    ],
  },
  { name: "cores", args: (query) => ["-smp", `cores=${query}`] },
  {
    name: "vdagent",
    args: () => [
      "-device",
      "virtio-serial-pci,id=virtio-serial0,max_ports=16,bus=pci.0,addr=0x5",
      "-chardev",
      "spicevmc,name=vdagent,id=vdagent",
      "-device",
      "virtserialport,nr=1,bus=virtio-serial0.0,chardev=vdagent,name=com.redhat.spice.0",
    ],
  },
  { name: "virtio", args: () => [] },
  { name: "enlightenments", args: () => [] },
];

const processes = {
  processes: {},
  kill: function (key) {
    if (this.processes[key]) {
      for (let i = 0; i < this.processes[key].length - 1; i++) {
        this.processes[key][i].kill();
      }
      this.processes[key][this.processes[key].length - 1] = false;
    }
  },
  running: function (key) {
    return !!(
      this.processes[key] && this.processes[key][this.processes[key].length - 1]
    );
  },
  spawn: function (key, command, args) {
    const process = spawn(command, args);
    process.stdout.on("data", (data) => {
      console.log(`${command}: ${data}`);
    });
    process.stderr.on("data", (data) => {
      console.error(`${command}: ${data}`);
    });
    process.on("close", () => {
      this.kill(key);
    });
    this.processes[key].push(process);
  },
  newProcess: function (key, commandArgs) {
    this.processes[key] = [];
    for (const [command, args] of commandArgs) {
      this.spawn(key, command, args);
    }
    this.processes[key].push(true);
  },
};

app.prepare().then(() => {
  const server = express();

  if (tls) {
    server.use(function (req, res, next) {
      if (req.secure) next();
      else res.redirect("https://" + req.headers.host + req.url);
    });
  }

  server.use(function (req, res, next) {
    if (req.header("Authorization") === keys.key) next();
    else {
      res.header("WWW-Authenticate", 'Basic realm="QEMU GUI"').sendStatus(401);
    }
  });

  server.get("/vms", (req, res, next) => {
    fs.readdir(path.join(__dirname, "vms"), (err, files) => {
      if (err) next(err);
      else res.json(files);
    });
  });

  server.get("/vms/:vm", (req, res, next) => {
    fs.readFile(path.join(__dirname, "vms", req.params.vm), (err, data) => {
      if (err) next(err);
      else res.json(JSON.parse(data));
    });
  });

  server.put("/vms/:vm", (req, res, next) => {
    fs.writeFile(
      path.join(__dirname, "vms", req.params.vm),
      JSON.stringify(req.query),
      (err) => {
        if (err) next(err);
        else res.sendStatus(201);
      }
    );
  });

  server.delete("/vms/:vm", (req, res, next) => {
    fs.unlink(path.join(__dirname, "vms", req.params.vm), (err) => {
      if (err) next(err);
      else {
        processes.kill(req.params.vm);
        res.sendStatus(204);
      }
    });
  });

  server.get("/vms/:vm/process", (req, res) => {
    res.json(processes.running(req.params.vm));
  });

  server.put("/vms/:vm/process", (req, res, next) => {
    fs.readFile(path.join(__dirname, "vms", req.params.vm), (err, data) => {
      if (err) next(err);
      else {
        processes.kill(req.params.vm);
        const json = JSON.parse(data);
        let args = [
          "--enable-kvm",
          "-cpu",
          "host" +
            (json.enlightenments &&
              ",hv_relaxed,hv_spinlocks=0x1fff,hv_vapic,hv_time"),
          "-vga",
          "qxl",
          "-soundhw",
          "hda",
        ];
        for (const feature of vmFeatures) {
          if (json[feature.name]) {
            args = [...args, ...feature.args(json[feature.name], json)];
          }
        }
        const spawns = [["qemu-system-x86_64", args]];
        if (json.wssport) {
          spawns.push(["websockify", [json.wssport, `localhost:${json.port}`]]);
          if (tls) {
            spawns[1][1] = [
              ...spawns[1][1],
              "--cert",
              "/etc/letsencrypt/live/qemu-gui.slowtacocar.com/fullchain.pem",
              "--key",
              "/etc/letsencrypt/live/qemu-gui.slowtacocar.com/privkey.pem",
            ];
          }
        }
        processes.newProcess(req.params.vm, spawns);
        res.sendStatus(201);
      }
    });
  });

  server.delete("/vms/:vm/process", (req, res) => {
    processes.kill(req.params.vm);
    res.sendStatus(204);
  });

  server.get("/disks", (req, res, next) => {
    fs.readdir(path.join(__dirname, "disks"), (err, files) => {
      if (err) next(err);
      else res.json(files);
    });
  });

  server.post("/disks", upload.single("file"), (req, res) => {
    res.sendStatus(204);
  });

  server.get("/disks/:disk", (req, res, next) => {
    exec(
      `qemu-img info --output=json "disks/${req.params.disk}"`,
      (err, stdout) => {
        if (err) next(err);
        else res.json(JSON.parse(stdout));
      }
    );
  });

  server.put("/disks/:disk", (req, res, next) => {
    exec(
      `qemu-img create "disks/${req.params.disk}" "${req.query.size}"`,
      (err, stdout) => {
        if (err) next(err);
        else res.send(stdout);
      }
    );
  });

  server.delete("/disks/:disk", (req, res, next) => {
    fs.unlink(path.join(__dirname, "disks", req.params.disk), (err) => {
      if (err) next(err);
      else res.end();
    });
  });

  server.all("*", handle);
  app;

  if (tls) {
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
  }
  http.createServer(server).listen(80);
});
