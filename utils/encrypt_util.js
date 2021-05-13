const bcrypt = require("bcrypt");


function encrypt(input) {
    return bcrypt.hash(input, 15);
}

function compare(input, record) {
    return bcrypt.compare(input, record);
}

module.exports = {encrypt, compare}
