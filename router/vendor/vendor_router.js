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

const login_interceptor = require('../../controller/login_interceptor')

router.use(express.static('static'));

//Set Van location to open
router.put('/van_open/:id', login_interceptor.vendor_login_interceptor, vendor_Controller.set_location);

//Set Van location to closed
router.put('/van_close/:id', login_interceptor.vendor_login_interceptor, vendor_Controller.close_snackvan);

//Filter Orders based on order Status
router.get('/orders/:van_name/:state', login_interceptor.vendor_login_interceptor, vendor_Controller.filtered_orders);

//Update order status to next status
router.put('/update_order_status/:id', login_interceptor.vendor_login_interceptor, vendor_Controller.update_order_status);

//Show order details
router.get('/order/:id',login_interceptor.vendor_login_interceptor, vendor_Controller.show_order_details);

router.get('/search_order/:van_name', login_interceptor.vendor_login_interceptor, vendor_Controller.search_orders);


router.get('/dashboard', login_interceptor.vendor_login_interceptor, vendor_Controller.show_dashboard);
router.get('/buisness', login_interceptor.vendor_login_interceptor, vendor_Controller.show_buisness);

//router.get('/', vendor_Controller.landing_page);

router.get('/login', vendor_loginController.show_page);

// receive info login page's form
router.post('/login', vendor_loginController.check_login);

router.get('/logout', vendor_loginController.handle_logout);

// show login success page(now it just directs to home page)
router.get('/login_success', vendor_loginController.show_success_page);

// show fail page
router.get('/login_failed', vendor_loginController.show_failed_page);

// show register page
router.get('/register', registerController.show_page);

// receive register info
router.post('/register', registerController.add_vendor);

// show register success
router.get('/register_success', registerController.show_success_page);

// show register failed
router.get('/register_failed', registerController.show_failed_page);

// handle 404
router.all('*', exceptionHandler.handle404)

module.exports = router;