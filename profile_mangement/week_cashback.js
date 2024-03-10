// const CashBackDB = require("../model/cash_back")
// const PPDWallet = require("../model/PPD-wallet")


// const Nextmonday = (() => {
//   const today = new Date();
//   // Get next month's index(0 based)
//   const nextMonth = today.getMonth() + 1;
//   const year = today.getFullYear() + (nextMonth === 12 ? 1 : 0);
//   // Get first day of the next month
//   const firstDayOfNextMonth = new Date(year, nextMonth % 12, 1);

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


// const handleCashReturn = (async (user_id, cash) => {
//   let data = await CashBackDB.find({ user_id });
//   let prev_bal = parseFloat(data[0].week_bonus); // Do not lose previously unclaimed bonus
//   await CashBackDB.updateOne({ user_id }, {
//     week_cashback: 0,
//     week_bonus: cash + prev_bal
//   })

//   //TODO: Probably dont need this
//   await CashBackDB.updateMany({}, {
//     nextMonday: Nextmonday()
//   })
// })

// const getCashbackPercentage = (vip_level) => {
//   if (vip_level < 38) {
//     return 0.05;
//   }
//   else if (vip_level < 56) {
//     return 0.06;
//   }
//   else if (vip_level < 70) {
//     return 0.07;
//   }
//   else if (vip_level < 85) {
//     return 0.075;
//   }
//   else {
//     return 0.08;
//   }
// }

// const handleWeeklyCashbackImplementation = (async () => {
//   try {
//     let data = await CashBackDB.find({week_cashback: {$gt: 0}});
//     await Promise.all(data.map(element => {
//       let vip_level = element.vip_level
//       let user_id = element.user_id
//       if (element.week_cashback > 1000) {
//         return handleCashReturn(user_id, (element.week_cashback * 0.01 * getCashbackPercentage(vip_level)).toFixed(6));
//       } else return handleCashReturn(user_id, 0)
//     }));
//   } catch (e) {
//     console.log("Error handling cashback", e.message)
//     throw e; // will be caught by task runner
//   }
// })

// const handleWeeklyCashback = (async (user_id, amount) => {
//   let data = await CashBackDB.find({ user_id });
//   let prev_bal = parseFloat(data[0].week_cashback)
//   let new_bal = prev_bal + amount
//   await CashBackDB.updateOne({ user_id }, {
//     week_cashback: new_bal
//   })
// })


// const handleClaimBonus = (async (req, res) => {
//   let { user_id } = req.id
//   try {
//     let data = await CashBackDB.find({ user_id })
//     let new_bal = parseFloat(data[0].week_bonus)
//     let new_claim = parseFloat(data[0].total_bonus_claimed)

//     let jdjn = await PPDWallet.find({ user_id })
//     let prev_bal = parseFloat(jdjn[0].balance)

//     await PPDWallet.updateOne({ user_id }, {
//       balance: new_bal + prev_bal
//     })
//     await CashBackDB.updateOne({ user_id }, {
//       week_bonus: 0,
//       claimed_week_bonus: new_bal,
//       last_week_bonus: data.claimed_week_bonus,
//       total_bonus_claimed: new_claim + new_bal
//     })
//     res.status(200).json({ result: "Claimed successfully" })
//   }
//   catch (error) {
//     res.status(500).json({ error })
//   }
// })

// const testCashback = async (req, res) => {
//   try {
//     await handleWeeklyCashbackImplementation();
//     res.status(200).json("done!")
//   } catch (error) {
//     res.status(500).json(error.message)
//   }
// }


// module.exports = { handleWeeklyCashback, handleWeeklyCashbackImplementation, handleClaimBonus, testCashback }