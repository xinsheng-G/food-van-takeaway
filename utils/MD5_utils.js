const crypto = require("crypto");

// encrypt the password
// MD5 encryption can be breached by Rainbow Tables，we can
// change it to a more secure encryption algorithm later
function encrypt(password) {
    let md5 = crypto.createHash("md5");
    return md5.update(password).digest('hex');
}

/**
 * Updated: add more Salt to make md5 better:
 * */
function salty_encrypt(password, username) {
    // encrypt for 3 times
    let salty_1 = encrypt(password + username);
    let salty_2 = encrypt(salty_1);
    return encrypt(salty_2);
}

module.exports = {encrypt, salty_encrypt}
