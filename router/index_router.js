const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const exceptionRouter = require('../router/exception_router');
const menuRouter = require('../router/menu_router');

const indexController = require('../controller/index_controller');
const exceptionHandler = require('../controller/handle_exceptions')

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));
router.use(express.static('upload_images'));

router.use('/menu', menuRouter);

// '/' means route path, 'indexController.show_page' means show_page
// function from  indexController
router.get('/', indexController.show_page);

router.get('/index', ((req, res) => {
    res.redirect('/');
}));

router.get('/search', ((req, res) => {
    res.end('search page');
}));

// handle 404
router.all('*', exceptionRouter);


module.exports = router;