const crypto = require("crypto");

// encrypt the password
// MD5 encryption can be breached by Rainbow Tables，we can
// change it to a more secure encryption algorithm later
function encrypt(password) {
    let md5 = crypto.createHash("md5");
    return md5.update(password).digest('hex');
}

module.exports = {encrypt}