const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const loginController = require('../controller/login_controller');
const exceptionHandler = require('../controller/handle_exceptions')

router.use(express.static('static'));

// show logging page
// '/' means route path, 'indexController.show_page' means show_page
// function from  loginController
router.get('/', loginController.show_page);

// receive info login page's form
router.post('/', loginController.check_login);

// show success page
router.get('/success', loginController.show_success_page);

// show fail page
router.get('/fail', loginController.show_failed_page);

router.all('*', exceptionHandler.handle404)




module.exports = router;