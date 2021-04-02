let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// need to design details
let vanSchema = new Schema({
    van_name: String,
    password: String,
    is_open: Boolean,
    stars: Number,

    // maybe we can store image path to db rather than store huge byte data.
    // the image could be located in upload_images folder
    picture_path: String,
    description: String,

    location: {x_pos: Number, y_pos: Number},

    // van can get it's orders by query Orders collection from db by van name, so don't need store orders in model

});

/* the Van model corresponds to the vans collection in the database. */
module.exports = mongoose.model('Van',vanSchema);