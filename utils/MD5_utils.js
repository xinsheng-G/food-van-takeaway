const crypto = require("crypto");

// encrypt the password
function encrypt(password) {
    let md5 = crypto.createHash("md5");
    return md5.update(password).digest('hex');
}

module.exports = {encrypt}