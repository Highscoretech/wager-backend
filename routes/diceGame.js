const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const {generateNewServerSeed, getDiceGameHistory, seedSettings, handleDiceGameEncryption, 
HandlePlayDice, gameDetalsByID } = require('../controller/diceControllers')

router.post('/historyByID', gameDetalsByID)
router.get('/generate-seed', generateNewServerSeed)

// auth middleware
router.use(requireAuth);
router.post('/bet', HandlePlayDice)
router.post('/seed-settings', seedSettings)
router.get('/encrypt', handleDiceGameEncryption)
router.get('/dice-history', getDiceGameHistory)

module.exports = router