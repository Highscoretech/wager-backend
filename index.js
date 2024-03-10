const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/", (req, res)=>{
    res.status(200).json({perfect:"Welcome to Wager.io"})
  })

app.get("/profile", (req, res)=>{
res.status(200).json({user:"My name is Valiant"})
})


const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
 });