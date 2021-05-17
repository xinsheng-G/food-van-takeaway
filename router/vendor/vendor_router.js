const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 *
 * DEMO
 *
 * need construction
 *
 * */

const vendor_loginController = require('../../controller/vendor/vendor_login_controller');

//Deliverable 2 functions
const vendor_Controller = require('../../controller/vendor/vendor_controller');

const registerController = require('../../controller/vendor/vendor_register_controller');
const exceptionHandler = require('../../controller/handle_exceptions');



router.use(express.static('./static'));

//Set Van location to open
router.post('/van_open/:id', vendor_Controller.set_location);

//Filter Orders based on order Status
router.get('/orders/:van_name/:state', vendor_Controller.filtered_orders);

//Update order status to next status
router.post('/update_order_status/:id', vendor_Controller.update_order_status);

//Show order details
router.get('/order/:id', vendor_Controller.show_order_details);

router.get('/dashboard', vendor_Controller.show_dashboard);

//router.get('/', vendor_Controller.landing_page);

router.get('/login', vendor_loginController.show_page);

// receive info login page's form
router.post('/login', vendor_loginController.check_login);

// show login success page(now it just directs to home page)
router.get('/login_success', vendor_loginController.show_success_page);

// show fail page
router.get('/login_failed', vendor_loginController.show_failed_page);

// // show register page
// router.get('/register', registerController.show_page);
//
// // receive register info
// router.post('/register', registerController.add_customer);
//
// // show register success
// router.get('/register_success', registerController.show_success_page);

// handle 404
router.all('*', exceptionHandler.handle404)

module.exports = router;