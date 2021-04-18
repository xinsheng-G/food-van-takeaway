let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// order schema for orders collection
let orderSchema = new Schema({

    // we can use _id and do some slice at back-end
    // order_id: String,

    /**  "foreign key" in one-to-many relationship's many-side.
    *    These two references are used to identify this order belongs to which customer and which van.
    *    These two references are used to do query, so they don't need to
    *    be selected by find() method and then be shown on the front-end page
     *
     *    order_van_name should be shown on previous order's detail page
     */
    order_customer_id: String,
    order_van_name: String,

    // CONFIRMING , PREPARING, READY, COMPLETE, CANCELLED
    status: String,
    customer_last_name: String,

    start_time: {
        type: Date,
        default: Date.now
    },

    end_time: Date,

    /** Line items for an order
     *
     * we just store an array of {snack_name, number}, because on the order monitor page, we just need to show snacks' names
     * and their numbers, and we don't need to show other snack details from db such as snack images on order monitor page.
     * What's more, snack_name is also acting as "primary key" of the snack schema, if we really want to get detailed snack
     * info for a specific order (maybe we don't need to), we can query the snack_name in lineItems collections.
     *
     */
    lineItems: [{snack_name:String, number: Number, remark: String}],
    is_given_discount: Boolean,
    cost: Number,
    refund: Number,
    total_price: Number

}, {
    timestamps: {createdAt: 'start_time'}
});


/* The first parameter is the singular form of the
collection name corresponding to the model. Mongoose
will automatically find collections whose names are the
plural of model names. For the example, the Customer
model corresponds to the customer collection in the database. */
module.exports = mongoose.model('Order',orderSchema);