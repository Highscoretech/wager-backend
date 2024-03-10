const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    hash: {
        type: String,
        required: true,
    },
    game_id: {
        type: String,
        required: true,
    },
    crash_point: {
        type: Number,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('Crash_game_history', Userschema)