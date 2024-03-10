// const CashBackDB = require("../model/cash_back")
// const PPDWallet = require("../model/PPD-wallet")
// const moment = require("moment");

// const handleRechargeCashback = async (user_id, amount) => {
//   let data = await CashBackDB.findOne({
//     user_id,
//     recharge_activated: true,
//     recharge_end: { $gt: moment.utc().toDate() }
//   });
//   if (data) {
//     let prev_bal = parseFloat(data.recharge_balance)
//     let new_bal = prev_bal + amount
//     await CashBackDB.updateOne({ user_id }, {
//       recharge_balance: new_bal
//     })
//   }
// }

// const getTierPercentage = (vip_level, wagered) => {
//   if (vip_level < 38) {
//     if (wagered < 50_000) return 0.10;
//     else if (wagered < 200_000) return 0.12;
//     else if (wagered < 500_000) return 0.14;
//     else return 0.16;
//   }
//   else if (vip_level < 56) {
//     if (wagered < 50_000) return 0.12;
//     else if (wagered < 200_000) return 0.14;
//     else if (wagered < 500_000) return 0.16;
//     else return 0.18;
//   }
//   else if (vip_level < 70) {
//     if (wagered < 50_000) return 0.14;
//     else if (wagered < 200_000) return 0.16;
//     else if (wagered < 500_000) return 0.18;
//     else return 0.18;
//   }
//   else if (vip_level < 85) {
//     if (wagered < 50_000) return 0.16;
//     else if (wagered < 200_000) return 0.18;
//     else if (wagered < 500_000) return 0.20;
//     else return 0.22;
//   }
//   else {
//     if (wagered < 50_000) return 0.18;
//     else if (wagered < 200_000) return 0.20;
//     else if (wagered < 500_000) return 0.22;
//     else return 0.24;
//   }
// }

// const handleCashReturn = (async (user_id, cash) => {
//   await CashBackDB.updateOne({ user_id }, {
//     recharge_balance: 0,
//     recharge_bonus: cash,
//   })
// })

// const handleRechargeImplementation = (async ({frequency}) => {
//   try {
//     let data = await CashBackDB.find({ recharge_settings: frequency, recharge_balance: {$gt: 0 } })
//     await Promise.all(data.map(element => {
//       let vip_level = element.vip_level
//       let user_id = element.user_id
//       if (element.recharge_balance > 1000) {
//         const recharge_balance = element.recharge_balance
//         return handleCashReturn(user_id, getTierPercentage(vip_level, recharge_balance) * recharge_balance * 0.01);
//       } else {
//         return handleCashReturn(user_id, 0)
//       }
//     }));
//   } catch (e) {
//     console.log("Error handling cashback", e.message)
//     throw e; // will be caught by task runner
//   }
// })

// const claimAvailable = (cashback) => {
//   let lastClaimDate = moment(cashback.recharge_claimed_at);
//   let currentTime = moment();
//   if (cashback.recharge_settings === "daily") {
//       return currentTime.isAfter(
//           moment(lastClaimDate)
//       .add(1, "day")
//       .startOf("day")
//   );
//   } else if (cashback.recharge_settings === "hourly") {
//       return currentTime.isAfter(
//           moment(lastClaimDate)
//       .add(1, "hour")
//       .startOf("hour"),
//   );
//   } else if (cashback.recharge_settings === "flash_charge") {
//       return currentTime.isAfter(moment(lastClaimDate)
//       .add(10, "minutes")
//       .startOf("minute"));
//   }
//   return false;
// };

// const handleClaimRechargeBonus = (async (req, res) => {
//   let { user_id } = req.id
//   try {
//     let data = await CashBackDB.findOne({ user_id });

//     if (!data.recharge_activated) {
//       return res.status(403).json({
//         error: true,
//         message: "Activate recharge before claiming!"
//       });
//     }

//     if (moment.utc().isAfter(moment(data.recharge_end))) {
//       return res.status(403).json({
//         error: true,
//         message: "Recharge period ended!"
//       });
//     }

    
//     if (!claimAvailable(data)) {
//       return res.status(403).json({
//         error: true,
//         message: "Cannot claim at this time!"
//       });
//     }


//     let new_bal = parseFloat(data.recharge_bonus)
//     let new_claim = parseFloat(data.total_bonus_claimed)

//     let jdjn = await PPDWallet.findOne({ user_id })
//     let prev_bal = parseFloat(jdjn.balance)

//     await PPDWallet.updateOne({ user_id }, {
//       balance: new_bal + prev_bal
//     })
//     await CashBackDB.updateOne({ user_id }, {
//       recharge_bonus: 0,
//       total_bonus_claimed: new_claim + new_bal,
//       recharge_claimed_at: moment.utc().toDate(),
//     })
//     res.status(200).json({ result: "Claimed successfully" })
//   }
//   catch (error) {
//     res.status(500).json({ error })
//   }
// })

// const handleRechargeActivation = (async (req, res) => {
//   let { user_id } = req.id
//   let { frequency } = req.body;
//   if (frequency !== "daily" && frequency !== "hourly" && frequency !== "flash_charge") {
//     frequency = "hourly";
//   }
//   try {

//     let data = await CashBackDB.findOne({ user_id });

//     if (data.recharge_activated) {
//       return res.status(403).json({
//         error: true,
//         message: "Recharge already activated"
//       });
//     }

//     await CashBackDB.updateOne({ user_id }, {
//       recharge_activated: true,
//       recharge_settings: frequency,
//       recharge_claimed_at: moment.utc().toDate(),
//       recharge_end: moment.utc().add(7, "days").toDate()
//     });
//     res.status(200).json({ result: "Claimed successfully" })
//   }
//   catch (error) {
//     res.status(500).json({ error })
//   }
// })

// const testResetCashback = async (req, res) => {
//   const {user_id} = req.body;
//   try {
//     await await CashBackDB.updateOne({ user_id }, {
//       recharge_activated: false,
//       recharge_settings: '-'
//     });
//     res.status(200).json("done!")
//   } catch (error) {
//     res.status(500).json(error.message)
//   }
// }

// const handleEndRechargePeriod = (async () => {
//   await CashBackDB.updateMany({ recharge_activated: true, recharge_end: { $lt: moment.utc().toDate() } }, {
//     recharge_activated: false,
//     recharge_settings: "-",
//     recharge_balance: 0,
//     recharge_bonus: 0,
//   });
// })


// module.exports = { handleRechargeCashback, handleClaimRechargeBonus, handleRechargeImplementation, handleRechargeActivation, handleEndRechargePeriod, testResetCashback }