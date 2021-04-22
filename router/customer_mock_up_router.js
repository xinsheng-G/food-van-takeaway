const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const exceptionHandler = require('../controller/handle_exceptions');
const customer_mock_up_controller = require('../controller/customer_mock_up_controller');


const myOrdersRouter = require('../router/my_orders_router')

router.use(express.static('static'));
router.use('/menu', express.static('static'))
router.use('/place_an_order', express.static('static'))

/**
 *
 * Mock up router don't need customer to login in.
 *
 * */

// based on index `/customer_mockup`
router.get('/menu/:van_name', customer_mock_up_controller.show_snack_for_a_van)
router.get('/snack_detail/:snack_name', customer_mock_up_controller.show_snack_detail)

/**
 * form:
 *
 *  snack_name: number
 *  snack_name: number
 *  snack_name: number
 *
 * */
router.post('/place_an_order/:van_name', customer_mock_up_controller.place_new_order)

// handle 404
router.all('*', exceptionHandler.handle404)

module.exports = router;