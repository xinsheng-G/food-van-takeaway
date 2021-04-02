let handle404 = (req, res) => {

    // render error pages
    res.status(404).render('404',{title: '404'})
}

let handle500 = (req, res) => {

    // render error pages
    res.status(500).render('500', {title: '500'})
}

// exports functions above
module.exports = {
    handle404, handle500
}