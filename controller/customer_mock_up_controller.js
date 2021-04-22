const moment = require('moment');
const global_variables = require('../utils/global_variables')
const dataBase_discount_handler = require('../utils/dataBase_discount_handler')
const string_util = require('../utils/string_utils')

/** show menu of a van*/
let show_snack_for_a_van = async (req, res) => {
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

    res.render('./customer/mockup_menu',{
        title: 'Menu',
        van_name: van_name,
        van_title: string_util.change_dash_into_space(van_name),
        foods: foods,
        drinks: drinks
    })
}

/** place new order in the db */
let place_new_order = async (req, res) => {
    let form_elements = req.body;
    // for real system, get user_id from session
    // mockup interface ignored login interceptor
    let user_id = 'mockup@example.com';
    console.log(user_id)
    let van_name = req.params.van_name;
    console.log(van_name)
    // time zone to utc 0
    let time_now = moment().utc()
    let total_price = 0;
    let cost = 0;
    let refund = 0;

    // remove van_name from form_elements
    delete form_elements.van_name
    // need to query price again in back end for security
    delete form_elements.price_all
    delete form_elements.customer_id

    let lineItems = []
    Object.keys(form_elements).forEach(key => {

        // if purchased a item
        if(parseInt(form_elements[key]) !== 0) {
            let new_item = {snack_name: key, number: parseInt(form_elements[key])}
            lineItems.push(new_item)
        }
    })

    // query price into a list
    // do price calculation in back-end is a security way
    let snack_model = require('../model/snack')
    let query_res = await snack_model.find({}, 'snack_name price').lean();

    let snacks_price_list = {}
    query_res.forEach(res_obj => {
        snacks_price_list[res_obj['snack_name'].toString()] = parseFloat(res_obj['price'])
    })

    // check whether lineItem is valid
    for(let i = 0; i < lineItems.length; i++) {
        let item_be_checked = lineItems[i]
        let item_name = item_be_checked['snack_name']

        if(snacks_price_list[item_name] == null) {
            // remove the lineItem whose price is not in price_list
            lineItems.splice(i, 1);
        }
    }

    // calc total price
    lineItems.forEach(item_obj => {
        let snack_name = item_obj['snack_name']
        let snack_number = parseInt(item_obj['number'])

        total_price +=  snack_number * snacks_price_list[snack_name]
    })

    cost = total_price
    refund = 0
    // create new order and save to db
    let order_model = require('../model/order')
    let new_order = new order_model({
        "order_customer_id": user_id,
        "order_van_name": van_name,
        "status": "confirming",
        "start_time": time_now,
        "end_time": time_now,
        "lineItems": lineItems,
        "is_given_discount": false,
        "cost": cost,
        "refund": refund,
        "total_price": total_price,
    })

    // save the order to db
    await new_order.save()

    // show json on the page
    res.json(new_order.toJSON())
}

/** show snack details from db */
let show_snack_detail = async (req, res) => {

    let snack_name = req.params.snack_name;
    let snack_model = require('../model/snack')
    let query_res = await snack_model.find({'snack_name': snack_name}).lean();

    // show snack detail on the page with JSON
    res.json(query_res)
}

module.exports = {
    show_snack_for_a_van, place_new_order, show_snack_detail
}