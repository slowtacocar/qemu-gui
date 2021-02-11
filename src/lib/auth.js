import keys from "../../keys.json";

export default async function (req, res) {
  return new Promise((resolve) => {
    if (req.headers.authorization === keys.key) resolve();
    else {
      res.setHeader("WWW-Authenticate", 'Basic realm="QEMU GUI"');
      res.statusCode = 401;
      res.end();
    }
  });
}
