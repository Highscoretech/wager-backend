const mongoose = require("mongoose");
const schema = mongoose.Schema
const CrashEndGameLockSchema = new schema({
    game_id: {
        type: String,
        required: true
    },
    expires_at: {
        type: Date,
        default: new Date(),
        expires: 3600
    },
}, { timestamp : true});
module.exports = mongoose.model('CrashEndGameLock', CrashEndGameLockSchema)