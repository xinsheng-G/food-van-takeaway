const moment = require('moment');

let set_location = (req, res) => {
    // Reading Request
    let van_name = req.params.id;
    let van_location = JSON.parse(req.body.van_location);

    // Loading Van Collection
    let van_model = require('../../model/van')

    //Setting up Query: find and update van dettails (Open for buisness and locaiton)
    let query = { 'van_name': van_name };
    let update = { "$set": { "is_open": true, "location": van_location } };
    let options = { new: true }

    van_model.findOneAndUpdate(query, update, options)
        .then(updatedDocument => {
            // Displaying document in Console and relevant informaion in response body on Success
            if (updatedDocument) {

                //console.log(`Successfully updated document: ${updatedDocument}.`);

                res.send(`Open for Business: ${updatedDocument.van_name} | OPEN: ${updatedDocument.is_open} at ${updatedDocument.location} `);

            } else {
                console.log("No such van name exists");
                res.send("400: Van not found");
            }

        })
        .catch(err => console.log(err));

}

let filtered_orders = async(req, res) => {

    // Reading Request
    let status_filter = req.params.status;
    let van_name = req.params.van_name;

    // Loading Order Collection
    let order_model = require('../../model/order');

    //Async function to wait for response from database
    try {
        //Setting up Query: filter orders based on provided status(Confirming, Preparing (outstanding), Ready, Complete)
        let query = { 'order_van_name': van_name, 'status': status_filter };

        let filter_orders = await order_model.find(query).lean();

        // Displaying list of  filtered orders in response body on Success
        res.send(filter_orders);

    } catch (err) {
        console.log(err);
    }
}

let update_order_status = (req, res) => {
    // Reading Request
    let order_id = req.params.id;

    //Initialising  required variables
    let order_status = "";
    let start = moment(new Date());
    let end = moment(new Date());

    // Loading Order Collection
    let order_model = require('../../model/order');

    //Setting up Query: find order and extract currentt status
    let query = { '_id': order_id };
    let projection = { 'status': 1 };

    order_model.findOne(query, projection)
        .then(order => {

            //Update Status to next State, while managing time
            switch (order.status) {

                case 'confirming':
                    order_status = 'preparing';
                    start = moment().format('YYYY-MM-DD[T00:00:00.000Z]');
                    end = moment().add(10, "minutes").format('YYYY-MM-DD[T00:00:00.000Z]');
                    break;

                case 'preparing':
                    order_status = 'ready';
                    end = moment().format('YYYY-MM-DD[T00:00:00.000Z]');
                    break;

                case 'ready':
                    order_status = 'complete';
                    break;

                default:
                    res.end('400: invalid order status');
            }

            //Setting up Query: find order and update order status and time
            let update = { "$set": { "status": order_status, "start_time": start, "end_time": end } };
            let options = { new: true };

            order_model.findOneAndUpdate(query, update, options)
                .then(updatedDocument => {
                    // Displaying document in Console and relevant informaion in response body on Success
                    if (updatedDocument) {

                        console.log(`Successfully updated document: ${updatedDocument}.`);
                        res.send(`Successfully updated order: ${updatedDocument.id} | ${updatedDocument.status}.`);

                    } else {
                        console.log("No such order exists");
                        res.send("400: Order not found");
                    }

                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}
module.exports = {
    set_location,
    filtered_orders,
    update_order_status
}