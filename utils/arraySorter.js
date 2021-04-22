function sortBy(field) {
    return function(a,b) {
        return a[field] - b[field];
    }
}

module.exports = {sortBy}