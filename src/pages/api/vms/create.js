import auth from "../../../lib/auth";
import { promises as fs } from "fs";
import path from "path";

export default async function (req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    const vmPath = path.join(process.cwd(), "vms", req.body.name);
    const body = { ...req.body };
    delete body.name;
    await fs.writeFile(vmPath, JSON.stringify(body));
    res.redirect("/");
  }
}
