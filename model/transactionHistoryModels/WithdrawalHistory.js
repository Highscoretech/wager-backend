const mongoose = require("mongoose");

const WithdrawalHistorySchema = new mongoose.Schema(
  {
    user_id: {
        type: String,
        required: true
    },

    status: {
        type: String,
        require: true
    }, 
    amount: {
      type: Number,
      required: true,
    },
    previous_balance: {
      type: String,
    },
    available_balance: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalHistory", WithdrawalHistorySchema);
