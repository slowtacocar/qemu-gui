import auth from "../../../../lib/auth";
import processes from "../../../../lib/processes";

async function killVM(req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    processes.kill(req.query.vm);
    res.redirect("/");
  }
}

export default killVM;
