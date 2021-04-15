const name_util = require('../utils/name_utils')

let show_page = async (req, res) => {
    let snacks = []

    let drinks = []
    let foods = []

    let van_name = req.params.van_name;

    // TODO: if has a corresponding cart cookie, load from the cookie first
    // .....


    // read all snacks from db
    /**
     * If using mongoose, use .lean() at the end of the query to get a json object (instead of a mongoose one).
     * To prevent Handlebars access deny problem
     * */
    let snack_model = require('../model/snack')
    snacks = await snack_model.find({}, '_id snack_name is_drink is_available price picture_path').lean();

    // divide snacks into drinks and foods
    snacks.forEach((snack) => {

        // add new attribute: snack_title
        // replace snack_name's dash line into spaces.
        snack['snack_title'] = name_util.change_dash_into_space(snack.snack_name);

        // if is drink
        if (snack.is_available && snack.is_drink) {
            drinks.push(snack);
        }
        // if is food, not drink
        else if (snack.is_available && !snack.is_drink) {
            foods.push(snack)
        } else {
            // if not available, not show on the page
        }
    })

    res.render('./customer/menu',{
        title: 'Menu',
        van_name: van_name,
        van_title: name_util.change_dash_into_space(van_name),
        foods: foods,
        drinks: drinks
    })
}

let add_new_order = (req, res) => {
    res.end('<h1>redirect to /customer/my_orders/checkout, implement data persistence there</h1>')
    // this function will retrieve data from menu page, create data objects based on posted data,
    // then store these data objects into cookies and redirect to `/customer/my_orders/checkout`
    // ,and `/customer/my_orders/checkout` page will have a controller function to render the cookie
    // on the page and store the order data to `orders` collection in database.

}

// export functions above
module.exports = {
    show_page, add_new_order
}