const express = require('express')
const router = express.Router()
const { GetAllPlayersByGameId } = require('../../../adminController/getAllPLayersControllers')

router.post('/crash', GetAllPlayersByGameId)

module.exports = router