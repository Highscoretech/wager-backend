// const CashBackDB = require("../model/cash_back")


// const Nextmonday = (()=>{
//   const today = new Date();
//   // Get next month's index(0 based)
//   const nextMonth = today.getMonth() + 1;
//   const year = today.getFullYear() + (nextMonth === 12 ? 1: 0);
//   // Get first day of the next month
//   const firstDayOfNextMonth = new Date(year, nextMonth%12, 1);

//   function getNextMonday(date = new Date()) {
//     const dateCopy = new Date(date.getTime());
//     const nextMonday = new Date(
//       dateCopy.setDate(
//         dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
//       )
//     );
//     return nextMonday;
//   }
//   // 👇️ Get Monday of Next Weeka
//   let data = {
//     next_firstofthemonth: firstDayOfNextMonth,
//     next_monday: new Date(getNextMonday()) 
//   }
//   return getNextMonday()
// })

// function startOfMonth(date) {
//   return new Date(date.getFullYear(), date.getMonth(), 1);
// }


// const createCashbackTable = (async(user_id)=>{
//   dt = new Date(); 
//   let data = {
//     user_id: user_id,
//     week_cashback: 0,
//     week_bonus:0,
//     monthly_cashback: 0,
//     recharge_balance: 0,
//     recharge_settings: '-',
//     total_level_bonus: 0,
//     vip_level: 0,
//     total_bonus_claimed:0,
//     next_level_point:1,
//     month_bonus: 0,
//     total_wagered: 0,
//     nextMonday: Nextmonday(),
//     nextMonth: startOfMonth(dt)
//   }
  
//   try{
//   await  CashBackDB.create(data)
//   }
//   catch(err){
//     console.log(err)
//   }
// })


// const handleAllCashbacks = (async(req, res)=>{
//     const {user_id} = req.id
//     if(user_id){
//       try{
//         const data = await CashBackDB.find({user_id})
//         res.status(200).json(data[0])
//       }
//       catch(err){
//         res.status(500).json({error: err})
//       }
//     }else{
//       res.status(500).json({error: "No user found"})
//     }
// })


// const handleFlashDrop = (async(req, res)=>{
//   const user_id = req.id

// })

// const handleUpdateDailyReports = (()=>{
// //   let query = `SELECT * FROM daily_reports`;
// //   connection.query(query, async function(error, data){
// //     let yesterdy = data[data.length - 1].date
// //     let before = new Date(yesterdy).getDate()
// //     let now = new Date().getDate()
// //     if( before !== now){
// //       let newStore = {
// //         DAU:0,
// //         newly_registered:0,
// //         total_new_deposit:0,
// //         total_new_deposit_amount:0,
// //         total_re_deposit_amount:0,
// //         total_withdraw_amount:0,
// //         total_withdraw: 0,
// //         date: new Date()
// //       }
// //       let sql = `INSERT INTO daily_reports SET ?`;
// //       connection.query(sql, newStore, (err, data)=>{
// //           if(err){
// //               console.log(err)
// //           }
// //         })
// //     }
// //   })
// })
// // setInterval(()=> handleUpdateDailyReports() ,1000)

// const handleNewNewlyRegisteredCount = (()=>{
// //   let query = `SELECT * FROM daily_reports`;
// //   connection.query(query, async function(error, data){
// //       let newly_registered = parseInt(data[0].newly_registered)
// //       let sql22= `UPDATE daily_reports SET newly_registered="${newly_registered + 1}"`;
// //       connection.query(sql22, function (err, result) {
// //         if (err) throw err;
// //       (result)
// //       })
// //   })
// })


// const handleTotalNewDepsitCount = ((amount)=>{
// //   let query = `SELECT * FROM daily_reports`;
// //   connection.query(query, async function(error, data){
// //       let newly_registered = parseInt(data[0].total_new_deposit)
// //       let deposit_amount = parseInt(data[0].total_new_deposit_amount)
// //       let sql22= `UPDATE daily_reports SET total_new_deposit="${newly_registered + 1}", total_new_deposit_amount="${deposit_amount + amount}", total_re_deposit_amount="${deposit_amount + amount}"`;
// //       connection.query(sql22, function (err, result) {
// //         if (err) throw err;
// //       (result)
// //       })
// //   })
// })

// module.exports = {  createCashbackTable, handleAllCashbacks, handleNewNewlyRegisteredCount, handleTotalNewDepsitCount, }