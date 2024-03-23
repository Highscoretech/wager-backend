const mongoose = require("mongoose");

const SwapHistorySchema = new mongoose.Schema(
  {
      user_id: {
        type: String,
        required: true
      },
      senderCoin: {
        type: String,
        require: true,
      },
      amountSwapped: {
        type: Number,
        require: true,
      },
      senderCoinIcon: {
        type: String,
        require: true,
      },
      senderCoin_previous_balance: {
        type: Number,
        require: true,
      },
      senderCoin_new_balance: {
        type: Number,
        require: true,
      },
      receiverCoin: {
        type: String,
        require: true,
      },
      receiverCoinIcon: {
        type: String,
        require: true,
      },
      receiverCoin_previous_balance: {
        type: Number,
        require: true,
      },
      receiverCoin_new_balance: {
        type: Number,
        require: true,
      }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("SwapHistory", SwapHistorySchema);
