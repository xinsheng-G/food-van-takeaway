const moment = require('moment');
const global_variables = require('../utils/global_variables')
const dataBase_discount_handler = require('../utils/dataBase_discount_handler')

let show_my_orders_page = async (req, res) => {
    // get user id from session
    let user_id = req.session.user;

    // query orders that belong to the user
    let order_model = require('../model/order')

    /**
     * if we use current orders array in the Customer schema to query orders,
     * we will call too many times of `find` function, as shown below

    let user_model = require('../model/user')

     // find() function called
     // get order array from one customer
     let orders = await user_model.find(
        {'order_customer_id': user_id},
        'current_order_ids previous_order_ids').lean();

    let current_order_ids = orders['current_order_ids']
    let previous_order_ids = orders['previous_order_ids']

    let current_order_list = []
    let previous_order_list = []

     // find() function is called in a loop
     // retrieve order details by query order_id in orders collection
     for (const id of current_order_ids) {
        current_order_list = await order_model.find(
            {'_id': id, $or:[{'status': 'CONFIRMING'}, {'status': 'PREPARING'}, {'status': 'READY'}]},
            '_id order_van_name status start_time total_price').lean();
    }

     // find() function is called in a loop
     // loop find again
    for (const id of previous_order_ids) {
        previous_order_list = await order_model.find(
            {'_id': id, $or:[{'status': 'CONFIRMING'}, {'status': 'PREPARING'}, {'status': 'READY'}]},
            '_id order_van_name status start_time total_price').lean();
    }
     */


    /** If we place user_id in Order schema, just call find function for 2 times*/
    // one query returns an array of current orders
    // sorted by start_time
    let current_orders = await order_model.find(
        {'order_customer_id': user_id, $or:[{'status': 'CONFIRMING'}, {'status': 'PREPARING'}, {'status': 'READY'}]},
        '_id order_van_name status start_time total_price is_given_discount').sort({start_time: -1}).lean();

    // add partial id to each element for display
    // && update discount information
    for(let i in current_orders) {
        let current_order = current_orders[i];
        let full_id = current_order['_id'].toString();

        // 6-digits to avoid collision in showing on the screen
        current_order['partial_id'] =  full_id.substring(full_id.length - 6).toUpperCase();

        /** update discount information before show them on the screen */
        /** this function is from /utils/dataBase_discount_handler */
        await dataBase_discount_handler.update_discount_info(current_order)

        // debug display:
        console.log('current orders:')
        console.log(current_order)
    }

    // sorted by end_time
    let previous_orders = await order_model.find(
        {'order_customer_id': user_id, $or:[{'status': 'COMPLETE'}, {'status': 'CANCELLED'}]},
        '_id order_van_name status start_time end_time total_price').sort({end_time: -1}).lean();

    // add partial id to each element for display
    previous_orders.forEach((previous_order) => {
        let full_id = previous_order['_id'].toString();
        // 6-digits to avoid collision
        previous_order['partial_id'] =  full_id.substring(full_id.length - 6).toUpperCase();

        // debug display:
        console.log('previous orders:')
        console.log(previous_order)
    })

    // ready to render

    // res.render('./customer/my_orders', {
    //     current_orders: current_orders,
    //     previous_orders: previous_orders
    // })

    res.end('Ready to render my orders page')

}

let show_previous_order_details_page = async (req, res) => {

    let order_model = require('../model/order')
    let order_id = req.params.order_id
    let order = await order_model.findOne(
        {'_id': order_id},
        '_id order_van_name status start_time end_time lineItems cost refund total_price').lean();

    /** Security for GET method */
    /** check whether the order belongs to the logged-in customer or not */
    /** if not, return my orders page */
    if(!order['order_customer_id'] === req.session.user) {
        res.redirect('/customer/my_orders')
    }

    /** if the order belongs to logged-in user, show order details page */
    // debug display:
    console.log('prev order:')
    console.log(order)

    // ready to render

    // res.render('./customer/previous_order_details', {
    //     previous_order: order
    // })

    res.end('Ready to render previous order details page')
}

let show_order_monitor_page = async (req, res) => {
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

    /** if the order belongs to logged-in user, show order monitor page */
    switch(order['status'].toString()) {
        case 'CONFIRMING':
            res.end('render confirming status moniter page')
            break
        case 'PREPARING':
            // judge time and show different page
            let time_now = moment().utc().utcOffset(0)
            let delta_minute = (time_now - order['start_time']) / 1000 / 60
            if(delta_minute < global_variables.change_cancel_time_minutes) {
                // show page with change button
            }
            else {
                // show page without change button
            }
            
            break
        case 'READY':
            res.end('render ready status moniter page')
            break
        case 'COMPLETE':

            // if the order has already been given a feedback
            if(order['stars'] === 0) {
                res.redirect('/customer/my_orders')
            } else {
                // calc average stars of all order belongs to the van, and update van stars

            }

            // rend the page
            res.end('render ready status moniter page')
            break
    }
}

// export functions above
module.exports = {
    show_my_orders_page, show_previous_order_details_page
}