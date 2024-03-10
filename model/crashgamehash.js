const mongoose = require("mongoose");
const schema = mongoose.Schema

const HashSchema = new schema({
    hash: {
        type: String,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    }
}, { timestamp : true})

module.exports = mongoose.model('CrashGameHash', HashSchema)