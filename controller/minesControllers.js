const crypto = require('crypto');
const minesEncrypt = require("../model/mine_encrypt")
const { format } = require('date-fns');
const minesgameInit = require('../model/minesgameInit');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

const BTCWallet = require("../model/btc-wallet");
const ETHWallet = require("../model/ETH-wallet");
const WGFWallet = require("../model/WGF-wallet")
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
function getResult(hash) {
  const allNums = [
    7, 2, 19, 25, 1, 13, 5, 24, 14, 6, 15, 9, 22, 16, 3, 17, 18, 20, 8, 21, 4,
    12, 10, 23, 11,
  ];
  let seed = hash;
  let finalNums = createNums(allNums, seed);
  seed = crypto.createHash("SHA256").update(seed).digest("hex");
  finalNums = createNums(finalNums, seed);
  return finalNums.map((m) => m.num.num);
}
function createNums(allNums, hash) {
  let nums = [];
  let h = crypto.createHash("SHA256").update(hash).digest("hex");
  allNums.forEach((c) => {
    nums.push({ num: c, hash: h });
    h = h.substring(1) + h.charAt(0);
  });
  nums.sort(function (o1, o2) {
    if (o1.hash < o2.hash) {
      return -1;
    } else if (o1.hash === o2.hash) {
      return 0;
    } else {
      return 1;
    }
  });
  return nums;
}

function main (serverSeed, clientSeed, nonce) {
  let resultArr = [clientSeed, nonce];
  let hmacSha256Result = crypto.createHmac("sha256", serverSeed).update(resultArr.join(":")).digest("hex")
  let resultList = getResult(hmacSha256Result);
  return (resultList);
} 

const updateUserWallet = (async(data)=>{
    if(data.coin_name === "WGF"){
     await WGFWallet.updateOne({ user_id:data.user_id }, {balance: data.balance });
    }
    if(data.coin_name === "BTC"){
      await BTCWallet.updateOne({ user_id:data.user_id }, {balance: data.balance });
    }
    if(data.coin_name === "ETH"){
      await ETHWallet.updateOne({ user_id:data.user_id }, {balance: data.balance });
    }
})

const UpdateGameState = (async(data)=>{
 await minesgameInit.updateOne({user_id: data.user_id,active: true },{
  gamaLoop: data.gamaLoop,
  active: false,
  profit: data.profit,
  cashout: data.cashout,
  has_won:data.has_won,
 })
})

const handleHasLost = (async(req, res)=>{
  try{
    const { user_id } = req.id
    const { data } = req.body
    await minesgameInit.updateOne({user_id,active: true },{
      gamaLoop: data.gameLoop,
      active: false,
      has_won: false
    }) 
    let mineGameHistory = await minesgameInit.find({user_id,game_id: data.game_id});
    res.status(200).json(mineGameHistory)
  }
  catch(error){
    res.status(500).json({error})
  }
})

const handleMinesHistory = (async(req, res)=>{
  try{
    const { user_id} = req.id;
    let mineGameHistory = await minesgameInit.find({user_id, active: false});
    res.status(200).json(mineGameHistory);
  }
  catch(error){
    res.status(500).json({error})
  }
})

const handleDetailedHistory = (async(req, res)=>{
  try{
    const { user_id} = req.id;
    const { data } = req.body;
    let mineGameHistory = await minesgameInit.find({user_id,game_id: data.game_id});
    res.status(200).json(mineGameHistory);
  }
  catch(error){
    res.status(500).json({error})
  }
})

const handleAutobet = (async(req, res)=>{
  try{
    const { user_id } = req.id
    const { data } = req.body
    let seed = data.server_seed
    let hash = data.server_seed
    let client = data.client_seed
    let nonce = data.nonce
    let jjsk =  main(seed, client, nonce);
    let mines = []
    let daajs = []
    let selected = []
    data.selected.forEach(element => {
        if(element.active){
          selected.push(element)
        }
    });
    for(let i = 0; i < data.mines; i++){
      mines.push(jjsk[i])
    }
    for(let u = 1; u < 26; u++){
      if(mines.includes(u)){
        daajs.push({id:u, active: false, mine: true})
      }else{
        daajs.push({id:u, active: false, mine: false})
      }
    }
    daajs.forEach(element => {
        if(element.mine){
          console.log(element)
        }
    });
    // console.log(data)
  }
  catch(error){
    console.log(error)
  }
})

const handleCashout = (async(req,res)=>{
  try{
    const {user_id} = req.id
    let {data} = req.body
    let prev_bal;
    if(data.bet_token_name === "BTC"){
      prev_bal = await BTCWallet.find({user_id})
    }
    if(data.bet_token_name === "WGF"){
      prev_bal = await WGFWallet.find({user_id})
    }
    if(data.bet_token_name === "ETH"){
      prev_bal = await ETHWallet.find({user_id})
    }
    let skjb = {
      is_active: true,
      balance: prev_bal[0].balance + data.profit,
      coin_image:data.bet_token_img, 
      coin_name: data.bet_token_name
  }
  await UpdateGameState({...data, user_id})
   updateUserWallet({...skjb, user_id})
   let mineGameHistory = await minesgameInit.find({user_id,game_id: data.game_id});
   res.status(200).json({data,skjb, mineGameHistory}) 
  }
  catch(err){
    console.log(err)
  }
})

const UpdateEncrtip = (async(data)=>{
  await minesEncrypt.updateOne({user_id:data.user_id},{
    nonce:data.nonce
  })
})

const handleActiveMines = (async(req, res)=>{
  try{
    const {user_id} = req.id
   let jks = await minesgameInit.find({user_id,active: true })
   res.status(200).json(jks)
  }
  catch(error){
    res.status(500).json({error})
  }
})

const handleMinesInit = (async(ev)=>{
  try{
    const liken = {
      user_id: ev.user_id,
      profile_img: ev.data.profile_img,
      username: ev.data.username,
      time: ev.data.time,
      mine: ev.waskj[0].mines,
      bet_amount:ev.waskj[0].bet_amount,
      bet_token_name:ev.waskj[0].bet_token_name,
      bet_token_img:ev.waskj[0].bet_token_img,
      client_seed:ev.data.client_seed,
      server_seed:ev.data.server_seed,
      nonce:ev.data.nonce,
      gameLoop:ev.daajs,
      cashout: 0,
      profit:0,
      active: true,
      has_won: false,
      game_id: ev.game_id
    }
    await minesgameInit.create(liken)
  }catch(error){
    console.log(error)
  }
})

const handleInitialze = (async(req, res)=>{
  try{
  const { user_id } = req.id
  const { data } = req.body
  let seed = data.server_seed
  let hash = data.server_seed
  let client = data.client_seed
  let nonce = data.nonce
  let jjsk =  main(seed, client, nonce);
  
  let mines = []
  let daajs = []
  for(let i = 0; i < data.mines; i++){
    mines.push(jjsk[i])
  }
  for(let u = 1; u < 26; u++){
    if(mines.includes(u)){
      daajs.push({id:u, active: false, mine: true})
    }else{
      daajs.push({id:u, active: false, mine: false})
    }
  }
  let game_id =  Math.floor(Math.random()* 10000000000)+ 10000000
  let waskj = [{
    mines: data.mines,
    bet_amount:data.bet_amount , 
    bet_token_name:data.bet_token_name,
    bet_token_img:data.bet_token_img
  }]
 let skjb = {
    is_active: true,
    balance: data.token_balance - data.bet_amount,
    coin_image:data.bet_token_img, 
    coin_name: data.bet_token_name,
    profile_img: data.profile_img,
    username: data.username,
  }
  updateUserWallet({...skjb, user_id})
  UpdateEncrtip({nonce:data.nonce,user_id })
   handleMinesInit({user_id, waskj, daajs, data, game_id })
    res.status(200).json({daajs, waskj, skjb,nonce:data.nonce, game_id})
  }
  catch(error){
    console.log(error)
  }
})

const handleMinesEncryption = (async(req, res)=>{
  try{
    const { user_id } = req.id
  let kjsljjj =   await minesEncrypt.find({user_id})
    res.status(200).json(kjsljjj)
  }
    catch(err){
      res.status(400).status({error: err})
    }
})

// ============================== Initialize dice game ===============================
const InitializeMinesGame = (async(user_id)=>{

  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function generateString(length) {
      let result = '';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }
  
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
  
const handleHashGeneration = (()=>{
      const serverSeed = crypto.randomBytes(32).toString('hex');
      const clientSeed = generateString(23);
      const combinedSeed = serverSeed + salt + clientSeed;
      const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
      let encrypt = { hash, clientSeed, serverSeed }
      return encrypt
  })

    let data = {
        user_id: user_id,
        nonce :0,
        server_seed: handleHashGeneration().serverSeed,
        hash_seed: handleHashGeneration().hash,
        client_seed:handleHashGeneration().clientSeed,
        is_open:false,
        updated_at: currentTime
    }
      await minesEncrypt.create(data)
  })

  const UpdateWins = (async(req, res)=>{
    try{
      const { user_id } = req.id
      const { data } = req.body
     await minesgameInit.updateOne({user_id, active: true },{
        gameLoop: data
      })
      res.status(200).json({message: "Game saved"})
    }
    catch(error){
      res.status(500).json({message: error})
    }
})

module.exports = {handleMinesHistory, handleCashout,handleHasLost,UpdateWins,handleDetailedHistory,
     InitializeMinesGame, handleInitialze, handleMinesEncryption,handleAutobet, handleActiveMines}