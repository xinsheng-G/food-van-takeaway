let mongoose = require('mongoose');

// params to setup mongoDB

// local
// let url = 'mongodb://localhost:27017/';
// let databaseName = 'test'
// const DB_URL = url + databaseName;

// mongoDB atlas online
let username = 'admin'
let password = 'admin'
let databaseName = 'snackApp'
// for production environment:
// let databaseName = 'snackApp-production'

let url = 'mongodb+srv://'+ username +':'+ password + '@x3ra-demo.9ztkf.mongodb.net/'+ databaseName +'?retryWrites=true&w=majority'
const DB_URL = url;



/**
 * connect
 */
mongoose.connect(DB_URL, { useNewUrlParser: true,  useUnifiedTopology: true });

/**
 * success
 */
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});

/**
 * exceptions
 */
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * disconnect
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;