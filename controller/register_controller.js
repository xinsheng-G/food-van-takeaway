const md5_util = require('../utils/MD5_utils')
const encrypt_util = require('../utils/encrypt_util')
const path = require('path');
const sanitize = require('mongo-sanitize');

let show_page = (req, res) => {
    // render index page
    res.render('./customer/register',{title: 'register'});
}

let add_customer = (req, res) => {

    try{
        // use customer model
        let customer_model = require('../model/customer')

        // receive data from post body
        let user = new customer_model({
            "login_id": sanitize(req.body.login_id),
            "username": sanitize(req.body.username),
            // all passwords should be encrypted before store it in db
            "password": encrypt_util.encrypt(sanitize(req.body.password)),
            "firstname": sanitize(req.body.firstname),
            "lastname": sanitize(req.body.lastname),
            "birthday": sanitize(req.body.birthday),
            "avatar_path": 'https://source.unsplash.com/Tn8DLxwuDMA'
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
                    user.save(function (err, res) {
                        if (err) {
                            console.log("Error:" + err);
                        }
                        else {
                            console.log("Customer Account saved");
                        }
                    });

                    res.redirect('/customer/register_success')
                } else {
                    // if account has existed
                    console.log('existed! ' + resp.login_id)

                    res.redirect('/customer/register_failed');
                }
            }
        });

    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }


}

let show_success_page = (req, res) => {

    res.render('./customer/register_success', {title: 'Success'});
}

let show_failed_page =  (req, res) => {
    res.render('./customer/warning',
        {
            title: 'warning',
            warning_message: 'Something went wrong.'
        });
}

// export functions above
module.exports = {
    show_page, add_customer, show_success_page, show_failed_page
}