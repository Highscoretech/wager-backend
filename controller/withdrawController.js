const { axios } = require("axios");
const BTCwallet = require("../model/btc-wallet")
const ETHwallet = require("../model/ETH-wallet")
const crypto = require("crypto");
const { updateWithdrawalHistory } = require("./transactionHistories/updateWithdrawalHistory");

const CCPAYMENT_API_ID = "RtJX7JPjUJGZOXvI";
const CC_APP_SECRET = "09d111e0f21efe3d7cd916f8dc752789";
const CCPAYMENT_API_URL = "https://admin.ccpayment.com";

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const seconds = String(now.getSeconds()).padStart(2, "0");

const formattedDbTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
const initiateWithdrawal = async (req, res) => {
  try {
    const {user_id} = req.id
    const { data } = req.body;
    if (!data.withdraw_address || !data.withdraw_amount) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    // if (data.withdraw_amount < 6.4) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Amount must be greater than 6.4usdt",
    //   });
    // }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const formattedTimeStamp = currentTimestamp.toString().slice(0, 10);
    let wallet = ""
    if(data.active_coin.coin_name === "BTC"){
      wallet = await BTCwallet.find({user_id})
    }else{
      wallet = await ETHwallet.find({user_id})
    }
    const userBalance = wallet[0].balance;
      if (userBalance < data.withdraw_amount) {
        return res.status(400).json({
          status: false,
          message: "Insufficient funds",
        });
      } 
  else {
    let token_id;
    if(data.active_coin.coin_name === "ETH"){
      token_id = "264f4725-3cfd-4ff6-bc80-ff9d799d5fb2"
    }
    else if(data.active_coin.coin_name === "BTC"){
      token_id = "0912e09a-d8e2-41d7-a0bc-a25530892988"
    }

  const uniqueId = Math.floor(Math.random() * 1000);
  const transaction_id = parseInt(`${currentTimestamp}${uniqueId}`);
  const transaction_type = "Wallet Withdrawal";
  const merchant_order_id = transaction_id.toString();
  const memo = (Math.floor(Math.random() * 1000) * 9999).toString();
    const withdrawData = {
      merchant_order_id,
      merchant_pays_fee: false,
      address: data.address,
      token_id,
      value: (data.withdraw_amount).toString(),
      memo,
    };
    let str = CCPAYMENT_API_ID + CC_APP_SECRET + formattedTimeStamp +  JSON.stringify(withdrawData);
        let sign = crypto.createHash("sha256").update(str, "utf8").digest("hex");
        const headers = {
          Appid: CCPAYMENT_API_ID,
          "Content-Type": "application/json; charset=utf-8",
          Timestamp: formattedTimeStamp,
          Sign: sign,
        };
        const response = await axios.post(`${CCPAYMENT_API_URL}/ccpayment/v1/withdraw`,
          withdrawData,
        { headers: headers});
      if (response.data.msg === "success") {
        const newAmount = Number(userBalance) - Number(data.withdraw_amount);
        if(data.active_coin.coin_name === "BTC"){
          await BTCwallet.updateOne({user_id},{
            balance: newAmount
          });
        }
        else{
          await ETHwallet.updateOne({user_id},{
            balance: newAmount
          });
        }
        res.status(201).json({
          status: true,
          message: "Crypto withdrawn successfully",
          data: response.data,
        });
        await updateWithdrawalHistory(user_id, "Successful", data.withdraw_amount, userBalance, newAmount);
    } 
    else {
      res.status(400).json({
        status: false,
        message: `${response.data.msg}`,
      });
      await updateWithdrawalHistory(user_id, "Failed", data.withdraw_amount);
    }
  }
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    // updateWithdrawalHistory(user_id, describtion, data.withdraw_amount, userBalance, newAmount, "Failed");
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  initiateWithdrawal,
};