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
     let orders = await user_model.find(
        {'order_customer_id': user_id},
        'current_order_ids previous_order_ids').lean();

    let current_order_ids = orders['current_order_ids']
    let previous_order_ids = orders['previous_order_ids']

    let current_order_list = []
    let previous_order_list = []

     // find() function is called in a loop
     for (const id of current_order_ids) {
        current_order_list = await order_model.find(
            {'_id': id, $or:[{'status': 'CONFIRMING'}, {'status': 'PREPARING'}, {'status': 'READY'}]},
            '_id order_van_name status start_time total_price').lean();
    }

     // find() function is called in a loop
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
        '_id order_van_name status start_time total_price').sort({start_time: -1}).lean();

    // add partial id to each element for display
    current_orders.forEach((current_order) => {
        let full_id = current_order['_id'].toString();
        // 6-digits to avoid collision
        console.log(full_id)
        current_order['partial_id'] =  full_id.substring(full_id.length - 6).toUpperCase();

        // debug display:
        console.log('current orders:')
        console.log(current_order)
    })

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

    // debug display:
    console.log('prev order:')
    console.log(order)

    // ready to render

    // res.render('./customer/previous_order_details', {
    //     previous_order: order
    // })

    res.end('Ready to render previous order details page')
}

// export functions above
module.exports = {
    show_my_orders_page, show_previous_order_details_page
}