const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    game_hash: {
        type: String,
        required: true,
    },
    game_id: {
        type: Number,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('crash_hash', Userschema)