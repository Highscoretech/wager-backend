const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
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
    password : {
        type: String,
        required: true
    },
    google_auth : {
        type: Boolean,
        required: true
    },
    created_at : {
        type: Date,
        required: true
    },
    lastLoginAt : {
        type: Date,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        required: true
    },
    last_login_ip: {
        type: String,
        required: true
    },
}, { timestamp : true})

module.exports = mongoose.model('User', Userschema)