const { Server } = require("socket.io");
const WGFWallet = require("../model/WGF-wallet");
const Chats = require("../model/public-chat");
const {
  handleHiloBet,
  handleHiloNextRound,
  handleHiloCashout,
  initHiloGame,
} = require("../controller/hiloController");
const { CrashGameEngine } = require("../controller/crashControllers");
const BTC_wallet = require("../model/btc-wallet");
const ETH_wallet = require("../model/ETH-wallet");
const WGD_wallet = require("../model/WGD-wallet");

const { handlePlinkoBet } = require("../controller/plinkoController");
let maxRange = 100;

const detectWallet = (type) => {
  if (typeof type === "string") {
    if (type.toLowerCase().includes("btc")) {
      return BTC_wallet;
    } else if (type.toLowerCase().includes("eth")) {
      return ETH_wallet;
    } else if (type.toLowerCase().includes("wgd")) {
      return WGD_wallet;
    } else if (type.toLowerCase().includes("wgf")) {
      return WGFWallet;
    }
  }
};

const deductFromWalletBalance = async (wallet, amount, user_id) => {
  const wallet_details = await wallet.findOne({ user_id });
  if (wallet_details) {
    const available_balance = wallet_details.balance;
    if (amount > available_balance) return "less";
    const new_balance = parseFloat(available_balance) - parseFloat(amount);
    await wallet.findOneAndUpdate({ user_id }, { balance: new_balance });
    return "done";
  } else {
    return "not-found";
  }
};

const addToWalletBalance = async (wallet, amount, user_id) => {
  let new_balance = amount;
  const wallet_details = await wallet.findOne({ user_id });
  if (wallet_details) {
    const available_balance = wallet_details.balance;
    new_balance = parseFloat(available_balance) + parseFloat(amount);
    await wallet.findOneAndUpdate({ user_id }, { balance: new_balance });
    return "done";
  } else {
    return "not-found";
  }
};

const handleCoinDrop = async (data) => {
  const amount = data.coin_drop_amount;
  const wallet = detectWallet(data.coin_drop_token);
  const user_id = data.user_id;

  const dropper = await Profile.findOne({ user_id });
  if (dropper.vip_level < 7) {
    return;
  }
  return deductFromWalletBalance(wallet, amount, user_id);
};

const handleRain = async (data, activeUsers) => {
  const wallet = detectWallet(data.coin_rain_token);
  let { user_id, coin_rain_amount, coin_rain_num, coin_rain_participant } =
    data;
  const isDeducted = await deductFromWalletBalance(
    wallet,
    coin_rain_amount,
    user_id
  );
  if (isDeducted === "done") {
    const share = coin_rain_amount / coin_rain_num;
    for (let i = 0; i < activeUsers.length; i++) {
      if (user_id !== activeUsers[i].id) {
        coin_rain_participant.push({
          user_id: activeUsers[i].id,
          username: activeUsers[i].username,
          share,
          grabbed_at: new Date(),
        });
        await addToWalletBalance(wallet, share, activeUsers[i].id);
      }
    }
  }
  data.coin_rain_participant = coin_rain_participant;
  return data;
};

const handleTip = async (data) => {
  const amount = data.tipped_amount;
  const wallet = detectWallet(data.tip_Token);
  const user_id = data.user_id;
  const receiverUsername = data.tipped_user;
  const receiver = await Profile.findOne({ username: receiverUsername });
  let deduction = await deductFromWalletBalance(wallet, amount, user_id);
  if (deduction === "done")
    await addToWalletBalance(wallet, amount, receiver.user_id);
};

async function createsocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["https://wager.services","http://localhost:5173","http://localhost:5174" , "https://wager-administration.netlify.app"]
    },
  });

  //Crash Game
  new CrashGameEngine(io)
    .run((latestBet) => {
      io.emit("latest-bet", latestBet);
    })
    .catch((err) => {
      console.log("Crash Game failed to start ::> ", err);
    });

  // let fghhs = await DiceGame.find()
  let activeplayers = [];
  const DiceActivePlayers = async (e) => {
    if (activeplayers.length > 21) {
      activeplayers.shift();
      activeplayers.push(e);
    } else {
      activeplayers.push(e);
    }
    io.emit("dice-gamePLayers", activeplayers);
  };

  let active_crash = [];
  const handleCrashActiveBet = (event) => {
    if (active_crash.length > 30) {
      active_crash.shift();
      active_crash.push(event);
    } else {
      active_crash.push(event);
    }
    io.emit("active-bets-crash", active_crash);
  };

  let activeUsers = [];
  const requestActiveUsers = (profile) => {
    const findUserIndex = (userId) => {
      return activeUsers.findIndex((user) => user.id === userId);
    };

    const addOrUpdateUser = (profile) => {
      const userIndex = findUserIndex(profile.user_id);
      if (userIndex !== -1) {
        activeUsers[userIndex].timestamp = new Date();
      } else {
        activeUsers.push({
          username: profile.username,
          id: profile.user_id,
          timestamp: new Date(),
        });
      }
    };

    const removeInactiveUsers = () => {
      const currentTime = new Date();
      activeUsers = activeUsers.filter((user) => {
        return currentTime - user.timestamp < 110000;
      });
    };

    addOrUpdateUser(profile);
    removeInactiveUsers();

    setInterval(() => {
      removeInactiveUsers();
    }, 120000);
    setInterval(() => {
      removeInactiveUsers();
    }, 110000);
    setInterval(() => {
      removeInactiveUsers();
    }, 100000);
    setInterval(() => {
      removeInactiveUsers();
    }, 130000);
  };

  let newMessage = await Chats.find();
  const handleNewChatMessages = async (data) => {
    if (data.type === "tip") {
      await handleTip(data);
    }
    if (data.type === "rain") {
      data = await handleRain(data, activeUsers);
    }

    if (data.type === "coin_drop") {
      await handleCoinDrop(data);
    }

    const newChat = await Chats.create({
      ...data,
      coin_drop_balance: data.coin_drop_amount || 0,
    });

    if (newChat) {
      newMessage = [];
      newMessage = await Chats.find();
      if (newMessage)
        io.emit("new-messages", {
          newMessage,
          active_user_num: activeUsers.length,
        });
    }
  };

  let active_keno_games = [];
  const handleKenoActiveBet = (event) => {
    if (active_keno_games.length > 30) {
      active_keno_games.shift();
      active_keno_games.push(event);
    } else {
      active_keno_games.push(event);
    }
    io.emit("active-bets-keno", active_keno_games);
  };

  //Live Bet Update
  let latest = []
  const latestBetUpdate = async (data, game) => {
    // const user = await Profile.findById(data.user_id)
    const stats = {
      gane_type: game,
      player: data.username,
      bet_id: data.bet_id,
      token_img: data.token_img,
      has_won: data.has_won,
      payout: data.payout,
      profit_amount: data.has_won ? data.wining_amount : data.bet_amount,
    };
    if(latest.length < 30){
      latest.push(stats)
    }else{
      latest.shift()
      latest.push(stats)
    }
    io.emit("latest-bet", latest);
  };

  const handleGrabCoinDrop = async (data) => {
    const { user_id, id, username } = data;
    const coin_drop = await Chats.findOne({ msg_id: id, type: "coin_drop" });

    if (!coin_drop) {
      io.emit("grabCoinDropResponse", { message: "Invalid coin drop" });
      return;
    }

    const grabber = await Profile.findOne({ user_id });

    if (grabber.vip_level < 7) {
      io.emit("grabCoinDropResponse", {
        message: `${user_id} vip level is less than 7`,
      });
      return;
    }

    let {
      coin_drop_token,
      coin_drop_participant,
      coin_drop_amount,
      coin_drop_balance,
      coin_drop_num,
    } = coin_drop;

    if (coin_drop_participant.length + 1 <= coin_drop_num) {
      const userExists = coin_drop_participant.some(
        (participant) => participant.user_id === user_id
      );

      if (!userExists) {
        const share = coin_drop_amount / coin_drop_num;
        coin_drop_participant.push({
          user_id,
          username,
          grabbed_at: new Date(),
        });
        coin_drop.coin_drop_balance = coin_drop_balance - share;
        const wallet = detectWallet(coin_drop_token);

        await addToWalletBalance(wallet, share, user_id);
        await coin_drop.save();

        io.emit("grabCoinDropResponse", {
          data: coin_drop,
          message: "Coin drop grabbed successfully",
        });
        // Notify other participants about the new participant
      } else {
        io.emit("grabCoinDropResponse", {
          message: "User already exists in coin drop participants",
        });
        return;
      }
    } else {
      io.emit("grabCoinDropResponse", { message: "Coin drop is already full" });
      return;
    }
  };

  io.on("connection", (socket) => {
    socket.on("dice-bet", (data) => {
      DiceActivePlayers(data);
      //Get New Bet and Update Latest Bet UI
       latestBetUpdate(data, "Dice Game");
    });

    socket.on("message", (data) => {
      handleNewChatMessages(data);
      requestActiveUsers(data.profile);
    });

    socket.on("grab_coin", (data) => {
      handleGrabCoinDrop(data);
    });

    socket.on("crash-activebet", (data) => {
      handleCrashActiveBet(data);
      //Get New Bet and Update Latest Bet UI
      const latestBet = latestBetUpdate(data, "Crash Game");
      io.emit("latest-bet", latestBet);
    });

    //KENO GAME SOCKET
    socket.on("keno-activebets", async (data) => {
      //   handleCrashActiveBet(data);
      handleKenoActiveBet(data);
      //Get New Bet and Update Latest Bet UI
      const latestBet = await latestBetUpdate(data, "Keno Game");
      io.emit("latest-bet", latestBet);
    });

    //HILO GAME
    socket.on("hilo-init", (data) => {
      initHiloGame(data, (event, payload) => {
        io.emit(event, payload);
      });
    });
    socket.on("hilo-bet", (data) => {
      handleHiloBet(data, (event, payload) => {
        io.emit(event, payload);
      });
    });
    socket.on("hilo-cashout", (data) => {
      handleHiloCashout(data, (event, payload) => {
        io.emit(event, payload);
      });
    });
    socket.on("hilo-next-round", (data) => {
      handleHiloNextRound(data, (event, payload) => {
        io.emit(event, payload);
      });
    });

    //PLINKO GAME BET
    socket.on("plinko-bet", (data) => {
      handlePlinkoBet(data);
      //Get New Bet and Update Latest Bet UI
      const latestBet = latestBetUpdate(data, "Plinko Game");
      io.emit("latest-bet", latestBet);
    });
  });
}

module.exports = { createsocket }
