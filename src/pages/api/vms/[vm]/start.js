import auth from "../../../../lib/auth";
import { promises as fs } from "fs";
import path from "path";
import processes from "../../../../lib/processes";
import vmFeatures from "../../../../lib/features";
import { qemuLogs, websockifyLogs } from "../../../../lib/logs";
import keys from "../../../../../keys.json";

async function startVM(req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    const vmPath = path.join(process.cwd(), "vms", req.query.vm);
    const data = await fs.readFile(vmPath);
    processes.kill(req.query.vm);
    const json = JSON.parse(data);
    const args = [
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
        args.push(...feature.args(json[feature.name], json));
      }
    }
    const spawns = [["qemu-system-x86_64", args, qemuLogs]];
    if (json.wssport) {
      spawns.push([
        "websockify",
        [json.wssport, `localhost:${json.port}`],
        websockifyLogs,
      ]);
      if (keys.tls) {
        spawns[1][1] = [
          ...spawns[1][1],
          "--cert",
          keys.tls.fullchain,
          "--key",
          keys.tls.key,
        ];
      }
    }
    processes.newProcess(req.query.vm, spawns);
    res.redirect("/");
  }
}

export default startVM;
