const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FrameSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    words: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Frame', FrameSchema);