// const { handleProfileTransactions } = require("../profile_mangement/index")
// const PPFwallet = require("../model/PPF-wallet")

// const handleDailyPPFbonus =  (async(req, res)=>{
//     // const {user_id} = req.id
//     // let query = `SELECT * FROM ppf_wallet WHERE user_id="${user_id}"`;
//     // connection.query(query, async function(error, data){
//     //   let prev_bal = parseFloat(data[0].balance)
//     //   let pre_date = data[0].updated_at
//     //   const yesterdy = pre_date.getDate()
//     //   const last_year = pre_date.getFullYear()
//     //   const now = new Date();
//     //   const this_year = now.getFullYear();
//     //   const today = now.getDate();
//     //   if(yesterdy === today && last_year === this_year){
//     //     return "don't add anything"
//     //   }else{
//     //     let trx_rec = {
//     //       user_id,
//     //       transaction_type: "PPF daily bonus", 
//     //       sender_img: "---", 
//     //       sender_name: "DPP_wallet", 
//     //       sender_balance: 0,
//     //       trx_amount: 20000,
//     //       receiver_balance: prev_bal + 20000,
//     //       datetime: currentTime, 
//     //       receiver_name: "PPF",
//     //       receiver_img: "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828376/ppf_logo_ntrqwg.png",
//     //       status: 'successful',
//     //       transaction_id: Math.floor(Math.random()*1000000000)+ 100000000,
//     //       is_sending: 0
//     //     }
//     //     handleProfileTransactions(trx_rec)
//     //     let sql22= `UPDATE ppf_wallet SET balance="${prev_bal + 20000}", updated_at="${now}" WHERE user_id="${user_id}"`;
//     //     connection.query(sql22, function (err, result) {
//     //       if (err) throw err;
//     //     (result)
//     //     let query = `SELECT * FROM daily_reports`;
//     //     connection.query(query, async function(error, data){
//     //         let pre_dau = parseInt(data[0].DAU)
//     //         let sql22= `UPDATE daily_reports SET DAU="${pre_dau + 1}"`;
//     //         connection.query(sql22, function (err, result) {
//     //           if (err) throw err;
//     //         (result)
//     //         })
//     //     })
//     //     });
//     //   }
//     // })  
// })


// module.exports =  {}