const Wallet = require("../model/wallet")
const WGDWallet = require("../model/WGD-wallet")
const ETHWallet = require("../model/ETH-wallet")
const WGFWallet = require("../model/WGF-wallet")
const BTCWallet = require("../model/btc-wallet")

// ============= get wallet  ====================
const GetWGDWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    }
    else {
      try {
        const users = await WGDWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetWGFWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await WGFWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})


const GetETHWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await ETHWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

// const GetETHWallet = (async(req, res)=>{
//     const {user_id} = req.id;
//     if (!user_id) {
//       res.status(500).json({ error: "No user found" });
//     } else {
//       try {
//         const users = await WGDWallet.find({user_id})
//         res.status(200).json(users)
//       } catch (err) {
//         res.status(501).json({ message: err.message });
//       }
//     }
// })

const GetBTCWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await BTCWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetDefaultWallet = (async(req, res)=>{
  const {user_id} = req.id;
  if (!user_id) {
    res.status(500).json({ error: "No user found" });
  } else {
    try {
      const users = await Wallet.find({user_id})
      res.status(200).json(users)
    } catch (err) {
      res.status(501).json({ message: err.message });
    }
  }
})

const UpdatedefaultWallet = (async(req, res)=>{
  const {user_id} = req.id;
  const data = req.body
  try {
    await BTCWallet.updateOne({ user_id }, {
    is_active: data.coin_name === "BTC" ? true : false
   });

   await WGFWallet.updateOne({ user_id }, {
    is_active: data.coin_name === "WGF" ? true : false
   });

   await WGDWallet.updateOne({ user_id }, {
    is_active: data.coin_name === "WGD" ? true : false
   });
   await ETHWallet.updateOne({ user_id }, {
    is_active: data.coin_name === "ETH" ? true : false
   })

  } catch (err) {
    res.status(501).json({ message: err.message });
}})

module.exports = {  GetWGDWallet, GetWGFWallet, GetETHWallet, GetBTCWallet, UpdatedefaultWallet, GetDefaultWallet, UpdatedefaultWallet}