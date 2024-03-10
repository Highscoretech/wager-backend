const mongoose = require("mongoose");
const schema = mongoose.Schema

const Schema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    bet_id: {
        type: Number,
        required: true,
    },
    bet_amount: {
        type: Number,
        required: true,
    },
    token_img: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    won: {
        type: Boolean,
        required: true,
    },
    payout: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        default: new Date()
    }
}, { timestamp : true})

module.exports = mongoose.model('Hilo_game_history', Schema)