const math_utils = require('../utils/math_utils')
const string_utils = require('../utils/string_utils')
const array_sorter = require('../utils/arraySorter')
const sanitize = require('mongo-sanitize');

let show_page = async (req, res) => {

    try{
        // render index page
        // index page doesn't rely on the main.hbs layout

        // For test let map user's location to be: 144.95782936759818,-37.79872198514221
        // In final release, user's location is got via geolocation, and shouldn't be stored in db
        let van_model = require('../model/van')

        /** find opening vans */
        let opening_vans = await van_model.find(
            {'is_open': true},
            '-_id van_name is_open picture_path description location stars picture_path');

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

            let resp = await customer_model.findOne({'login_id': customer_id}, '-_id login_id username firstname lastname avatar_path');
            user_info = {login_id: resp.login_id, username: resp.firstname + " " + resp.lastname, avatar_path: resp.avatar_path};
        }

        if (opening_vans.length === 0) {
            console.log("no van in array")

            let default_van_info = ("{" +
                "  location: { x_pos: 0, y_pos: 0 }," +
                "  van_name: 'none'," +
                "  is_open: false," +
                "  picture_path: 'https://source.unsplash.com/Fkwj-xk6yck'," +
                "  description: 'default'," +
                "  stars: 0" +
                "}");

            res.render('index', {
                layout: false,
                vans_to_show: [default_van_info],
                customer_login_id: user_info.login_id,
                customer_username: user_info.username,
                customer_avatar_path: user_info.avatar_path
            });

        } else {
            console.log("has van in array")

            res.render('index', {
                layout: false,
                vans_to_show: opening_vans,
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

    const default_user_location = {x_pos: 144.95782936759818, y_pos: -37.79872198514221 }
    const default_distance = 99
    try{
        let van_name = sanitize(req.params.van_name)
        let van_model = require('../model/van')
        let van_obj = await van_model.findOne({'van_name': van_name, 'is_open': true},
            'picture_path text_address stars location is_open').lean();

        // shouldn't show non-exist van's details
        if(van_obj == null || van_obj['is_open'] == null || van_obj['is_open'] === false) {
            res.render('./customer/warning',{
                title: 'Warning',
                warning_message: 'This van is not existing/opening'
            })
            return
        }

        if(van_obj.picture_path == null || van_obj.stars == null) {
            res.render('./customer/warning',{
                title: 'Warning',
                warning_message: 'This van is missing information'
            })
            return
        }

        let van_title = string_utils.change_dash_into_space(van_name)
        let text_address = van_obj['text_address']
        let picture_path = van_obj['picture_path']
        let stars = van_obj['stars']

        let van_location = van_obj['location']
        let user_location
        // if session doesn't get position
        if(req.session.user_x_pos == null || req.session.user_y_pos == null) {

            // default value
            console.log('can\'t find location in session')
            user_location = default_user_location
        } else {

            // get location from session
            user_location = {x_pos: req.session.user_x_pos, y_pos: req.session.user_y_pos}
        }

        let distance_full = default_distance

        if(van_location == null) {
            console.log('van: '+ van_obj['van_name'] + ' missing location information.')
        } else {
            distance_full = math_utils.findDistance(
                user_location.x_pos,
                user_location.y_pos,
                van_location['x_pos'],
                van_location['y_pos']
            )
        }

        // reverse 2 digits after the dot
        let distance = math_utils.my_round(distance_full, 1)

        let stars_percentage = (parseFloat(stars) / 5) * 100;

        res.render('customer/van_details', {
            van_name: van_name,
            van_title: van_title,
            stars_percentage: stars_percentage,
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
        let x_pos = sanitize(req.body.x_pos)
        let y_pos = sanitize(req.body.y_pos)

        req.session.user_x_pos = parseFloat(x_pos)
        req.session.user_y_pos = parseFloat(y_pos)

        res.json({ ok: true });
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}

let show_search_page = (req, res) => {
    try{
        res.render('./customer/search_van', {
            title: 'Search',
            not_found_message: [],
            vans_to_show: []
        });

    } catch (e) {
    console.log(e)
    res.redirect('/500')
    }
}

let receive_search_text = (req, res) => {
    try{
        let form_elements = req.body;
        let search_text = sanitize(form_elements.search_text)

        if (search_text == null) {
            // go to search page
            res.redirect('/search')
        } else {
            // search the text
            res.redirect('/search/' + search_text);
        }

    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}


/**
 *
 * fuzzy search a opening van by its name
 *
 * */
let search_by_van_name = async (req, res) => {

    const default_distance = 99;
    const default_user_location = {x_pos: 144.95782936759818, y_pos: -37.79872198514221 }
    try{
        let query_text = sanitize(req.params.search_text)
        let reg = new RegExp(query_text, 'i')

        let van_model = require('../model/van')
        let result = await van_model.find(
            {'van_name' : {$regex : reg}, 'is_open': true},
            '_id van_name stars text_address location').sort({stars: -1}).lean()

        /**
         * we need to calc distance
         * get user location from session to calc distance */
        let user_location
        // if session doesn't get position
        if(req.session.user_x_pos == null || req.session.user_y_pos == null) {

            // default value
            console.log('can\'t find location in session')
            user_location = default_user_location
        } else {

            // get location from session
            user_location = {x_pos: req.session.user_x_pos, y_pos: req.session.user_y_pos}
        }

        let vans_to_show = []

        result.forEach((res_obj) => {

            /* don't show buggy records */
            if(res_obj['van_name'] != null && res_obj['stars'] != null) {
                let van_location = res_obj['location'];
                let distance = default_distance

                if (van_location == null || van_location.x_pos == null || van_location.y_pos == null) {
                    console.log('van: '+ res_obj['van_name'] + ' missing location information.')

                } else {

                    distance = math_utils.findDistance(user_location.x_pos, user_location.y_pos, van_location.x_pos, van_location.y_pos)
                    let van = {
                        van_name: res_obj['van_name'],
                        van_title: string_utils.change_dash_into_space(res_obj['van_name']),
                        stars_percentage: (parseFloat(res_obj['stars']) / 5 * 100),
                        text_address: res_obj['text_address'],
                        distance: distance,
                    }
                    vans_to_show.push(van)
                }
            }
        })

        vans_to_show = vans_to_show.sort(array_sorter.sortBy('distance'))

        let not_found_message = "<div style=\"text-align: center; margin-top: 200px;\">\n" +
            "                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"50\" fill=\"red\" class=\"bi bi-info-circle\" viewBox=\"0 0 16 16\">\n" +
            "                        <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\n" +
            "                        <path d=\"m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z\"/>\n" +
            "                    </svg>\n" +
            "                </div>\n" +
            "\n" +
            "\n" +
            "                <br>\n" +
            "                <h5 style=\"color:red;text-align: center;font-size:20px\">whoops...no result found</h5>";


        // if no result
        if (vans_to_show.length === 0) {
            res.render('./customer/search_van', {
                title: 'Search',
                not_found_message: not_found_message,
                vans_to_show: []
            });
        }
        else
        {
            res.render('./customer/search_van', {
                title: 'Search',
                not_found_message:"",
                vans_to_show: vans_to_show
            });
        }

    } catch (e) {
    console.log(e)
    res.redirect('/500')
    }
}


/**
 *
 * show nearest 5 opening vans on the page
 *
 * */
let show_nearest_van_list_page = async (req, res) => {

    // define the number of nearest vans to show
    const show_number = 5;
    const default_user_location = {x_pos: 144.95782936759818, y_pos: -37.79872198514221 }
    try{
        /**
         * we need to calc distance
         * get user location from session to calc distance */
        let user_location
        // if session doesn't get position
        if(req.session.user_x_pos == null || req.session.user_y_pos == null) {

            // default value
            console.log('can\'t find location in session')
            user_location = default_user_location
        } else {

            // get location from session
            user_location = {x_pos: req.session.user_x_pos, y_pos: req.session.user_y_pos}
        }

        // get all vans
        let van_model = require('../model/van')
        let query_results = await van_model.find(
            {'is_open': true},
            '_id van_name stars text_address location').lean()

        let vans = []

        for(let i in query_results) {
            let res_obj = query_results[i]

            let van_location = res_obj['location'];
            if (van_location == null || res_obj['van_name'] == null || res_obj['stars'] == null ||
                van_location.x_pos == null || van_location.y_pos == null) {
                // if a van doesn't have a location stored in the db
                // don't show it
                continue;
            }

            let distance = math_utils.findDistance(user_location.x_pos, user_location.y_pos, van_location.x_pos, van_location.y_pos)
            let van = {
                van_name: res_obj['van_name'],
                van_title: string_utils.change_dash_into_space(res_obj['van_name']),
                stars_percentage: (parseFloat(res_obj['stars']) / 5 * 100),
                text_address: res_obj['text_address'],
                distance: distance,
            }
            vans.push(van)
        }

        let sorted_vans = vans.sort(array_sorter.sortBy('distance'))
        let showing_list = []
        for(let i = 0; i < show_number; i++) {
            if(i < sorted_vans.length) {
                showing_list.push(sorted_vans[i])
            } else {
                break
            }
        }

        res.render('./customer/nearest_vans', {
            title: 'Nearest Vans',
            showing_list: showing_list
        })
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}


let get_position_by_ip = async (req, res) => {

    const http = require("https");
    let ip_address = req.body.ip_address
    const geo_API_settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.getgeoapi.com/api/v2/ip/" + ip_address +"?api_key=0e33f90ed8de88b9f3e2d8e3848c1ec7adee696d",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "48a030c68f2f647c63f73dfe65e8664ba811c0f2",
            "x-rapidapi-host": "ip-geo-location.p.rapidapi.com"
        }
    };

    console.log(ip_address)
    console.log("https://api.getgeoapi.com/api/v2/ip/" + ip_address +"?api_key=0e33f90ed8de88b9f3e2d8e3848c1ec7adee696d")
    const options = {
        "method": "GET",
        "hostname": "https://api.getgeoapi.com/api/v2/ip/" + ip_address +"?api_key=0e33f90ed8de88b9f3e2d8e3848c1ec7adee696d",
        "port": null,
        "path": "/ip/check?format=json",
        "headers": {
            "x-rapidapi-key": "0e33f90ed8de88b9f3e2d8e3848c1ec7adee696d",
            "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
            "useQueryString": true
        }
    };

    const request = http.request(options, function (response) {
        const chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
            res.json(body);
        });
    });

    request.end();
}

// export functions above
module.exports = {
    show_page, get_van_objects, store_user_location_from_post_to_session, show_search_page, search_by_van_name, show_nearest_van_list_page,show_van_detail_page, receive_search_text, get_position_by_ip
}