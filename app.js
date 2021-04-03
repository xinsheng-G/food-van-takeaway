// Food Buddy server using Handlebars
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const app = express();
const session = require('express-session');

const index_router = require('./router/index_router');
const customer_router = require('./router/customer_router');

const exceptionHandler = require('./controller/handle_exceptions');

// all page use the main.hbs as the layout.
app.engine('hbs', exphbs({
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

// 使用 session 中间件
app.use(session({
    secret :  'secret', // Signs the cookie associated with the session ID
    resave : true,
    saveUninitialized: false, // Whether to save uninitialized sessions
    cookie : {
        maxAge : 1000 * 60 * 10, // Sets the duration of the session in milliseconds
    },
}));

// express framework gets the static folder
app.use(express.static('static'));

// make post router can parse form
app.use(bodyParser.urlencoded({extended:true}))

// customer router
app.use('/customer', customer_router)

// index router
app.use('/', index_router)

// handle exception
app.all('*', exceptionHandler.handle404);

app.listen(8080, () => {
    console.log('8080 plz')
})