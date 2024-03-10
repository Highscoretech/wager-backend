const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    msg_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    profle_img: {
        type: String,
        required: true,
    },
    hide_profile: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    gif: {
        type: String,
        required: true,
    },
    vip_level: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('public_chat', Userschema)