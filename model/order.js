let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// need to design details
let orderSchema = new Schema({
    login_id: String,
    password: String,
    username: String,
    firstname: String,
    lastname: String,
    birthday: String,

    location: {x_pos: Number, y_pos: Number},
    current_order_ids:[String],
    previous_order_ids:[String]
});


/* The first parameter is the singular form of the
collection name corresponding to the model. Mongoose
will automatically find collections whose names are the
plural of model names. For the example, the Customer
model corresponds to the customer collection in the database. */
module.exports = mongoose.model('Order',customerSchema);