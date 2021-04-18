const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const exceptionHandler = require('../controller/handle_exceptions')
const myOrdersController = require('../controller/my_orders_controller')

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));
router.use(express.static('upload_images'));

/** my_orders_router based on customer_router */

// show my orders page
router.get('/', myOrdersController.show_my_orders_page);

// show previous order details
router.get('/previous_order/:order_id', myOrdersController.show_previous_order_details_page);

// show different order monitor pages for current orders
router.get('/current_order/:order_id', ((req, res) => {
    res.write("<h1> check an order's status with order_id, controller will check status record and renders responding page </h1>")
    res.end("<p> eg: if this order's status is ready, then res.render('ready', {...})</p>")
}));

// show checkout page
router.get('/checkout', ((req, res) => {
    res.end("<h1> Checkout page </h1>")
}));

// get checkout page's form info and generate new order in `orders` collection of mongoDB
router.post('/checkout', ((req, res) => {
    res.end("<h1> posted a new order form, store them in db </h1>")
}));

// show order feedback page
router.get('/order_feedback/:order_id', ((req, res) => {
    res.end("<h1> show feed back page of an order, then store the feedback to db </h1>")
}));

// show order edit page, select by order id
router.get('/order_edit/:order_id', ((req, res) => {
    res.end("<h1> Order Edit Page, edit order id: req.params.order_id </h1>")
}));

// get edited info and store them in orders collection
router.post('/order_edit', ((req, res) => {
    res.end("<h1> posted a edited form, store them in db </h1>")
}));

// delete order by order id
router.get('/order_remove/:order_id', ((req, res) => {
    res.end("<h1> handle remove by id req.params.order_id </h1>")
}));

// handle 404
router.all('*', exceptionHandler.handle404)

module.exports = router;