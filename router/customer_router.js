const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const loginController = require('../controller/login_controller');
const registerController = require('../controller/register_controller');
const exceptionHandler = require('../controller/handle_exceptions');

const login_interceptor = require('../controller/login_interceptor')

const myOrdersRouter = require('../router/my_orders_router')

router.use(express.static('./static'));
router.use(express.static('upload_images'));

/** child router: my_orders */
router.use('/my_orders', login_interceptor.customer_login_interceptor, myOrdersRouter);

// show logging page
router.get('/login', loginController.show_page);

// receive info login page's form
router.post('/login', loginController.check_login);

// show login success page(now it just directs to home page)
router.get('/login_success', loginController.show_success_page);

// show fail page
router.get('/login_failed', loginController.show_failed_page);

// show register page
router.get('/register', registerController.show_page);

// receive register info
router.post('/register', registerController.add_customer);

// show register success
router.get('/register_success', registerController.show_success_page);

// handle log out
router.get('/logout', login_interceptor.customer_login_interceptor, loginController.handle_logout);

// show profile
router.get('/profile', login_interceptor.customer_login_interceptor, ((req, res) => {
    res.end('<h1>user profile</h1>')
}));

// show edit profile page
router.get('/edit_profile', login_interceptor.customer_login_interceptor, ((req, res) => {
    res.end('<h1>edit user profile</h1>')
}));

// receive edit form data, store it
router.post('/edit_profile', login_interceptor.customer_login_interceptor, ((req, res) => {
    res.end('<h1>receive posted edit data, store them </h1>')
}));

router.get('/cart', login_interceptor.customer_login_interceptor, ((req, res) => {
    res.end('<h1>cart</h1>')
}));

// handle 404
router.all('*', exceptionHandler.handle404)

module.exports = router;