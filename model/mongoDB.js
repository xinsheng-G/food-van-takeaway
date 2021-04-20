let mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)

//=============================================
// !!! EDIT CONFIGURATION HERE !!!
// params to setup mongoDB

// if use mongoDB atlas online
let username = 'admin'
let password = '3ulH5EXbBpj5mcax'
// for production environment in final release: 'snackApp-production'
let databaseName = 'snackApp'

const DB_URL = 'mongodb+srv://'+ username +':'+ password + '@cluster0.1saxw.mongodb.net/'+ databaseName +'?retryWrites=true&w=majority';

// if using local:
// let url = 'mongodb://localhost:27017/';
// let databaseName = 'test'
//
// const DB_URL = url + databaseName;

//========================================

/*
* Old MongoDB server:
* let username = 'admin'
* let password = 'admin'
* let databaseName = 'snackApp'
* const DB_URL = 'mongodb+srv://'+ username +':'+ password + '@x3ra-demo.9ztkf.mongodb.net/'+ databaseName +'?retryWrites=true&w=majority';
*
* */


/**
 * connect
 */
mongoose.connect(DB_URL, { useNewUrlParser: true,  useUnifiedTopology: true }, function () {
    console.log('Mongoose connection established')
});

/**
 * success
 */
mongoose.connection.on('connecting', function () {
    console.log('Mongoose is trying to connect to MongoDB Atlas server ' + DB_URL);
    console.log('Please wait...');
});

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