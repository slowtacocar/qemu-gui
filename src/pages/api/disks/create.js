import auth from "../../../lib/auth";
import { execSync } from "child_process";
import path from "path";

export default async function (req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    const diskPath = path.join(process.cwd(), "disks", req.body.name);
    execSync(`qemu-img create "${diskPath}" "${req.body.size}"`);
    res.redirect("/disks");
  }
}
