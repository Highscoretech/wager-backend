const mongoose = require("mongoose");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('HiloSeedCounter', CounterSchema);
const Schema = new schema({
    seed_id: {
        type: Number,
        default: 1
    },
    user_id: {
        type: String,
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
    hash_seed: {
        type: String,
        required: true,
    },
    next_server_seed: {
        type: String,
        required: true,
    },
    next_hash_seed: {
        type: String,
        required: true,
    },
    nonce: {
        type: Number,
        default: 0,
    },
    is_open: {
        type: Boolean,
        default: false,
    },
    updated_at: {
        type: Date
    }
}, { timestamp : true})
Schema.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'seed_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.seed_id = counter.seq;
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('hilo_encryped_seed', Schema)