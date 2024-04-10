const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../model/User");
const Profile = require("../model/Profile");
const { createProfile } = require("./profileControllers");
var SECRET = `highscoretechBringwexsingthebestamoung23498hx93`;
const { format } = require("date-fns");
// const { createCashbackTable } = require("../profile_mangement/cashbacks");
const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
const Chats = require("../model/public-chat");
const {createWGF, createEth, createbtc, createwagerToken, 
  handleDefaultWallet  } = require("../wallet_transaction/index")
const { InitializeDiceGame } = require("../controller/diceControllers");
// const { InitializePlinkoGame } = require("../controller/plinkoController");
const { CreateAffiliate, CheckValidity } = require("./affiliateControllers");
// const { handleCreatePPDunlocked } = require("../profile_mangement/ppd_unlock");
// const { handleNewNewlyRegisteredCount } = require("../profile_mangement/cashbacks");
const { InitializeMinesGame } = require("../controller/minesControllers");
// const { InitializeKenoGame } = require("../controller/kenoControllers");
// const { createNotify } = require("./notify");

const BTCWallet = require("../model/btc-wallet")
const EThHWallet = require("../model/ETH-wallet")
const WGFWallet = require("../model/WGF-wallet")
const WGDWallet = require("../model/WGD-wallet")

const createToken = (_id) => {
  return jwt.sign({ _id }, SECRET, { expiresIn: "9d" });
};

const handleColors = (()=>{
  let color = ["red", "blue", "black", "grey", "lemon", "brown", "pink", "violet", "tomato" ]
  const random = Math.floor(Math.random() * color.length);
  return (color[random])
})

const Register = async (req, res) => {
  const {data} = req.body;
  let invited_code = data.reff ? data.reff : "";
  let user_id = data.user.uid
  if (invited_code) {
    let validateCode = await CheckValidity(invited_code, user_id);
    if (validateCode) {
      invited_code = validateCode;
    }
  }
  const exist = await User.findOne({ user_id:data.user.uid });
  if (!exist) {
    try {
    let result = {
      born: "-",
      firstname: "-",
      lastname: "-",
      user_id: data.user.uid,
      email: data.user.email,
      hide_profile: false,
      hidden_from_public: false,
      refuse_friends_request: false,
      refuse_tips: false,
      username: data.username ? data.username : data.user.displayName,
      profile_image: {color: handleColors()},
      vip_level: 0,
      kyc_is_activated: false,
      phone: "-",
      next_level_point: 1,
      total_wagered: 0,
      invited_code: invited_code ? invited_code : "-",
      google_auth_is_activated: false,
      is_suspend: false,
      vip_progress: 0,
      fa_is_activated: false,
      earn_me: 0,
      commission_reward: 0,
      usd_reward: 100,
      joined_at: currentTime,
      account_type: "normal",
      total_chat_messages: 0,
      weekly_wagered: 0,
      monthly_wagered: 0,
    };
    await User.create({
      email:data.user.email,
      user_id: data.user.uid,
      created_at: currentTime,
      lastLoginAt: currentTime,
      password: data.user.apiKey,
      provider: data.user.providerData[0].providerId,
      emailVerified: data.user.emailVerified,
      google_auth: false,
      last_login_ip: req.socket.remoteAddress,
    });

    createWGF(user_id);
    createwagerToken(user_id);
    createEth(user_id);
    createbtc(user_id);
    InitializeDiceGame(user_id);
    // InitializeKenoGame(user_id);
    InitializeMinesGame(user_id);
    // createCashbackTable(user_id);
    CreateAffiliate(user_id);
    // handleCreatePPDunlocked(user_id);
    const Token = createToken(user_id);
    let wallet = handleDefaultWallet();
    createProfile(result);
    res.status(200).json({Token, wallet: wallet, result });
    } catch (err) {
      res.status(401).json({ error: err });
    }
  } else {
    const result = await Profile.find({ user_id });
    const btc = await BTCWallet.findOne({ user_id })
    const eth = await EThHWallet.findOne({ user_id })
    const wgf = await WGFWallet.findOne({ user_id })
    const wgd = await WGDWallet.findOne({ user_id })
    const wallet = [btc, eth, wgf, wgd]
    const Token = createToken(user_id);
    res.status(200).json({ Token,wallet, result: result[0] });
  }
};

// get a user profile by id
const SingleUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await Profile.find({ user_id: id });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ============= get previous messages ====================
const previousChats = async (req, res) => {
  try {
    let newMessage = await Chats.find();
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const handleSunspend = (async(req, res)=>{
  try {
    const { user_id, is_suspend } = req.body
    await Profile.updateOne({user_id},{
      is_suspend
    })
    const profile = await Profile.find({user_id})
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err });
  }
})

const mentionUsers = (async (req, res, next) => {
  try {
    const usernames = await Profile.find()
    const usernamesArray = usernames.map(obj => obj.username);
    return res.status(200).json(usernamesArray)
  }
  catch (error) {
    console.log(error.message)
  }
})


const secret = speakeasy.generateSecret({length: 20})
const secretBase32 = secret.base32
const qrCodeUrl =  `otpauth://totp/Wager Services?secret=${encodeURIComponent(secretBase32)}`
let qrlCodeImageUrl;
qrcode.toDataURL(qrCodeUrl, (err, imageUrl)=>{
  if(err){
    console.error("Error generating or code", err)
  }else{
      qrlCodeImageUrl = imageUrl
  }
})

const verifyToken = ((token, secret)=>{
    return speakeasy.totp.verify({secret, encoding: "base32", token })
})

const twoFacAuth = async (req, res) => {
  try{ 
    res.status(200).json({key: secretBase32, qrCode: qrlCodeImageUrl})
  }
  catch(err){
    res.status(400).json(err)
  }
};

const twoFacAuthVerify = async (req, res) => {
  try{
    const { token, user_id, action } = req.body
    const isTokenValid = verifyToken(token, secretBase32)
    if(isTokenValid){
      await Profile.updateOne({user_id},{
        google_auth_is_activated: action
      })
      const result = await Profile.findOne({ user_id });
      res.status(200).json({message: "success", user:result })
    }
    else {
      res.status(500).json({message: "Invalid Verification code"})
    }
  }
  catch(err){
    res.status(404).json({message: err})
  }
};


const handleCheckUsername = (async(req, res)=>{
    try{
      const { username } = req.body
      const user = await Profile.findOne({ username });
       res.status(200).json(user)
    }
    catch(error){
       res.status(401).json({msg: error})
    }
})

module.exports = {
  Register,
  previousChats,
  SingleUserByID,
  twoFacAuth,
  handleSunspend,
  mentionUsers,
  twoFacAuthVerify,
  handleCheckUsername
};
