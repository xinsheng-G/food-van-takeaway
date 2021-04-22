const moment = require('moment');

let set_location = (req, res) => {

    let van_name = req.params.id;
    //let van_location = req.body.van_location;

    let van_model = require('../../model/van')

    let query = { 'van_name': van_name };
    let update = { "$set": { "is_open": true } };
    //let update = { "$set": { "is_open": true, "location": van_location } };
    let options = { new: true }

    van_model.findOneAndUpdate(query, update, options)
        .then(updatedDocument => {

            if (updatedDocument) {
                console.log(`Successfully updated document: ${updatedDocument}.`);
                res.send(`Open for Business: ${updatedDocument.van_name} | OPEN: ${updatedDocument.is_open}.`);

            } else {
                console.log("No such van name exists");
                res.send("400: Van not found");
            }

        })
        .catch(err => console.log(err));

}

let filtered_orders = async(req, res) => {

    let status_filter = req.params.status;
    let van_name = req.params.van_name;

    let order_model = require('../../model/order');

    try {
        let query = { 'order_van_name': van_name, 'status': status_filter };

        let filter_orders = await order_model.find(query).lean();

        res.send(filter_orders);
    } catch (err) {
        console.log(err);
    }
}

let update_order_status = (req, res) => {

    let order_id = req.params.id;
    let order_status = "";
    let start = moment(new Date());
    let end = moment(new Date());

    // manage start time and end  time
    let order_model = require('../../model/order');

    let query = { '_id': order_id };
    let projection = { 'status': 1 };

    order_model.findOne(query, projection)
        .then(order => {

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
                    res.send('400: invalid order status');
            }

            let update = { "$set": { "status": order_status, "start_time": start, "end_time": end } };
            let options = { new: true };

            order_model.findOneAndUpdate(query, update, options)
                .then(updatedDocument => {

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