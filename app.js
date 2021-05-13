// Food Buddy server using Handlebars
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const app = express();
const cookieParser = require('cookie-parser')
const session = require('express-session');

const index_router = require('./router/index_router');
const customer_router = require('./router/customer_router');
const vendor_router = require('./router/vendor/vendor_router')

const exceptionHandler = require('./controller/handle_exceptions');

/* filter to prevent db injection */
const filter = require('content-filter');

/* rate limit */
const rateLimit = require("express-rate-limit");
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000 // limit each IP to 10000 requests per windowMs
});
app.use(limiter);

/* configure content-filter */
let blackList = ['$','{','&&','||']
let options = {
    urlBlackList: blackList,
    bodyBlackList: blackList,
    bodyMessage: 'Please no hacking, sir'
}

app.use(filter(options))

// all page use the main.hbs as the layout.
app.engine('hbs', exphbs({
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

// session
app.use(cookieParser('secret'))

app.use(session({
    secret :  'secret', // Signs the cookie associated with the session ID
    resave : true,
    saveUninitialized: false, // Whether to save uninitialized sessions
    cookie : {
        maxAge : 1000 * 60 * 120, // Sets the duration of the session in milliseconds
    },
}));

// express framework gets the static folder
app.use(express.static('static'));
app.use(express.static('upload_images'));

// make post router can parse form
app.use(bodyParser.urlencoded({extended:true}))

// customer router, for customer app functionalities
app.use('/customer', customer_router)

// vendor router, for Vendor app functionalities
app.use('/vendor', vendor_router)

// index router
app.use('/', index_router)

// handle 404 exception
app.all('*', exceptionHandler.handle404);

app.listen(process.env.PORT || 8080, () => {
    // process.env.PORT is for Heroku's port
    if (process.env.PORT) {
        console.log('port: ' + process.env.PORT);
    } else {
        console.log('port: 8080')
    }
})