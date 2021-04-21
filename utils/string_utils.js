const moment = require('moment');

/** change the dashes in a string into spaces */
// Replace the underscore in the string with a space and change the initial letter to uppercase
// useful to handle object name differences between database and html page
function change_dash_into_space(name) {
    let res = name.replace(/_/g, ' ');
    return res.charAt(0).toUpperCase() + res.slice(1);
}

/** retrieve date YYYY-MM-DD from Date obj from Mongoose */
function get_date_str_from_Date(date_obj) {

    // when show on the screen, convey the time zone from utc-0 to local
    return moment(new Date(date_obj)).format('YYYY-MM-DD').toString()
}

/** retrieve clock time hour-minute from Date obj from Mongoose */
function get_hour_minute_from_Date(date_obj) {

    // let time_string = new Date(date_obj).toISOString()

    // ISO Date String
    // 2021-04-16T16:00:00.000Z
    // let index_T = time_string.lastIndexOf("T")
    // let index_last_colon = time_string.lastIndexOf(":")
    // return time_string.substring(index_T + 1, index_last_colon)
    return moment(new Date(date_obj)).format('hh:mm A').toString()
}

module.exports = {change_dash_into_space, get_date_str_from_Date, get_hour_minute_from_Date}