// const PPDunlockDB = require("../model/ppd_unlock")
// const PPD_wallet = require("../model/PPD-wallet")


// const handleCreatePPDunlocked = (async (user_id) => {
//     let data = {
//         user_id,
//         locked: 0,
//         unlocked: 0,
//         progress: 0
//     }
//     try {
//         let result = await PPDunlockDB.create(data)
//         return result
//     }
//     catch (error) {
//         console.log(error)
//     }
// })

// const handlePPDunLockUpdate = (async (user_id, amount) => {
//     const data = await PPDunlockDB.find({ user_id })
//     let prev_bal = parseFloat(data[0].unlocked)
//     await PPDunlockDB.updateOne({ user_id }, {
//         unlocked: prev_bal + amount
//     })
// })

// const unlockedPPD = (async (user_id, total_wagered) => {
//     const data = await PPDunlockDB.find({ user_id })
//     let rsr = 0.01 * 0.25 * total_wagered
//     let unlocked = parseFloat(data[0].unlocked)
//     let locked = parseFloat(data[0].locked)

//     if (locked > 0) {
//         await PPDunlockDB.updateOne({ user_id }, {
//             unlocked: unlocked + rsr,
//             locked: locked - rsr
//         })

//         let jdni = await PPD_wallet.find({ user_id })
//         let prev_bal = parseFloat(jdni[0].balance)

//         await PPD_wallet.updateOne({ user_id }, {
//             balance: prev_bal + rsr
//         })
//     }
// })

// const displayUnlockDDP = (async (req, res) => {
//     const { user_id } = req.id
//     try {
//         const data = await PPDunlockDB.find({ user_id })
//         res.status(200).json(data)
//     }
//     catch (error) {
//         res.status(500).json(error)
//     }
// })


// module.exports = { handleCreatePPDunlocked, handlePPDunLockUpdate, unlockedPPD, displayUnlockDDP }