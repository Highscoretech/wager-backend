const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    born: {
        type: String,
        required: true,
    }, 
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    next_level_point: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
        unique : true
    }, 
    email: {
        type: String,
        required: true,
        unique : true
    },
    hide_profile: {
        type: Boolean,
        required: true,
    },
    hidden_from_public: {
        type: Boolean,
        required: true,
    },
    refuse_friends_request: {
        type: Boolean,
        required: true,
    },
    refuse_tips: {
        type: Boolean,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    profile_image: {
        type: String,
        required: true,
    },
    vip_level: {
        type: Number,
        required: true,
    },
    kyc_is_activated: {
        type: Boolean,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    total_wagered: {
        type: Number,
        required: true,
    },
    invited_code: {
        type: String,
        required: true,
    },
    google_auth_is_activated: {
        type: Boolean,
        required: true,
    },
    is_suspend: {
        type: Boolean,
        required: true,
    },
    vip_progress: {
        type: Number,
        required: true,
    },
    fa_is_activated: {
        type: Boolean,
        required: true,
    },
    earn_me: {
        type: Number,
        required: true,
    },
    commission_reward: {
        type: Number,
        required: true,
    },
    usd_reward: {
        type: Number,
        required: true,
    },
    joined_at: {
        type: Date,
        required: true,
    },
    account_type: {
        type: String,
        required: true,
    },
    total_chat_messages: {
        type: Number,
        required: true,
    },
    weekly_wagered: {
        type: Number,
        required: true,
    },
    monthly_wagered: {
        type: Number,
        required: true,
    },
}, { timestamp : true})

module.exports = mongoose.model('Profile', Userschema)