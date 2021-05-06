const string_util = require('../utils/string_utils')
const math_util = require('../utils/math_utils')
const global_variables = require('../utils/global_variables')

/** show menu page */
let show_page = async (req, res) => {

    try {
        let snacks = []

        let drinks = []
        let foods = []

        let van_name = req.params.van_name;

        // check whether the van is open
        /** query for van object */
        let van_model = require('../model/van')
        let van_obj = await van_model.findOne(
            {'van_name': van_name},
            'van_name text_address location is_open').lean();

        // shouldn't show closed van's menu
        if(van_obj == null || van_obj['is_open'] !== true) {
            res.render('./customer/warning',{
                title: 'Warning',
                warning_message: 'This van is not existing/opening'
            })
            return
        }

        // read all snacks from db
        /**
         * If using mongoose, use .lean() at the end of the query to get a json object (instead of a mongoose one).
         * To prevent Handlebars access deny problem
         * */
        let snack_model = require('../model/snack')
        snacks = await snack_model.find({}, '_id snack_name is_drink is_available price picture_path').lean();

        // divide snacks into drinks and foods
        snacks.forEach((snack) => {

            // add new attribute: snack_title
            // replace snack_name's dash line into spaces.
            snack['snack_title'] = string_util.change_dash_into_space(snack.snack_name);

            // if is drink
            if (snack.is_available && snack.is_drink) {
                drinks.push(snack);
            }
            // if is food, not drink
            else if (snack.is_available && !snack.is_drink) {
                foods.push(snack)
            } else {
                // if not available, not show on the page
            }
        })

        res.render('./customer/menu',{
            title: 'Menu',
            van_name: van_name,
            van_title: string_util.change_dash_into_space(van_name),
            foods: foods,
            drinks: drinks
        })
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}

/** show checkout page when managed to place an order */
let show_check_out_page = async (req, res) => {

    const default_user_location = {x_pos: 144.95782936759818, y_pos: -37.79872198514221 }
    const default_distance = 99
    try {
        let form_elements = req.body;
        let van_name = form_elements.van_name;
        let price_all = form_elements.price_all;

        // remove van_name from form_elements
        delete form_elements.van_name
        // need to query price again in back end for security
        delete form_elements.price_all

        /** query snack price into a list */
            // do price calculation in back-end is a security way
        let snack_model = require('../model/snack')
        let query_res = await snack_model.find({}, 'snack_name price').lean();

        let snacks_price_list = {}
        query_res.forEach(res_obj => {
            snacks_price_list[res_obj['snack_name'].toString()] = parseFloat(res_obj['price'])
        })

        let lineItems = []
        Object.keys(form_elements).forEach(key => {

            let item_number = parseInt(form_elements[key]);
            let item_total_price = item_number * snacks_price_list[key];

            // if purchased a item
            if(parseInt(form_elements[key]) !== 0) {
                let new_item = {snack_name: key, number: item_number, price: item_total_price}
                lineItems.push(new_item)
            }
        })

        /** get user location from session to calc distance */
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

        /** query for van object */
        let van_model = require('../model/van')
        let van_obj = await van_model.findOne(
            {'van_name': van_name},
            'van_name text_address location').lean();

        /* van details to show */
        let van_title = string_util.change_dash_into_space(van_obj['van_name'])
        let van_location = van_obj['location']
        let distance = default_distance

        if(van_location == null) {
            console.log('van: '+ van_obj['van_name'] + ' missing location information')
        } else {
            distance = math_util.findDistance(user_location.x_pos, user_location.y_pos, van_location.x_pos, van_location.y_pos)
        }

        let text_address = van_obj['text_address'].toString()



        res.render('./customer/checkout', {
            title: 'Check Out',
            van_name: van_name,
            van_title: van_title,
            distance: distance,
            text_address: text_address,
            price_all: price_all,
            lineItems: lineItems,
            change_minutes: global_variables.change_cancel_time_minutes.toString()
        })
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}

// export functions above
module.exports = {
    show_page, show_check_out_page
}