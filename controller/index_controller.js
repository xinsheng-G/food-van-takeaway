let show_page = (req, res) => {
    // render index page
    res.render('index', {layout: false});
}

// export functions above
module.exports = {
    show_page
}