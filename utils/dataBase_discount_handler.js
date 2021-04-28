/**
 * This function update an order's discount info
 * This function could be called at:
 *
 *  1. When a customer visits my_orders_pages to see current orders, the function will be called
 *     to update current orders' discount information
 *
 *  2. When a vendor periodically refreshes his order management page.
 *
 *
 * For input parameter current_order, it is an order object from order_model.findOne(...), and this
 * order object contains _id, start_time, is_given_discount, cost, fund, total_price fields
 *
 */

const moment = require('moment');
const global_variables = require('../utils/global_variables')
const order_model = require('../model/order')
const math_util = require('./math_utils')

let update_discount_info = async function(current_order) {

    let time_now = moment().utc()
    let delta_minute = (time_now - current_order['start_time']) / 1000 / 60
    // console.log('current time period minutes: ' + delta_minute)

    /*
     if no discount given and exceeds discount period, then give discount
     if a discount has been given, skip the query
    */
    if(delta_minute > global_variables.discount_period_minutes &&
        current_order['is_given_discount'] === false &&
        (current_order['status'] !=='ready' && current_order['status'] !=='complete') ) {

        let original_price = current_order['cost']
        let refund = original_price * global_variables.discount_percent
        let new_price = original_price - refund


        try {
            await order_model.findByIdAndUpdate(
                current_order['_id'].toString(),
                {'is_given_discount': true,
                    'cost': math_util.my_round(original_price, 2),
                    'refund': math_util.my_round(refund, 2),
                    'total_price': math_util.my_round(new_price, 2)}
            );
        } catch (e) {
            console.log('account update failed')
            throw e
        }

    }
}

module.exports = {update_discount_info}