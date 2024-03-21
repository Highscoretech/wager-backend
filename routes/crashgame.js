const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const {handleCrashHistory, handleScriptList, handleScriptAddOrUpdate, handleScriptDelete,handleMybets, handleCrashGamePlayers, handleBetDetails} = require('../controller/crashControllers');

router.post('/scripts/list', handleScriptList)
router.get('/history', handleCrashHistory)
router.get('/details/:betID', handleBetDetails)
router.get('/players/:gameID', handleCrashGamePlayers)

// auth middleware
router.use(requireAuth);
router.post('/my-bet', handleMybets);
router.post('/scripts/add', handleScriptAddOrUpdate)
router.post('/scripts/update', handleScriptAddOrUpdate)
router.post('/scripts/delete', handleScriptDelete)

module.exports = router