// Replace the underscore in the string with a space and change the initial letter to uppercase
// useful to handle
// change it to a more secure encryption algorithm later
function change_dash_into_space(name) {
    let res = name.replace(/_/g, ' ');
    return res.charAt(0).toUpperCase() + res.slice(1);
}

module.exports = {change_dash_into_space}