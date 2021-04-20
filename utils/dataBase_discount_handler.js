/**
 * This function update an order's discount info
 * This function should be called at:
 *
 *  1. When a customer visits my_orders_pages to see current orders, the function will be called
 *     to update current orders' discount information
 *
 *  2. When a vendor periodically refreshes his order management page.
 *
 */

const moment = require('moment');
const global_variables = require('../utils/global_variables')
const order_model = require('../model/order')

let update_discount_info = async function(current_order) {
    // transfer server time zone to utc 0
    let time_now = moment().utc().utcOffset(0)
    let delta_minute = (time_now - current_order['start_time']) / 1000 / 60
    console.log('current time period minutes: ' + delta_minute)

    /*
     if no discount given and exceeds discount period, then give discount
     if a discount has been given, skip the query
    */
    if(delta_minute > global_variables.discount_period_minutes &&
        current_order['is_given_discount'] === false ) {

        let original_price = current_order['total_price']
        let refund = original_price * global_variables.discount_percent
        let new_price = original_price - refund

        await order_model.findByIdAndUpdate(
            current_order['_id'].toString(),
            {'is_given_discount': true,
                'cost': original_price,
                'refund': refund,
                'total_price': new_price}
        );
    }
}

module.exports = {update_discount_info}