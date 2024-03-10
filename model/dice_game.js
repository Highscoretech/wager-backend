const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    profile_img: {
        type: String,
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
    bet_id: {
        type: Number,
        required: true,
    },
    game_nonce: {
        type: Number,
        required: true,
    },
    payout: {
        type: Number,
        required: true,
    },
    has_won: {
        type: Boolean,
        required: true,
    },
    server_seed: {
        type: String,
        required: true,
    },
    client_seed: {
        type: String,
        required: true,
    },
    chance: {
        type: Number,
        required: true,
    },
    hidden_from_public: {
        type: Boolean,
        required: true,
    },
    cashout: {
        type: Number,
        required: true,
    },
    profit: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
}, { timestamp : true})

module.exports = mongoose.model('Dice_game', Userschema)