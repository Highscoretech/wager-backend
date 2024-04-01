const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const {  handleAffiliateProfile,
 handleActivateAffiliateCode, handleActivateAffiliate,
  handleFriendsInfo} = require('../controller/affiliateControllers')

router.get("/friends-info", handleFriendsInfo)
router.post("/activate", handleActivateAffiliate)
router.get("/", handleAffiliateProfile)
module.exports = router