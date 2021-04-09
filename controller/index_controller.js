let show_page = async (req, res) => {
    // render index page
    // index page doesn't rely on the main.hbs layout

    // For test let map user's location to be: 144.95782936759818,-37.79872198514221
    // In final release, user's location is got via geolocation, and shouldn't be stored in db

    // dynamic component: Vans location
    let vans = []

    let van_model = require('../model/van')

    await van_model.find({}, '-_id van_name is_open picture_path description location stars picture_path', function (err, resp) {
        if (err) {
            console.log('error: ' + err);
        } else {
            vans = resp;
        }
    });

    // define default user showing info
    let user_info = {login_id: ' ', username: 'Please Login', avatar_path: './images/icon_default_avatar.png'};

    // if customer has login-in, get customer's information from db
    if ((req.session.user && req.session.user_type === 'CUSTOMER') || (req.cookies.user_type && req.cookies.user_type === 'CUSTOMER')) {
        let customer_model = require('../model/customer');
        let customer_id  = '';

        if(req.session.user) {
            customer_id = req.session.user;
        } else {
            customer_id = req.cookies.user;
        }

        let resp = await customer_model.findOne({'login_id': customer_id}, '-_id login_id username avatar_path');
        user_info = {login_id: resp.login_id, username: resp.username, avatar_path: resp.avatar_path};
    }

    if (vans.length === 0) {

        res.render('index', {
            layout: false,
            vans_to_show: [],
            customer_login_id: user_info.login_id,
            customer_username: user_info.username,
            customer_avatar_path: user_info.avatar_path
        });

    } else {
        // vans that need to be showed
        let vans_to_show = [];
        // pick open van to show
        vans.forEach((van) => {
            if (van.is_open) {
                vans_to_show.push(van);
            }
        })

        vans = []
        res.render('index', {
            layout: false,
            vans_to_show: vans_to_show,
            customer_login_id: user_info.login_id,
            customer_username: user_info.username,
            customer_avatar_path: user_info.avatar_path
        })
    }

}

let _get_customer_login_info = async (req, res) => {
    // define default user showing info
    let user_info = {login_id: ' ', username: 'Please Login', avatar_path: './images/icon_drink_snack.png'};

    // if customer has login-in, get customer's information from db
    if ((req.session.user && req.session.user_type === 'CUSTOMER') || (req.cookies.user_type && req.cookies.user_type === 'CUSTOMER')) {
        let customer_model = require('../model/customer');
        let customer_id  = '';

        if(req.session.user) {
            customer_id = req.session.user;
        } else {
            customer_id = req.cookies.user;
        }

        console.log('customer_id : ' + customer_id)

        let resp = await customer_model.findOne({'login_id': customer_id}, '-_id login_id username avatar_path');
        user_info = {login_id: resp.login_id, username: resp.username, avatar_path: resp.avatar_path};
    }

    return user_info;
}

// export functions above
module.exports = {
    show_page
}