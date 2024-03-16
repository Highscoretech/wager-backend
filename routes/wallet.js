const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const { GetWGDWallet, GetWGFWallet, GetETHWallet, GetBTCWallet, GetDefaultWallet, UpdatedefaultWallet}  = require('../controller/walletControlers')

router.get('/wgd-wallet', GetWGDWallet)
router.get('/wgf-wallet', GetWGFWallet)
router.get('/eth-wallet', GetETHWallet)
router.get('/btc-wallet', GetBTCWallet)
router.get('/default-wallets', GetDefaultWallet)
router.post('/update-default-wallets', UpdatedefaultWallet)

module.exports = router