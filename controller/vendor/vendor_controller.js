const moment = require('moment');
const string_util = require('../../utils/string_utils');
const discount_util = require('../../utils/dataBase_discount_handler');
let set_location = (req, res) => {

    // Reading Request
    let van_name = req.params.id;


    let van_address = req.body.van_address;
    let van_location_description = req.body.van_location_description;

    //update with req.body with geotext api
    let van_location = JSON.parse(req.body.van_location);
    // Loading Van Collection
    let van_model = require('../../model/van')

    //Setting up Query: find and update van dettails (Open for buisness and locaiton)
    let query = { 'van_name': van_name };
    let update = {
        "$set": {
            "is_open": true,
            "location": { "x_pos": van_location.x_pos, "y_pos": van_location.y_pos },
            "description": van_location_description,
            "text_address": van_address
        }
    };

    let options = { new: true }

    van_model.findOneAndUpdate(query, update, options)
        .then(updatedDocument => {
            // Displaying document in Console and relevant informaion in response body on Success
            if (updatedDocument) {

                //console.log(`Successfully updated document: ${updatedDocument}.`);
                res.send(`Open for Business: ${updatedDocument.van_name} | OPEN: ${updatedDocument.is_open} at ${updatedDocument.van_location_description} `);
            } else {
                console.log("No such van name exists");
                res.redirect('/404');
            }

        })
        .catch(err => {
            console.log(err);
            res.redirect('/500');
        });

}
let close_snackvan = (req, res) => {
    // Reading Request
    let van_name = req.params.id;

    // Loading Van Collection
    let van_model = require('../../model/van')

    //Setting up Query: find and update van dettails (Closed for buisness)
    let query = { 'van_name': van_name };
    let update = {
        "$set": {
            "is_open": false,
            "location": { 'x_pos': null, 'y_pos': null },
            "description": null,
            "text_address": null
        }
    };
    let options = { new: true }

    van_model.findOneAndUpdate(query, update, options)
        .then(updatedDocument => {

            // Displaying document in Console and relevant informaion in response body on Success
            if (updatedDocument) {

                //console.log(`Successfully updated document: ${updatedDocument}.`);
                res.send(`Closed for Business: ${updatedDocument.van_name}`);

            } else {
                console.log("No such van name exists");
                res.redirect('/404');
            }

        })
        .catch(err => {
            console.log(err);
            res.redirect('/500');
        });

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
        let orders = await order_model.find(query).sort({ "start_time": 1 }).lean();
        orders.forEach(order => {
            discount_util.auto_cancel_outdated_order(order);
            discount_util.update_discount_info(order);
        });
        // Displaying list of  filtered orders in response body on Success
        res.send(orders);

    } catch (err) {
        console.log(err);
        res.redirect('/500');
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
    let projection = { 'status': 1, "start_time": 1 };

    order_model.findOne(query, projection)
        .then(order => {

            //Update Status to next State, while managing time
            switch (order.status) {

                case 'confirming':
                    order_status = 'preparing';
                    end = new Date(order.start_time.getTime() + 15 * 60000);
                    break;

                case 'preparing':
                    order_status = 'ready';
                    end = new Date();
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
            let update = { "$set": { "status": order_status, "end_time": end } };
            let options = { new: true };

            order_model.findOneAndUpdate(query, update, options)
                .then(updatedDocument => {
                    // Displaying document in Console and relevant informaion in response body on Success
                    if (updatedDocument) {

                        //console.log(`Successfully updated document: ${updatedDocument}.`);
                        res.send(`Successfully updated order: ${updatedDocument.id} | ${updatedDocument.status}.`);

                    } else {
                        console.log("No such order exists");
                        res.redirect('/404');
                    }

                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/500');
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/500');
        });
}

let show_order_details = (req, res) => {
    order_id = req.params.id;

    let order_model = require('../../model/order');
    let customer_model = require('../../model/customer');
    let snack_model = require('../../model/snack');

    let query = { '_id': order_id };
    let projection = { 'order_customer_id': 1, 'lineItems': 1, 'cost': 1, 'refund': 1, 'start_time': 1, 'is_given_discount': 1, 'status': 1, 'total_price': 1 };

    order_model.findOne(query, projection).lean().then(order => {

        let customer_query = { 'login_id': order.order_customer_id };
        let customer_projection = { 'firstname': 1, 'lastname': 1 };

        customer_model.findOne(customer_query, customer_projection).lean()
            .then(customer_name => {

                order.order_customer_id = order.customer_name;
                delete order.order_customer_id
                order.customer_name = `${customer_name.firstname} ${customer_name.lastname}`;

            }).catch(err => {
                console.log(err);
                res.redirect('/500');
            });

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
            }).catch(err => {
                console.log(err);
                res.redirect('/vendor/login');
            });

    }).catch(err => {
        console.log(err);
        res.redirect('/500');
    });


}

let show_dashboard = (req, res) => {
    //let van_name = req.session.user;
    let van_name = req.session.vendor_user;
    let van_model = require('../../model/van');

    let query = { 'van_name': van_name };
    let projection = { "van_name": 1, 'is_open': 1 };
    van_model.findOne(query, projection).lean()
        .then(van => {
            //add login check
            if (van) {
                if (van.is_open) {
                    res.render('./vendor/dashboard', {
                        van: van.van_name,
                        url: `http://${req.headers.host}`
                    })
                } else {
                    res.redirect('/vendor/buisness');
                }
            } else {
                console.log("LOGIN AGAIN!")
                res.redirect('/vendor/login');
            }
        }).catch(err => {
            console.log(err);
            res.redirect('/500')
        });


}

let show_buisness = (req, res) => {
    //let van_name = req.session.user;
    let van_name = req.session.vendor_user;
    let van_model = require('../../model/van');

    let query = { 'van_name': van_name };
    let projection = { "van_name": 1, 'is_open': 1 };
    van_model.findOne(query, projection).lean()
        .then(van => {
            //add login check
            if (van) {
                if (van.is_open) {
                    res.redirect('/vendor/dashboard');
                } else {
                    res.render('./vendor/buisness', {
                        van: van.van_name,
                        url: `http://${req.headers.host}`
                    })
                }
            } else {
                console.log("LOGIN AGAIN!")
                res.redirect('/vendor/login');
            }
        }).catch(err => {
            console.log(err);
            res.redirect('/500');
        });

}

let search_orders = (req, res) => {
    let van_name = req.params.van_name;

    //req.body not working
    let search_string = req.query.search_string;
    let status = "complete";
    let order_model = require('../../model/order');

    //searches Whole Object _id, json key is variable, 
    let query = req.query.search_mode === 'search-order-id' ? {
        "order_van_name": van_name,
        "status": status
    } : {
        "order_van_name": van_name,
        'order_customer_id': search_string,
        "status": status
    };

    order_model.find(query).lean().then(orders => {
        if (req.query.search_mode === 'search-order-id') {
            let filtered_order = orders.filter(order => {
                return search_string.toUpperCase() === string_util.get_partial_id(order._id);
            })
            orders = filtered_order;
        }

        res.send(orders);
    }).catch(err => {
        console.log(err);
        res.redirect('/500');
    });


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