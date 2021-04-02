let show_page = async (req, res) => {
    // render index page
    // index page doesn't rely on the main.hbs layout

    // let map user's location to be: 144.95782936759818,-37.79872198514221
    // user's location shouldn't be stored in db
    let user_pos = {
        x_pos: 144.95782936759818,
        y_pos: -37.79872198514221
    }

    // dynamic component: Vans location
    let vans = []


    let van_model = require('../model/van')
    await van_model.find({}, '-_id van_name is_open picture_path description location stars', function (err, resp) {
        if (err) {
            console.log('error: ' + err);
        } else {
            vans = resp;
        }

        console.log('result + ', resp)
    });

    // let query = van_model.find()
    // // select all vans from Vans collection
    // query.select('van_name is_open picture_path description location stars');
    //
    // await query.exec(await function (err, resp) {
    //     console.log('checking db!')
    //     if (err) {
    //         console.log('error: ' + err);
    //     } else {
    //         vans = resp;
    //     }
    //     console.log('result + ', resp)
    // })

    console.log(vans)
    if (vans.length === 0) {

        res.render('index', {layout: false, user_to_show: user_pos, vans_to_show: []});

    } else {
        // vans that need to be showed
        let vans_to_show = [];
        // pick open van to show
        vans.forEach((van) => {
            if (van.is_open) {
                vans_to_show.push(van);
            }
        })

        vans = []
        res.render('index', {
            layout: false,
            vans_to_show: vans_to_show,
            user_to_show: user_pos
        })
    }

}

// export functions above
module.exports = {
    show_page
}