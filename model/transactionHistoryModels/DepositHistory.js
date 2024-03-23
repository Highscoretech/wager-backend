const mongoose = require("mongoose");

const DepositHistorySchema = new mongoose.Schema(
    {
        user_id: {
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
        coin_image: {
            type: String,
        },
        status: {
            type: String,
            required: true,
        },
        merchant_order_id: {
            type: String,
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

        
        }, { timestamp : true}
);

module.exports = mongoose.model("DepositHistory", DepositHistorySchema);



