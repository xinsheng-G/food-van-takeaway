const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const exceptionRouter = require('../router/exception_router');
const menuRouter = require('../router/menu_router');
const customerMockUpRouter = require('./customer_mock_up_router');

const indexController = require('../controller/index_controller');
const exceptionHandler = require('../controller/handle_exceptions')

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));
router.use('/van_details', express.static('static'));

router.use('/menu', menuRouter);
router.use('/customer_mockup', customerMockUpRouter)

// '/' means route path, 'indexController.show_page' means show_page
// function from  indexController
router.get('/', indexController.show_page);

router.get('/index', ((req, res) => {
    res.redirect('/');
}));

// show van_details page
router.get('/dan_details/:van_name', ((req, res) => {
    res.end('van detail page');
}));

// get user's location from index with AJAX
router.post('/get_location', indexController.store_user_location_from_post_to_session)

router.get('/search', ((req, res) => {
    res.end('search page');
}));

// handle 404 or 500
router.all('*', exceptionRouter);


module.exports = router;