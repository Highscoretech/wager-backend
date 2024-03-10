// const CashBackDB = require("../model/cash_back")
// const PPDWallet = require("../model/PPD-wallet")
// const PPLWallet = require("../model/PPL-wallet")
// const USDTWallet = require("../model/btc-wallet")
// const FlashDrop = require("../model/flashdrop")
// const RedeemHistory = require("../model/flashdrop_redeem_history");
// const mongoose = require("mongoose");

// const handleRedeemFlashDrop = (async (req, res) => {
//   let { user_id } = req.id
//   let { shit_code } = req.body;
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {

//     if (!shitCode) {
//       return res.status(403).json({
//         error: true,
//         message: "ShitCode required"
//       })
//     }


//     const flashdrop = await FlashDrop.findOne({ shit_code }).session(session);
//     if (!flashdrop) {
//       await session.endSession();
//       return res.status(404).json({
//         error: true,
//         message: "Drop with requested shitcode not found!"
//       })
//     }
//     if (flashdrop.threshold_limit <= 0) {
//       await session.endSession();
//       return res.status(403).json({
//         error: true,
//         message: "Threshold limit exceeded!"
//       })
//     }

//     let data = await CashBackDB.findOne({ user_id }).session(session);

//     if (flashdrop.wager_requirement > 0 && data.total_wagered < flashdrop.wager_requirement) {
//       await session.endSession();
//       return res.status(403).json({
//         error: true,
//         message: "Wager requirements not met"
//       })
//     }

//     if (flashdrop.level_requirement > 0 && data.vip_level < flashdrop.level_requirement) {
//       await session.endSession();
//       return res.status(403).json({
//         error: true,
//         message: "Level requirements not met"
//       })
//     }

//     if (flashdrop.token === "PPL") {
//       await PPLWallet.updateOne({ user_id }, {
//         $inc: { balance: flashdrop.amount }
//       }).session(session);
//     } else if (flashdrop.token === "PPD") {
//       await PPDWallet.updateOne({ user_id }, {
//         $inc: { balance: flashdrop.amount }
//       }).session(session);
//     } else if (flashdrop.token === "USDT") {
//       await USDTWallet.updateOne({ user_id }, {
//         $inc: { balance: flashdrop.amount }
//       }).session(session);
//     }

//     await FlashDrop.updateOne({ flashdrop_id: flashdrop.flashdrop_id }, {
//       $inc: { threshold_limit: -1 }
//     }).session(session);

//     await RedeemHistory.create([{
//       user_id,
//       flashdrop_id: flashdrop.flashdrop_id,
//     }], { session })

//     await session.commitTransaction();
//     await session.endSession();
//     res.status(200).json({ token: flashdrop.token, amount: flashdrop.amount });
    
//   }
//   catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     res.status(500).json({ error })
//   }
// })



// module.exports = { handleRedeemFlashDrop }