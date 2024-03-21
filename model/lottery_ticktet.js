const mongoose = require("mongoose");
const schema = mongoose.Schema

// delete mongoose.connection.models['LotteryTicket'];

const TicketCounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('TicketCounter', TicketCounterSchema);
const LotteryTicketSchema = new schema({
    ticket_id: {
        type: Number,
        default: 1,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        ref: "User",
    },
    numbers: {
        type: [Number],
        required: true
    },
    game_id: {
        type: Number,
        ref: "Lottery",
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    matched: {
        type: Number,
        default: 0
    },
    prize: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Boolean,
        default: false
    }
}, { timestamp : true})
LotteryTicketSchema.pre('save', async function(next) {
    try {
        const counter = await Counter.findByIdAndUpdate({_id: 'ticket_id'}, {$inc: { seq: 1}}, {new: true, upsert: true});
        this.ticket_id = counter.seq;
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('LotteryTicketV2', LotteryTicketSchema)