const md5_util = require('../../utils/MD5_utils')
const encrypt_util = require('../../utils/encrypt_util')
const path = require('path');
const sanitize = require('mongo-sanitize');
const str_utils = require('../../utils/string_utils')

let show_page = (req, res) => {
    // render index page
    res.render('./vendor/register',{
        layout: false,
        title: 'register'
    });
}

let add_vendor = (req, res) => {

    try{
        // use customer model
        let vendor_model = require('../../model/van')

        // receive data from post body
        let user = new vendor_model({
            "van_name": str_utils.change_space_into_dash(sanitize(req.body.van_name)),
            // all passwords should be encrypted before store it in db
            "password": encrypt_util.encrypt(sanitize(req.body.password)),
            "is_open": false,
            "stars": 0,
            "description": "new van",
            "text_address": " ",
            "picture_path": "https://source.unsplash.com/Fkwj-xk6yck",
            "location": {x_pos: 0.0, y_pos: 0.0}
        })

        // find by login_id, return the 'password' field of the model
        let query = vendor_model.findOne({'van_name': user.van_name})
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
                            console.log("Vendor Account saved");
                        }
                    });

                    res.redirect('/vendor/register_success')
                } else {
                    // if account has existed
                    console.log('existed! ' + resp.login_id)

                    res.redirect('/vendor/register_failed');
                }
            }
        });

    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }


}

let show_success_page = (req, res) => {

    res.render('./vendor/register_success', {
        layout: false,
        title: 'Success'
    });
}

let show_failed_page =  (req, res) => {
    res.render('./vendor/register_failed',
        {
            layout: false,
            title: 'failed',
            warning_message: 'Something went wrong.'
        });
}

// export functions above
module.exports = {
    show_page, add_vendor, show_success_page, show_failed_page
}