const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    registered_friends: {
        type: Number,
        required: true,
    },
    affiliate_code: {
        type: String,
        required: true,
    },
    is_activated: {
        type: Boolean,
        required: true,
    },
    friends	: {
        type: Array,
        required: true,
    },
    commission_reward: {
        type: Number,
        required: true,
    },
    today_commission: {
        type: Number,
        required: true,
    },
    available_usd_reward: {
        type: Number,
        required: true,
    },
    is_suspend: {
        type: Boolean,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('affiliate_code', Userschema)