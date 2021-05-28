const bodyParser = require('body-parser')
const md5_util = require('../../utils/MD5_utils')
const path = require('path');
const encrypt_util = require('../../utils/encrypt_util')
const sanitize = require('mongo-sanitize');
const str_utils = require('../../utils/string_utils')



// render login page
let show_page = (req, res) => {
    res.render('./vendor/login', {
        layout: false,
        title: 'Login'
    });
}

// check login info
let check_login = (req, res) => {

    try {
        // encrypt to bcrypt
        let user_plain_password = sanitize(req.body.password);
        let user = {
            "van_name": str_utils.change_space_into_dash(sanitize(req.body.van_name)),
            "password": encrypt_util.encrypt(user_plain_password),
            "user_type": 'VENDOR'
        }

        console.log('input password encrypted: ' + user.password)

        // select user model
        let vendor_model = require('../../model/van')

        // find by login_id, return the 'password' field of the model
        let query = vendor_model.findOne({ 'van_name': user.van_name })
            // the find will return the 'password' field of the model
        query.select('password');
        query.exec((err, resp) => {
            if (err) {
                console.log('error: ' + err);
            } else {

                // if no login id record match
                if (resp === null) {
                    console.log('no match password')
                    res.redirect('/vendor/login_failed')
                } else {
                    // if login id record match

                    // if password equals the record
                    /* Compare plain input password with encrypted database record */
                    if (encrypt_util.compare(user_plain_password, resp.password)) {
                        // sent user_id information to session
                        req.session.vendor_user = user.van_name;
                        // req.session.user_type = user.user_type;
                        console.log("req.session.vendor_user: " + req.session.vendor_user)

                        // sent user_id to cookie, remember the user
                        if (req.body.remember_me === 'on') {
                            // res.cookie("user_type",
                            //     'VENDOR',
                            //     {maxAge: 1000 * 60 * 60 * 48})
                            res.cookie("vendor_user",
                                user.van_name, { maxAge: 1000 * 60 * 60 * 48 })
                        }

                        // If the original request path exists, redirect the user to the previous request path
                        let redirectUrl = '/vendor';
                        if (req.session.originalUrl) {
                            redirectUrl = req.session.originalUrl;
                            // Clear the original request path stored in the session
                            req.session.originalUrl = null;
                        } else {
                            // No original request path exists, redirect the user to the success page
                            redirectUrl = '/vendor/login_success';
                        }

                        res.redirect(redirectUrl);
                    } else {

                        // password error, failed
                        res.redirect('/vendor/login_failed')
                    }
                }
            }
        });
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }

}

let handle_logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('vendor_user');

    res.render('./vendor/logout', {
        layout: false,
        title: 'Log Out'
    });
}


/* to dashboard */
let show_success_page = (req, res) => {
    res.redirect('/vendor/buisness');
}

let show_failed_page = (req, res) => {

    res.render('./vendor/login_failed', {
        layout: false,
        title: 'Login failed'
    });
}

// export functions above
module.exports = {
    show_page,
    check_login,
    show_success_page,
    show_failed_page,
    handle_logout
}