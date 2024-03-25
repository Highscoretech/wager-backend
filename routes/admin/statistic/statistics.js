const express = require('express')
const router = express.Router()

const { GlobalStat, crashStat, diceStat } = require('../../../adminController/statistisControllers')
router.post ('/global', GlobalStat)
router.post ('/crash', crashStat)
router.post ('/dice', diceStat)

module.exports = router