const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const exceptionHandler = require('../controller/handle_exceptions')

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));

// handle 404
router.all('/', (req, res) => {  // 'default' route to catch user errors
    res.status(404).render('404');})

module.exports = router;