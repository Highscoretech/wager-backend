const CrashGame = require("../model/crashgame")

const GetAllPlayersByGameId = (async(req, res)=>{
    const id = req.body
    try{
        let response = await CrashGame.find({game_id:id.game_id})
        res.status(200).json(response)
    }
    catch(error){
        res.status(500).json({error: error})
    }
})

module.exports = { GetAllPlayersByGameId }