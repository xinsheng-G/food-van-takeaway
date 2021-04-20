/**
 *
 * DEMO
 *
 * Is under construction
 *
 * */

let vendor_login_interceptor = function (req, res, next) {
    if ((req.session.user && req.session.user_type === 'VENDOR') || (req.cookies.user && req.cookies.user_type === 'VENDOR')) {

        if(!req.session.user) {
            req.session.user = req.cookies.user
            req.session.user_type = req.cookies.user_type
        }

        next();
    } else {
        res.redirect('/vendor/login');
    }
}


let customer_login_interceptor = function (req, res, next) {
    if ((req.session.user && req.session.user_type === 'CUSTOMER') || (req.cookies.user && req.cookies.user_type === 'CUSTOMER')) {

        if(!req.session.user) {
            req.session.user = req.cookies.user
            req.session.user_type = req.cookies.user_type
        }

        next();
    } else {
        res.redirect('/customer/login');
    }
}

module.exports = {customer_login_interceptor, vendor_login_interceptor}