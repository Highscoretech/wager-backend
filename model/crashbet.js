const mongoose = require("mongoose");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});
const Counter = mongoose.model('BetCounter', CounterSchema);
const CrashBetSchema = new schema({
    bet_id: {
        type: String,
    },
    token: {
        type: String,
    },
    token_img: {
        type: String,
    },
    user_id: {
        type: String,
        required: true,
    },
    game_id: {
        type: String,
        required: true,
    },
    bet_type: {
        type: String,
        default: "Classic",
    },
    bet: {
        type: Number,
    },
    won: {
        type: Boolean,
    },
    payout: {
        type: Number,
        default: 0,
    },
    bet_time: {
        type: Date,
    }
}, { timestamp : true})
CrashBetSchema.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'bet_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.bet_id = (BigInt("1500000000") + BigInt(counter.seq)).toString();
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('CrashBet', CrashBetSchema)