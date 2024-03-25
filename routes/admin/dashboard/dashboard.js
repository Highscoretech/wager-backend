const express = require('express')
const router = express.Router()

const { dashboard } = require('../../../adminController/adminController')

router.get('/', dashboard)

module.exports = router