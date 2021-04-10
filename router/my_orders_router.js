const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const login_interceptor = require('../controller/login_interceptor')

const exceptionHandler = require('../controller/handle_exceptions')
const menuController = require('../controller/menu_controller')

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));
router.use(express.static('upload_images'));

/** my_orders_router based on customer_router */

// show current orders
router.get('/current_orders', ((req, res) => {
    res.end("<h1> Current Orders page </h1>")
}));

// show previous orders
router.get('/previous_orders', ((req, res) => {
    res.end("<h1> Previous Orders page </h1>")
}));

// show checkout page
router.get('/checkout', ((req, res) => {
    res.end("<h1> Checkout page </h1>")
}));

// get checkout page's info and generate new order in orders collection of mongoDB
router.post('/checkout', ((req, res) => {
    res.end("<h1> posted a new order form, store them in db </h1>")
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