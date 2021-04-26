/** Rounds the value v to preserve the e bits */
function my_round(v,e){

    var t=1;

    for(;e>0;t*=10,e--);

    for(;e<0;t/=10,e++);

    return Math.round(v*t)/t;
}

function rad(d) {
    return d * Math.PI / 180.0
}

/** Find the distance between two points by their latitude and longitude */
function findDistance(x_pos1, y_pos1, x_pos2, y_pos2){

    let EARTH_RADIUS = 6378.137

    let radLat1 = rad(y_pos1);
    let radLat2 = rad(y_pos2);
    let a = radLat1 - radLat2;

    let b = rad(x_pos1) - rad(x_pos2);

    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
        + Math.cos(radLat1) * Math.cos(radLat2)
        * Math.pow(Math.sin(b / 2), 2)));

    s = s * EARTH_RADIUS;
    // s km
    s = Math.round(s * 10000) / 10000;
    s = my_round(s, 1)
    console.log('get distance: ' + s + ' km')
    return s;
}

module.exports = {my_round, findDistance}
