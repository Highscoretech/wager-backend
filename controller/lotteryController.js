const crypto = require("crypto");
const moment = require("moment");
// const { handleWagerIncrease } = require("../profile_mangement/index");
const WGFWallet = require("../model/WGF-wallet");
const BTCWallet = require("../model/btc-wallet");
const Lottery = require('../model/lottery_game');
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/80ac7c0645804a909267c778b9b82126'));
const Profile = require('../model/Profile');
const LotterySeeds = require('../model/lottery_encryped_seeds');
const LotteryTicket = require('../model/lottery_ticktet');
const mongoose = require("mongoose");
const { generateRandomString } = require("../utils/generators");

const buyTickets = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user_id } = req.id
    const { random, numbers, jackpot, amount } = req.body;
    if (!random && (numbers.length < 5 || !jackpot)) {
      await session.endSession();
      return res.status(403).json({
        error: true,
        message: "Select valid numbers",
      });
    }

    const price = amount * 0.1;
    // Check wallet balance
    const wallet = await WGFWallet.findOne({ user_id }).session(session);
    if (wallet.balance < price) {
      await session.endSession();
      return res.status(403).json({
        error: true,
        message: "Not enough WGF"
      });
    }


    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);
    if (!lottery) {
      await session.endSession();
      return res.status(400).json({
        error: true,
        message: "Game not available",
      });
    }
    // Check if game has started
    if (moment.utc().isBefore(moment(lottery.start_date))) {
      await session.endSession();
      return res.status(403).json({ error: true, message: "Game has'nt started yet!" });
    }
    // Check if current time is past deadline
    if (moment.utc().isAfter(moment(lottery.draw_date).subtract(5, "minutes"))) {
      await session.endSession();
      return res.status(403).json({
        error: true,
        message: "Cannot purchase ticket. Past deadline",
      });
    }

    const prevBal = parseFloat(wallet.balance);
    await WGFWallet.updateOne({ _id: wallet._id }, { balance: prevBal - price }).session(session);
    // await handleWagerIncrease({user_id, bet_amount: price, token: 'PPL'});
    const [ticket] = await LotteryTicket.create([{
      user_id,
      game_id: lottery.game_id,
      amount,
      numbers: random ? drawNumbers() : [...numbers, jackpot]
    }], { session });

    await Lottery.updateOne({ game_id: lottery.game_id }, { total_tickets: lottery.total_tickets + amount }).session(session);

    await session.commitTransaction();
    await session.endSession();

    res.status(200).json({ ticket_id: ticket.ticket_id, user_id: ticket.user_id, game_id: ticket.game_id, amount: ticket.amount, numbers: ticket.numbers });

  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.error("Error purchasing tickets:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};


const getLotteryHistory = async (req, res) => {
  try {
    const games = await Lottery.find({ drawn: true }).sort({ '_id': -1 });
    res.status(200).json({
      games: games.map(g => ({
        game_id: g.game_id,
        total_tickets: g.total_tickets,
        start_date: g.start_date,
        numbers: g.drawn ? g.numbers : [],
        draw_date: g.draw_date
      }))
    })
  } catch (error) {
    res.status(500).json(error);
  }
}

const getLotteryDetails = async (req, res) => {
  const { id } = req.query;
  let lottery;
  try {
    if (!id) {
      lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 });
    } else {
      lottery = await Lottery.findOne({ game_id: id });
    }
    if (!lottery) {
      return res.status(400).json({
        error: true,
        message: "Game not found",
      });
    }

    res.status(200).json({
      lottery: {
        game_id: lottery.game_id,
        total_tickets: lottery.total_tickets,
        start_date: lottery.start_date,
        numbers: lottery.drawn ? lottery.numbers : [],
        draw_date: lottery.draw_date
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

const getUserGameLotteryTickets = async (req, res) => {
  const { user_id } = req.id
  const { id } = req.query;
  try {
    let lottery;
    if (!id) {
      lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 });
    } else {
      lottery = await Lottery.findOne({ game_id: id });
    }
    if (!lottery) {
      return res.status(400).json({
        error: true,
        message: "Game not found",
      });
    }
    const tickets = await LotteryTicket.find({ user_id, game_id: lottery.game_id });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json(error);
  }
}

const getGameSeeds = async (req, res) => {
  const { id } = req.query;

  try {
    let lottery;
    if (!id) {
      lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 });
    } else {
      lottery = await Lottery.findOne({ game_id: id });
    }

    if (!lottery) {
      return res.status(400).json({
        error: true,
        message: "Game not found",
      });
    }
    const seeds = await LotterySeeds.findOne({ game_id: lottery.game_id });
    if (!seeds) {
      return res.status(400).json({
        error: true,
        message: "Seeds not found",
      });
    }
    let update = {};
    if (!lottery.drawn) update = { server_seed_hash: seeds.server_seed_hash }
    else update = { server_seed_hash: seeds.server_seed_hash, server_seed: seeds.server_seed, client_seed_hash: seeds.client_seed_hash, client_start_block: seeds.client_start_block.toString(), client_seed: seeds.client_seed.toString() }
    res.status(200).json({ seeds: update });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json(error);
  }
}

const getGameLotteryTickets = async (req, res) => {
  let { id, limit, purchased } = req.query;
  limit = limit || 100
  try {
    let lottery;
    if (!id) {
      lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 });
    } else {
      lottery = await Lottery.findOne({ game_id: id });
    }

    if (!lottery) {
      return res.status(400).json({
        error: true,
        message: "Game not found",
      });
    }
    const tickets = await LotteryTicket.find({ game_id: lottery.game_id, ...(purchased ? { bonus: false } : {}) }).sort({ '_id': -1 }).limit(limit);
    const userPopulatedTickets = await Promise.all(tickets.map(async (ticket) => {
      const user = await Profile.findOne({ user_id: ticket.user_id });
      ticket.user = { user_id: user.user_id, hidden: user.hidden_from_public, username: user.hidden_from_public ? "" : user.username, image: user.profile_image };
      return {
        bonus: ticket.bonus,
        jackpotNumber: Lottery.numbers?.[5] || 0,
        matches: lottery.numbers?.slice(0, 5)?.filter(i => ticket.numbers.includes(i)) || [],
        ticket_id: ticket.ticket_id, matched: ticket.matched, prize: ticket.prize, user_id: ticket.user_id, game_id: ticket.game_id, amount: ticket.amount, numbers: ticket.numbers, user: ticket.user
      };
    }));
    res.status(200).json({ tickets: userPopulatedTickets });
  } catch (error) {
    res.status(500).json(error);
  }
}

const getWinningTickets = async (req, res) => {
  const { user_id } = req.id
  try {
    const tickets = await LotteryTicket.find({ user_id, prize: { $gt: 0 } });
    const gamePopulatedTickets = await Promise.all(tickets.map(async (ticket) => {
      const game = await Lottery.findOne({ game_id: ticket.game_id });
      return {
        bonus: ticket.bonus,
        jackpotNumber: game.numbers?.[5] || 0,
        matches: game.numbers?.slice(0, 5)?.filter(i => ticket.numbers.includes(i)) || [],
        ticket_id: ticket.ticket_id, matched: ticket.matched, prize: ticket.prize, user_id: ticket.user_id, game_id: ticket.game_id, amount: ticket.amount, numbers: ticket.numbers
      };;
    }))
    res.status(200).json({ tickets: gamePopulatedTickets });
  } catch (error) {
    res.status(500).json(error);
  }
}
async function initializeLottery() {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let latestLottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);
    if (!latestLottery) {
      console.log("Creating Lottery Game ::");
      ([latestLottery] = await Lottery.create([{
        numbers: [],
        drawn: false
      }], { session }));

      // console.log("Lottery => ", latestLottery);
      if (latestLottery.game_id > 1) {
        //Find Bonus tickets from previous game
        const lastGameId = latestLottery.game_id - 1;

        const lastGame = await Lottery.findOne({ game_id: lastGameId }).session(session);
        if (!!lastGame) {
          const previousGameTickets = await LotteryTicket.find({ game_id: lastGameId }).sort({ '_id': -1 }).session(session);
          const previousGameBonusTickets = previousGameTickets.filter(ticket => ticket.matched <= 2);

          const ticketsCreation = [];
          for (const ticket of previousGameBonusTickets) {
            ticketsCreation.push(LotteryTicket.create([{
              user_id: ticket.user_id,
              game_id: latestLottery.game_id,
              amount: ticket.amount,
              numbers: ticket.numbers,
              bonus: true,
            }], { session }))
          }

          await Promise.all(ticketsCreation);
        }
      }

      const serverSeed = generateRandomString(64);
      const [seeds] = await LotterySeeds.create([{
        game_id: latestLottery.game_id,
        // client_start_block: await web3.eth.getBlockNumber(),
        server_seed: serverSeed,
        server_seed_hash: crypto.createHash('sha256').update(serverSeed).digest('hex')
      }], { session });

      await session.commitTransaction();
    } else if (moment(latestLottery.draw_date).add(5, 'mins').isBefore(moment.utc())) {
      console.log("Fixing unconcluded game")
      try {
        const seeds = await LotterySeeds.findOne({ game_id: latestLottery.game_id });
        if (!seeds.client_start_block) {
          await LotterySeeds.updateOne({ game_id: latestLottery.game_id }, {
            client_start_block: (await web3.eth.getBlockNumber()).toString()
          })
        }
        await runLotteryDraw();
      } catch (error) {
        console.log("Failed to conclude game:> ", error.message);
      }
    }
    // console.log("Game seeds :::> ", seeds);
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
}


function drawNumbers() {
  const balls = Array(36)
    .fill(null)
    .map((_, i) => i + 1);
  const regularBalls = Array.from({ length: 5 }, () => {
    const randomIndex = Math.floor(Math.random() * balls.length);
    return balls.splice(randomIndex, 1)[0];
  });
  const jackpotNum = Math.max(1, Math.min(10, Math.round(Math.random() * 10) + 1));
  return [...regularBalls, jackpotNum];
}

function calculatePrize(ticketNumbers, drawnNumbers) {
  const matchCount = ticketNumbers.filter(num => drawnNumbers.includes(num)).length;

  switch (matchCount) {
    case 6:
      return { matched: matchCount, prize: 100000 };
    case 5:
      return { matched: matchCount, prize: 3000 };
    case 4:
      return { matched: matchCount, prize: 20 };
    case 3:
      return { matched: matchCount, prize: 1 };
    default:
      return { matched: matchCount, prize: 0 };
  }
}


function drawLottery(clientSeed, serverSeed) {
  const hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');
  function getRandomByHash(_hash) {
    return _hash.match(/.{2}/g)
      .map(it => parseInt(it, 16))
      .reduce((res, it, i) => res + it / (256 ** (i + 1)), 0);
  }
  const remainingBalls = Array(36).fill(null).map((v, i) => i + 1);
  const regularBalls = [];
  for (let i = 0; i < 5; i++) {
    const random = getRandomByHash(hash.substr(i * 8, 8));
    const ballIndex = Math.floor(random * remainingBalls.length);
    regularBalls.push(remainingBalls.splice(ballIndex, 1)[0]);
  }
  const jackpotBall = Math.floor(getRandomByHash(hash.substr(5 * 8, 8)) * 10) + 1;
  return { regularBalls, jackpotBall };
}


async function runLotteryDraw() {
  console.log("Running Lotto Draw")
  const session = await mongoose.startSession();
  session.startTransaction();
  let errors;
  try {
    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);

    if (!lottery) {
      throw new Error("This should never happen!")
    }

    const seeds = await LotterySeeds.findOne({ game_id: lottery.game_id }).session(session);

    if (!seeds) {
      throw new Error("This should never happen!")
    }
    // console.log("Seeds => ", seeds);
    if (!seeds.client_start_block) {
      throw new Error("NO Start Block, This should never happen!");
    }

    const clientSeedBlock = BigInt(seeds.client_start_block) + BigInt(10);
    const clientSeedHash = (await web3.eth.getBlock(clientSeedBlock))?.hash || crypto.createHash('sha256').update(clientSeedBlock).digest('hex');

    // console.log("clientSeedHash => ", clientSeedHash, clientSeedBlock);

    const { regularBalls, jackpotBall } = drawLottery(clientSeedHash, seeds.server_seed);
    const winningNumbers = [...regularBalls, jackpotBall];

    await LotterySeeds.updateOne({ game_id: lottery.game_id }, { client_seed: clientSeedBlock.toString(), client_seed_hash: clientSeedHash }).session(session);

    const tickets = await LotteryTicket.find({ game_id: lottery.game_id }).session(session);

    await Lottery.updateOne({ game_id: lottery.game_id }, { drawn: true, numbers: winningNumbers }).session(session);

    await Promise.all(tickets.map(async ticket => {
      const { prize, matched } = calculatePrize(ticket.numbers, winningNumbers);
      const promises = [];
      if (prize > 0) {
        const wallet = ETHWallet.findOne({ user_id: ticket.user_id }).session(session);
        const prevBal = parseFloat(wallet.balance);
        promises.push([ETHWallet.updateOne({ user_id: ticket.user_id }, {
          balance: prevBal + parseFloat((prize * (ticket.amount * 0.1)) / 0.1)
        }).session(session)])
      }
      promises.push(LotteryTicket.updateOne({ _id: ticket._id }, { prize, matched }).session(session))
      return Promise.all(promises);
    }));

    await session.commitTransaction();
    await initializeLottery();
  } catch (error) {
    await session.abortTransaction();
    console.log("Error running lotto", error)
    errors = error;
  } finally {
    await session.endSession();
    if (errors) throw errors; // Throws the so task runner retries it
  }
}

async function setDeadlineBlock() {
  console.log("Setting ETH start block")
  const session = await mongoose.startSession();
  session.startTransaction();
  let errors;
  try {
    const lottery = await Lottery.findOne({ drawn: false }).sort({ '_id': -1 }).session(session);

    if (!lottery) {
      throw new Error("This should never happen!")
    }
    const seeds = await LotterySeeds.findOne({ game_id: lottery.game_id }).session(session);

    if (!seeds) {
      throw new Error("This should never happen!")
    }
    if (seeds.client_start_block) {
      return await session.endSession();
    }
    // latest ETH block
    const latestBlock = await web3.eth.getBlockNumber();
    await LotterySeeds.updateOne({ game_id: lottery.game_id }, { client_start_block: latestBlock.toString() }).session(session);
    console.log('Seeds updated :::> ', latestBlock);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    errors = error;
    console.log("Error setting ETH blocks", error)
  } finally {
    await session.endSession();
    if (errors) throw errors;
  }
}

const resetGame = async (req, res) => {
  try{
    await Lottery.deleteMany({});
    await LotteryTicket.deleteMany({});
    await LotterySeeds.deleteMany({});
    return res.status(200).json("Done!")
  } catch(e) {
    return res.status(500).json(e.message)
  }
}

//TODO: remove code
const topUp = async (req, res) => {
  const {user_id } = req.body;
  try {
    if (!user_id ) {
      return res.status(400).json({
        error: true,
        message: "No user ID"
      });
    }

    await Promise.all([
      ETHWallet.updateOne({user_id }, {balance: 1_000 }),
      BTCWallet.updateOne({user_id }, {balance: 1_000 }),
    ])
    res.status(200).json("You are now rich!");
  } catch(e) {
    return res.status(500).json(e.message)
  }
}


module.exports = {
  buyTickets,
  initializeLottery,
  runLotteryDraw,
  getWinningTickets,
  getGameLotteryTickets,
  getUserGameLotteryTickets,
  getLotteryDetails,
  getLotteryHistory,
  getGameSeeds,
  setDeadlineBlock,
  resetGame,
  topUp
};
