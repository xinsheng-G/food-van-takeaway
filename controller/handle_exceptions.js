
let handle404 = (req, res) => {

    res.redirect('/404')
}

let handle500 = (req, res) => {

    // render error pages
    res.redirect('/500')
}

// exports functions above
module.exports = {
    handle404, handle500
}