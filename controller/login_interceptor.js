
/**
 *
 * DEMO
 *
 * Is under construction
 *
 * */

// let customer_login_interceptor = function (req, res, next) {
//
//     console.log(req.url)
//     if ((req.session.user && req.session.user_type === 'CUSTOMER') || (req.cookies.user)) {
//         // if user has logged in, pass
//         next();
//     } else {
//         // parse request path
//         let arr = req.url.split('/');
//         // remove params from GET request path
//         for (var i = 0, length = arr.length; i < length; i++) {
//             arr[i] = arr[i].split('?')[0];
//         }
//
//         console.log(arr[0])
//         console.log(arr[1])
//
//         // Determine whether the request path is root, login, register, logout, if so, do not intercept
//         if (arr.length > 1 && (arr[1] == 'index' || arr[1] == '')) {
//             next();
//         } else if (arr.length > 2 && arr[1] == 'customer' && (arr[2] == 'register' || arr[2] == 'login' ||
//             arr[2] == 'register_success' || arr[2] == 'login_failed' ||arr[2] == 'logout')) {
//
//             next();
//         } else {
//
//             // need login
//             // Record the user's original request path
//             req.session.originalUrl = req.originalUrl ? req.originalUrl : null;
//             console.log('please login');
//             res.redirect('/customer/login');  // Redirect the user to the login page
//         }
//     }
// }

let vendor_login_interceptor = function (req, res, next) {
    if ((req.session.user && req.session.user_type === 'VENDOR') || (req.cookies.user_type && req.cookies.user_type === 'VENDOR')) {

        next();
    } else {
        res.redirect('/vendor/login');
    }
}


let customer_login_interceptor = function (req, res, next) {
    if ((req.session.user && req.session.user_type === 'CUSTOMER') || (req.cookies.user_type && req.cookies.user_type === 'CUSTOMER')) {

        next();
    } else {
        res.redirect('/customer/login');
    }
}

module.exports = {customer_login_interceptor, vendor_login_interceptor}