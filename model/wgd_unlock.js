const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    locked: {
        type: Number,
        required: true,
    },
    unlocked: {
        type: Number,
        required: true,
    },
    progress: {
        type: Number,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('wgd_unlock', Userschema)