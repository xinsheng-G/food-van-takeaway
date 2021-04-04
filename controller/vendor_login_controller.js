const bodyParser = require('body-parser')
const md5_util = require('../utils/MD5_utils')
const path = require('path');

/**
 *
 * DEMO
 *
 * need construction
 *
 * */

// render login page
let show_page = (req, res) => {
    res.render('vendor_login.hbs',{title: 'Login'});
}

// check login info
let check_login = (req, res) => {
    console.log('vendor login check')
}

let show_success_page = (req, res) => {
    res.redirect('/vendor')
}

let show_failed_page = (req, res) => {

    res.render('login_failed', {title: 'Login failed'});
}

// export functions above
module.exports = {
    show_page, check_login, show_success_page, show_failed_page
}