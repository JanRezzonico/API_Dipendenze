const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentRecord = new Schema({
    date: {
        type: Date,
        required: true
    },
    comment: {
        type: String,
        required: false,
        default: ''
    }
});
module.exports = mongoose.model('CommentRecord', CommentRecord);