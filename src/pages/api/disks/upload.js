import multer from "multer";
import path from "path";
import auth from "../../../lib/auth";

const upload = multer({ dest: path.join(process.cwd(), "disks") });

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadDisk(req, res) {
  await auth(req, res);
  if (req.method === "POST") {
    await new Promise((resolve) => {
      upload.single("file")(req, res, () => {
        resolve();
      });
    });
    res.redirect("/disks");
  }
}

export default uploadDisk;
