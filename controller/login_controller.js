const bodyParser = require('body-parser')
const md5_util = require('../utils/MD5_utils')
const path = require('path');

// render login page
let show_page = (req, res) => {
    res.render('./customer/login',{title: 'Login'});
}

// check login info
let check_login = (req, res) => {

    // encrypt to MD5, so that to compare with the MD5 record from db
    let user = {
       "login_id": req.body.login_id,
       "password": md5_util.encrypt(req.body.password),
        "user_type": 'CUSTOMER'
   }

   console.log('input password to MD5: ' +user.password)

   // select user model
   let customer_model = require('../model/customer')

    // find by login_id, return the 'password' field of the model
    let query = customer_model.findOne({'login_id': user.login_id})
    // the find will return the 'password' field of the model
    query.select('password');
    query.exec((err, resp) => {
        if(err) {
            console.log('error: ' + err);
        } else {

            // if no login id record match
            if(resp === null) {
                console.log('no match password')
                res.redirect('/customer/login_failed')
            } else {
                // if login id record match
                console.log('got result, password: ' + resp.password)

                // if password equals the record
                if(resp.password === user.password) {

                    // sent user_id information to session
                    req.session.user = user.login_id;
                    req.session.user_type = user.user_type;

                    // sent user_id to cookie, remember the user
                    if(req.body.remember_me === 'on') {
                        res.cookie("user_type",
                            'CUSTOMER',
                            {maxAge: 1000 * 60 * 60 * 48})
                    }

                    // If the original request path exists, redirect the user to the previous request path
                    let redirectUrl = '/';
                    if (req.session.originalUrl) {
                        redirectUrl = req.session.originalUrl;
                        // Clear the original request path stored in the session
                        req.session.originalUrl = null;
                    } else {
                        // No original request path exists, redirect the user to the success page
                        redirectUrl = '/customer/login_success';
                    }

                    res.redirect(redirectUrl);
                } else {

                    // password error, failed
                    res.redirect('/customer/login_failed')
                }
            }
        }
    });



}

let show_success_page = (req, res) => {
    res.redirect('/index')
}

let show_failed_page = (req, res) => {

    res.render('./customer/login_failed', {title: 'Login failed'});
}

// export functions above
module.exports = {
    show_page, check_login, show_success_page, show_failed_page
}