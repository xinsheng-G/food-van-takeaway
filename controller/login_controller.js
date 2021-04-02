const bodyParser = require('body-parser')
const md5_util = require('../utils/MD5_utils')

// render login page
let show_page = (req, res) => {
    res.render('login',{title: 'Login'});
}

// check login info
let check_login = (req, res) => {

    // encrypt to MD5, so that to compare with the record from db
    let user = {
       "login_id": req.body.login_id,
       "password": md5_util.encrypt(req.body.password)
   }

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
                res.redirect('/login')
            } else {
                // if login id record match
                console.log('got result, password: ' + resp.password)

                // if password equals the record
                if(resp.password === user.password) {
                    res.redirect('/login/success')
                } else {

                    // password error, failed
                    res.redirect('/login/fail')
                }
            }
        }
    });



}

let show_success_page = (req, res) => {
    res.redirect('/index')
}

let show_failed_page = (req, res) => {
    res.render('login_failed', {title: 'Login Failed'})
}

module.exports = {
    show_page, check_login, show_success_page, show_failed_page
}