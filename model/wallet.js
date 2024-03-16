const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
        unique : true
    },
    balance: {
        type: Number,
        required: true,
    },
    coin_image: {
        type: String,
        required: true,
    },
    coin_name: {
        type: String,
        required: true,
    },
    hidden_from_public: {
        type: Boolean,
        required: true,
    },
}, { timestamp : true})

module.exports = mongoose.model('default_wallet', Userschema)