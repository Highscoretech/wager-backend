const express = require('express')
const router = express.Router()

const { handlePrev_Games } = require('../../../controller/diceControllers')

router.post('/crash-history', handlePrev_Games)

module.exports = router