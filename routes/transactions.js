const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth);
const {  handleTransaction, handleSwapCoins }  = require('../controller/transactionControllers');

router.get('/:id', handleTransaction)
router.post('/swap', handleSwapCoins)

module.exports = router