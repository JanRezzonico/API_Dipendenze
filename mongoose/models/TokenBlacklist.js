const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TokenBlacklist = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
});
module.exports = mongoose.model('TokenBlacklist', TokenBlacklist);