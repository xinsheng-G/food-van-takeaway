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
router.get('/dan_details/:van_name', indexController.show_van_detail_page);

// get user's location from index with AJAX
router.post('/get_location', indexController.store_user_location_from_post_to_session)

// show nearest vans list page
router.get('/nearest_vans', indexController.show_nearest_van_list_page);

// show search page
router.get('/search', indexController.show_search_page);

// Fuzzy query based on van name
router.get('/search/:search_text', indexController.search_by_van_name);

// handle 404 or 500
router.all('*', exceptionRouter);


module.exports = router;