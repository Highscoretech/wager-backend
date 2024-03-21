const mongoose = require("mongoose");
const schema = mongoose.Schema

const LotterySchema = new schema({
    game_id: {
        type: Number,
        required: true,
    },
    server_seed_hash: {
        type: String,
        required: true,
    },
    server_seed: {
        type: String,
        required: true,
    },
    client_start_block: {
        type: String,
    },
    client_seed: {
        type: String,
    },
    client_seed_hash: {
        type: String,
    },
    updated_at: {
        type: Date,
    }
}, { timestamp : true})

module.exports = mongoose.model('lottery_encryped_seed', LotterySchema)