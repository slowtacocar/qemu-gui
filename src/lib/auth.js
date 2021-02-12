import keys from "../../keys.json";

async function auth(req, res) {
  return new Promise((resolve) => {
    if (req.headers.authorization === keys.key) resolve();
    else {
      res.setHeader("WWW-Authenticate", 'Basic realm="QEMU GUI"');
      res.statusCode = 401;
      res.end();
    }
  });
}

export default auth;
