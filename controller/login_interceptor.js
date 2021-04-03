
// still under construction

let login_interceptor = function (req, res, next) {
    if (req.session.user) {
        // if user has logged in, pass
        next();
    } else {
        // parse request path
        let arr = req.url.split('/');
        // remove params from GET request path
        for (var i = 0, length = arr.length; i < length; i++) {
            arr[i] = arr[i].split('?')[0];
        }

        // Determine whether the request path is root, login, register, logout, if so, do not intercept
        if (arr.length > 1 && arr[1] == '') {
            next();
        } else if (arr.length > 2 && arr[1] == 'customer' && (arr[2] == 'register' || arr[2] == 'login' || arr[2] == 'logout')) {
            next();
        } else {

            // need login
            // Record the user's original request path
            req.session.originalUrl = req.originalUrl ? req.originalUrl : null;
            req.flash('error', 'please login');
            res.redirect('/customer/login');  // Redirect the user to the login page
        }
    }
}