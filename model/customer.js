let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// customer schema for customers collection
let customerSchema = new Schema({
    login_id: {type: String, required:true},
    password: {type: String, required:true},
    username: {type: String, required:true},

    firstname: {type: String, required:true},
    lastname: {type: String, required:true},

    // optional
    birthday: String,

    // maybe we can store image path to db rather than store huge byte data.
    // the image could be uploaded by users to `upload_images` folder,
    // For this project, we just hard-code an Unslash source url, don't need to implement upload function.
    avatar_path: {type: String, required:true},

    // we don't need store customer's location in the db, leave it
    location: {x_pos: Number, y_pos: Number},

    /**
     * customer can get his orders by query Orders collection from db by user_id, so don't need store orders in customer model.
     * This is similar to one-to-many relationship in mysql, we leave one-side's reference at the many-side, i.e. leave the user_id
     * in order schema.
     *
     * However, If we use these arrays for storing orders that belong to this customer, if we want to get all orders' detail show on
     * my orders page,,we have to travel all the order id in this array, and then call `orders.findOne(order_id)` method for each
     * element in the array to query id-matched order in Orders collections to get order details, which will make the
     * program travel the database over and over again.
     *
     * On the contrary, if we store user_id in order schema, as is similar to mysql one-to-many relationship, if we want to find a customer's
     * orders and their details, just call `orders.find(customer_id)` method for once, then this method will travel the database for only one time
     * and returns an array of orders that belong to the customer.
     *
     * Another idea is storing Order objects that includes order details in the array, but it is not a good idea, because in this
     * way we are creating our own `database` with an array that contains order objects, and when we do a query, we will travel the array,
     * which will make query slow. Since we are using mongoDB, just use Orders collection to store order details, and use mongoose's
     * high efficient find method to get them.
     *
    */
    // current_order_ids:[String],
    // previous_order_ids:[String]
});


/* The first parameter is the singular form of the
collection name corresponding to the model. Mongoose
will automatically find collections whose names are the
plural of model names. For the example, the Customer
model corresponds to the customer collection in the database. */
module.exports = mongoose.model('Customer',customerSchema);