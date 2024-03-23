const SwapHistory = require("../../model/transactionHistoryModels/SwapHistory");

const getSwapHistory = async (req, res) => {
  try {
    const { user_id } = req.id;
    const asset = req.query.asset;
    const query = {
      user_id,
    };

    if (asset) {
      query.$or = [];
      query.$or.push({ senderCoin: asset });
      query.$or.push({ receiverCoin: asset });
    }

    const current_user_transaction_history = await SwapHistory.find(query);

    res.status(200).json(current_user_transaction_history);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getSwapHistory };
