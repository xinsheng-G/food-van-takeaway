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
function salty_encrypt(password, user_id) {
    // encrypt for 3 times
    let salty_1 = encrypt(password + user_id);
    let salty_2 = encrypt(user_id + salty_1);
    return encrypt(salty_2 + password);
}

module.exports = {encrypt, salty_encrypt}
