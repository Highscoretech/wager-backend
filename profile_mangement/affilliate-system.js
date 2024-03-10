// const ProfileDB = require("../model/Profile")
// const AffiliateCodes = require("../model/affiliate_codes")
// const affiliate_commission_reward = require("../model/affiliate_commission_reward")

// const handelLevelupBonuses = (async (bonus, user_id) => {
//     try {
//         const dataEL = await ProfileDB.find({ user_id })
//         const ref = dataEL[0].invited_code
//         const prev_earn_me = parseFloat(dataEL[0].earn_me)
//         const prev_locked_usd = parseFloat(dataEL[0].usd_reward)
//         if (ref !== "-") {
//             await ProfileDB.updateOne({ user_id }, {
//                 earn_me: prev_earn_me + bonus,
//                 usd_reward: prev_locked_usd - bonus
//             })

//             const refss = await AffiliateCodes.find({ affiliate_code: ref })
//             let prev_bal = parseFloat(refss[0].available_usd_reward)
//             let upper_line_id = refss[0].user_id

//             await AffiliateCodes.updateOne({ affiliate_code: ref }, {
//                 available_usd_reward: prev_bal + bonus
//             })

//             let reward = {
//                 user_id: upper_line_id,
//                 crypto: "USDT",
//                 amount: bonus,
//                 time: new Date(),
//                 status: "successful",
//                 is_consumed: false
//             }
//             await affiliate_commission_reward.create(reward)
//         }
//     }
//     catch (err) {
//         console.log(err)
//     }
// })


// const handleProgressPercentage = (async (starting, ending, total_wagered, user_id) => {
//     let unit_range = (ending - parseFloat(starting)) / 100
//     let range = (total_wagered - starting).toFixed(0)
//     let progressPercent = (range / unit_range).toFixed(0)
//     await ProfileDB.updateOne({ user_id }, {
//         vip_progress: progressPercent
//     })
// })

// const handleAffiliateRewards = ((data, user_id) => {
//     if (data === 4) {
//         handelLevelupBonuses(0.5, user_id)
//     }
//     else if (data === 5) {
//         setTimeout(() => {
//             handelLevelupBonuses(0.3, user_id)
//         }, 50)
//     }
//     else if (data === 6) {
//         setTimeout(() => {
//             handelLevelupBonuses(0.40, user_id)
//         }, 100)
//     }
//     else if (data === 7) {
//         setTimeout(() => {
//             handelLevelupBonuses(0.5, user_id)
//         }, 150)
//     }
//     else if (data === 8) {
//         setTimeout(() => {
//             handelLevelupBonuses(1.30, user_id)
//         }, 200)
//     }
//     else if (data === 9) {
//         setTimeout(() => {
//             handelLevelupBonuses(0.50, user_id)
//         }, 50)
//     }
//     else if (data === 10) {
//         setTimeout(() => {
//             handelLevelupBonuses(0.50, user_id)
//         }, 100)
//     }
//     else if (data === 11) {
//         setTimeout(() => {
//             handelLevelupBonuses(0.6, user_id)
//         }, 150)
//     }
//     else if (data === 12) {
//         setTimeout(() => {
//             handelLevelupBonuses(0.6, user_id)
//         }, 200)
//     }
//     else if (data === 13) {
//         setTimeout(() => {
//             handelLevelupBonuses(0.7, user_id)
//         }, 250)
//     }
//     else if (data === 14) {
//         handelLevelupBonuses(2.1, user_id)
//     }
//     else if (data === 15) {
//         handelLevelupBonuses(0.8, user_id)
//     }
//     else if (data === 16) {
//         handelLevelupBonuses(0.8, user_id)
//     }
//     else if (data === 17) {
//         handelLevelupBonuses(1.00, user_id)
//     }
//     else if (data === 18) {
//         handelLevelupBonuses(1, user_id)
//     }
//     else if (data === 19) {
//         handelLevelupBonuses(1, user_id)
//     }
//     else if (data === 20) {
//         handelLevelupBonuses(1.2, user_id)
//     }
//     else if (data === 21) {
//         handelLevelupBonuses(1.2, user_id)
//     }
//     else if (data === 22) {
//         handelLevelupBonuses(5, user_id)
//     }
//     else if (data === 23) {
//         handelLevelupBonuses(1.6, user_id)
//     }
//     else if (data === 24) {
//         handelLevelupBonuses(1.6, user_id)
//     }
//     else if (data === 25) {
//         handelLevelupBonuses(2, user_id)
//     }
//     else if (data === 26) {
//         handelLevelupBonuses(2, user_id)
//     }
//     else if (data === 27) {
//         handelLevelupBonuses(2, user_id)
//     }
//     else if (data === 28) {
//         handelLevelupBonuses(2.4, user_id)
//     }
//     else if (data === 29) {
//         handelLevelupBonuses(2.4, user_id)
//     }
//     else if (data === 30) {
//         handelLevelupBonuses(11, user_id)
//     }
//     else if (data === 31) {
//         handelLevelupBonuses(3, user_id)
//     }
//     else if (data === 32) {
//         handelLevelupBonuses(3.5, user_id)
//     }
//     else if (data === 33) {
//         handelLevelupBonuses(4, user_id)
//     }
//     else if (data === 34) {
//         handelLevelupBonuses(4.5, user_id)
//     }
//     else if (data === 35) {
//         handelLevelupBonuses(5, user_id)
//     }
//     else if (data === 36) {
//         handelLevelupBonuses(5.5, user_id)
//     }
//     else if (data === 37) {
//         handelLevelupBonuses(6.5, user_id)
//     }
//     else if (data === 38) {
//         handelLevelupBonuses(23.0, user_id)
//     }
// })


// const handleAffiliateCommission = (async (user_id, bet_amount, crypto) => {
//     try {
//         const vie = await ProfileDB.find({ user_id })
//         const ref = vie[0].invited_code
//         const prev_commission_reward = parseFloat(vie[0].commission_reward)
//         let new_commission_reward = parseFloat(bet_amount) * 0.01 * 0.15
//         if (ref !== "-") {
//             await ProfileDB.updateOne({ user_id }, {
//                 commission_reward: prev_commission_reward + new_commission_reward
//             })

//             let foo = await AffiliateCodes.find({ affiliate_code: ref })
//             let upper_line_id = foo[0].user_id
//             let yesterday_commission = parseFloat(foo[0].today_commission)

//             await AffiliateCodes.updateOne({ user_id: upper_line_id }, {
//                 today_commission: new_commission_reward + yesterday_commission
//             })
//             let reward = {
//                 user_id: upper_line_id,
//                 amount: new_commission_reward,
//                 time: new Date(),
//                 crypto: crypto,
//                 status: "successful",
//                 is_consumed: 0
//             }

//             await affiliate_commission_reward.create(reward)

//         }
//     }
//     catch (error) {
//         console.log(error)
//     }
// })


// const handleUpdateCommision = (async (user_id) => {
//     try {
//         const refss = await AffiliateCodes.find({ user_id })
//         let yesterday_bonus = parseFloat(refss[0].today_commission)
//         let prev_bonus = parseFloat(refss[0].commission_reward)

//         await AffiliateCodes.updateOne({ user_id }, {
//             today_commission: 0,
//             commission_reward: yesterday_bonus + prev_bonus
//         })
//         await affiliate_commission_reward.updateOne({ user_id }, {
//             is_consumed: true
//         })
//     }
//     catch (err) {
//         console.log(err)
//     }
// })

// const handleCommissionCalculation = (async () => {
//     try {
//         const reff = await affiliate_commission_reward.find({ is_consumed: false })
//         let now = new Date()
//         reff.forEach(element => {
//             if (new Date(element.time).getDate() !== now.getDate()) {
//                 handleUpdateCommision(element.user_id)
//             }
//         });
//     }
//     catch (eror) {
//         console.log(eror)
//     }
// })

// // setInterval(() => handleCommissionCalculation(), 60000);
// module.exports = { handleAffiliateRewards, handleAffiliateCommission, handleProgressPercentage }