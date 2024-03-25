const express = require('express')
const router = express.Router()

const {reports} = require('../../../adminController/reports')

router.get('/', reports)
module.exports = router