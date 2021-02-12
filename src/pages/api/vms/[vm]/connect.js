import auth from "../../../../lib/auth";
import { promises as fs } from "fs";
import path from "path";

async function connectVM(req, res) {
  await auth(req, res);
  if (req.method === "GET") {
    const vmPath = path.join(process.cwd(), "vms", req.query.vm);
    const data = await fs.readFile(vmPath);
    const json = JSON.parse(data);
    res.redirect(
      `/spice-html5/spice_auto.html?port=${parseInt(json.port, 10) - 100}`
    );
  }
}

export default connectVM;
