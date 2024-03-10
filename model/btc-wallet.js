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
    coin_fname: {
        type: String,
        required: true,
    },
    coin_name: {
        type: String,
        required: true,
    },
    is_active:{
        type: Boolean,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('btc_wallet', Userschema)