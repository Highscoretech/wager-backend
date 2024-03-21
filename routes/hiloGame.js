const express = require('express');
const router = express.Router();
const mainRouter = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {userBets, gameDetail, recentBets, updateSeeds, gameSeeds } = require('../controller/hiloController');

mainRouter.get('/recent-bets', recentBets);
mainRouter.get('/details/:betID', gameDetail);
router.get('/seeds', gameSeeds);
// auth middleware
router.use(requireAuth);
router.get('/user/bets', userBets);
router.post('/user/update-seeds', updateSeeds);
mainRouter.use(router);

module.exports = mainRouter;