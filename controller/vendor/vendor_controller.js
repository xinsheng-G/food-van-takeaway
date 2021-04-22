const bodyParser = require('body-parser')
const path = require('path');

let set_location = (req, res) => {

    let van_name = req.params.id;
    let van_location = req.body.van_location;

    let van_model = require('../../model/van')

    try {
        let query = { 'van_name': van_name }
        let update = { "$set": { "is_open": true, "location": van_location } }
        let options = { returnNewDocument: true }

        let set_loc = van_model.findOneAndUpdate(query, update, options);
        console.log(set_loc);
        res.write("<h1>SUCCESS!</h1>");
        res.end();
    } catch (err) {

        console.log(err);

    }

}

let filtered_orders = async(req, res) => {
    let status_filter = req.params.status;
    let van_name = req.params.van_name;

    let order_model = require('../../model/order');

    try {
        let filter_orders = await order_model.find({ 'order_van_name': van_name, 'status': status_filter }).lean();
        res.end(JSON.stringify(filter_orders));
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    set_location,
    filtered_orders
}