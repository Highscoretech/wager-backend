const { default: axios } = require("axios");
const crypto = require("crypto");
const DepositRequest = require("../model/deposit_request")
const BTCwallet = require("../model/btc-wallet")
const ETHwallet = require("../model/ETH-wallet")
const CCPAYMENT_API_ID = "RtJX7JPjUJGZOXvI";
const CC_APP_SECRET = "09d111e0f21efe3d7cd916f8dc752789";
const CCPAYMENT_API_URL = "https://admin.ccpayment.com";
const { handleProfileTransactions } = require("../profile_mangement/index")
const { handlePPDunLockUpdate } = require("../profile_mangement/ppd_unlock")
const { handleTotalNewDepsitCount } = require("../profile_mangement/cashbacks")

// Function to get the current BTC to USD exchange rate
async function getExchangeRate() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin',
        vs_currencies: 'usd',
      },
    });
    return response.data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
    return null;
  }
}

async function getExchangeRateETH() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'ethereum',
        vs_currencies: 'usd',
      },
    });
    return response.data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
    return null;
  }
}


const RequestTransaction = (async(event)=>{
  // Get the current date and time
const currentDate = new Date();
// Calculate the date and time 16 hours from now
const futureDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000);
  let data = {
    user_id: event.user_id,
    order_id: event.data.order_id,
    amount: event.data.amount,
    crypto: event.data.crypto,
    network: event.data.network,
    pay_address: event.data.pay_address,
    token_id: event.data.token_id,
    order_valid_period: event.data.order_valid_period,
    time: new Date(),
    expire_in: futureDate,
    merchant_order_id: event.merchant_order_id,
    contract: "-",
    status: "Pending"
  }
  if(event.msg === "success"){
    await DepositRequest.create(data)
  }else{
    console.log("something went wrong")
  }
})

const handleFirstDeposit = ((user_id, amount, num)=>{
    let data = {
      user_id,
      amount,
      date: new Date()
    }
    let bonus
    if(num < 1){
     bonus = amount * (180 / 100)
    }
    else if(num === 1){
      bonus = amount * (240 / 100)
    }
    else if(num === 2){
      bonus = amount * (300 / 100)
    }
    else if(num === 3){
      bonus = amount * (360 / 100)
    }
    // handlePPDunLockUpdate(user_id, bonus)
    // let sql = `INSERT INTO first_deposit SET ?`;
    // connection.query(sql, data, (err, result)=>{
    //     if(err){
    //         (err)
    //     }else{
    //       (result)
    //     }
    // })
})

const handleSuccessfulDeposit = (async(event)=>{
    let eyyn = await DepositRequest.find({merchant_order_id:event.merchant_order_id })
    let user_id = eyyn[0].user_id
    let order_amount = parseFloat(eyyn[0].amount)
    await DepositRequest.updateOne({user_id, merchant_order_id: event.merchant_order_id }, {
      status:event.status,
      contract: event.contract
    })
    if(eyyn[0].crypto === "BTC"){
      let resnj = await BTCwallet.find({user_id})
      let prev_bal = parseFloat(resnj[0].balance)
      await BTCwallet.updateOne({user_id}, {
        balance:prev_bal + order_amount
      })
    }
    if(eyyn[0].crypto === "ETH"){
      let resnj = await ETHwallet.find({user_id})
      let prev_bal = parseFloat(resnj[0].balance)
      await ETHwallet.updateOne({user_id}, {
        balance:prev_bal + order_amount
      })
    }
})

const handleFailedTransaction = (async(event)=>{
  try{
    let eyyn = await DepositRequest.find({merchant_order_id:event.merchant_order_id })
    let user_id = eyyn[0].user_id
    await DepositRequest.updateMany({user_id, merchant_order_id: event.merchant_order_id }, {
      status:event.status,
      contract: event.contract
    })
  }
  catch(err){
    console.log(err)
  }
})


const initiateDeposit = async (req, res) => {
  try {
    const {user_id} = req.id
    const { data } = req.body;
    const transaction_type = "Wallet Fund";
    const timestamp = Math.floor(Date.now() / 1000);
    let tokenid;

    // Function to convert BTC to USD using the current exchange rate
    const convertBTCtoUSD = async(btcAmount)=> {
      const exchangeRate = await getExchangeRate();
      if (exchangeRate !== null) {
        // console.log(`${btcAmount} BTC is equal to ${btcAmount * exchangeRate} USD.`);
       return  btcAmount * exchangeRate;
      } else {
        console.log('Unable to fetch the exchange rate. Please try again later.');
      }
  }

  // Function to convert BTC to USD using the current exchange rate
  const convertETHtoUSD = async(ethAmount)=> {
      const exchangeRate = await getExchangeRateETH();
      if (exchangeRate !== null) {
        // console.log(`${btcAmount} BTC is equal to ${btcAmount * exchangeRate} USD.`);
        return  ethAmount * exchangeRate;
      } else {
        console.log('Unable to fetch the exchange rate. Please try again later.');
      }
  }

 let deposiit_amount 
  let details = data.active_coin
  if(details.coin_name === "BTC"){
    tokenid = 'f36ad1cf-222a-4933-9ad0-86df8069f916'
    let ions =  await convertBTCtoUSD(data.deposit_amount)
    deposiit_amount = (parseFloat(ions)).toFixed(2)
  }
  if(details.coin_name === "ETH"){
    let active_network = data.active_network
    tokenid = '8addd19b-37df-4faf-bd74-e61e214b008a'
    let ions =  await convertETHtoUSD(data.deposit_amount)
    deposiit_amount = (parseFloat(ions)).toFixed(2)
  }

    const merchant_order_id = Math.floor(Math.random()*100000) + 1000000;
    const currency = "USD";
    const paymentData = {
      remark: transaction_type,
      token_id : tokenid,
      product_price: deposiit_amount.toString(),
      merchant_order_id:merchant_order_id.toString(),
      denominated_currency: currency,
      order_valid_period: 43200,
    };
    
    let str = CCPAYMENT_API_ID + CC_APP_SECRET +  timestamp + JSON.stringify(paymentData);
    let sign = crypto.createHash("sha256").update(str, "utf8").digest("hex");
    const headers = {
      Appid: CCPAYMENT_API_ID,
      "Content-Type": "application/json; charset=utf-8",
      Timestamp: timestamp,
      Sign: sign,
    };
  await axios.post(`${CCPAYMENT_API_URL}/ccpayment/v1/bill/create`, paymentData,
      {  headers: headers } 
    ).then((response)=>{
      RequestTransaction({...response.data, user_id, merchant_order_id:merchant_order_id.toString()})
      res.status(200).json({status: true,message: response.data.msg, ...response.data, status: "pending"});
    }) 
    .catch((error)=>{
      console.error("Error processing deposit:", error);
      res.status(404).json({ status: false, message: "Internal server error" });
    })
  }
   catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};


const confirmDeposit = async (req, res) => {
  try {
    let { user_id} = req.id
    let usersID = await DepositRequest.find({user_id,status:"Pending"})
      if(usersID.length > 0){
      const timestamp = Math.floor(Date.now() / 1000);
      let str =  CCPAYMENT_API_ID + CC_APP_SECRET + timestamp +  JSON.stringify({"merchant_order_ids": (usersID[0].merchant_order_id).split(" ")});
      let sign = crypto.createHash("sha256").update(str, "utf8").digest("hex");
      const headers = {
        Appid: CCPAYMENT_API_ID,
        "Content-Type": "application/json; charset=utf-8",
        Timestamp: timestamp,
        Sign: sign,
      };
      const response = await axios.post(
      `${CCPAYMENT_API_URL}/ccpayment/v1/bill/info`,{
        merchant_order_ids: (usersID[0].merchant_order_id).split(" ")
      },{ headers: headers }
      );
      let result = response.data.data
      if(usersID.length > 0){
        result.forEach(element => {
          if(element.order_detail.status === "Successful"){
            handleSuccessfulDeposit(element.order_detail)
          }
           else if(element.order_detail.status !== "Pending"){
            handleFailedTransaction(element.order_detail)
          }
        });
      }
      res.status(200).json(result)
    }
  } catch (error) {
    console.error("Error confirming deposit:", error);
  }
}

const fetchPendingOrder = (async(req, res)=>{
    const {user_id} = req.id
    try{
      const jdiok = await DepositRequest.find({user_id, status: "Pending"})
        res.status(200).json(jdiok)
    }
    catch(error){
      res.status(500).json(error)
    }
})

const updateExpied = (async(req, res)=>{
  const {user_id} = req.id
  try{
    const jdiok = await DepositRequest.updateOne({user_id, status: "Pending"},{
      status: "Expired"
    })
    res.status(200).json(jdiok)
  }
  catch(error){
    res.status(500).json(error)
  }
})

const BTCaAddress = (async(req, res)=>{
  const { user_id } = req.id
  let paymentData = {
    user_id, 
    chain: "ETH",
  }
  const timestamp = Math.floor(Date.now() / 1000);
  let str = CCPAYMENT_API_ID + CC_APP_SECRET +  timestamp + JSON.stringify(paymentData);
  let sign = crypto.createHash("sha256").update(str, "utf8").digest("hex");
  const headers = {
    Appid: CCPAYMENT_API_ID,
    "Content-Type": "application/json; charset=utf-8",
    Timestamp: timestamp,
    Sign: sign,
  };
})

module.exports = { initiateDeposit, fetchPendingOrder , confirmDeposit, BTCaAddress, updateExpied}