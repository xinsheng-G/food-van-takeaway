const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const exceptionHandler = require('../controller/handle_exceptions')
const myOrdersController = require('../controller/my_orders_controller')

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));
router.use('/previous_order', express.static('static'));
router.use('/current_order', express.static('static'));
router.use('/order_edit', express.static('static'));

/** my_orders_router based on customer_router */

// show my orders page
router.get('/', myOrdersController.show_my_orders_page);

// show previous order details
router.get('/previous_order/:order_id', myOrdersController.show_previous_order_details_page);

// show different order monitor pages for current orders
router.get('/current_order/:order_id', myOrdersController.show_order_monitor_page);

// get checkout page's form info and generate new order in `orders` collection of mongoDB
// check out page is rendered by menu_controller
router.post('/checkout', myOrdersController.place_new_order);

// show checkout page
router.get('/checkout_success', myOrdersController.show_order_payment_success_page);

// show order feedback page
router.get('/order_feedback/:order_id', ((req, res) => {
    res.end("<h1> show feed back page of an order, then store the feedback to db </h1>")
}));

// show order edit page, select by order id
router.get('/order_edit/:order_id', myOrdersController.show_edit_page);

// get edited info and store them in orders collection
router.post('/order_edit', myOrdersController.edit_order_info);

// cancel order by order id
router.get('/order_cancel/:order_id', myOrdersController.cancel_order);

// handle 404
router.all('*', exceptionHandler.handle404)

module.exports = router;