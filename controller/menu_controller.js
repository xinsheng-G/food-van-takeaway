const string_util = require('../utils/string_utils')

/** show menu page */
let show_page = async (req, res) => {

    try {
        let snacks = []

        let drinks = []
        let foods = []

        let van_name = req.params.van_name;

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
let show_check_out_page = (req, res) => {

    try {
        let form_elements = req.body;
        let van_name = form_elements.van_name;
        let price_all = form_elements.price_all;

        // remove van_name from form_elements
        delete form_elements.van_name
        // need to query price again in back end for security
        delete form_elements.price_all

        let lineItems = []
        Object.keys(form_elements).forEach(key => {

            // if purchased a item
            if(parseInt(form_elements[key]) !== 0) {
                let new_item = {snack_name: key, number: parseInt(form_elements[key])}
                lineItems.push(new_item)
            }
        })

        res.render('./customer/temp_checkout', {
            title: 'Check Out',
            van_name: van_name,
            price_all: price_all,
            lineItems: lineItems
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