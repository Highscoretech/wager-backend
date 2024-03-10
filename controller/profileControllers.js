const Profile = require("../model/Profile")
// const { handleProfileTransactions } = require("../profile_mangement/index")
// const { format } = require('date-fns');
const WGFWallet = require("../model/WGF-wallet")
const CrashGame = require("../model/crashgame")
const DiceGame = require("../model/dice_game");
const WGDWallet = require("../model/WGD-wallet");
const BTCtWallet = require("../model/btc-wallet");
const ETHWallet = require("../model/ETH-wallet");

const createProfile = (async(datas)=>{
  try{
    const profile = await Profile.create(datas)
    return profile
  }
  catch(err){
    console.log(err)
  }
})

const UpdateProfile = (async(req, res)=>{
  const {user_id} = req.id;
  const {data} = req.body
  if (!user_id) {
    res.status(500).json({ error: "No user found" });
  } else{
    try{
     await Profile.updateOne({ user_id }, {
      born: data.born,
       firstname: data.firstname,
        lastname:data.lastname
     })
     let profile = await Profile.findOne({user_id})
     res.status(200).json(profile)
    }
    catch(error){
      res.status(501).json({ message: error });
    }
  }
})

const UpdateAvatar = (async(req, res)=>{
    const {user_id} = req.id;
    const {data} = req.body
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    }
    else{
      try{
       await Profile.updateOne({ user_id }, {
        profile_image: data.profile_image,
       });
       res.status(200).json({message: "Updated succesfully"})
      }
      catch(error){        
        res.status(404).json({ message: error });
      }
    }
})

const UpdateUser = (async(req, res)=>{
  const {user_id} = req.id;
  const {data} = req.body
  if (!user_id) {
    res.status(500).json({ error: "No user found" });
  }
  else{
    try{
     await Profile.updateOne({ user_id }, {
      username: data.username,
      profile_image: data.profile_image,
     })
    let profile = await Profile.findOne({user_id})
     res.status(200).json(profile)
    }
    catch(error){        
      res.status(404).json({ message: error });
    }
  }
})

const SingleUser = (async(req, res)=>{
  try {
  const {user_id} = req.id;
      if (!user_id) {
        res.status(500).json({ error: "No user found" });
      } 
      else {

        const users = await Profile.find({user_id})
        const btc = await BTCtWallet.find({user_id})
        const wgf = await WGFWallet.find({user_id})
        const eth = await ETHWallet.find({user_id})
        const wgd = await WGDWallet.find({user_id})
        let wallet = [btc[0], wgf[0], eth[0], wgd[0]]
        res.status(200).json({users, wallet})
    }
  } catch (err) {
    res.status(501).json({ message: err.message });
    console.log(err)
  }
})


const handleHiddenProfile = (async(req, res)=>{
  try{
  const {user_id} = req.id
  const { profile_state } = req.body
   let response = await Profile.updateOne({user_id},{
      hide_profile: profile_state
    })
      res.status(200).json(response)
  }
  catch(error){
    console.log(error)
  }
})


const handleRefusefriendRequest = (async(req, res)=>{
  try{
  const {user_id} = req.id
  const { profile_state } = req.body

    let response = await Profile.updateOne({user_id},{
      refuse_friends_request: profile_state
    })
      res.status(200).json(response)
  }
  catch(error){
    console.log(error)
  }
})

const handleRefuseTip = (async(req, res)=>{
  try{
  const {user_id} = req.id
  const { profile_state } = req.body
 
    let response = await Profile.updateOne({user_id},{
      refuse_tips: profile_state
    })
      res.status(200).json(response)
  }
  catch(error){
    console.log(error)
  }
})

const handlePublicUsername = (async(req, res)=>{
  try{
  const {user_id} = req.id
  const { profile_state } = req.body

    await Profile.updateOne({user_id},{
      hidden_from_public: profile_state
    })

    await CrashGame.updateOne({user_id},{
      hidden_from_public: profile_state
    })

    let result = await DiceGame.updateOne({user_id},{
      hidden_from_public: profile_state
    })
      res.status(200).json(result)
  }
  catch(error){
    console.log(error)
  }
})

const handleDailyPPFbonus =  (async(req, res)=>{
  try{
  const {user_id} = req.id
    let result = await WGFWallet.find({user_id})
    let prev_bal = result[0].balance
    let pre_date = result[0].date
    let now = new Date()
    let yesterdy = new Date(pre_date)
  
    if(yesterdy.getDate() !== now.getDate()){
      await WGFWallet.updateOne({ user_id }, {
        balance: prev_bal + 20000,
        date:now
       });
    }
    res.status(200).json({message: "daily ppf added successfully"})
  }
  catch(err){
    res.status(500).json({error: err})
  }

})


const ChangeProfilePicture = (async(req, res)=>{
    const {user_id} = req.id;
    const {data} = req.body
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    }
    else{
      try{
        //update db
       await Profile.updateOne({ user_id }, {
        profile_image: data.profile_image,
       });
       res.status(200).json({
        message: "Successful",
        imageLink: data.profile_image
    })
      }
      catch(error){        
        res.status(404).json({ message: error });
      }
    }
})

module.exports = { SingleUser, UpdateUser, UpdateProfile,handleHiddenProfile , handlePublicUsername, handleRefusefriendRequest, handleRefuseTip, handleDailyPPFbonus, createProfile, UpdateAvatar,  ChangeProfilePicture }
