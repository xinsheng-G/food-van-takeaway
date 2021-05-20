const moment = require('moment');
let set_location = (req, res) => {
    console.log(req.body);

    // Reading Request
    let van_name = req.params.id;

    //update with req.body with geotext api
    let van_location = { 'x_pos': 0, 'y_pos': 0 };
    let van_location_description = "";

    // Loading Van Collection
    let van_model = require('../../model/van')

    //Setting up Query: find and update van dettails (Open for buisness and locaiton)
    let query = { 'van_name': van_name };
    let update = { "$set": { "is_open": true, "location": van_location, "description": van_location_description } };
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
let close_snackvan = (req, res) => {
    console.log(req.body);
    // Reading Request
    let van_name = req.params.id;

    // Loading Van Collection
    let van_model = require('../../model/van')

    //Setting up Query: find and update van dettails (Closed for buisness)
    let query = { 'van_name': van_name };
    let update = { "$set": { "is_open": false, "location": { 'x_pos': null, 'y_pos': null }, "description": null } };
    let options = { new: true }

    van_model.findOneAndUpdate(query, update, options)
        .then(updatedDocument => {

            // Displaying document in Console and relevant informaion in response body on Success
            if (updatedDocument) {

                //console.log(`Successfully updated document: ${updatedDocument}.`);
                res.send(`Closed for Business: ${updatedDocument.van_name}`);

            } else {
                console.log("No such van name exists");
                res.send("400: Van not found");
            }

        })
        .catch(err => console.log(err));

}
let filtered_orders = async(req, res) => {

    // Reading Request
    let van_name = req.params.van_name;
    let status = req.params.state;
    // Loading Order Collection
    let order_model = require('../../model/order');

    //Async function to wait for response from database
    try {

        //Setting up Query: filter orders based on provided status(Confirming, Preparing (outstanding), Ready, Complete)
        let query = { 'order_van_name': van_name, 'status': status };
        let orders = await order_model.find(query).lean();

        // Displaying list of  filtered orders in response body on Success
        res.send(orders);

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

                case 'complete':
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

let show_order_details = (req, res) => {
    order_id = req.params.id;

    let order_model = require('../../model/order');
    let customer_model = require('../../model/customer');
    let snack_model = require('../../model/snack');

    let query = { '_id': order_id };
    let projection = { 'order_customer_id': 1, 'lineItems': 1, 'cost': 1, 'refund': 1, 'start_time': 1, 'is_given_discount': 1, 'status': 1 };

    order_model.findOne(query, projection).lean().then(order => {

        let customer_query = { 'login_id': order.order_customer_id };
        let customer_projection = { 'firstname': 1, 'lastname': 1 };

        customer_model.findOne(customer_query, customer_projection).lean()
            .then(customer_name => {

                order.order_customer_id = order.customer_name;
                delete order.order_customer_id
                order.customer_name = `${customer_name.firstname} ${customer_name.lastname}`;

            }).catch(err => console.log(err));

        let snacks_projection = { 'snack_name': 1, 'price': 1 };
        snack_model.find({}, snacks_projection).lean()
            .then(snacks => {
                let lineItems_info = [];
                order.lineItems.forEach(item => {
                    snack = snacks.filter(snack => {
                        let lineItem_total = 0;
                        if (snack.snack_name === item.snack_name) {

                            lineItem_total = snack.price * item.number;

                            lineItems_info.push({
                                'snack_name': snack.snack_name,
                                'number': item.number,
                                'total': lineItem_total
                            });
                            return true;

                        } else {
                            return false;
                        };
                    });
                });
                order.lineItems = lineItems_info;
                res.send(order)
            }).catch(err => console.log(err));

    }).catch(err => console.log(err));


}

let show_dashboard = (req, res) => {
    res.render('./vendor/dashboard', {
        van: 'valve',
        url: `http://${req.headers.host}`
    });
}

let show_buisness = (req, res) => {
    res.render('./vendor/buisness', {
        van_name: 'valve',
        url: `http://${req.headers.host}`
    })
}

let search_orders = (req, res) => {
    let van_name = req.params.van_name;
    //req.body not working
    let search_string = req.body.search_string;

    let order_model = require('../../model/order');
    //searches Whole Object _id, json key is variable, 
    let query = req.body.search_mode === 'search-order-id' ? { "order_van_name": van_name, '_id': { "$regex": search_string, "$options": "i" } } : { "order_van_name": van_name, 'order_customer_id': { "$regex": search_string, "$options": "i" } };

    console.log(query);
    let searched_order_details = [];
    order_model.find(query).lean().then(orders => {
        orders.forEach(async order => {
            let url = `http://localhost:8080`;
            //does axios work in node
            await axios.get(`${url}/vendor/order/${order._id}`).then(order_details => {
                searched_order_details.push(order_details.data);
            }).catch(err => console.log(err));
        });
        res.send(searched_order_details);
    }).catch(err => console.log(err));


}

module.exports = {
    set_location,
    close_snackvan,
    filtered_orders,
    update_order_status,
    show_order_details,
    show_dashboard,
    show_buisness,
    search_orders

}