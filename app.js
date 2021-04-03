// Food Buddy server using Handlebars
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const app = express();
const session = require('express-session');

const index_router = require('./router/index_router');
const customer_router = require('./router/customer_router');

const exceptionHandler = require('./controller/handle_exceptions');

/**
 *
 *  Dependencies:
 *
 * "express": "^4.17.1",
 * "express-handlebars": "^5.3.0",
 * "mongoose": "^5.12.3",
 * "express-session": "^1.17.1"
 *
 * */


// all page use the main.hbs as the layout.
app.engine('hbs', exphbs({
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

// session
app.use(session({
    secret :  'secret', // Signs the cookie associated with the session ID
    resave : true,
    saveUninitialized: false, // Whether to save uninitialized sessions
    cookie : {
        maxAge : 1000 * 60 * 3, // Sets the duration of the session in milliseconds
    },
}));

// express framework gets the static folder
app.use(express.static('static'));
app.use(express.static('upload_images'));

// make post router can parse form
app.use(bodyParser.urlencoded({extended:true}))

// customer router
app.use('/customer', customer_router)

// index router
app.use('/', index_router)

// handle 404 exception
app.all('*', exceptionHandler.handle404);

app.listen(8080, () => {
    console.log('8080 plz')
})