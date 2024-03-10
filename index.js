const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { createsocket } = require("./socket/index.js");
const { createServer } = require("node:http");

const User = require("./routes/Users.js");
const Profile = require("./routes/Profile.js");

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

 app.use("/api/users", User);
 app.use("/api/profile", Profile);

const PORT = process.env.PORT || 5000; 
mongoose.set('strictQuery', false);
// connect database
// const dbUri = `mongodb://localhost:27017/wager`
const dbUri = `mongodb+srv://highscoreteh:eNiIQbm4ZMSor8VL@cluster0.xmpkpjc.mongodb.net/wager?retryWrites=true&w=majority`
mongoose.connect(dbUri, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then((result)=>  console.log('Database connected'))
    .catch((err)=> console.log(err))
server.listen(process.env.PORT, ()=>{
    console.log("Running on port "+ process.env.PORT)
})