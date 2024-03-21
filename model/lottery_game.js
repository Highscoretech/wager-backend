const mongoose = require("mongoose");
const moment = require("moment");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);


const LotterySchema = new schema({
    numbers: {
        type: [Number],
        required: true
    },
    game_id: {
        type: Number,
        default: 1,
        required: true,
    },
    total_tickets: {
        type: Number,
        default: 0
    },
    drawn: {
        type: Boolean,
        default: false
    },
    draw_date: {
        type: Date,
        default: function () {
            const now = moment.utc();
            // now.setUTCMinutes(now.getUTCMinutes() + 2);
            // return now.add(2, "minute");
            const date = moment.utc().set({hour:15, minute:0, second:0, millisecond:0});

            if (now.get('hour') > 15 ) {
                return date.add(1, 'day').toDate();
            }
            return date.toDate();
        }
    },
    start_date: {
        type: Date,
        default: function () {
            return moment.utc().add(5, 'minutes').toDate();
        }
    }
}, { timestamp: true })
LotterySchema.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'game_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.game_id = counter.seq;
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('Lottery', LotterySchema)