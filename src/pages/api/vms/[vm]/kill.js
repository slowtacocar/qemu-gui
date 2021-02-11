import auth from "../../../../lib/auth";
import processes from "../../../../lib/processes";

export default async function (req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    processes.kill(req.query.vm);
    res.redirect("/");
  }
}
