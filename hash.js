const crypto = require("crypto");
console.log(crypto.createHash("sha256").update(process.argv[2]).digest("hex"));
