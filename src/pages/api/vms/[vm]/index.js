import auth from "../../../../lib/auth";
import { promises as fs } from "fs";
import path from "path";

async function updateVM(req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    const vmPath = path.join(process.cwd(), "vms", req.query.vm);
    const body = { ...req.body };
    await fs.writeFile(vmPath, JSON.stringify(body));
    res.redirect("/");
  }
}

export default updateVM;
