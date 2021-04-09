let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// need to design details
let orderSchema = new Schema({
    order_id: Number,

    // "foreign key"
    order_customer_id: String,
    order_van_name: String,

    // CONFIRMING , PREPARING, READY, COMPLETE, CANCELLED
    status: String,

    start_time: {
        type: Date,
        default: Date.now
    },

    end_time: Date,

    snacks: [{snack_name:String, number: Number, remark: String}],
    is_given_discount: Boolean,
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