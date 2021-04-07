let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// need to design details
let customerSchema = new Schema({
    login_id: String,
    password: String,
    username: String,

    // optional
    firstname: String,
    lastname: String,
    birthday: String,

    // maybe we can store image path to db rather than store huge byte data.
    // the image could be uploaded by users to `upload_images` folder,
    avatar_path: String,

    location: {x_pos: Number, y_pos: Number},

    // customer can get his orders by query Orders collection from db by user_id, so don't need store orders in customer model
    // current_order_ids:[String],
    // previous_order_ids:[String]
});


/* The first parameter is the singular form of the
collection name corresponding to the model. Mongoose
will automatically find collections whose names are the
plural of model names. For the example, the Customer
model corresponds to the customer collection in the database. */
module.exports = mongoose.model('Customer',customerSchema);