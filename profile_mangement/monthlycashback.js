// const CashBackDB = require("../model/cash_back")
// const PPDWallet = require("../model/PPD-wallet")
// function startOfMonth(date) {
//   return new Date(date.getFullYear(), date.getMonth(), 1);
// }

// const handleMonthlyCashback = (async (user_id, amount) => {
//   let data = await CashBackDB.find({ user_id })
//   let prev_bal = parseFloat(data[0].monthly_cashback)
//   let new_bal = prev_bal + amount
//   await CashBackDB.updateOne({ user_id }, {
//     monthly_cashback: new_bal
//   })
// })

// const handleClaimMonthlyBonus = (async (req, res) => {
//   let { user_id } = req.id
//   try {
//     let snjj = await CashBackDB.find({ user_id })
//     let new_bal = parseFloat(snjj[0].month_bonus)
//     let new_claim = parseFloat(snjj[0].total_bonus_claimed)

//     let ksns = await PPDWallet.find({ user_id })
//     let prev_bal = parseFloat(ksns[0].balance)

//     await PPDWallet.updateOne({ user_id }, {
//       balance: new_bal + prev_bal
//     })

//     await CashBackDB.updateOne({ user_id }, {
//       month_bonus: 0,
//       claimed_month_bonus: new_bal,
//       last_month_bonus: data.claimed_month_bonus,
//       total_bonus_claimed: new_claim + new_bal
//     })
//     res.status(200).json({ result: "Claimed successfully" })
//   }
//   catch (error) {
//     res.status(500).json({ error })
//   }
// })

// const handleCashReturn = (async (user_id, cash) => {
//   dt = new Date();
//   let data = await CashBackDB.find({ user_id });
//   let prev_bal = parseFloat(data[0].month_bonus); // Do not lose previously unclaimed bonus
//   await CashBackDB.updateOne({ user_id }, {
//     monthly_cashback: 0,
//     month_bonus: cash + prev_bal
//   })
//   await CashBackDB.updateMany({}, {
//     nextMonth: startOfMonth(dt)
//   })
// })

// const getCashbackPercentage = (vip_level) => {
//   if (vip_level < 38) {
//     return 0.03;
//   }
//   else if (vip_level < 56) {
//     return 0.035;
//   }
//   else if (vip_level < 70) {
//     return 0.04;
//   }
//   else if (vip_level < 85) {
//     return 0.045;
//   }
//   else {
//     return 0.05;
//   }
// }

// const handleMonthlyCashbackImplementation = (async () => {
 
//   try {
//     let hsjiis = await CashBackDB.find({monthly_cashback: {$gt: 0 }});
//     await Promise.all(hsjiis.map(element => {
//       let vip_level = element.vip_level
//       let user_id = element.user_id
//       if (element.monthly_cashback > 10000) {
//         return handleCashReturn(user_id, (element.monthly_cashback * 0.01 * getCashbackPercentage(vip_level)).toFixed(6));
//       }
//       else return handleCashReturn(user_id, 0)
//     }))
//   } catch (e) {
//     console.log("Error handling cashback", e.message)
//     throw e; // will be caught by task runner
//   }
// })

// module.exports = { handleMonthlyCashback, handleClaimMonthlyBonus, handleMonthlyCashbackImplementation }