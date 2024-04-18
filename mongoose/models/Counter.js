const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = new Schema({
    name: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    resets: [{
        type: Schema.Types.ObjectId,
        ref: 'CommentRecord'
    }],
    diary: {
        records: [{
            type: Schema.Types.ObjectId,
            default: [],
            ref: 'CommentRecord'
        }]
    }
});
module.exports = mongoose.model('Counter', Counter);