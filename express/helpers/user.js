const User = require("../../mongoose/models/User");

/**
 * @param {User} user 
 * @param {String} token 
 */
const formatUser = (user, token = undefined) => {
    const result = { token: token, ...user._doc };
    delete result.password;
    return result;
}

module.exports = { formatUser };