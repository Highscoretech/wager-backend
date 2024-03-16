const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const User = require("./routes/Users.js");
const Profile = require("./routes/Profile.js");
const Chat = require("./routes/chat.js")
const diceGame = require("./routes/diceGame.js");
const Wallet = require("./routes/wallet.js");

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res)=>{
    res.status(200).json({perfect:"Welcome to Wager.io chat please na"})
})

 app.use("/api/users", User);
 app.use("/api/profile", Profile);
 app.use("/api/chat", Chat);
 app.use("/api/user/dice-game", diceGame);
 app.use("/api/wallet", Wallet);

const PORT = process.env.PORT || 5000; 
mongoose.set('strictQuery', false);

// connect database
// const dbUri = `mongodb://localhost:27017/wager`
const dbUri = `mongodb+srv://highscoreteh:eNiIQbm4ZMSor8VL@cluster0.xmpkpjc.mongodb.net/wager?retryWrites=true&w=majority`
mongoose.connect(dbUri, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then((result)=>  console.log('Database connected'))
    .catch((err)=> console.log(err))
app.listen(process.env.PORT, ()=>{
    console.log("Running on port "+ process.env.PORT)
})