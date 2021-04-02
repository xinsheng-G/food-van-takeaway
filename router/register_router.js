const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


const registerController = require('../controller/register_controller')
const exceptionHandler = require('../controller/handle_exceptions')

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));


// '/' means route path, 'registerController.show_page' means show_page
// function from  registerController
router.get('/', registerController.show_page);

router.post('/', registerController.add_customer);

router.get('/success', registerController.show_success_page);


router.all('*', exceptionHandler.handle404)


module.exports = router;