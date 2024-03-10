const AffiliateDB = require("../model/affiliate_codes")
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const ProfileBD = require("../model/Profile")

function genAffiliate(length) {
    if (length === 0) return '';
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars[Math.floor(Math.random() * chars.length)] + genAffiliate(length - 1);
}
   

const CreateAffiliate = (async(user_id)=>{
    let data =  {
        user_id, 
        created_at :currentTime, 
        affiliate_code:genAffiliate(9),
         registered_friends : 0,
         friends: JSON.stringify([]), 
         commission_reward:0,
         available_usd_reward:0,
          is_activated:0, 
         is_suspend: false,
         today_commission: 0
    }
    try{
        await AffiliateDB.create(data)
    }
    catch(error){
        console.log(error)
    }
})

const handleAffiliateProfile = (async (req, res)=>{
    let {user_id} = req.id
    try {
        let response = await AffiliateDB.find({user_id})
         return res.status(200).json(response)
        } 
    catch (error) {
      console.log(error.message)
    }
})

const handleActivateAffiliate = (async (req, res)=>{
    let {user_id} = req.id
    try {
        await AffiliateDB.updateOne({user_id},{
            is_activated:true
        })
     res.status(200).json("Updated successfully")
    } catch (error) {
      console.log(error.message)
    }
})

const handleFriendsInfo = (async(req, res)=>{
    let {user_id} = req.id
    let usd_reward = []
    let commission_reward = []
    let friends_list = []
    let total_usd_bonus = []
    try {
        let dizsjh = await AffiliateDB.find({user_id})
        let friends = dizsjh[0].friends
        friends.forEach(async(element) => {
                let result = await ProfileBD.find({user_id:element})
                if(result.length > 0){
                    usd_reward.push(result[0].usd_reward)
                    commission_reward.push(result[0].commission_reward)
                    friends_list.push(result[0])
                    total_usd_bonus.push(result[0].earn_me)
                }
        });
    setTimeout(()=>{
        let total_usd_reward = 0
        let total_commission_reward = 0
        let total_earn_me = 0
        for(let i = 0; i < usd_reward.length; i++){
            total_usd_reward += usd_reward[i]
        }
        for(let i = 0; i < commission_reward.length; i++){
            total_commission_reward += commission_reward[i]
        }
        for(let i = 0; i < total_usd_bonus.length; i++){
            total_earn_me += total_usd_bonus[i]
        }
        return res.status(200).json({total_commission_reward,total_earn_me , total_usd_reward, friends_list})
    },700)
    } catch (error) {
      console.log(error.message)
    }
})

const CheckValidity = (async(code, user_id)=>{
    let r = ""
    try{
        const data = await AffiliateDB.find().select("affiliate_code")
        data.forEach(async(element) => {
            if(element.affiliate_code === code){
                r =  element.affiliate_code
               await AffiliateDB.updateOne(
                    { affiliate_code:element.affiliate_code }, 
                    { $push: { friends: user_id } }
                  );
                let senbsj = await AffiliateDB.find({affiliate_code:element.affiliate_code})
                let pre_num = parseInt(senbsj[0].registered_friends)
                await AffiliateDB.updateOne({affiliate_code:element.affiliate_code},{
                    registered_friends: pre_num + 1
                })
            }
        });
        return r
    }
    catch(error){
        return error
    }
})

module.exports = { handleAffiliateProfile , handleActivateAffiliate,CheckValidity, handleFriendsInfo, CreateAffiliate}