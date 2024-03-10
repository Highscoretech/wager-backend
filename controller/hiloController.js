const crypto = require("crypto");
const Bills = require("../model/bill");
const mongoose = require("mongoose");
const HiloGame = require("../model/hilo_game");
const HiloHistory = require("../model/hilo_game_history");
const HiloEncrypt = require("../model/hilo_encryped_seeds");
const BTCWallet = require("../model/btc-wallet");
const ETHWallet = require("../model/ETH-wallet");
const WGFWallet = require("../model/WGF-wallet")

const Profile = require('../model/Profile');
const { generateRandomString } = require("../utils/generators");
// const { handleWagerIncrease } = require("../profile_mangement/index");

const suites = ['♠', '♥', '♣', '♦'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const rankValues = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };

const cardOrder = [
    { rank: 'A', suite: '♠' },
    { rank: '4', suite: '♥', red: true },
    { rank: '7', suite: '♣' },
    { rank: '10', suite: '♦', red: true },
    { rank: '2', suite: '♠' },
    { rank: 'K', suite: '♣' },
    { rank: '5', suite: '♥', red: true },
    { rank: '8', suite: '♣' },
    { rank: 'J', suite: '♦', red: true },
    { rank: '3', suite: '♠' },
    { rank: '6', suite: '♥', red: true },
    { rank: 'Q', suite: '♦', red: true },
    { rank: '9', suite: '♣' },
    { rank: 'A', suite: '♥', red: true },
    { rank: '4', suite: '♣' },
    { rank: '7', suite: '♦', red: true },
    { rank: '10', suite: '♠' },
    { rank: '2', suite: '♥', red: true },
    { rank: 'K', suite: '♦', red: true },
    { rank: '5', suite: '♣' },
    { rank: '8', suite: '♦', red: true },
    { rank: 'J', suite: '♠' },
    { rank: '3', suite: '♥', red: true },
    { rank: '6', suite: '♣' },
    { rank: 'Q', suite: '♠' },
    { rank: '9', suite: '♦', red: true },
    { rank: 'A', suite: '♣' },
    { rank: '4', suite: '♦', red: true },
    { rank: '7', suite: '♠' },
    { rank: '10', suite: '♥', red: true },
    { rank: '2', suite: '♣' },
    { rank: 'K', suite: '♠' },
    { rank: '5', suite: '♦', red: true },
    { rank: '8', suite: '♠' },
    { rank: 'J', suite: '♥', red: true },
    { rank: '3', suite: '♣' },
    { rank: '6', suite: '♦' },
    { rank: 'Q', suite: '♣' },
    { rank: '9', suite: '♥', red: true },
    { rank: 'A', suite: '♦', red: true },
    { rank: '4', suite: '♠' },
    { rank: '7', suite: '♥', red: true },
    { rank: '10', suite: '♣' },
    { rank: '2', suite: '♦' },
    { rank: 'K', suite: '♥', red: true },
    { rank: '5', suite: '♠' },
    { rank: '8', suite: '♥', red: true },
    { rank: 'J', suite: '♣' },
    { rank: '3', suite: '♦' },
    { rank: '6', suite: '♠' },
    { rank: 'Q', suite: '♣' },
    { rank: '9', suite: '♥', red: true }
];
const numbers = [161, 180, 199, 218, 162, 205, 181, 200, 219, 163, 182, 220, 201, 177, 196, 215, 170, 178, 221, 197, 216, 171, 179, 198, 172, 217, 193, 212, 167, 186, 194, 173, 213, 168, 187, 195, 214, 188, 169, 209, 164, 183, 202, 210, 189, 165, 184, 203, 211, 166, 204, 185];

const deck = cardOrder.map((card, index) => ({
    suite: card.suite,
    rank: card.rank,
    red: card.red || false,
    number: numbers[index],
    rankValue: rankValues[card.rank]
}));


const pickRandomCard = (clientSeed, serverSeed, nonce, round) => {
    const hmac = crypto.createHmac('sha256', serverSeed)
        .update(`${clientSeed}:${nonce}:${round}`)
        .digest('hex');
    // Take the first eight characters and process them
    let sum = 0;
    for (let i = 0; i < 4; i++) {
        const pair = hmac.substring(i * 2, i * 2 + 2);
        const pairDecimal = parseInt(pair, 16);
        sum += (pairDecimal / (256 ** (i + 1)));
    }
    // Multiply sum by 52
    const cardIndex = Math.floor(sum * 52);
    return deck[cardIndex % 52];
}

function calculateProbabilities(lastCardRankValue) {
    const higherOrSameProbability = (deck.filter(card => lastCardRankValue === 1 ? card.rankValue > lastCardRankValue : card.rankValue >= lastCardRankValue).length / deck.length) * 100;
    const lowerOrSameProbability = (deck.filter(card => lastCardRankValue === 13 ? card.rankValue < lastCardRankValue : card.rankValue <= lastCardRankValue).length / deck.length) * 100;

    return {
        hi_chance: higherOrSameProbability,
        lo_chance: lowerOrSameProbability
    };
}

const handleUpdatewallet = (async (data, emitter, session) => {
    let prev_bal = 0;
    let bet_amount = parseFloat(data.bet_amount)
    if (data.token === "ETH") {
        let sjj = await ETHWallet.find({ user_id: data.user_id })
        prev_bal = parseFloat(sjj[0].balance)
        if (!data.cashout && prev_bal < bet_amount) {
            throw new Error("Not enough balance!");
        }
        let current_amount = prev_bal + (data.cashout ? bet_amount : -bet_amount)
        emitter("hilo-wallet", [{ ...data, balance: current_amount }])
        await ETHWallet.updateOne({ user_id: data.user_id }, { balance: current_amount }).session(session);
    } else if (data.token === "WGF") {
        let sjj = await WGFWallet.find({ user_id: data.user_id })
        prev_bal = parseFloat(sjj[0].balance)
        if (!data.cashout && prev_bal < bet_amount) {
            throw new Error("Not enough balance!");
        }
        let current_amount = prev_bal + (data.cashout ? bet_amount : -bet_amount)
        emitter("hilo-wallet", [{ ...data, balance: current_amount }])
        await WGFWallet.updateOne({ user_id: data.user_id }, { balance: current_amount }).session(session);
    }
    else if (data.token === "BTC") {
        let sjj = await BTCWallet.find({ user_id: data.user_id })
        prev_bal = parseFloat(sjj[0].balance)
        if (!data.cashout && prev_bal < bet_amount) {
            throw new Error("Not enough balance!");
        }
        let current_amount = prev_bal + (data.cashout ? bet_amount : -bet_amount)
        emitter("hilo-wallet", [{ ...data, balance: current_amount }])
        await BTCWallet.updateOne({ user_id: data.user_id }, { balance: current_amount }).session(session);
    }
    return prev_bal;
})


function calculateProfit({ bet_amount, hi_chance, lo_chance }) {
    const probability_higher = hi_chance / 100;
    const probability_lower = lo_chance / 100;

    // House edge
    const house_edge = 1 / 100;

    // Calculate no-edge multipliers
    const multiplier_higher = 1 / probability_higher;
    const multiplier_lower = 1 / probability_lower;

    // Adjust multipliers for house edge
    const edge_multiplier_higher = multiplier_higher * (1 - house_edge);
    const edge_multiplier_lower = multiplier_lower * (1 - house_edge);

    // Calculating profits
    const hi_profit = (bet_amount * edge_multiplier_higher) - bet_amount;
    const lo_profit = (bet_amount * edge_multiplier_lower) - bet_amount;

    return { hi_profit, lo_profit };
}

async function handleGameHistory(data, emitter, session) {
    const [history] = await HiloHistory.create([{
        bet_id: data.bet_id,
        bet_amount: data.bet_amount,
        token: data.token,
        token_img: data.token_img,
        user_id: data.user_id,
        payout: data.payout,
        won: data.won
    }], { session });
    if (data.won) {
        await Bills.updateOne({ bet_id: data.bet_id, user_id: data.user_id }, {
            status: data.won
        }).session(session);
    }
    emitter("hilo-game-ended", await populateUser(history.toObject()));
}

const handleHiloBet = async (data, emitter) => {
    const session = await mongoose.startSession();
    const { user_id } = data;
    try {
        session.startTransaction();
        let game = HiloGame.findOne({ has_ended: false, user_id }).sort({ '_id': -1 }).lean().session(session);
        if (game?.bet_id) throw new Error("Conclude Previous game first");
        let seeds = await HiloEncrypt.findOne({ is_open: false }).sort({ '_id': -1 }).session(session);
        if (!seeds) {
            const serverSeed = crypto.randomBytes(32).toString('hex');
            const hash_seed = crypto.createHash('sha256').update(serverSeed).digest('hex');
            const n_serverSeed = crypto.randomBytes(32).toString('hex');
            const n_hash_seed = crypto.createHash('sha256').update(n_serverSeed).digest('hex');
            [seeds] = await HiloEncrypt.create([{
                server_seed: serverSeed,
                hash_seed,
                user_id: data.user_id,
                client_seed: generateRandomString(10),
                next_hash_seed: n_hash_seed,
                next_server_seed: n_serverSeed,
            }], { session })
        }

        const card = pickRandomCard(seeds.client_seed, seeds.server_seed, seeds.nonce, 0);
        const { hi_chance, lo_chance } = calculateProbabilities(card.rankValue);
        ([game] = await HiloGame.create([{
            user_id,
            seed_id: seeds.seed_id,
            bet_amount: data.bet_amount,
            token: data.token,
            token_img: data.token_img,
            hi_chance,
            lo_chance,
            payout: 0.99,
            round: 0,
            rounds: [{
                cardSuite: card.suite,
                cardNumber: card.number,
                cardRankNumber: card.rankValue,
                cardRank: card.rank,
            }],
            nonce: seeds.nonce + 1
        }], { session }));
        const current_amount = await handleUpdatewallet(data, emitter, session);
        // if (data.token !== "WGF") {
        //     handleWagerIncrease(data)
        // }
        await HiloEncrypt.updateOne({ seed_id: seeds.seed_id }, { $inc: { nonce: 1 } }).session(session);
        await Bills.create([{
            user_id,
            transaction_type: "Hilo",
            token_img: data.token_img,
            token_name: data.token,
            balance: current_amount,
            trx_amount: data.bet_amount,
            datetime: game.time,
            status: false,
            bill_id: game.bet_id
        }], { session })
        await session.commitTransaction();
        emitter("hilo-game", { ...game.toObject(), rounds: normalizeRounds(game.rounds) })
    } catch (e) {
        await session.abortTransaction();
        emitter("hilo-game", { error: e.message, user_id });
    } finally {
        await session.endSession();
    }

}

const handleHiloCashout = async (data, emitter) => {
    const { user_id } = data;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const game = await HiloGame.findOne({ has_ended: false, user_id }).sort({ '_id': -1 }).session(session);
        if (!game) throw new Error("Game not found!")

        if (!game.profit) throw new Error("Nothing to cashout!");

        await handleUpdatewallet({ ...data, bet_amount: game.bet_amount + game.profit, cashout: true }, emitter, session);
        await HiloGame.updateOne({ bet_id: game.bet_id }, {
            has_ended: true, won: true, time: new Date(),
        }).session(session);
        await handleGameHistory({ ...data, won: true, payout: 1 + game.profit / game.bet_amount, bet_id: game.bet_id }, emitter, session);
        await session.commitTransaction();
        emitter("hilo-game", { ...game.toObject(), has_ended: true, won: true, rounds: normalizeRounds(game.rounds) })
    } catch (e) {
        console.log("cashout error => ", e)
        await session.abortTransaction();
        emitter("hilo-game", { error: e.message, user_id })
    } finally {
        await session.endSession();
    }
}

async function populateUser(data) {
    const user = await Profile.findOne({ user_id: data.user_id });
    data.user = { user_id: user.user_id, hidden: user.hidden_from_public, username: user.hidden_from_public ? "" : user.username, image: user.hidden_from_public ? "" : user.profile_image };
    return data;
}

const initHiloGame = async (data, emitter) => {
    const { user_id } = data;
    try {
        const game = await HiloGame.findOne({ has_ended: false, user_id }).sort({ '_id': -1 });
        if (!game?.bet_id) {
            let seeds = await HiloEncrypt.findOne({ is_open: false }).sort({ '_id': -1 });
            if (!seeds) {
                const serverSeed = crypto.randomBytes(32).toString('hex');
                const hash_seed = crypto.createHash('sha256').update(serverSeed).digest('hex');
                const n_serverSeed = crypto.randomBytes(32).toString('hex');
                const n_hash_seed = crypto.createHash('sha256').update(n_serverSeed).digest('hex');
                [seeds] = await HiloEncrypt.create([{
                    server_seed: serverSeed,
                    hash_seed,
                    user_id: data.user_id,
                    client_seed: generateRandomString(10),
                    next_hash_seed: n_hash_seed,
                    next_server_seed: n_serverSeed,
                }])
            }
        }
        const [allRecentBets, userBets] = await Promise.all([HiloHistory.find().sort({ '_id': -1 }).limit(15).lean().then(bets => Promise.all(bets.map(async bet => {
            if (!bet.time) {
                const _g = await HiloGame.findOne({ bet_id: bet.bet_id }).sort({ '_id': -1 })
                bet.time = _g.time;
            }
            return populateUser(bet);
        }))), HiloHistory.find({ user_id }).sort({ '_id': -1 }).limit(15).lean().then(bets => Promise.all(bets.map(async bet => {
            if (!bet.time) {
                const _g = await HiloGame.findOne({ bet_id: bet.bet_id }).sort({ '_id': -1 })
                bet.time = _g.time;
            }
            return populateUser(bet);
        })))]);
        emitter("hilo-game", { ...(game?.toObject() || { new_game: true, user_id }), rounds: normalizeRounds(game?.rounds || []) });
        emitter("hilo-history", { allRecentBets, userBets, user_id })
    } catch (e) {
        console.log("Init Error > ", e)
        emitter("hilo-game", { error: e.message, user_id })
    }
}


function normalizeRounds(rounds) {
    return rounds.map((_round, index) => {
        const lastCard = index ? rounds[index - 1] : {};
        return {
            round: index,
            odds: _round.payout,
            card: _round.cardNumber,
            guess: _round.skipped ? 1 : (_round.hi ? (lastCard.cardRank === "A" ? 3 : (lastCard.cardRank === "K" ? 4 : 5)) : (_round.lo ? (lastCard.cardRank === "A" ? 4 : (lastCard.cardRank === "K" ? 2 : 6)) : 0))
        }
    })
}

const handleHiloNextRound = async (data, emitter) => {
    const { user_id, hi, lo, skip } = data;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const game = await HiloGame.findOne({ has_ended: false, user_id }).sort({ '_id': -1 }).session(session);
        if (!game) throw new Error("Game not found!")

        if (skip && game.round >= 52) throw new Error("Cant no longer use skip!")

        const seeds = await HiloEncrypt.findOne({ is_open: false, seed_id: game.seed_id }).sort({ '_id': -1 }).session(session);

        const currentCard = game.rounds[game.rounds.length - 1];
        const nextCard = pickRandomCard(seeds.client_seed, seeds.server_seed, seeds.nonce, game.round + 1);
        let updates = { profit: game.profit, payout: game.payout };
        if ((hi && (currentCard.cardRank === ranks[0] ? nextCard.rankValue > currentCard.cardRankNumber : nextCard.rankValue >= currentCard.cardRankNumber)) || (lo && (currentCard.cardRank === ranks[ranks.length - 1] ? nextCard.rankValue < currentCard.cardRankNumber : nextCard.rankValue <= currentCard.cardRankNumber)) || skip) {
            const { bet_amount, profit, hi_chance: h_c, lo_chance: l_c } = game;
            const { hi_profit, lo_profit } = skip ? {} : calculateProfit({ bet_amount: bet_amount + profit, hi_chance: h_c, lo_chance: l_c });
            const { hi_chance, lo_chance } = calculateProbabilities(nextCard.rankValue);
            updates = { hi_chance, lo_chance, profit: skip ? game.profit : Math.min(5000.0000, ((hi ? hi_profit : lo_profit) + game.profit)), payout: skip ? game.payout : (1 + (game.profit + (hi ? hi_profit : lo_profit)) / game.bet_amount) }
        } else {
            updates = { has_ended: true, won: false, profit: 0, payout: 0 }
            await handleGameHistory({ ...data, won: false, payout: 0 }, emitter, session);
        }

        const newRounds = [...game.rounds, {
            cardSuite: nextCard.suite,
            cardNumber: nextCard.number,
            cardRankNumber: nextCard.rankValue,
            hi_chance: game.hi_chance,
            lo_chance: game.lo_chance,
            cardRank: nextCard.rank,
            payout: updates.payout,
            hi, lo,
            skipped: skip,
        }]
        await HiloGame.updateOne({ bet_id: game.bet_id }, {
            ...updates,
            ...{ $inc: { round: 1 } },
            rounds: newRounds
        }).session(session);
        await session.commitTransaction();
        emitter("hilo-game", { ...game.toObject(), ...updates, round: game.round + 1, rounds: normalizeRounds(newRounds), hi, lo })
    } catch (e) {
        console.log("next round error => ", e)
        await session.abortTransaction();
        emitter("hilo-game", { error: e.message, user_id })
    } finally {
        await session.endSession();
    }
}

const recentBets = async (req, res) => {
    try {
        const bets = await HiloHistory.find().sort({ '_id': -1 }).limit(15).lean();
        return res.status(200).json({
            bets: await Promise.all(bets.map(populateUser))
        })
    } catch (e) {
        res.status(500).json({ status: false, message: e.message })
    }
}

const gameDetail = async (req, res) => {
    const { betID: bet_id } = req.params;
    try {
        const game = await HiloGame.findOne({ bet_id }).lean();
        if (!game) throw new Error("Game not found!");

        const seeds = await HiloEncrypt.findOne({ seed_id: game.seed_id });
        await populateUser(game);

        return res.status(200).json({
            betLog: {
                bet_id: game.bet_id,
                time: game.time,
                round: game.round,
                token_img: game.token_img,
                profit: game.profit,
                payout: game.payout,
                won: game.won,
                bet_amount: game.bet_amount,
                rounds: normalizeRounds(game.rounds),
                user: game.user,
                nonce: game.nonce || seeds.nonce
            },
            seedHistory: {
                serverSeed: seeds.is_open ? seeds.server_seed : "",
                clientSeed: seeds.client_seed,
                serverSeedHash: seeds.hash_seed,
                nxt_hash: seeds.next_hash_seed,
                maxNonce: seeds.nonce
            }
        });

    } catch (e) {
        res.status(500).json({ status: false, message: e.message })
    }
}
const gameSeeds = async (req, res) => {
    try {
        const seeds = await HiloEncrypt.findOne({ is_open: false }).sort({ '_id': -1 });
        return res.status(200).json({
            seedHistory: {
                serverSeed: seeds.is_open ? seeds.server_seed : "",
                clientSeed: seeds.client_seed,
                serverSeedHash: seeds.hash_seed,
                nxt_hash: seeds.next_hash_seed,
                maxNonce: seeds.nonce
            }
        });

    } catch (e) {
        res.status(500).json({ status: false, message: e.message })
    }
}
const userBets = async (req, res) => {
    const { user_id } = req.id;
    try {
        const bets = await HiloHistory.find({ user_id }).sort({ '_id': -1 }).limit(15).lean();
        return res.status(200).json({
            bets: await Promise.all(bets.map(populateUser))
        })
    } catch (e) {
        res.status(500).json({ status: false, message: e.message })
    }
}


const updateSeeds = async (req, res) => {
    const { user_id } = req.id;
    const { client_seed } = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const game = await HiloGame.findOne({ has_ended: false, user_id }).sort({ '_id': -1 }).session(session);
        if (game) throw new Error("Conclude current game first!");

        const seeds = await HiloEncrypt.findOne({ is_open: false }).sort({ '_id': -1 }).session(session);
        if (!seeds) throw new Error("Seeds not found. Play at least one game!");

        if (!client_seed) throw new Error("Client Seed not found!");

        const { next_server_seed: server_seed, next_hash_seed: hash_seed } = seeds;

        await HiloEncrypt.updateOne({ seed_id: seeds.seed_id }, {
            is_open: true,
        }).session(session);
        const n_serverSeed = crypto.randomBytes(32).toString('hex');
        const n_hash_seed = crypto.createHash('sha256').update(n_serverSeed).digest('hex');
        await HiloEncrypt.create([{
            server_seed,
            hash_seed,
            user_id,
            client_seed,
            next_hash_seed: n_hash_seed,
            next_server_seed: n_serverSeed,
        }], { session })
        await session.commitTransaction();
        await session.endSession();
        return res.status(200).json({
            seeds: {
                serverSeed: seeds.server_seed,
                clientSeed: seeds.client_seed,
                serverSeedHash: seeds.hash_seed,
                maxNonce: seeds.nonce
            }
        })
    } catch (e) {
        await session.abortTransaction();
        await session.endSession();
        res.status(500).json({ status: false, message: e.message })
    }
}

module.exports = {
    initHiloGame, handleHiloBet, handleHiloCashout, handleHiloNextRound, updateSeeds, userBets, recentBets, gameDetail, gameSeeds
}