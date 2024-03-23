const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth');

// auth middleware
router.use(requireAuth);
const { getDepositHistory } = require('../controller/transactionHistories/getDepositHistory');
const { getWithdrawalHistory } = require('../controller/transactionHistories/getWithdrawalHistory');
const { getSwapHistory } = require('../controller/transactionHistories/getSwapHistory');
router.get('/deposit', getDepositHistory);
router.get('/withdrawal', getWithdrawalHistory);
router.get('/swap', getSwapHistory);


module.exports = router