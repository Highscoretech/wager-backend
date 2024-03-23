const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    network: {
        type: String,
        required: true,
    },
    crypto: {
        type: String,
        required: true,
    },
    pay_address: {
        type: String,
        required: true,
    },
    token_id: {
        type: String,
        required: true,
    },
    contract: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    merchant_order_id: {
        type: String,
        required: true,
    },
    order_valid_period: {
        type: Number,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    order_id: {
        type: String,
        required: true,
    },
    expire_in:{
        type: Date,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('Deposit_request', Userschema)