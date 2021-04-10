let show_page = async (req, res) => {
    let snacks = []

    let drinks = []
    let foods = []

    let van_name = req.params.van_name;
    console.log('van name: ' + van_name);

    // read all snacks from db
    /**
     * If using mongoose, use .lean() at the end of the query to get a json object (instead of a mongoose one).
     * To prevent Handlebars access deny problem
     * */
    let snack_model = require('../model/snack')
    snacks = await snack_model.find({}, '-_id snack_name is_drink is_available price picture_path').lean();

    // divide snacks into drinks and foods
    snacks.forEach((snack) => {
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
        foods: foods,
        drinks: drinks
    })
}

let add_new_order = (req, res) => {
    res.end('<h1>Get order</h1>')

}

// export functions above
module.exports = {
    show_page, add_new_order
}