const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createsocket } = require("./socket/index.js");
const { createServer } = require("node:http");

const app = express();
const User = require("./routes/Users.js");
const Profile = require("./routes/Profile.js");
const diceGame = require("./routes/diceGame.js");
const Wallet = require("./routes/wallet.js");
const Affiliate = require("./routes/affiliate");
const minegame = require("./routes/mines.js");
const Lottery = require("./routes/lottery.js");
const HiloGame = require("./routes/hiloGame.js");
const CrashGame = require("./routes/crashgame.js");
const Deposit = require("./routes/deposit.js");
const Withdraw = require("./routes/withdraw.js");
const Transaction = require("./routes/transactions.js");
const TransactionHistory = require("./routes/transactionHistory.js");
const Stats = require("./routes/admin/statistic/statistics.js");

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const server = createServer(app);
async function main() {
  createsocket(server);
}
main();

app.get("/", (req, res)=>{
    res.status(200).json({perfect:"Welcome to Wager.io chat please na"})
})

// require("./controller/lotteryEngine.js");
 app.use("/api/users", User);
 app.use("/api/profile", Profile);
 app.use("/api/user/dice-game", diceGame);
 app.use("/api/wallet", Wallet);
 app.use("/api/user/mine-game", minegame);
 app.use("/api/lottery", Lottery);
 app.use("/api/hilo-game", HiloGame);
 app.use("/api/user/crash-game", CrashGame);
 app.use("/api/deposit", Deposit);
app.use("/api/withdraw", Withdraw);
app.use("/api/transaction-history", TransactionHistory);
app.use("/api/transaction", Transaction);
app.use("/api/affiliate", Affiliate);
app.use("/api/stats", Stats);
mongoose.set('strictQuery', false);
const dbHost = "highscoreteh"
const dbPass = "eNiIQbm4ZMSor8VL"
const dbCompany = "wager"

// connect database
// const dbUri = `mongodb://localhost:27017/wager`
const dbUri = `mongodb+srv://${dbHost}:${dbPass}@cluster0.xmpkpjc.mongodb.net/${dbCompany}?retryWrites=true&w=majority`
mongoose.connect(dbUri, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then((result)=>  console.log('Database connected'))
    .catch((err)=> console.log(err))
server.listen(process.env.PORT, ()=>{
    console.log("Running on port "+ process.env.PORT)
})