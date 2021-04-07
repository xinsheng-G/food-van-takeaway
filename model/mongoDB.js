let mongoose = require('mongoose');

//=============================================
// !!! EDIT CONFIGURATION HERE !!!
// params to setup mongoDB

// if use mongoDB atlas online
let username = 'admin'
let password = 'admin'
// for production environment in final release: 'snackApp-production'
let databaseName = 'snackApp'

const DB_URL = 'mongodb+srv://'+ username +':'+ password + '@x3ra-demo.9ztkf.mongodb.net/'+ databaseName +'?retryWrites=true&w=majority';

// if using local:
// let url = 'mongodb://localhost:27017/';
// let databaseName = 'test'
//
// const DB_URL = url + databaseName;

//========================================




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
    conlole.log('MongoDB Atlas connection is unstable, please try to get the web URL again');
});

/**
 * disconnect
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;