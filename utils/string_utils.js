const moment = require('moment');

/** change the dashes in a string into spaces */
// Replace the underscore in the string with a space and change the initial letter to uppercase
// useful to handle object name differences between database and html page
function change_dash_into_space(name) {
    let res = name.replace(/_/g, ' ');
    return res.charAt(0).toUpperCase() + res.slice(1);
}

/**
 * get partial id from full_id string
 * 6-digits to avoid collision in showing on the screen */
function get_partial_id(full_id) {

    let full_id_string = full_id.toString()
    return full_id_string.toString().substring(full_id_string.length - 6).toUpperCase()
}

/** retrieve date string YYYY-MM-DD from Date obj from Mongoose */
function get_date_str_from_Date(date_obj) {

    // when show on the screen, convey the time zone from utc-0 to local
    return moment(new Date(date_obj)).format('dddd, D MMMM').toString()
}

/** retrieve clock time hour-minute from Date obj from Mongoose */
function get_hour_minute_from_Date(date_obj) {

    // let time_string = new Date(date_obj).toISOString()

    // to local timezone
    return moment(new Date(date_obj)).format('hh:mm A').toString()
}

module.exports = {change_dash_into_space, get_date_str_from_Date, get_hour_minute_from_Date, get_partial_id}