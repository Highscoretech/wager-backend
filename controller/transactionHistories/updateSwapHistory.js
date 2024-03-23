const SwapHistory = require("../../model/transactionHistoryModels/SwapHistory");

const updateSwapHistory = async (
  swappingDetails,
  user_id,
  senderCoinIcon,
  receiverCoinIcon,
  amountSwapped,
  senderWallet,
  receiverWallet
) => {
  const senderCoin = swappingDetails.senderCoin;
  const receiverCoin = swappingDetails.receiverCoin;
  const senderBalances = await getSenderCoinBalances(
    senderWallet,
    amountSwapped,
    user_id
  );
  const receiverBalances = await getReceiverCoinBalances(
    receiverWallet,
    amountSwapped,
    user_id
  );
  const senderCoin_previous_balance = senderBalances.previous;
  const senderCoin_new_balance = senderBalances.new;
  const receiverCoin_previous_balance = receiverBalances.previous;
  const receiverCoin_new_balance = receiverBalances.new;

  try {
    const newSwapRecord = {
      user_id,
      senderCoinIcon,
      receiverCoinIcon,
      senderCoin,
      receiverCoin,
      amountSwapped,
      senderCoin_previous_balance,
      senderCoin_new_balance,
      receiverCoin_previous_balance,
      receiverCoin_new_balance,
    };

    const savedRecord = await SwapHistory.create(newSwapRecord);
  } catch (error) {
    console.log(error);
  }
};

const getSenderCoinBalances = async (wallet, amountSwapped, user_id) => {
  const wallet_details = await wallet.findOne({ user_id });
  const available_balance = wallet_details.balance;
  const previousBalance = available_balance + amountSwapped;
  const senderCoinBalances = {
    previous: previousBalance,
    new: available_balance,
  };
  return senderCoinBalances;
};

const getReceiverCoinBalances = async (wallet, amountSwapped, user_id) => {
  const wallet_details = await wallet.findOne({ user_id });
  const available_balance = wallet_details.balance;
  const previousBalance = available_balance - amountSwapped;
  const receiverCoinBalances = {
    previous: previousBalance,
    new: available_balance,
  };
  return receiverCoinBalances;
};

module.exports = { updateSwapHistory };
