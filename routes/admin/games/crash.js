const express = require('express')
const router = express.Router()

const { fetchPreviousCrashHistory, VerifyDice } = require('../../../adminController/gamesControllers')

router.post('/crash-history', fetchPreviousCrashHistory)
router.get('/Verify-dice', VerifyDice)
module.exports = router