const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const {  SingleUser,  UpdateUser, UpdateProfile,
     handleHiddenProfile, handlePublicUsername, 
     handleRefusefriendRequest, handleRefuseTip, handleDailyPPFbonus, 
     UpdateAvatar, ChangeProfilePicture } = require('../controller/profileControllers')
// const {handleClaimBonus} = require("../profile_mangement/week_cashback")
// const { handleClaimMonthlyBonus } = require("../profile_mangement/monthlycashback")
// const {handleClaimRechargeBonus, handleRechargeActivation } = require("../profile_mangement/rechargebonus")
// const { handleRedeemFlashDrop } = require("../profile_mangement/flashdropredeem")

router.get('/', SingleUser)
router.post('/update-user', UpdateUser)
router.post('/update-profile', UpdateProfile)
router.post('/change-profile-picture', ChangeProfilePicture)
router.post('/update-avatar', UpdateAvatar);
router.post('/update-hidden', handleHiddenProfile)
router.post('/hide-public-username', handlePublicUsername)
router.post('/refuse-friend-request', handleRefusefriendRequest)
router.post('/refuse-tips', handleRefuseTip)
router.get('/ppf-daily-bonus', handleDailyPPFbonus)
// router.post("/claim-recharge-bonus", handleClaimRechargeBonus)
// router.post("/activate-recharge", handleRechargeActivation)

// router.post("/claim-weekly-bonus", handleClaimBonus)
// router.post("/claim-monthly-bonus", handleClaimMonthlyBonus)
// router.post("/redeem-flashdrop", handleRedeemFlashDrop)

module.exports = router