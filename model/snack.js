let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// need to design details
let snackSchema = new Schema({
    snack_name: String,
    is_drink: Boolean,
    is_available: Boolean,
    price: Number,
    description: String,

    // maybe we can store image path to db rather than store huge byte data.
    // the image could be located in upload_images folder
    // For this project, we just hard-code an Unslash source url, don't need to implement upload function.
    picture_path: String,
});


/* The first parameter is the singular form of the
collection name corresponding to the model. Mongoose
will automatically find collections whose names are the
plural of model names. */
module.exports = mongoose.model('Snack',snackSchema);