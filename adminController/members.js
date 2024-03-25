// const jwt = require('jsonwebtoken');
// const { connection } = require("../database/index")
// const { db } = require("../database/firebase")
// var SECRET = `highscoretechBringwexsingthebestamoung23498hx93`
// const { format } = require('date-fns');
// const { createCashbackTable } = require("../profile_mangement/cashbacks")
// const { genAffiliate } = require('../utils/genAffiliate');
// const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
// const { createPPF, createPPL,  createPPD, createUsdt } = require("../wallet_transaction/index")
// const { InitializeDiceGame } = require("../controller/diceControllers")
// const {Helper} = require('../utils/helperFunction')
// const helper = new Helper()
// const createToken = ((_id)=>{
//    return  jwt.sign({_id}, SECRET, { expiresIn: '4d' })
// })


// const Register = (async(req, res)=>{
//     // const data = req.body
//     // let email = (data.user.email)
//     // let emailVerified = (data.user.emailVerified)
//     // let google_auth = 0
//     // let user_id = (data.user.uid)
//     // const createdAt =  currentTime
//     // const lastLoginAt = currentTime
//     // const last_login_ip =req.socket.remoteAddress
//     // let password =  (data.user.apiKey)
//     // let provider =  (data.user.providerData[0].providerId)
//     // let affiliate_bonus = 0
//     // let invited_code = ''

//     const data = req.body
//     let email = (data.user.email)
//     let emailVerified = (data.user.emailVerified)
//     let google_auth = 0
//     let user_id = (data.user.uid)
//     const createdAt =  currentTime
//     const lastLoginAt = currentTime
//     const last_login_ip =req.socket.remoteAddress
//     let password =  (data.user.apiKey)
//     let provider =  (data.user.providerData[0].providerId)
//     let affiliate_bonus = 0
//     let invited_code = ''
//     let vip_level = (data.user.vip_level || 0)
//     let wallet = (data.user.wallet || 0)
    

//     const fullData = {
//         email, user_id, createdAt, lastLoginAt, password, provider, emailVerified, google_auth,last_login_ip
//     }

//     let query = `SELECT * FROM users  WHERE email = "${email}"`;
//     connection.query(query, async function(error, response){
//     if(response.length > 0){
//         const Token = createToken(user_id)
//         let profileEL; 
//         let query3 = `SELECT * FROM profiles WHERE user_id="${user_id}"`;
//             connection.query(query3, async function(error, result){
//                 profileEL = result
//         })
//         let wallet;
//         let query1 = `SELECT * FROM wallet WHERE user_id="${user_id}"`;
//         connection.query(query1, async function(error, dimes){
//             wallet = dimes
//         })
//         setTimeout(()=>{
//              res.status(200).json({profile:profileEL[0],wallet: wallet[0], Token})
//         }, 500)
//     }else{
//         try{
//             if(data.reff){
//                await updateAffiliate(data.reff, data.user.uid) //this update referral friends
//                affiliate_bonus = 100
//                invited_code = data.reff
//             }
//              createAffiliate(data) //this create affiliate code for the new user
//             let sql = `INSERT INTO users SET ?`;
//             connection.query(sql, fullData, (err, data)=>{
//             if(err){
//                 console.log(err)
//             }else{
//                 createUsdt(user_id,wallet)
//                 createPPD(user_id)
//                 createPPL(user_id)
//                 createPPF(user_id)
//                 InitializeDiceGame(user_id)
//                 const Token = createToken(user_id)
//                 createCashbackTable(user_id)
//         //================================ Create profile ==================================================
//             const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//                 function generateString(length) {
//                     let result = '';
//                     const charactersLength = characters.length;
//                     for ( let i = 0; i < length; i++ ) {
//                         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//                     }
//                     return result;
//                 }
//                 let username = (generateString(9));
//                 let datas = {
//                     born: "",
//                     firstname: '',
//                     lastname: '',
//                     user_id: user_id,
//                     email : email,  
//                     hide_profile: 0,
//                     hidden_from_public: 0,
//                     refuse_friends_request: 0,
//                     refuse_tips: 0, 
//                     username,  
//                     profile_image: "https://img2.nanogames.io/avatar/head1.png",
//                     vip_level: vip_level? vip_level:0,
//                     kyc_is_activated: "",
//                     phone: "",
//                     total_wagered: 0,
//                     invited_code: invited_code,
//                     google_auth_is_activated : 0,
//                     is_suspend: 0,
//                     vip_progress: 0,
//                     fa_is_activated: 0,   
//                     earn_me: 0,
//                     commission_reward: 0,
//                     usd_reward : affiliate_bonus, 
//                     joined_at: currentTime,
//                     account_type: "normal",

//                     weekly_wagered: 0,
//                     monthly_wagered: 0,
    
//                 }

//                 db.collection("profile").doc(email).set(datas)
//                 let sql = `INSERT INTO profiles SET ?`;
//                 connection.query(sql, datas, (err, data)=>{
//                 if(err){
//                     console.log(err)
//                     }else{
//                     (data)
//                     }
//                 })

//             // ================ create default wallet details ===================
            
//                 let balance = 20000.0000
//                 let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828376/ppf_logo_ntrqwg.png"
//                 let coin_name = "PPF"
//                 let created_at = currentTime
//                 let hidden_from_public = 0
//                 let walletEl = {user_id, balance, coin_image, coin_name, created_at, hidden_from_public }

//                 let sql2 = `INSERT INTO wallet SET ?`;
//                 connection.query(sql2, walletEl, (err, result)=>{
//                     if(err){
//                         console.log(err)
//                     }else{
//                         (result)
//                     }
//                 })
//              res.status(200).json({profile:datas,wallet: walletEl, Token}) 
//             }
//     })
//     } catch (error){
//         res.status(401).json({error : error.message})
//     }
//         }
//     })
// })


// //============================ store Affiliate Code =================
// const createAffiliate = ((_data)=>{
//     let user_id = _data?.user?.uid || _data?.user_id
//     let created_at = currentTime
//     let  affiliate_code = genAffiliate(9)
//     let registered_friends = 0
//     let  friends = JSON.stringify([])
//     let  new_codes_generated = JSON.stringify([])
//     let is_suspend = 0
//     let commission_reward = 0
//     let available_usd_reward = 0
//     let welcome_msg = _data?.welcome_msg?.trim() || ""
//     let is_activated = 0
//     let data =  {
//         user_id, 
//         created_at, 
//         affiliate_code,
//          registered_friends,
//          friends, 
//          commission_reward,
//          available_usd_reward,
//          welcome_msg,
//           is_activated, 
//          new_codes_generated,
//          is_suspend
//     }
//     let sql = `INSERT INTO affiliate_code SET ?`;
//     connection.query(sql, data, (err, result)=>{
//         if(err){
//             console.log(err)
//         }else{
//            (result)
//         }
//     })
// })


// //============================ update Affiliate Code =================
// const updateAffiliate = (async (affiliateCode,user_id)=>{
//     try {
//         let query = `SELECT * FROM affiliate_code`;
//          connection.query(query, async function(error, response){
        
//             if(response && response.length > 0){
//                function convertAffiliateFriendsToArray(data) {
//                 return data.map(function(item) {
//                   try {
//                     item.friends = JSON.parse(item.friends);
//                   } catch (error) {
//                     console.error( error);
//                     item.friends = [];
//                   }
//                   return item;
//                 });
//               }
              
//               var dataArray = convertAffiliateFriendsToArray(response)
              
//             //   find the affiliate code out
//               const selected = dataArray.find(data=> data.affiliate_code.trim() === affiliateCode.trim())
//               if(selected === undefined){
//                 console.log("invalid affiliate code")
//                 return;
//               }
//               const { affiliate_code, registered_friends, friends } = selected;

//               const newFriends = [...friends];
//               newFriends.push(user_id);
              
//               try {
//                 const query = `UPDATE affiliate_code SET registered_friends = ${registered_friends + 1}, friends = ? WHERE affiliate_code = ?`;
//                  connection.query(query, [JSON.stringify(newFriends), affiliate_code], function (error, response) {
//                   if (error) {
//                     console.error(error.message);
//                   }
//                 });
//                 } catch (error) {
//                     console.error(error.message);
//                 }
              
//             }
//         })
//     } catch (error) {
//       console.log(error.message)
//     }
// })


// //============================ regenerate Affiliate Code =================
// const regenerateAffiliateCode = (async(req, res)=>{
//     const body = req.body;
//     const user_id = body.id
//     const welcome_msg = body.welcome_msg?.trim() || ""
//     if(!user_id){
//         return res.status(500).json({
//             status:false,
//             message:"User not found"
//         });
//     }
//     try {
//         let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
//          connection.query(query, async function(error, response){
//             if(response && response.length > 19){
//                 return res.status(500).json({
//                     status:false,
//                     message:"Max affiliate code generated"
//                 })
//             }
//             const data = {
//                 user_id,welcome_msg
//             }
//             createAffiliate(data)
//             return res.status(200).json({
//                 status:true,
//                 message:"Affiliate Code generated successfully"
//             })
//         })
//     } catch (error) {
//         return res.status(501).json({
//             status:false,
//             message: error.message
//         })
//     }
// })

// //============================ regenerate Affiliate Code =================
// const manuallygenerateAffiliateCode = (async(req, res)=>{
//     const body = req.body;
//     const user_id = body.id
//     const new_affiliate_code = body.new_affiliate_code
//     if(!new_affiliate_code){
//         return res.status(500).json({
//             status:false,
//             message:"Input the new affiliate code"
//         })
//     }
//     if(!user_id){
//         return res.status(500).json({
//             status:false,
//             message:"User not found"
//         });
//     }
//     try {
//         let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
//          connection.query(query, async function(error, response){
//             if(response && response.length > 19){
//                 return res.status(500).json({
//                     status:false,
//                     message:"Max affiliate code generated"
//                 })
//             }
//             const data = {
//                 user_id
//             }
//           createAffiliate(data)
//             return res.status(200).json({
//                 status:true,
//                 message:"Affiliate Code generated successfully"
//             })
//         })
//     } catch (error) {
//         return res.status(501).json({
//             status:false,
//             message: error.message
//         })
//     }
// })

// //======================= get all affiliate code ===================
// const userAffiliateCodes = (async(req, res)=>{
//     const body = req.body;
//     const user_id = body.id
//     if(!user_id){
//         return res.status(500).json({
//             status:false,
//             message:"User not found"
//         });
//     }
//     try {
//         let query = `SELECT * FROM affiliate_code WHERE user_id = "${user_id}"`;
//         connection.query(query, async function(error, response){
//         return res.status(200).json({
//                 status:true,
//                 data:response,
//             })
//         })
//     } catch (error) {
//         return res.status(501).json({
//             status:false,
//             message: error.message
//         })
//     }
// })


// //============================ member profile =======================
// const memberProfile = (async(req, res)=>{
//  const {id} = req.params;
//  try {
//     let query = `SELECT 
//     user_id, email,lastLoginAt, createdAt, last_login_ip ,last_login_ip
//     FROM users WHERE user_id = "${id}"`;
    
//     connection.query(query, async function (error, response) {
//       if (response && response.length > 0) {
//         const result = {
//             basicInfo:[],
//             accountInfo:[],
//             vipInfo:[],
//             affiliateInfo:[],
//         };
//         const promises = [];

//         // gather the basic informations
//         for (const user of response) {
//           const query = `SELECT 
//           user_id, username,phone,fa_is_activated,kyc_is_activated,hide_profile,hidden_from_public,is_suspend,refuse_tips
//            FROM profiles WHERE user_id = "${user.user_id}"`;
//           const promise = new Promise((resolve, reject) => {
//             connection.query(query, async (error, response) => {
//               if (error) {
//                 reject(error);
//               } else {
//                 const profile = {
//                     user_id:response[0].user_id,
//                     username:response[0].username,
//                     mobile:user.phone,
//                     email:user.email,
//                     password:user.password,
//                     fa:response[0].fa_is_activated ===0? false:true,
//                     kyc:response[0].kyc_is_activated ===0? false:true,
//                     hide_profile:response[0].hide_profile ===0? false:true ,
//                     hidden_from_public:response[0].hidden_from_public ===0? false:true ,
//                     is_suspend:response[0].is_suspend ===0? false:true ,
//                     refuse_tips:response[0].refuse_tips ===0? false:true ,
//                 };
//                 result.basicInfo.push(profile);
//                 resolve();
//               }
//             });
//           });

//           promises.push(promise);
//         }

//         // gather account information
//         for (const user of response) {
//             const query = `SELECT 
//             user_id
//              FROM profiles WHERE user_id = "${user.user_id}"`;
//             const promise = new Promise((resolve, reject) => {
//               connection.query(query, async (error, response) => { 
                
//              const userDeposit = await helper.userDeposit(user.user_id,"user_id")
//              let lastDeposit,firstDeposit;
//              if(userDeposit && userDeposit.length > 0){
//               firstDeposit = userDeposit[0].time;
//               lastDeposit = userDeposit[userDeposit.length - 1].time;              
//              }else{
//               firstDeposit = null
//               lastDeposit = null
//              }
              
//                 if (error) {
//                   reject(error);
//                 } else {
//                   const profile = {
//                       user_id:response[0].user_id,
//                       lastLoginAt:user.lastLoginAt,
//                       last_login_ip:user.last_login_ip,
//                       lastDeposit,
//                       lastWithdrawal:"N/A",
//                   };
//                   result.accountInfo.push(profile);
//                   resolve();
//                 }
//               });
//             });
  
//             promises.push(promise);
//           }

//         // get vip information
//          for (const user of response) {
//             const query = `SELECT 
//             user_id,vip_level,total_wagered
//              FROM profiles WHERE user_id = "${user.user_id}"`;
//             const promise = new Promise((resolve, reject) => {
//               connection.query(query, async (error, response) => { 
              
//                 if (error) {
//                   reject(error);
//                 } else {
//                   const profile = {
//                      vip_level:response[0].vip_level,
//                      rank:'frontend calc...',
//                      totalwagered:response[0].total_wagered,

//                   };
//                   result.vipInfo.push(profile);
//                   resolve();
//                 }
//               });
//             });
  
//             promises.push(promise);
//           }

//         await Promise.all(promises);

//         return res.status(200).json(result);
//       }

//       return res.status(200).json(response);
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: false,
//       message: "Something completely went wrong",
//     });
//   }
// })



// //============================ all member details =======================
// const allMemberProfile = (async(req, res)=>{
//   try {
//     let query = `SELECT user_id, email,lastLoginAt, createdAt, last_login_ip FROM users`;
    
//     connection.query(query, async function (error, response) {
//       if (response && response.length > 0) {
//         const result = [];
//         const promises = [];

//         for (const user of response) {
//           const query = `SELECT phone, total_wagered, firstname,lastname,total_chat_messages FROM profiles WHERE user_id = "${user.user_id}"`;
//           const promise = new Promise((resolve, reject) => {
//             connection.query(query, async (error, response) => {

//              const totalWon = await helper.getTotalUSDTWinByUser(user.user_id);
//              const ggr = +response[0].total_wagered - +totalWon
//              const sumUSDTPPDPPL = await helper.sumUSDTPPDPPL(user.user_id,"user_id")
//              const userDeposit = await helper.userDeposit(user.user_id,"user_id")
//              let lastDeposit,firstDeposit;
//              if(userDeposit && userDeposit.length > 0){
//               firstDeposit = userDeposit[0].time;
//               lastDeposit = userDeposit[userDeposit.length - 1].time;              
//              }else{
//               firstDeposit = null
//               lastDeposit = null
//              }

//               if (error) {
//                 reject(error);
//               } else {
//                 const profile = {
//                   ...user,
//                   registerDate:user.createdAt,
//                   phone: response[0].phone,
//                   totalWagered: response[0].total_wagered,
//                   fullName: response[0].firstname +" "+ response[0].lastname,
//                   totalGGR: ggr,
//                   sumUSDTPPDPPL:sumUSDTPPDPPL,
//                   totalChatMessages:response[0].total_chat_messages,
//                   firstDeposit:firstDeposit,
//                   lastDeposit:lastDeposit
//                 };
//                 result.push(profile);
//                 resolve();
//               }
//             });
//           });

//           promises.push(promise);
//         }
//         await Promise.all(promises);

//         return res.status(200).json(result);
//       }

//       return res.status(200).json(response);
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: false,
//       message: "Something completely went wrong",
//     });
//   }
// })


// module.exports = { 
//     Register,memberProfile,allMemberProfile
// }