// const { format } = require('date-fns');
// const Transaction = require("../model/transaction")
// const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
// const DPP_wallet = require("../model/PPD-wallet")
// const CashBackDB = require("../model/cash_back")
// const ProfileDB = require("../model/Profile")
// const PPFwallet = require("../model/PPF-wallet")

// const handelLevelupBonuses = (async(data, user_id)=>{
//     const res = await DPP_wallet.find({user_id})
//     let prev_bal = parseFloat(res[0].balance)
//     let new_bal = prev_bal + parseFloat(data)

//     await DPP_wallet.updateOne({user_id}, {
//         balance:new_bal
//     })
//     await CashBackDB.updateOne({user_id}, {
//         total_level_bonus:new_bal
//     })
//     try{
//         let trx_rec = {
//             user_id: user_id,
//             transaction_type: "Level Up", 
//             sender_img: "-", 
//             sender_name: "DPP_wallet", 
//             sender_balance: 0,
//             trx_amount:  parseFloat(data),
//             receiver_balance: new_bal,
//             datetime: currentTime, 
//             receiver_name: "PPD",
//             receiver_img: "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828435/dpp_logo_sd2z9d.png",
//             status: 'successful',
//             transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
//             is_sending: false
//         }
//   await Transaction.create(trx_rec)
//     }
//     catch(error){
//         console.log(error)
//     }
// })

// const handlePPFLevelupBonus = (async(user_id)=>{
//    let result =  await PPFwallet.find({user_id})
//     let prev_bal = parseFloat(result[0].balance)
//     await PPFwallet.updateOne({user_id},{
//         balance:prev_bal + 10000
//     })
// })


// const handelLevelups = (async(data, user_id)=>{
//     handlePPFLevelupBonus(user_id)
//     if( data === 2){
//         handelLevelupBonuses(0.04, user_id )
//     }
//      else if( data === 3 ){
//         setTimeout(()=>{
//             handelLevelupBonuses(0.05, user_id )
//         },50)
//     }
//     else if( data === 4 ){
//         setTimeout(()=>{
//             handelLevelupBonuses(0.10, user_id )
//         },100)
//     }
//     else if( data === 5){
//         setTimeout(()=>{
//             handelLevelupBonuses(0.20, user_id )
//         },150)
//     }
//     else if( data === 6){
//         setTimeout(()=>{
//             handelLevelupBonuses(0.30, user_id )
//         },200)
//     }
//     else if( data === 7){
//         setTimeout(()=>{
//             handelLevelupBonuses(0.35, user_id )
//         },250)
//     }
//     else if( data === 8){
//         setTimeout(()=>{
//             handelLevelupBonuses(0.70, user_id )
//         },300)
//     }
//     else if( data === 9){
//         setTimeout(()=>{
//             handelLevelupBonuses(0.80, user_id )
//         },50)
//     }
//     else if( data === 10){
//         setTimeout(()=>{
//             handelLevelupBonuses(0.90, user_id )
//         },100)
//     }
//     else if( data === 11){
//         setTimeout(()=>{
//             handelLevelupBonuses(1, user_id )
//         },150)
//     }
//     else if( data === 12){
//         setTimeout(()=>{
//             handelLevelupBonuses(1.1, user_id )
//         },200)
//     }
//     else if( data === 13){
//         setTimeout(()=>{
//             handelLevelupBonuses(1.2, user_id )
//         },250)
//     }
//     else if( data === 14){
//          handelLevelupBonuses(1.3, user_id )
//     }
//     else if( data === 15){
//      handelLevelupBonuses(1.4, user_id )
//     }
//     else if( data === 16){
//         handelLevelupBonuses(1.5, user_id )
//     }
//     else if( data === 17){
//          handelLevelupBonuses(1.6, user_id )
//     }
//     else if( data === 18){
//          handelLevelupBonuses(1.7, user_id )
//     }
//     else if( data === 19){
//         handelLevelupBonuses(1.8, user_id )
//     }
//     else if( data === 20){
//        handelLevelupBonuses(1.9, user_id )
//     }
//     else if( data === 21){
//             handelLevelupBonuses(2, user_id )
//     }
//     else if( data === 22){
//         handelLevelupBonuses(3, user_id )
//     }
//     else if( data === 23){
//         handelLevelupBonuses(4, user_id )
//     }
//     else if( data === 24){
//         handelLevelupBonuses(5, user_id )
//     }
//     else if( data === 25){
//          handelLevelupBonuses(6, user_id )
//     }
//     else if( data === 26){
//         handelLevelupBonuses(7, user_id )
//     }
//     else if( data === 27){
//         handelLevelupBonuses(8, user_id )
//     }
//     else if( data === 28){
//         handelLevelupBonuses(9, user_id )
//     }
//     else if( data === 29){
//         handelLevelupBonuses(10, user_id )
//     }
//     else if( data === 30){
//         handelLevelupBonuses(12, user_id )
//     }
//     else if( data === 31){
//         handelLevelupBonuses(14, user_id )
//     }
//     else if( data === 32){
//         handelLevelupBonuses(16, user_id )
//     }
//     else if( data === 33){
//         handelLevelupBonuses(18, user_id )
//     }
//     else if( data === 34){
//         handelLevelupBonuses(20, user_id )
//     }
//     else if( data === 35){
//         handelLevelupBonuses(22, user_id )
//     }
//     else if( data === 36){
//         handelLevelupBonuses(24, user_id)
//     }
//     else if( data === 37){
//          handelLevelupBonuses(26, user_id)
//     }
//     else if( data === 38){
//         handelLevelupBonuses(30, user_id)
//     }
//     else if( data === 39){
//         handelLevelupBonuses(35, user_id)
//     }
//     else if( data === 40){
//         handelLevelupBonuses(40, user_id)
//     }
//     else if( data === 41){
//         handelLevelupBonuses(50, user_id)
//     }
//     else if( data === 42){
//         handelLevelupBonuses(60, user_id)
//     }
//     else if( data === 43 ){
//         handelLevelupBonuses(70, user_id)
//     }     
//     else if( data === 44 ){
//         handelLevelupBonuses(80, user_id)
//     }
//     else if( data === 45 ){
//         handelLevelupBonuses(90, user_id)
//     }
//     else if( data === 46 ){
//         handelLevelupBonuses(100, user_id)
//     }
//     else if( data === 47 ){
//         handelLevelupBonuses(110, user_id)
//     }
//     else if( data === 48 ){
//         handelLevelupBonuses(120, user_id)
//     }
//     else if( data === 49 ){
//         handelLevelupBonuses(130, user_id)
//     }
//     else if( data === 50 ){
//         handelLevelupBonuses(140, user_id)
//     }
//     else if( data === 51 ){
//         handelLevelupBonuses(150, user_id)
//     }
//     else if( data === 52 ){
//         handelLevelupBonuses(160, user_id)
//     }
//     else if( data === 53 ){
//         handelLevelupBonuses(170, user_id)
//     }
//     else if( data === 54 ){
//         handelLevelupBonuses(180, user_id)
//     }
//     else if( data === 55 ){
//         handelLevelupBonuses(190, user_id)
//     }
//     else if( data === 56 ){
//         handelLevelupBonuses(200, user_id)
//     }
//     else if( data === 57 ){
//         handelLevelupBonuses(220, user_id)
//     }
//     else if( data === 58 ){
//         handelLevelupBonuses(240, user_id)
//     } 
//     else if( data === 59 ){
//         handelLevelupBonuses(260, user_id)
//     } 
//     else if( data === 60 ){
//         handelLevelupBonuses(280, user_id)
//     } 
//     else if( data === 61 ){
//         handelLevelupBonuses(300, user_id)
//     } 
//     else if( data === 62 ){
//         handelLevelupBonuses(350, user_id)
//     } 
//     else if( data === 63 ){
//         handelLevelupBonuses(400, user_id)
//     } 
//     else if( data === 64 ){
//         handelLevelupBonuses(450, user_id)
//     } 
//     else if( data === 65 ){
//         handelLevelupBonuses(500, user_id)
//     } 
//     else if( data === 66 ){
//         handelLevelupBonuses(550, user_id)
//     } 
//     else if( data === 67){
//         handelLevelupBonuses(600, user_id)
//     } 
//     else if(  data === 68){
//         handelLevelupBonuses(700, user_id)
//     } 
//     else if(  data === 69 ){
//         handelLevelupBonuses(800, user_id)
//     } 
//     else if(  data === 70 ){
//         handelLevelupBonuses(1200, user_id)
//     } 
//     else if(  data === 71 ){
//         handelLevelupBonuses(1300, user_id)
//     } 
//     else if(  data === 72 ){
//         handelLevelupBonuses(1400, user_id)
//     } 
//     else if(  data === 73 ){
//         handelLevelupBonuses(1500, user_id)
//     } 
//     else if(  data === 74 ){
//         handelLevelupBonuses(1600, user_id)
//     } 
//     else if(  data === 75 ){
//         handelLevelupBonuses(1700, user_id)
//     } 
//     else if(  data === 76 ){
//         handelLevelupBonuses(1800, user_id)
//     }
//     else if(  data === 77 ){
//         handelLevelupBonuses(2000, user_id)
//     }
//     else if(  data === 78 ){
//         handelLevelupBonuses(2200, user_id)
//     } 
//     else if(  data === 79 ){
//         handelLevelupBonuses(2300, user_id)
//     } 
//     else if(  data === 80 ){
//         handelLevelupBonuses(2500, user_id)
//     } 
//     else if(  data === 81 ){
//         handelLevelupBonuses(2600, user_id)
//     } 
//     else if(  data === 82 ){
//         handelLevelupBonuses(2700, user_id)
//     } 
//     else if(  data === 83 ){
//         handelLevelupBonuses(2800, user_id)
//     } 
//     else if(  data === 84 ){
//         handelLevelupBonuses(3000, user_id)
//     } 
//     else if(  data === 85 ){
//         handelLevelupBonuses(3200, user_id)
//     } 
//     else if(  data === 86 ){
//         handelLevelupBonuses(3600, user_id)
//     } 
//     else if(  data === 87 ){
//         handelLevelupBonuses(4000, user_id)
//     } 
//     else if(  data === 88 ){
//         handelLevelupBonuses(4500, user_id)
//     } 
//     else if(  data === 89 ){
//         handelLevelupBonuses(5000, user_id)
//     } 
//     else if(  data === 90 ){
//         handelLevelupBonuses(5500, user_id)
//     } 
//     else if(data === 91  ){
//         handelLevelupBonuses(6000, user_id)
//     } 
//     else if( data === 92 ){
//         handelLevelupBonuses(7000, user_id)
//     } 
//     else if(data === 93 ){
//         handelLevelupBonuses(8000, user_id)
//     } 
//     else if(data === 94 ){
//         handelLevelupBonuses(9000, user_id)
//     } 
//     else if(data === 95 ){
//         handelLevelupBonuses(10000, user_id)
//     } 
//     else if(data === 96 ){
//         handelLevelupBonuses(11000, user_id)
//     } 
//     else if(data === 97){
//         handelLevelupBonuses(12000, user_id)
//     } 
//     else if( data === 98 ){
//         handelLevelupBonuses(13000, user_id)
//     } 
//     else if(data === 99 ){
//         handelLevelupBonuses(15000, user_id)
//     } 
//     else if(data === 100 ){
//         handelLevelupBonuses(18000, user_id)
//     }  
//     else if(data === 101 ){
//         handelLevelupBonuses(20000, user_id)
//     } 
//     else if(data === 102 ){
//         handelLevelupBonuses(23000, user_id)
//     } 
//     await CashBackDB.updateOne({user_id}, {
//         vip_level:data
//     })
//     await ProfileDB.updateOne({user_id}, {
//         vip_level:data
//     })
// })

// module.exports = { handelLevelups}