const moment = require('moment');
const global_variables = require('../utils/global_variables')
const dataBase_discount_handler = require('../utils/dataBase_discount_handler')
const string_utils = require('../utils/string_utils')
const math_util = require('../utils/math_utils')

let show_my_orders_page = async (req, res) => {

    try{

        // get user id from session
        let user_id = req.session.user;

        // query orders that belong to the user
        let order_model = require('../model/order')

        /** If we place user_id in Order schema, just call find function for 1 time*/
            // one query returns an array of current orders
            // sorted by start_time


        let current_orders
        try{

            /*
            * find order in confirming, preparing, ready,
            * and order that complete but not has been marked
            * */
            current_orders = await order_model.find(
                {'order_customer_id': user_id,
                    $or:[{'status': 'confirming'}, {'status': 'preparing'}, {'status': 'ready'}, {'status': 'complete'}],
                    $and:[{'stars':{$lt: 0}}]
                },
                '_id order_van_name status start_time total_price is_given_discount').sort({start_time: -1}).lean();
        } catch (e) {
            console.log(e)
        }

        // handle render format on front-end page
        // && update discount information
        for(let i in current_orders) {
            let current_order = current_orders[i];
            let full_id = current_order['_id'].toString();

            // 4-digits to avoid collision in showing on the screen
            current_order['partial_id'] =  string_utils.get_partial_id(full_id);

            // change van name format into van title (change dash into space)
            current_order['van_title'] = string_utils.change_dash_into_space(current_order['order_van_name'])

            // retrieve date and time string from Date type of MongoDB
            current_order['start_date'] =  string_utils.get_date_str_from_Date(current_order['start_time'])
            current_order['start_clock'] = string_utils.get_hour_minute_from_Date(current_order['start_time'])

            /** update discount information before show them on the screen */
            /** this function is from /utils/dataBase_discount_handler */
            await dataBase_discount_handler.update_discount_info(current_order)

        }

        // sorted by end_time
        /**
         * Reminder:
         * `A cancelled order should be invisible to customer and vendor`
         * according to project specification，So previous order only shows
         * completed orders
         * */

        let previous_orders

        try{
            /*
            *
            * orders that are completed and have been marked
            * */
            previous_orders = await order_model.find(
                {'order_customer_id': user_id,
                    $or:[{'status': 'complete'}],
                    $and:[{'stars':{$gte: 0}}]},
                '_id order_van_name status start_time end_time total_price').sort({end_time: -1}).lean();
        } catch (e) {
            console.log(e)
        }

        // add partial id to each element for display
        previous_orders.forEach((previous_order) => {
            let full_id = previous_order['_id'].toString();
            // 6-digits to avoid collision
            previous_order['partial_id'] =  string_utils.get_partial_id(full_id);

            // change van name format into van title (change dash into space)
            previous_order['van_title'] = string_utils.change_dash_into_space(previous_order['order_van_name'])

            // retrieve date and time string from Date type of MongoDB
            previous_order['start_date'] =  string_utils.get_date_str_from_Date(previous_order['start_time'])
            previous_order['start_clock'] = string_utils.get_hour_minute_from_Date(previous_order['start_time'])

            previous_order['end_date'] = string_utils.get_date_str_from_Date(previous_order['end_time'])
            previous_order['end_clock'] = string_utils.get_hour_minute_from_Date(previous_order['end_time'])

        })

        res.render('./customer/my_orders', {
            title: 'My Orders',
            current_orders: current_orders,
            previous_orders: previous_orders
        })

    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }



}

/**
 * Reminder:
 * `A cancelled order should be invisible to customer and vendor`
 * according to project specification
 * */
let show_previous_order_details_page = async (req, res) => {

    try{
        let order_model = require('../model/order')
        let order_id = req.params.order_id

        let order

        try{
            order = await order_model.findOne(
                {'_id': order_id},
                '_id order_van_name status start_time end_time lineItems cost refund total_price').lean();
        } catch (e) {
            console.log(e)
        }

        /** Security for GET method */
        /** check whether the order belongs to the logged-in customer or not */
        /** if not, return my orders page */
        if(!order['order_customer_id'] === req.session.user) {
            res.redirect('/customer/my_orders')
        }

        /** if the order belongs to logged-in user, show order details page */
        /** only shows compete order details */
        if (order['status'] === 'complete') {
            res.render('./customer/previous_order_details', {
                title: 'Details',
                van_title: string_utils.change_dash_into_space(order['order_van_name']),
                partial_id: string_utils.get_partial_id(order['_id']),
                start_date: string_utils.get_date_str_from_Date(order['start_time']),
                start_clock: string_utils.get_hour_minute_from_Date(order['start_time']),
                end_clock: string_utils.get_hour_minute_from_Date(order['end_time']),
                line_items: order['lineItems'],
                cost: math_util.my_round(order['cost'],2),
                refund: math_util.my_round(order['refund'],2),
                total_price: math_util.my_round(order['total_price'],2)
            })

        } else {
            /** only shows compete order details */
            res.redirect('/404');
        }

    } catch (e) {

        console.log(e)
        res.redirect('/500')
    }
}

/** This page can automatically refresh itself from front-end script */
let show_order_monitor_page = async (req, res) => {

    try{

        /** get user location from session to calc distance */
        let user_location
        // if session doesn't get position
        if(req.session.user_x_pos == null || req.session.user_y_pos == null) {

            // default value
            console.log('can\'t find location in session')
            user_location = {x_pos: 144.95782936759818, y_pos: -37.79872198514221 }
        } else {

            // get location from session
            user_location = {x_pos: req.session.user_x_pos, y_pos: req.session.user_y_pos}
        }

        /** query snack price into a list */
            // do price calculation in back-end is a security way
        let snack_model = require('../model/snack')
        let query_res = await snack_model.find({}, 'snack_name price').lean();

        let snacks_price_list = {}
        query_res.forEach(res_obj => {
            snacks_price_list[res_obj['snack_name'].toString()] = parseFloat(res_obj['price'])
        })

        /** query for the order */
        let order_model = require('../model/order')
        let order_id = req.params.order_id
        let order = await order_model.findOne(
            {'_id': order_id},
            '_id order_customer_id order_van_name status start_time end_time lineItems cost refund total_price').lean();

        /** check whether the order belongs to the logged-in customer or not */
        /** if not, return my orders page */
        if(!order['order_customer_id'] === req.session.user) {
            res.redirect('/customer/my_orders')
        }

        /** query for van object */
        let van_model = require('../model/van')
        let van_obj = await van_model.findOne(
            {'van_name': order['order_van_name']},
            'van_name text_address location stars').lean();

        /** update discount information before show them on the screen */
        /** this function is from /utils/dataBase_discount_handler */
        await dataBase_discount_handler.update_discount_info(order)

        /** calc showing info */
        let showing_items = []

        let lineItems = order['lineItems']

        for(let i in lineItems) {
            let item_obj = lineItems[i]
            let snack_name = string_utils.change_dash_into_space(item_obj['snack_name'])
            let snack_number = parseInt(item_obj['number'])
            let snack_unit_price = snacks_price_list[item_obj['snack_name']]
            let snack_total_price = snack_number * snack_unit_price

            let new_showing_item = {snack_name: snack_name, snack_number: snack_number, snack_total_price: snack_total_price}
            showing_items.push(new_showing_item)
        }

        /** utc 0 time now */
        let time_now = moment().utc()
        let time_now_local = moment().local()

        /** calc the time that customer can change */
        let time_can_change = moment(order['start_time']).add(global_variables.change_cancel_time_minutes,"minutes")
        let time_can_change_local = time_can_change.local()

        /** van details to show */
        let van_title = string_utils.change_dash_into_space(van_obj['van_name'])
        let van_location = van_obj['location']
        let distance = math_util.findDistance(user_location.x_pos, user_location.y_pos, van_location.x_pos, van_location.y_pos)
        let text_address = van_obj['text_address'].toString()

        /** if the order belongs to logged-in user, show order monitor page */
        switch(order['status'].toString()) {
            case 'confirming':

                if (time_now_local.isBefore(time_can_change_local)) {
                    // if customer can change
                    res.render('./customer/confirming_changeable', {
                        title: 'Order Monitor',
                        order_id: order_id,
                        van_title: van_title,
                        distance: distance,
                        text_address: text_address,
                        order_partial_id: string_utils.get_partial_id(order_id),
                        start_clock: string_utils.get_hour_minute_from_Date(order['start_time']),
                        now_clock: string_utils.get_hour_minute_from_Date(time_now_local),
                        showing_items: showing_items,
                        change_clock: string_utils.get_hour_minute_from_Date(time_can_change_local)
                    })

                } else {
                    // if customer cannot change
                    res.render('./customer/confirming_not_changeable.hbs', {
                        title: 'Order Monitor',
                        order_id: order_id,
                        van_title: van_title,
                        distance: distance,
                        text_address: text_address,
                        order_partial_id: string_utils.get_partial_id(order_id),
                        start_clock: string_utils.get_hour_minute_from_Date(order['start_time']),
                        now_clock: string_utils.get_hour_minute_from_Date(time_now_local),
                        showing_items: showing_items,
                    })
                }
                break
            case 'preparing':
                // judge time and show different page
                let time_now = moment().utc()
                let delta_minute = (time_now - order['start_time']) / 1000 / 60
                if(delta_minute < global_variables.change_cancel_time_minutes) {
                    // show page with change button
                    res.end('show prepaing page with change button')
                }
                else {
                    // show page without change button
                    res.end('show prepaing page without change button')
                }

                break
            case 'ready':
                res.end('render ready status moniter page')
                break
            case 'complete':

                // if the order has already been given a feedback
                if(order['stars'] !== -1) {
                    res.redirect('/customer/my_orders')
                } else {
                    // calc average stars of all order belongs to the van, and update van stars
                    res.end('show feed back complete page')
                }
                break
        }
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}

/** place an new order and store it in db  */
let place_new_order = async (req, res) => {

    try{
        let form_elements = req.body;
        let user_id = req.session.user;
        let van_name = form_elements.van_name;
        // time zone to utc 0
        let time_now = moment().utc()
        let total_price = 0;
        let cost = 0;
        let refund = 0;

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
            "stars": -1,
            "cost": cost,
            "refund": refund,
            "total_price": total_price,
        })

        await new_order.save()
        res.redirect('/customer/my_orders/checkout_success')
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
}

let show_order_payment_success_page = (req, res) => {
    res.render('./customer/payment_success', {
        title: 'Payment success'
    })
}


// export functions above
module.exports = {
    show_my_orders_page, show_previous_order_details_page, show_order_monitor_page, place_new_order, show_order_payment_success_page
}