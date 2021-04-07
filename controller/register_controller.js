const md5_util = require('../utils/MD5_utils')
const path = require('path');

let show_page = (req, res) => {
    // render index page
    res.render('./customer/register',{title: 'register'});
}

let add_customer = (req, res) => {

    // use customer model
    let customer_model = require('../model/customer')

    // receive data from post body
    let user = new customer_model({
        "login_id": req.body.login_id,
        "username": req.body.username,
        // all passwords should be encrypted before store it in db
        "password": md5_util.encrypt(req.body.password),
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "birthday": req.body.birthday,
    })

    // find by login_id, return the 'password' field of the model
    let query = customer_model.findOne({'login_id': user.login_id})
    // the find will return the 'password' field of the model
    query.exec((err, resp) => {
        if(err) {
            console.log('error: ' + err);
        } else {

            // if no account record match, can add one
            if(resp === null) {
                console.log('add customer account')

                user.save(function (err, res) {
                    if (err) {
                        console.log("Error:" + err);
                    }
                    else {
                        console.log("Customer Account saved, res:" + res);
                    }
                });

                res.redirect('/customer/register_success')
            } else {
                // if account has existed
                console.log('existed! ' + resp.login_id)

                // just a demo, need to make the page dynamic later
                res.redirect('/customer/register');
            }
        }
    });

}

let show_success_page = (req, res) => {

    res.render('./customer/register_success', {title: 'Success'});
}

// export functions above
module.exports = {
    show_page, add_customer, show_success_page
}