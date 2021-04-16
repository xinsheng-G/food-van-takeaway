let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// van schema for vans collection
let vanSchema = new Schema({

    // logged by van_name, so van name is unique
    van_name: String,
    password: String,
    is_open: Boolean,
    stars: Number,

    // We can store image path to online DB rather than store huge byte data.
    // the image could be located in upload_images folder
    // For this project, we just hard-code an Unslash source url, don't need to implement upload function.
    picture_path: String,
    description: String,

    text_address: String,
    location: {x_pos: Number, y_pos: Number},

    // van can get it's orders by query Orders collection from db by van name, so don't need store orders as arraies in model
    /**
     * van can get its orders by query Orders collection from db by van_name, if a van wants to query for orders in a specific
     * status like `completed`, query with van_name and 'COMPLETE' in Orders collection.
     *
     * However, If we use these arrays for storing orders , if we want to get these orders' detail,we have to travel all the order id
     * in these arrays, and then call `orders.findOne(order_id)` method for each of id element in array to query id-matched order in
     * Orders collections to get order details, which will make the program travel the database over and over again.
     *
     * On the contrary, if we store van_name in order schema, as is similar to mysql one-to-many relationship, if we want to find a van's
     * orders and their details, just call `orders.find(van_name)` method for once, then this method will travel the database for only one time
     * and returns an array of orders that belong to the customer.
     */
    // ready_order_ids:[String],
    // preparing_order_ids:[String],
    // completed_order_ids:[String],
    // cancelled_order_ids:[String],

});

/* the Van model corresponds to the vans collection in the database. */
module.exports = mongoose.model('Van',vanSchema);