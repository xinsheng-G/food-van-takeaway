let fs = require('fs')
let handle404 = (req, res) => {

    res.redirect('/404')
}

let handle500 = (req, res) => {

    // render error pages
    res.status(500).render('./500')
}

// exports functions above
module.exports = {
    handle404, handle500
}