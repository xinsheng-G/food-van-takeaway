// Food Buddy server using Handlebars
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const app = express();

const index_router = require('./router/index_router');

// all page use the main.hbs as the layout.
app.engine('hbs', exphbs({
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

// express framework gets the static folder
app.use(express.static('static'));

// make post router can parse form
app.use(bodyParser.urlencoded({extended:true}))


// index router
app.use('/', index_router)

app.listen(8080, () => {
    console.log('8080 plz')
})