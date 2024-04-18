const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Diary = new Schema({
    counter: {
        type: Schema.Types.ObjectId,
        required: true
    },
    records: [{
        type: Schema.Types.ObjectId,
        ref: 'CommentRecord'
    }]
});
module.exports = mongoose.model('Diary', Diary);