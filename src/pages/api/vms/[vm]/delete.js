import auth from "../../../../lib/auth";
import { promises as fs } from "fs";
import path from "path";
import processes from "../../../../lib/processes";

export default async function (req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    const vmPath = path.join(process.cwd(), "vms", req.query.vm);
    await fs.unlink(vmPath);
    processes.kill(req.query.vm);
    res.redirect("/");
  }
}
