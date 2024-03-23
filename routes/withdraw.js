const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// auth middleware
router.use(requireAuth);
const { initiateWithdrawal } = require("../controller/withdrawController");

router.post("/initiate", initiateWithdrawal);
module.exports = router;