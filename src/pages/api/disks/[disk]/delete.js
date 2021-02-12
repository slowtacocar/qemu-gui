import auth from "../../../../lib/auth";
import { promises as fs } from "fs";
import path from "path";

async function deleteDisk(req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    const diskPath = path.join(process.cwd(), "disks", req.query.disk);
    await fs.unlink(diskPath);
    res.redirect("/disks");
  }
}

export default deleteDisk;
