const crypto = require('crypto');
// const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const DiceEncription = require("../model/dice_encryped_seeds");
const DiceGame = require("../model/dice_game");
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const BTCWallet = require("../model/btc-wallet");
const ETHWallet = require("../model/ETH-wallet");
const WGFWallet = require("../model/WGF-wallet");
const Bills = require("../model/bill");
let nonce = 0
let maxRange = 100
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const handleHashGeneration = (() => {
  const serverSeed = crypto.randomBytes(32).toString('hex');
  const clientSeed = generateString(23);
  const combinedSeed = serverSeed + salt + clientSeed;
  const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
  let encrypt = { hash, clientSeed, serverSeed }
  return encrypt
})

async function handleUpdatewallet(data) {
  try {
    await DiceEncription.updateOne(
      { user_id: data.user_id }, {
      nonce: parseFloat(data.nonce) + 1
    });
    if (data.token === "WGF") {
      let sjj = await WGFWallet.find({ user_id: data.user_id });
      let prev_bal = parseFloat(sjj[0].balance);
      let wining_amount = parseFloat(data.wining_amount);
      let bet_amount = parseFloat(data.bet_amount);
      if (data.has_won) {
        let current_amount = prev_bal + wining_amount;
        await WGFWallet.updateOne(
          { user_id: data.user_id },
          { balance: current_amount });
      }
      else {
        let current_amount = prev_bal - bet_amount;
        await WGFWallet.updateOne(
          { user_id: data.user_id },
          { balance: prev_bal - bet_amount }
        );
      }
    }
    else if (data.token === "BTC") {
      let sjj = await BTCWallet.find({ user_id: data.user_id });
      let prev_bal = parseFloat(sjj[0].balance);
      let wining_amount = parseFloat(data.wining_amount);
      let bet_amount = parseFloat(data.bet_amount);
      if (data.has_won) {
        let current_amount = prev_bal + wining_amount;
        await BTCWallet.updateOne(
          { user_id: data.user_id },
          { balance: prev_bal + wining_amount }
        );
      } else {
        let current_amount = prev_bal - bet_amount;
        await BTCWallet.updateOne(
          { user_id: data.user_id },
          { balance: current_amount }
        );
      }
    }
    else if (data.token === "ETH") {
      let sjj = await ETHWallet.find({ user_id: data.user_id });
      let prev_bal = parseFloat(sjj[0].balance);
      let wining_amount = parseFloat(data.wining_amount);
      let bet_amount = parseFloat(data.bet_amount);
      if (data.has_won) {
        let current_amount = prev_bal + wining_amount;
        await ETHWallet.updateOne(
          { user_id: data.user_id },
          { balance: prev_bal + wining_amount }
        );
      } else {
        let current_amount = prev_bal - bet_amount;
        await ETHWallet.updateOne(
          { user_id: data.user_id },
          { balance: current_amount }
        );
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}


async function handleDiceBEt(data) {
  let events = data[0];
  try {
    // if (events.token !== "WGF") {
    //   handleWagerIncrease(events);
    // }
    let result = await DiceGame.create(events);
  }
  catch (error) {
    console.log(error);
  }
  let bil = {
    user_id: events.user_id,
    transaction_type: "Classic Dice",
    token_img: events.token_img,
    token_name: events.token,
    balance: events.current_amount,
    trx_amount: events.has_won ? events.wining_amount : events.bet_amount,
    datetime: events.time,
    status: events.has_won,
    bill_id: events.bet_id,
  };
  await Bills.create(bil);
}

function handleMybet(e, user, prev_bal, res) {
  if (user.is_roll_under) {
    if (parseFloat(e.cashout) < parseFloat(user.chance)) {
      let wining_amount = parseFloat(user.wining_amount);
      let current_amount = parseFloat(prev_bal + wining_amount).toFixed(4);
      handleUpdatewallet({ has_won: true, current_amount, ...user });
      const data = [
        {
          ...e,
          ...user,
          current_amount,
          has_won: true,
          profit: wining_amount,
          bet_id: Math.floor(Math.random() * 100000000000) + 720000000000,
        },
      ];
      handleDiceBEt(data);
      return res.status(200).json(data);
    } else {
      let bet_amount = parseFloat(user.bet_amount);
      let current_amount = parseFloat(prev_bal - bet_amount).toFixed(4);
      handleUpdatewallet({ current_amount, has_won: false, ...user });
      const data = [
        {
          ...e,
          ...user,
          current_amount,
          has_won: false,
          profit: 0,
          bet_id: Math.floor(Math.random() * 100000000000) + 720000000000,
        },
      ];
      handleDiceBEt(data);
      return res.status(200).json(data);
    }
  }
  else {
    if (parseFloat(e.cashout) > parseFloat(user.chance)) {
      let wining_amount = parseFloat(user.wining_amount);
      let current_amount = parseFloat(prev_bal + wining_amount).toFixed(4);
      handleUpdatewallet({ has_won: true, current_amount, ...user });
      const data = [
        {
          ...e,
          ...user,
          current_amount,
          has_won: true,
          profit: wining_amount,
          bet_id: Math.floor(Math.random() * 100000000000) + 720000000000,
        }
      ];
      handleDiceBEt(data);
      return res.status(200).json(data);
    } else {
      let bet_amount = parseFloat(user.bet_amount);
      let current_amount = parseFloat(prev_bal - bet_amount).toFixed(4);
      handleUpdatewallet({ current_amount, has_won: false, ...user });
      const data = [
        {
          ...e,
          ...user,
          current_amount,
          has_won: false,
          profit: 0,
          bet_id: Math.floor(Math.random() * 100000000000) + 720000000000,
        },
      ];
      handleDiceBEt(data);
      return res.status(200).json(data);
    }
  }
}

const HandlePlayDice = (async(req, res) => {
  const { user_id } = req.id
  let { data } = req.body
  const handleDicePoints = (e, bal, res) => {
    function generateRandomNumber(serverSeed, clientSeed, hash, nonce) {
      const combinedSeed = `${serverSeed}-${clientSeed}-${hash}-${nonce}-${salt}`;
      const hmac = crypto.createHmac("sha256", combinedSeed);
      const hmacHex = hmac.digest("hex");
      const decimalValue = (parseInt(hmacHex, 32) % 10001) / 100;
      const randomValue = (decimalValue % maxRange).toFixed(2);
      let row = {
        cashout: randomValue,
        server_seed: serverSeed,
        client_seed: clientSeed,
        hash,
        game_nonce: nonce,
      };
      return row;
    }
    let kjks = generateRandomNumber(
      e.server_seed,
      e.client_seed,
      e.hash_seed,
      e.nonce
    );
    handleMybet(kjks, e, bal, res);
  };

  let wallet_bal = null
  if(data.token === "BTC"){
      let response = await BTCWallet.find({user_id}).select("balance")
      wallet_bal = (response[0].balance)
  }
  else if(data.token === "ETH"){
    let response = await ETHWallet.find({user_id}).select("balance")
      wallet_bal = (response[0].balance)
  }
  else if(data.token === "WGF"){
    let response = await WGFWallet.find({user_id}).select("balance")
      wallet_bal = (response[0].balance)
  }
  else{
     return  res.status(500).json({error: "Select another coin"})
  }
  if(data.bet_amount > wallet_bal){
    return res.status(500).json({error: "Insufficient funds"})
  }else{
    handleDicePoints(data, wallet_bal, res)
  }
})

const seedSettings = (async (req, res) => {
  const { user_id } = req.id
  const { client, server, hash} = req.body
  try {
  await DiceEncription.updateOne({ user_id }, {
      server_seed: server,
      client_seed: client,
      hash_seed: hash,
      nonce : 0,
      is_open: true,
      updated_at: new Date()
    })

    let responses = {
      nonce: 0,
      server_seed:server,
      hash_seed: hash,
      client_seed: client,
      is_open: false,
      updated_at: currentTime
    }
    res.status(200).json(responses)
  }
  catch (err) {
    res.status(501).json({ message: err });
  }
})

const getDiceGameHistory = (async (req, res) => {
  const { user_id } = req.id
  try {
    let diceGameHistory = await DiceGame.find({ user_id });
    res.status(200).json(diceGameHistory);
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})


// ============================== Initialize dice game ===============================
const InitializeDiceGame = (async (user_id) => {

  const {serverSeed: server_seed, hash: hash_seed, clientSeed: client_seed } = handleHashGeneration();
  let data = {
    user_id: user_id,
    nonce: 0,
    server_seed,
    hash_seed,
    client_seed,
    is_open: false,
    updated_at: currentTime
  }
  try{
    await DiceEncription.create(data)
  }
  catch(error){
    console.log(error)
  }
})


const handleDiceGameEncryption = (async (req, res) => {
  try {
    const { user_id } = req.id
    let result = await DiceEncription.find({ user_id })
    res.status(200).json(result)
  }
  catch (err) {
    console.log(err)
  }
})

const gameDetalsByID = (async(req, res)=>{
  try{
    const { data } = req.body
    let result = await DiceGame.find({ bet_id:data })
    res.status(200).json(result)
  }
  catch(error){
    console.log(error)
  }
}) 

const generateNewServerSeed = (async(req, res)=>{
    try{
       let encrypt = handleHashGeneration()
      res.status(200).json(encrypt)
    }
    catch(error){
      console.log(error)
    }
})

module.exports = { getDiceGameHistory, seedSettings, 
  handleDiceGameEncryption, InitializeDiceGame,
   HandlePlayDice, gameDetalsByID, generateNewServerSeed}