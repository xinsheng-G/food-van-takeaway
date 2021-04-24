const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// application/x-www-form-urlencoded for post from forms
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.static('static'));

// handle 404
router.get('/404', (req, res) => {  // 'default' route to catch user errors

    console.log('404')
    res.render('404', {title: '404'});
})

// handle 500
router.get('/500', (req, res) => {  // 'default' route to catch user errors

    console.log('500')
    res.render('500', {title: '500'});
})

module.exports = router;