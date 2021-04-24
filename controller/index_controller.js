const math_utils = require('../utils/math_utils')
const string_utils = require('../utils/string_utils')

let show_page = async (req, res) => {

    try{
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
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }


}

let get_van_objects = async (req, res) => {

    try{
        let vans = []

        let van_model = require('../model/van')

        await van_model.find({}, '-_id van_name is_open picture_path description location stars picture_path', function (err, resp) {
            if (err) {
                console.log('error: ' + err);
            } else {
                vans = resp;
            }
        });

        // vans that need to be showed
        let vans_to_show = [];

        if (vans.length === 0) {

            res.send(vans_to_show)

        } else {

            // pick open van to show
            vans.forEach((van) => {
                if (van.is_open) {
                    vans_to_show.push(van);
                }
            })

            vans = []
            res.send(vans_to_show)
        }
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}

let show_van_detail_page = async (req, res) => {
    try{
        let van_name = req.params.van_name
        let van_model = require('../model/van')
        let van_obj = await van_model.findOne({'van_name': van_name},
            'picture_path text_address stars location').lean();

        let van_title = string_utils.change_dash_into_space(van_name)
        let text_address = van_obj['text_address']
        let picture_path = van_obj['picture_path']

        let van_location = van_obj['location']
        let user_location
        // if session doesn't get position
        if(req.body.x_pos == null || req.body.y_pos == null) {

            // default value
            console.log('can\'t find location in session')
            user_location = {x_pos: 144.95782936759818, y_pos: -37.79872198514221 }
        } else {

            // get location from session
            user_location = {x_pos: req.session.user_x_pos, y_pos: req.session.user_y_pos}
        }


        let distance_full = math_utils.findDistance(
            user_location.x_pos,
            user_location.y_pos,
            van_location['x_pos'],
            van_location['y_pos']
        )

        // reverse 2 digits after the dot
        let distance = math_utils.my_round(distance_full, 2)

        res.render('customer/van_details', {
            van_name: van_name,
            van_title: van_title,
            distance: distance,
            text_address: text_address,
            picture_path: picture_path
        })
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}

let store_user_location_from_post_to_session = (req, res) => {
    try{
        let x_pos = req.body.x_pos
        let y_pos = req.body.y_pos

        req.session.user_x_pos = parseFloat(x_pos)
        req.session.user_y_pos = parseFloat(y_pos)

        res.json({ ok: true });
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}

// export functions above
module.exports = {
    show_page, get_van_objects, store_user_location_from_post_to_session
}