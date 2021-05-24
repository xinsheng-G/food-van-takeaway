let mongoose = require('./mongoDB'),
    Schema = mongoose.Schema;

// snack schema of snacks collection
/**
 * store snack details such as images or types
* these info is used to render menu page
 */
let snackSchema = new Schema({
    snack_name: {type:String, required:true},
    is_drink: {type:Boolean, required:true},
    is_available: {type:Boolean, required:true},
    price: {type:Number, required:true},
    description: String,

    // maybe we can store image path to db rather than store huge byte data.
    // the image could be located in upload_images folder
    // For this project, we just hard-code an Unslash source url, don't need to implement upload function.
    picture_path: {type:String, required:true},
});


/* The first parameter is the singular form of the
collection name corresponding to the model. Mongoose
will automatically find collections whose names are the
plural of model names. */
module.exports = mongoose.model('Snack',snackSchema);