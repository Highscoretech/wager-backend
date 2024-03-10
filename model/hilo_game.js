const mongoose = require("mongoose");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});
const Counter = mongoose.model('HiloGameCounter', CounterSchema);
const roundSchema = new schema({
    hi_chance: {
        type: Number,
    },
    lo_chance: {
        type: Number,
    },
    skipped: {
        type: Boolean,
    },
    cardRank: {
        type: String,
        required: true,
    },
    cardRankNumber: {
        type: Number,
        required: true,
    },
    profit: {
        type: Number,
    },
    cardSuite: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: Number,
        required: true,
    },
    lo: {
        type: Boolean,
    },
    hi: {
        type: Boolean,
    },
    payout: {
        type: Number,
        default: 0
    },
});

const Schema = new schema({
    user_id: {
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
        type: String,
        default: "1",
        required: true,
    },
    seed_id: {
        type: Number,
        required: true,
    },
    payout: {
        type: Number,
        default: 0,
    },
    won: {
        type: Boolean,
        default: false,
    },
    round: {
        type: Number,
        default: 0,
    },
    rounds: {
        type: [roundSchema],
        default: [],
    },
    has_ended: {
        type: Boolean,
        default: false,
    },
    lo_chance: {
        type: Number,
        required: true,
    },
    hi_chance: {
        type: Number,
        required: true,
    },
    profit: {
        type: Number,
        default: 0,
    },
    time: {
        type: Date,
        default: new Date(),
    },
    nonce: {
        type: Number,
        default: 0
    }
}, { timestamp : true})
Schema.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'bet_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.bet_id = (BigInt("4000") + BigInt(counter.seq)).toString();
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('Hilo_game', Schema)