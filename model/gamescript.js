const mongoose = require("mongoose");
const schema = mongoose.Schema;
const CounterSchema = new schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("GameScriptCounter", CounterSchema);
const GameScriptSchema = new schema(
  {
    script_id: {
      type: String,
    },
    game_name: {
      type: String,
    },
    user_id: {
      type: String,
    },
    name: {
      type: String,
    },
    content: {
      type: String,
    },
    created_at: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamp: true }
);
GameScriptSchema.pre("save", async function (next) {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "script_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.script_id = counter.seq.toString();
    next();
  } catch (error) {
    return next(error);
  }
});
module.exports = mongoose.model("GameScripts", GameScriptSchema);
