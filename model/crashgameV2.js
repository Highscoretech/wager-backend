const mongoose = require("mongoose");
const schema = mongoose.Schema;
const BetSchema = new schema({
  user_id: {
    type: String,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String
  },
  hidden: {
    type: Boolean,
  },
  bet: {
    type: Number,
  },
  token: {
    type: String
  },
  token_img: {
    type: String
  },
  bet_time: {
    type: Date
  },
  bet_rate: {
    type: Number,
    default: 0
  },
  bet_type: {
    type: Number,
  },
  auto_escape: {
    type: Number,
  }
});
const EscapeSchema = new schema({
  user_id: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true
  },
});
const CounterSchema = new schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("CrashGameCounter", CounterSchema);
const CrashGameSchema = new schema(
  {
    game_id: {
      type: String,
    },
    crash_point: {
      type: Number,
      default: 1,
    },
    status: {
      type: Number,
      default: 1,
    },
    hash: {
      type: String,
    },
    bets: {
        type: [BetSchema],
        default: []
    },
    escapes: {
      type: [EscapeSchema],
      default: []
    },
    start: {
      type: Date,
      default: new Date(),
    },
    end: {
      type: Date,
    },
    concluded: {
      Type: Boolean
    },
  },
  { timestamp: true }
);
CrashGameSchema.pre("save", async function (next) {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "game_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.game_id = (BigInt("1000") + BigInt(counter.seq)).toString();
    next();
  } catch (error) {
    return next(error);
  }
});
module.exports = mongoose.model("CrashGameV2", CrashGameSchema);
