const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
// const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const Plinko = require("../model/plinko_game")
const BTC_wallet = require("../model/btc-wallet")
const ETH_wallet = require("../model/ETH-wallet")
const WGFWallet = require("../model/WGF-wallet")
const PlinkoEncription = require("../model/plinko_encryption")
//Plink Bucket List and Corresponding Win value
const rowAndRisk = {
    row8low: [{ name: 'Win', val1: 0, val2: 8, prize: 5.6 }, { name: 'Win', val1: 1, val2: 7, prize: 2.1 }, { name: 'Win', val1: 2, val2: 6, prize: 1.1 }, { name: 'No Win', val1: 3, val2: 5, prize: 1.0 }, { name: 'Loss', val1: 4, val2: 4, prize: 0.5 }],
    row9low: [{ name: 'Win', val1: 0, val2: 9, prize: 5.6 }, { name: 'Win', val1: 1, val2: 8, prize: 2.0 }, { name: 'Win', val1: 2, val2: 7, prize: 1.6 }, { name: 'No Win', val1: 3, val2: 6, prize: 1.0 }, { name: 'Loss', val1: 5, val2: 5, prize: 0.7 }],
    row10low: [{ name: 'Win', val1: 0, val2: 10, prize: 8.9 }, { name: 'Win', val1: 1, val2: 9, prize: 3.0 }, { name: 'Win', val1: 2, val2: 8, prize: 1.4 }, { name: 'Win', val1: 3, val2: 7, prize: 1.1 }, { name: 'No Win', val1: 4, val2: 6, prize: 1.0 }, { name: 'No Win', val1: 0, val2: 8, prize: 0.5 }]

    //Other row and risk array will be added once verified to continue
}
//Get PNL based on Numbe of Row and the Risk Parameter
const PNL = (rows, score) => {
    try {
        const selectedArray = rowAndRisk[rows];

        if (!selectedArray) {
            console.log(`Array '${rows}' not found.`);
            return;
        }
        for (let i = 0; i < selectedArray.length; i++) {
            const object = selectedArray[i];
            //Return the prize won
            if (object.val1 === score || object.val2 === score) {
                return object.prize;
            }
        }
        return null;
    } catch (err) {
        console.log(err.message)
    }
}

const generatePinkoScore = (rows) => {
    // Number of rows in the Plinko board
    // const rows = rows;
    // For simplicity, am using random score based on the number of rows
    // Randomly choose a row
    const score = Math.floor(Math.random() * rows) + 1;
    return score;
}
const updateUserWallet = (async (data) => {
    if (data.bet_token_name === "WGF") {
        await WGFWallet.updateOne({ user_id: data.user_id }, { balance: data.current_amount });
    }
    if (data.bet_token_name === "BTC") {
        await BTC_wallet.updateOne({ user_id: data.user_id }, { balance: data.current_amount });
    }
    if (data.bet_token_name === "ETH") {
        await ETH_wallet.updateOne({ user_id: data.user_id }, { balance: data.current_amount });
    }
})

const CreateBetGame = (async (data) => {
    try {
        await Plinko.create(data)

    } catch (err) {
        console.error(err);
    }
})

const InitializePlinkoGame = async (rows, user_id) => {
    const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';

    const handleHashGeneration = (() => {
        const serverSeed = crypto.randomBytes(32).toString('hex');
        const clientSeed = generateString(23);
        const combinedSeed = serverSeed + salt + clientSeed;
        const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
        let encrypt = { hash, clientSeed, serverSeed }
        return encrypt
    })
    const { serverSeed: server_seed, hash: hash_seed, clientSeed: client_seed } = handleHashGeneration();
    let data = {
        user_id: user_id,
        nonce: 0,
        server_seed,
        hash_seed,
        client_seed,
        is_open: false,
        updated_at: currentTime
    }
    await PlinkoEncription.create(data)
}

let hidden = false
const handlePlinkoBet = (async (req, res) => {
    try {
        const { user_id } = req.id
        const { data } = req.body
        let game_type = "Plinko"
        // if (data.bet_token_name !== "WGF") {
        //     handleWagerIncrease(user_id, data.bet_amount, data.bet_token_img)
        // }
        let current_amount;
        if (data.bet_token_name === "WGF") {
            let wallet = await WGFWallet.find({ user_id })
            current_amount = parseFloat(wallet[0].balance) - parseFloat(data.bet_amount)
        }

        if (data.bet_token_name === "BTC") {
            let wallet = await BTC_wallet.find({ user_id })
            current_amount = parseFloat(wallet[0].balance) - parseFloat(data.bet_amount)
        }
        if (data.bet_token_name === "ETH") {
            let wallet = await ETH_wallet.find({ user_id })
            current_amount = parseFloat(wallet[0].balance) - parseFloat(data.bet_amount)
        }
        //Get Score and PNL
        const score = generatePinkoScore(data.rows)
        const pnl = PNL(`row${data.rows}${data.risk}`, score)

        let bet = {
            user_id: user_id,
            username: data.username,
            profile_img: data.user_img,
            bet_amount: data.bet_amount,
            token: data.bet_token_name,
            token_img: data.bet_token_img,
            bet_id: Math.floor(Math.random() * 10000000) + 72000000,
            game_id: data.game_id,
            risk: data.risk,
            pnl: pnl,
            server_seed: data.server_seed,
            client_seed: data.client_seed,
            cashout: 0,
            auto_cashout: data.auto_cashout,
            profit: 0,
            game_hash: "-",
            hidden_from_public: hidden,
            game_type: game_type,
            user_status: true,
            game_status: true,
            time: data.time,
            payout: pnl,
            has_won: true,
            chance: data.chance
        }
        CreateBetGame(bet)
        current_amount = current_amount + (bet.amount * pnl)
        updateUserWallet({ ...data, user_id, current_amount })
        res.status(200).json({ ...bet, current_amount })
    } catch (err) {
        res.status(501).json({ message: err.message });
    }
})
const HandlePlayPlinko = ((req, res) => {
    const { user_id } = req.id
    let { data } = req.body
    function generateRandomNumber(serverSeed, clientSeed, hash, nonce) {
        const combinedSeed = `${serverSeed}-${clientSeed}-${hash}-${nonce}-${salt}`;
        const hmac = crypto.createHmac('sha256', combinedSeed);
        const hmacHex = hmac.digest('hex');
        const decimalValue = (parseInt(hmacHex, 32) % 10001 / 100)
        const randomValue = (decimalValue % maxRange).toFixed(2);
        let row = { point: randomValue, server_seed: serverSeed, client_seed: clientSeed, hash, nonce }
        return row;
    }
    // handleDiceBet(user_id,data, generateRandomNumber(data.server_seed,data.client_seed, data.hash_seed,data.nonce ))
    res.status(200).json(generateRandomNumber(data.server_seed, data.client_seed, data.hash_seed, data.nonce))
})

const getGameHistory = (async (req, res) => {
    const { user_id } = req.id
    try {
        let plinkoGameHistory = await Plinko.find({ user_id });
        res.status(200).json(plinkoGameHistory);
    } catch (err) {
        res.status(501).json({ message: err.message });
    }
})

const handlePlinkoGameEncryption = (async (req, res) => {
    const { user_id } = req.id
    try {
        let result = await PlinkoEncription.find({ user_id })
        res.status(200).json(result)
    }
    catch (err) {
        console.log(err)
    }
})

const seedSettings = async (req, res) => {
    const { user_id } = req.id
    let { data } = req.body
    const handleHashGeneration = (() => {
      const serverSeed = crypto.randomBytes(32).toString('hex');
      const clientSeed = data;
      const combinedSeed = serverSeed + salt + clientSeed;
      const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
      return hash
    })
    try {
      let client_seed = data
      let server_seed = handleHashGeneration()
      nonce = 0
      await PlinkoEncription.updateOne({ user_id }, {
        server_seed: server_seed,
        client_seed: client_seed,
        updated_at: new Date()
      })
      console.log(client_seed)
      res.status(200).json("Updated sucessfully")
    }
    catch (err) {
      res.status(501).json({ message: err });
    }
  }



module.exports = { handlePlinkoBet, HandlePlayPlinko, getGameHistory, InitializePlinkoGame, handlePlinkoGameEncryption, seedSettings }
