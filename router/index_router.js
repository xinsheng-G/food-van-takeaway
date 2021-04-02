const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const login_router = require('../router/login_router');
const register_router = require('../router/register_router');

const indexController = require('../controller/index_controller');
const exceptionHandler = require('../controller/handle_exceptions')

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));


// '/' means route path, 'indexController.show_page' means show_page
// function from  indexController
router.get('/', indexController.show_page);

router.get('/index', ((req, res) => {
    res.redirect('/');
}));

router.use('/login', login_router);

router.use('/register', register_router);

router.all('*', exceptionHandler.handle404);


module.exports = router;