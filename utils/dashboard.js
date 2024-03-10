const CrashGame = require('../model/crashgame');
const DiceGame = require('../model/dice_game');
const MinesGame = require('../model/minesgameInit');

const WGDWallet = require('../model/WGD-wallet');
const BTC_wallet = require('../model/btc-wallet');
const ETH_wallet = require('../model/ETH-wallet');

const LotteryTicket = require('../model/lottery_ticktet');
const WithdrawalHistory = require('../model/transactionHistoryModels/WithdrawalHistory');
const CashBack = require('../model/cash_back');

//remove duplicate player from the list of successful deposit to avoid repition
const removeDuplicatePlayer = (data) => {
    const uniqueID = []
    data.forEach(value => {
        if (!uniqueID.includes(value.user_id)) {
            uniqueID.push(value.user_id)
        }
    })
    return uniqueID.length
}

//Show total gross gaming revenue (win/lose)
const getGGR = async (user_id) => {

    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;


    let crashGameTotalStakeLoss = 0;
    let diceGameTotalStakeLoss = 0;
    let minesGameTotalStakeLoss = 0;

    try {
        if (user_id) {
            // //Get the total wagered at loss
            //Get Number of Crash Game Loss Amount

            const crashGame = await CrashGame.find({ user_id: user_id, has_won: false })
            if (crashGame.length > 0) {
                crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
                    return game.bet_amount
                })
                if (crashGameTotalStake.length > 0) {
                    crashGameTotalStakeLoss = crashGameTotalStake.reduce((a, b) => a + b)
                }
            }


            //Get Number of Dice Game Loss Amount
            const diceGame = await DiceGame.find({ user_id: user_id, has_won: false })
            if (diceGame.length > 0) {
                diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
                    return game.bet_amount
                })
                if (diceGameTotalStake.length > 0) {
                    diceGameTotalStakeLoss = diceGameTotalStake.reduce((a, b) => a + b)
                }

            }

            //Get Number of Mines Game Loss Amount
            const minesGame = await MinesGame.find({ user_id: user_id, has_won: false })
            if (minesGame.length > 0) {
                minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
                    return game.bet_amount
                })
                if (minesGameTotalStake.length > 0) {
                    minesGameTotalStakeLoss = minesGameTotalStake.reduce((a, b) => a + b)
                }
            }

            const sumOfLoss = crashGameTotalStakeLoss + diceGameTotalStakeLoss + minesGameTotalStakeLoss

            return ggr = sumOfLoss.toFixed(2)
        } else {
            //Get Number of Crash Game Loss Amount
            const crashGame = await CrashGame.find({ has_won: false })
            if (crashGame.length > 0) {
                crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
                    return game.bet_amount
                })
                if (crashGameTotalStake.length > 0) {
                    crashGameTotalStakeLoss = crashGameTotalStake.reduce((a, b) => a + b)
                }
                
            }

            //Get Number of Dice Game Loss Amount
            const diceGame = await DiceGame.find({ has_won: false })
            if (diceGame.length > 0) {
                diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
                    return game.bet_amount
                })
                if (diceGameTotalStake.length > 0) {
                    diceGameTotalStakeLoss = diceGameTotalStake.reduce((a, b) => a + b)
                }
                
            }
            //Get Number of Mines Game Loss Amount
            const minesGame = await MinesGame.find({ has_won: false })
            if (minesGame.length > 0) {
                minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
                    return game.bet_amount
                })
                if (minesGameTotalStake.length > 0) {
                    minesGameTotalStakeLoss = minesGameTotalStake.reduce((a, b) => a + b)
                }
            }

            const sumOfLoss = crashGameTotalStakeLoss + diceGameTotalStakeLoss + minesGameTotalStakeLoss

            return ggr = sumOfLoss.toFixed(2)
        }
    } catch (err) {
        console.log(err)
    }

}

const getTotalPlayerBalance = async () => {
    // Show total player balance for all users across all wallet
    let USDTTotalBalance = 0;
    let PPDTotalBalance = 0;
    let PPLTotalBalance = 0;

    //Get all Balance from USDT wallet
    //Get all users with available USDT balance greather than 0 
    const usersWithBalanceGreaterThanZeroUSDT = await BTC_wallet.find({ balance: { $gt: 0 } })
    if (usersWithBalanceGreaterThanZeroUSDT.length > 0) {
        const getBalanceUSDT = usersWithBalanceGreaterThanZeroUSDT.map((user) => {
            return user.balance
        })
        // console.log(getBalanceUSDT)
        USDTTotalBalance = getBalanceUSDT.reduce((a, b) => {
            return a + b
        })
    }


    //Get all Balance from PPD wallet
    //Get all users with available PPD balance greather than 0 
    const usersWithBalanceGreaterThanZeroPPD = await WGDWallet.find({ balance: { $gt: 0 } })
    if (usersWithBalanceGreaterThanZeroPPD.length > 0) {
        const getBalancePPD = usersWithBalanceGreaterThanZeroPPD.map((user) => {
            return user.balance
        })
        // console.log(getBalancePPD)
        PPDTotalBalance = getBalancePPD.reduce((a, b) => {
            return a + b
        })
    }

    //Get all Balance from PPL wallet
    //Get all users with available PPL balance greather than 0 
    const usersWithBalanceGreaterThanZeroPPL = await ETH_wallet.find({ balance: { $gt: 0 } })
    if (usersWithBalanceGreaterThanZeroPPL.length > 0) {
        const getBalancePPL = usersWithBalanceGreaterThanZeroPPL.map((user) => {
            return user.balance
        })
        // console.log(getBalancePPL)
        PPLTotalBalance = getBalancePPL.reduce((a, b) => {
            return a + b
        })
    }
    return totalPlayerBalance = (USDTTotalBalance + PPDTotalBalance + PPLTotalBalance).toFixed(2)
}

const totalGamesWon = async (today, tomorrow) => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;

    let crashGameTotalStakeWon = 0;
    let diceGameTotalStakeWon = 0;
    let minesGameTotalStakeWon = 0;

    try {
        if (today && tomorrow) {
            //Get Number of Crash Game Won Amount
            const crashGame = await CrashGame.find({
                created_at: {
                    $gte: new Date(today),
                    $lt: new Date(tomorrow)
                }, has_won: true
            })
            if (crashGame.length > 0) {
                crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
                    return game.profit
                })
                if (crashGameTotalStake.length > 0) {
                    crashGameTotalStakeWon = crashGameTotalStake.reduce((a, b) => a + b)
                }
            }

            //Get Number of Dice Game Won Amount
            const diceGame = await DiceGame.find({
                created_at: {
                    $gte: new Date(today),
                    $lt: new Date(tomorrow)
                }, has_won: true
            })

            if (diceGame.length > 0) {
                diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
                    return game.profit
                })
                if (diceGameTotalStake.length > 0) {
                    diceGameTotalStakeWon = diceGameTotalStake.reduce((a, b) => a + b)
                }
            }

            //Get Number of Mines Game Won Amount
            const minesGame = await MinesGame.find({
                created_at: {
                    $gte: new Date(today),
                    $lt: new Date(tomorrow)
                }, has_won: true
            })

            if (minesGame.length > 0) {
                minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
                    return game.profit
                })
                if (minesGameTotalStake.length > 0) {
                    minesGameTotalStakeWon = minesGameTotalStake.reduce((a, b) => a + b)
                }
            }

        } else {
            console.log("Overall")
            //Get Number of Crash Game Won Amount
            const crashGame = await CrashGame.find({ has_won: true })
            if (crashGame.length > 0) {
                crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
                    return game.profit
                })
                if (crashGameTotalStake.length > 0) {
                    crashGameTotalStakeWon = crashGameTotalStake.reduce((a, b) => a + b)
                }
            }

            //Get Number of Dice Game Won Amount
            const diceGame = await DiceGame.find({ has_won: true })
            if (diceGame.length > 0) {
                diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
                    return game.profit
                })
                if (diceGameTotalStake.length > 0) {
                    diceGameTotalStakeWon = diceGameTotalStake.reduce((a, b) => a + b)
                }
            }

            //Get Number of Mines Game Won Amount
            const minesGame = await MinesGame.find({ has_won: true })
            if (minesGame.length > 0) {
                minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
                    return game.profit
                })
                if (minesGameTotalStake.length > 0) {
                    minesGameTotalStakeLoss = minesGameTotalStake.reduce((a, b) => a + b)
                }
            }

        }

        const sum = crashGameTotalStakeWon + diceGameTotalStakeWon + minesGameTotalStakeWon
        return sum.toFixed(2)
    } catch (err) {
        console.log(err)
    }
}

const totalGamesLoss = async () => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;

    let crashGameTotalStakeLoss = 0;
    let diceGameTotalStakeLoss = 0;
    let minesGameTotalStakeLoss = 0;
    //Get Number of Crash Game Won Amount
    const crashGame = await CrashGame.find({ has_won: false })
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
            return game.bet_amount
        })
        if (crashGameTotalStake.length > 0) {
            crashGameTotalStakeLoss = crashGameTotalStake.reduce((a, b) => a + b)
        }
    }

    //Get Number of Dice Game Won Amount
    const diceGame = await DiceGame.find({ has_won: false })
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
            return game.bet_amount
        })
        if (diceGameTotalStake.length > 0) {
            diceGameTotalStakeLoss = diceGameTotalStake.reduce((a, b) => a + b)
        }

    }

    //Get Number of Mines Game Won Amount
    const minesGame = await MinesGame.find({ has_won: false })
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
            return game.bet_amount
        })
        if (minesGameTotalStake.length > 0) {
            minesGameTotalStakeLoss = minesGameTotalStake.reduce((a, b) => a + b)
        }
    }

    const sum = crashGameTotalStakeLoss + diceGameTotalStakeLoss + minesGameTotalStakeLoss
    return sum.toFixed(2)
}

const totalWageredByMonth = async () => {
    let crashGameTotalStake = [];
    let diceGameTotalStake = [];
    let minesGameTotalStake = [];

    const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    //Get Number of Crash Game Won Amount
    const crashGame = await CrashGame.find()
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.time).getMonth() + 1
            }
        })
    }

    //Get Number of Dice Game Won Amount
    const diceGame = await DiceGame.find()
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.time).getMonth() + 1
            }
        })
    }

    //Get Number of Mines Game Won Amount
    const minesGame = await MinesGame.find()
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
            return {
                bet_amount: game.bet_amount,
                month: new Date(game.time).getMonth() + 1
            }
        })
    }

    const allWagered = crashGameTotalStake.concat(diceGameTotalStake).concat(minesGameTotalStake)
    let totalAmountByMonth = [];
    for (let i = 0; i < allWagered.length; i++) {
        let month = allWagered[i].month;
        let betAmount = allWagered[i].bet_amount;

        // Check if the month already exists in the array
        let existingMonth = totalAmountByMonth.find(item => item.month === month);

        if (existingMonth) {
            existingMonth.totalAmount += betAmount;
        } else {
            totalAmountByMonth.push({ month: month, totalAmount: betAmount });
        }
    }

    totalAmountByMonth = totalAmountByMonth.map((obj) => {
        return {
            month: monthsArray[obj.month - 1],
            totalAmount: Math.floor(obj.totalAmount)
        }
    })
    if (totalAmountByMonth.length <= 0) {
        return []
    }
    return totalAmountByMonth
}

const totalWonByMonth = async () => {
    let crashGameTotalStake = [];
    let diceGameTotalStake = [];
    let minesGameTotalStake = [];

    const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    //Get Number of Crash Game Won Amount
    const crashGame = await CrashGame.find({ has_won: true })
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
            return {
                profit: game.profit,
                month: new Date(game.time).getMonth() + 1
            }
        })
    }

    //Get Number of Dice Game Won Amount
    const diceGame = await DiceGame.find({ has_won: true })
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
            return {
                profit: game.profit,
                month: new Date(game.time).getMonth() + 1
            }
        })
    }

    //Get Number of Mines Game Won Amount
    const minesGame = await MinesGame.find({ has_won: true })
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
            return {
                profit: game.profit,
                month: new Date(game.time).getMonth() + 1
            }
        })
    }
    const allWagered = crashGameTotalStake.concat(diceGameTotalStake).concat(minesGameTotalStake)
    let totalAmountWon = [];

    for (let i = 0; i < allWagered.length; i++) {
        let month = allWagered[i].month;
        let betProfit = allWagered[i].profit;

        // Check if the month already exists in the array
        let existingMonth = totalAmountWon.find(item => item.month === month);

        if (existingMonth) {
            existingMonth.totalAmount += betProfit;
        } else {
            totalAmountWon.push({ month: month, totalAmount: betProfit });
        }
    }

    totalAmountWon = totalAmountWon.map((obj) => {
        return {
            month: monthsArray[obj.month - 1],
            totalAmount: Math.floor(obj.totalAmount)
        }
    })

    if (totalAmountWon.length <= 0) {
        return []
    }
    return totalAmountWon
}
const userWon = async (user_id) => {

    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;

    let crashGameTotalStakeWon = 0;
    let diceGameTotalStakeWon = 0;
    let minesGameTotalStakeWon = 0;


    // //Get the total won across all games
    // //Get Number of Crash Game Won Amount
    const crashGame = await CrashGame.find({ user_id: user_id, has_won: true })
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
            return game.profit
        })
        if (crashGameTotalStake.length > 0) {
            crashGameTotalStakeWon = crashGameTotalStake.reduce((a, b) => a + b)
        }
    }

    // //Get Number of Dice Game Won Amount
    const diceGame = await DiceGame.find({ user_id: user_id, has_won: true })
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
            return game.profit
        })
        if (diceGameTotalStake.length > 0) {
            diceGameTotalStakeWon = diceGameTotalStake.reduce((a, b) => a + b)
        }
    }

    // //Get Number of Mines Game Won Amount
    const minesGame = await MinesGame.find({ user_id: user_id, has_won: true })
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
            return game.profit
        })
        if (minesGameTotalStake.length > 0) {
            minesGameTotalStakeWon = minesGameTotalStake.reduce((a, b) => a + b)
        }
    }

    const sumOfWon = crashGameTotalStakeWon + diceGameTotalStakeWon + minesGameTotalStakeWon
    return sumOfWon
}
const userLoss = async (user_id) => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;

    let crashGameTotalStakeLoss = 0;
    let diceGameTotalStakeLoss = 0;
    let minesGameTotalStakeLoss = 0;


    // //Get the total won across all games
    // //Get Number of Crash Game Won Amount
    const crashGame = await CrashGame.find({ user_id: user_id, has_won: false })
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
            return game.bet_amount
        })
        if (crashGameTotalStake.length > 0) {
            crashGameTotalStakeLoss = crashGameTotalStake.reduce((a, b) => a + b)
        }
    }

    // //Get Number of Dice Game Won Amount
    const diceGame = await DiceGame.find({ user_id: user_id, has_won: false })
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
            return game.bet_amount
        })
        if (diceGameTotalStake.length > 0) {
            diceGameTotalStakeLoss = diceGameTotalStake.reduce((a, b) => a + b)
        }
    }

    // //Get Number of Mines Game Won Amount
    const minesGame = await MinesGame.find({ user_id: user_id, has_won: false })
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
            return game.bet_amount
        })
        if (minesGameTotalStake.length > 0) {
            minesGameTotalStakeLoss = minesGameTotalStake.reduce((a, b) => a + b)
        }

    }

    const sumOfLoss = crashGameTotalStakeLoss + diceGameTotalStakeLoss + minesGameTotalStakeLoss
    return sumOfLoss
}

const dailyTotalWagered = async (from, to, type) => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;

    let crashGameTotalWagered = 0;
    let diceGameTotalWagered = 0;
    let minesGameTotalWagered = 0;

    let crashGameDailyUserActive = 0;
    let diceGameDailyUserActive = 0;
    let minesGameDailyUserActive = 0;

    if (type === undefined) {
        //Get Number of Crash Game Won Amount
        const crashGame = await CrashGame.find({
            created_at: {
                $gte: new Date(from),
                $lt: new Date(to)
            }
        })
        if (crashGame.length > 0) {
            crashGameTotalStake = crashGame.map((game) => {
                if (game.token !== 'WGF') {
                    return game.bet_amount
                }
            })
            crashGameTotalWagered = crashGameTotalStake.reduce((a, b) => a + b)
            crashGameDailyUserActive = crashGameTotalStake.length

        }

        //Get Number of Dice Game Won Amount
        const diceGame = await DiceGame.find({
            created_at: {
                $gte: new Date(from),
                $lt: new Date(to)
            }
        })
        if (diceGame.length > 0) {
            diceGameTotalStake = diceGame.map((game) => {
                if (game.token !== 'WGF') {
                    return game.bet_amount
                }
            })
            diceGameTotalWagered = diceGameTotalStake.reduce((a, b) => a + b)
            diceGameDailyUserActive = diceGameTotalStake.length
        }

        //Get Number of Mines Game Won Amount
        const minesGame = await MinesGame.find({
            created_at: {
                $gte: new Date(from),
                $lt: new Date(to)
            }
        })
        if (minesGame.length > 0) {
            minesGameTotalStake = minesGame.map((game) => {
                if (game.bet_token_name !== 'WGF') {
                    return game.bet_amount
                }
            })
            minesGameTotalWagered = minesGameTotalStake.reduce((a, b) => a + b)
            minesGameDailyUserActive = minesGameTotalStake.length
        }
        let totalDailyUserActive = crashGameDailyUserActive + diceGameDailyUserActive + minesGameDailyUserActive

        const sum = crashGameTotalWagered + diceGameTotalWagered + minesGameTotalWagered
        return {
            totalWagered: sum,
            totalDailyUserActive
        }
    } else {
        if (type === 'crashgame') {
            let crashGameTotalStakeDaily = 0;
            //Get Number of Crash Game Won Amount
            const crashGame = await CrashGame.find({
                created_at: {
                    $gte: new Date(from),
                    $lt: new Date(to)
                }
            })
            if (crashGame.length > 0) {
                crashGameTotalStake = crashGame.map((game) => {
                    if (game.token !== 'WGF') {
                        return game.bet_amount
                    }
                })
                crashGameTotalStakeDaily = crashGameTotalStake.reduce((a, b) => a + b)
            }
            return crashGameTotalStakeDaily
        } else if (type === 'dicegame') {
            let diceGameTotalStakeDaily = 0
            //Get Number of Dice Game Won Amount
            const diceGame = await DiceGame.find({
                created_at: {
                    $gte: new Date(from),
                    $lt: new Date(to)
                }
            })
            if (diceGame.length > 0) {
                diceGameTotalStake = diceGame.map((game) => {
                    if (game.token !== 'WGF') {
                        return game.bet_amount
                    }
                })
                diceGameTotalStakeDaily = diceGameTotalStake.reduce((a, b) => a + b)
            }
            return diceGameTotalStakeDaily
        } else if (type === 'minesgame') {
            let minesGameTotalStakeDaily = 0
            //Get Number of Mines Game Won Amount
            const minesGame = await MinesGame.find({
                created_at: {
                    $gte: new Date(from),
                    $lt: new Date(to)
                }
            })
            if (minesGame.length > 0) {
                minesGameTotalStake = minesGame.map((game) => {
                    if (game.bet_token_name !== 'WGF') {
                        return game.bet_amount
                    }
                })
                minesGameTotalStakeDaily = minesGameTotalStake.reduce((a, b) => a + b)
            }
            return minesGameTotalStakeDaily
        }

    }
}

const dailyGamesWon = async (today, tomorrow, type) => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;
    if (type === 'crashgame') {
        let crashGameTotalStakeWon = 0
        //Get Number of Crash Game Won Amount
        const crashGame = await CrashGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }, has_won: true
        })
        if (crashGame.length > 0) {
            crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
                return game.profit
            })
            if (crashGameTotalStake.length > 0) {
                crashGameTotalStakeWon = crashGameTotalStake.reduce((a, b) => a + b)
            }
        }
        return crashGameTotalStakeWon
    } else if (type === 'dicegame') {
        let diceGameTotalStakeWon = 0
        //Get Number of Dice Game Won Amount
        const diceGame = await DiceGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }, has_won: true
        })
        if (diceGame.length > 0) {
            diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
                return game.profit
            })
            if (diceGameTotalStake.length > 0) {
                diceGameTotalStakeWon = diceGameTotalStake.reduce((a, b) => a + b)
            }
        }
        return diceGameTotalStakeWon
    } else if (type === 'minesgame') {
        //Get Number of Mines Game Won Amount
        let minesGameTotalStake = 0
        const minesGame = await MinesGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }, has_won: true
        })
        if (minesGame.length > 0) {
            minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
                return game.profit
            })
            if (minesGameTotalStake.length > 0) {
                minesGameTotalStakeWon = minesGameTotalStake.reduce((a, b) => a + b)
            }
        }
        return minesGameTotalStake
    }

}

const dailyLottery = async (today, tomorrow) => {
    //Get Number of Crash Game Won Amount
    let totalTicket = 0
    let totalPrize = 0
    try {
        //Get total Lottery Ticket and Prize for the day
        const lotteryTickets = await LotteryTicket.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }
        })
        // const lotteryTickets  = [{amount: 30, prize: 10},{amount: 30, prize: 10},{amount: 30, prize: 10}]
        if (lotteryTickets.length > 0) {
            console.log("Yes")
            let tickets = lotteryTickets.map(lotteryTicket => {
                return {
                    amount: lotteryTicket.amount,
                    prize: lotteryTicket.prize
                }

            })
            for (let i = 0; i < tickets.length; i++) {
                totalTicket += tickets[i].amount
                totalPrize += tickets[i].prize
            }
            return {
                totalTicket, totalPrize
            }
        } else {
            return {
                totalTicket: 0,
                totalPrize: 0
            }
        }

    } catch (err) {
        console.log(err)
    }

}

const withdrawalHistory = async (today, tomorrow) => {
    let totalWithdrawalAmount = 0;
    const historys = await WithdrawalHistory.find({
        createdAt: {
            $gte: new Date(today),
            $lt: new Date(tomorrow)
        }, status: 'Successful'
    })

    if (historys.length > 0) {
        const withdrawal = historys.map(history => {
            return history.amount
        })
        totalWithdrawalAmount = withdrawal.reduce((a, b) => {
            return a + b
        })
    }
    return totalWithdrawalAmount
}

const cashBack = async () => {
    let otherBonuses = {}

    let recharge_balance = 0
    let week_cashback = 0
    let monthly_cashback = 0

    const cashBacks = await CashBack.find()
    // const cashBacks = [{recharge_balance: 20, week_cashback: 10, monthly_cashback: 5}, {recharge_balance: 20, week_cashback: 10, monthly_cashback: 5}]
    if (cashBacks.length > 0) {
        const cashBack = cashBacks.map(cashBack => {
            // console.log(cashBacks)
            const cash = {
                recharge_balance: cashBack.recharge_balance,
                week_cashback: cashBack.week_cashback,
                monthly_cashback: cashBack.monthly_cashback
            }
            return cash
        })
        for (let i = 0; i < cashBack.length; i++) {
            recharge_balance += cashBack[i].recharge_balance
            week_cashback += cashBack[i].week_cashback
            monthly_cashback += cashBack[i].monthly_cashback
        }
    }
    return otherBonuses = {
        recharge_balance,
        week_cashback,
        monthly_cashback
    }
}
const wonByDate = async (from, to, user_id) => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;

    let crashGameTotalStakeWon = 0;
    let diceGameTotalStakeWon = 0;
    let minesGameTotalStakeWon = 0;


    // //Get the total won across all games
    // //Get Number of Crash Game Won Amount
    const crashGame = await CrashGame.find({
        created_at: {
            $gte: new Date(from),
            $lt: new Date(to)
        }, user_id: user_id, has_won: true
    })
    if (crashGame.length > 0) {
        crashGameTotalStake = crashGame.filter(game => game.token !== 'WGF').map(game => {
            return game.profit
        })
        if (crashGameTotalStake.length > 0) {
            crashGameTotalStakeWon = crashGameTotalStake.reduce((a, b) => a + b)
        }
    }

    // //Get Number of Dice Game Won Amount
    const diceGame = await DiceGame.find({
        created_at: {
            $gte: new Date(from),
            $lt: new Date(to)
        }, user_id: user_id, has_won: true
    })
    if (diceGame.length > 0) {
        diceGameTotalStake = diceGame.filter(game => game.token !== 'WGF').map(game => {
            return game.profit
        })
        if (diceGameTotalStake.length > 0) {
            diceGameTotalStakeWon = diceGameTotalStake.reduce((a, b) => a + b)
        }
    }

    // //Get Number of Mines Game Won Amount
    const minesGame = await MinesGame.find({
        created_at: {
            $gte: new Date(from),
            $lt: new Date(to)
        }, user_id: user_id, has_won: true
    })
    if (minesGame.length > 0) {
        minesGameTotalStake = minesGame.filter(game => game.bet_token_name !== 'WGF').map(game => {
            return game.profit
        })
        if (minesGameTotalStake.length > 0) {
            minesGameTotalStakeWon = minesGameTotalStake.reduce((a, b) => a + b)
        }
    }

    const sumOfWon = crashGameTotalStakeWon + diceGameTotalStakeWon + minesGameTotalStakeWon
    return sumOfWon
}

const betCount = async (today, tomorrow, type) => {
    let crashGameTotalStake = 0;
    let diceGameTotalStake = 0;
    let minesGameTotalStake = 0;
    if (type === 'crashgame') {
        //Get Number of Crash Game Won Amount
        const crashGame = await CrashGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }
        })
        if (crashGame.length > 0) {
            crashGameTotalStake = crashGame.length
            return crashGameTotalStake
        }
        return crashGameTotalStake
    } else if (type === 'dicegame') {
        //Get Number of Dice Game Won Amount
        const diceGame = await DiceGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }
        })
        if (diceGame.length > 0) {
            diceGameTotalStake = diceGame.length
            return diceGameTotalStake
        }
        return diceGameTotalStake
    } else if (type === 'minesgame') {
        //Get Number of Mines Game Won Amount
        const minesGame = await MinesGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }
        })
        if (minesGame.length > 0) {
            minesGameTotalStake = minesGame.length
            return minesGameTotalStake
        }
        return minesGameTotalStake
    }

}

const playerCount = async (today, tomorrow, type) => {
    if (type === 'crashgame') {
        //Get Number of Crash Game Won Amount
        const crashGame = await CrashGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }
        })
        if (crashGame.length > 0) {
            //Remove repition, One player might play crash game 10 times a day
            const uniqueID = []
            crashGame.forEach(value => {
                if (!uniqueID.includes(value.user_id)) {
                    uniqueID.push(value.user_id)
                }
            })
            return uniqueID.length
        } else {
            return 0;
        }

    } else if (type === 'dicegame') {
        //Get Number of Dice Game Won Amount
        const diceGame = await DiceGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }
        })
        if (diceGame.length > 0) {
            //Remove repition, One player might play dice game 10 times a day
            const uniqueID = []
            diceGame.forEach(value => {
                if (!uniqueID.includes(value.user_id)) {
                    uniqueID.push(value.user_id)
                }
            })
            return uniqueID.length
        } else {
            return 0;
        }
    } else if (type === 'minesgame') {
        //Get Number of Mines Game Won Amount
        const minesGame = await MinesGame.find({
            created_at: {
                $gte: new Date(today),
                $lt: new Date(tomorrow)
            }
        })
        if (minesGame.length > 0) {
            //Remove repition, One player might play crash game 10 times a day
            const uniqueID = []
            minesGame.forEach(value => {
                if (!uniqueID.includes(value)) {
                    uniqueID.push(value)
                }
            })
            return uniqueID.length
        } else {
            return 0;
        }

    }
}

module.exports = {
    removeDuplicatePlayer,
    getGGR,
    getTotalPlayerBalance,
    totalGamesWon,
    totalGamesLoss,
    totalWageredByMonth,
    totalWonByMonth,
    userWon,
    userLoss,
    dailyTotalWagered,
    dailyGamesWon,
    betCount,
    playerCount,
    dailyLottery,
    withdrawalHistory,
    cashBack,
    wonByDate

}