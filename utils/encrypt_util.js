const bcrypt = require("bcrypt");


function encrypt(input) {

    let salt = bcrypt.genSaltSync(15)
    return bcrypt.hashSync(input, salt)
}

function compare(input_plain, record_hash) {
    return bcrypt.compareSync(input_plain, record_hash)
}

module.exports = {encrypt, compare}
