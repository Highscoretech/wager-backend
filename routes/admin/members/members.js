const express = require("express");
const router = express.Router();
const requireAuth = require('../../../middleware/requireAuth')

const {
  Register, memberProfile, allMemberProfile,
} = require("../../../adminController/members");
router.post("/createmember", Register);
router.get("/member-profile/:id",memberProfile)
router.get("/all-members",allMemberProfile)

module.exports = router;
