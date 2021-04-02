let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// need to design details
let vanSchema = new Schema({
    login_id: String,
    password: String,
    firstname: String,
    lastname: String,

    location: {x_pos: Number, y_pos: Number},
    current_order_ids:[String],
    previous_order_ids:[String]
});

/* the Van model corresponds to the vans collection in the database. */
module.exports = mongoose.model('Van',vanSchema);