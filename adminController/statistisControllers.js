const CrashGame = require("../model/crashgame")
const DiceGame = require("../model/dice_game")

const GlobalStat = (async(req, res)=>{
    const {user_id, game} = req.body
    let global_statistics = []
    try{
    let crash_res =  game === "global" || game === "crash" ?  await CrashGame.find({user_id}) : []
    let dice_res =  game === "global" || game === "dice" ? await DiceGame.find({user_id}) : []
        
    if(crash_res.length !== 0){
        crash_res.forEach(element => {
            global_statistics.push(element)
        });
    }
    if(dice_res.length !== 0){
        dice_res.forEach(element => {
            global_statistics.push(element)
        });
    }

        let WGF = []
        let WGF_lose = []
        let WGF_win = []
        let WGF_img = ''
        let WGF_wagered = 0

        let ETH = []
        let ETH_lose = []
        let ETH_win = []
        let ETH_img = ''
        let ETH_wagered = 0

        let BTC = []
        let BTC_lose = []
        let BTC_win = []
        let BTC_img = ''
        let BTC_wagered = 0


global_statistics.forEach(element => {
    if(element.token === "ETH"){
        ETH.push(element)
        ETH_img = element.token_img
        ETH_wagered += (parseInt(element.bet_amount))
        if(element.has_won){
            ETH_win.push(element)
        }else{
            ETH_lose.push(element) 
        }
    }
    if(element.token === "BTC"){
        BTC.push(element)
        BTC_img = element.token_img
        BTC_wagered += (parseInt(element.bet_amount))
        if(element.has_won){
            BTC_win.push(element)
        }else{
            BTC_lose.push(element) 
        }
    }
    else if(element.token === "WGF"){
        WGF.push(element)
        WGF_img = element.token_img
        WGF_wagered += (parseInt(element.bet_amount))
        if(element.has_won){
            WGF_win.push(element)
        }else{
            WGF_lose.push(element) 
        }
    }
})
    let total_wagered = ETH_wagered + BTC_wagered
    let total_lose = WGF_lose.length + ETH_lose.length + BTC_lose.length 
    let total_win = WGF_win.length + ETH_win.length + BTC_win.length
    let total_bet = global_statistics.length
    let wgf = {wgf_bets:WGF.length, wgf_win: WGF_win.length, wgf_lose: WGF_lose.length, wgf_wagered:WGF_wagered, wgf_img:WGF_img }
    let eth = {eth_bets:ETH.length, eth_win: ETH_win.length, eth_lose: ETH_lose.length, eth_wagered:ETH_wagered, eth_img:ETH_img }
    let btc = {btc_bets:BTC.length, btc_win: BTC_win.length, btc_lose: BTC_lose.length, btc_wagered:BTC_wagered, btc_img:BTC_img }

     res.status(200).json({total_wagered, total_bet,total_lose,total_win, wgf, eth, btc})
    }
    catch(error){
        res.status(500).json({error})
    }
})

const crashStat = (async(req, res)=>{
    const {user_id} = req.body
    let global_statistics = []
    try{
        let response = await CrashGame.find({user_id})
        response.forEach(element => {
            global_statistics.push(element)
        })

        let PPF = []
        let PPF_lose = []
        let PPF_win = []
        let PPF_img = ''
        let PPF_wagered = 0

        let PPD = []
        let PPD_lose = []
        let PPD_win = []
        let PPD_img = ''
        let PPD_wagered = 0

        let PPE = []
        let PPE_lose = []
        let PPE_win = []
        let PPE_img = ''
        let PPE_wagered = 0

        let PPL = []
        let PPL_lose = []
        let PPL_win = []
        let PPL_img = ''
        let PPL_wagered = 0

        let USDT = []
        let USDT_lose = []
        let USDT_win = []
        let USDT_img = ''
        let USDT_wagered = 0

        setTimeout(()=>{
            for (let index = 0; index < global_statistics.length; index++) {
                const element = global_statistics[index];
                if(element.token === "USDT"){
                    USDT.push(element)
                    USDT_img = element.token_img
                    USDT_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        USDT_lose.push(element)
                    }else{
                        USDT_win.push(element) 
                    }
                }
                else if(element.token === "PPF"){
                    PPF.push(element)
                    PPF_img = element.token_img
                    PPF_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPF_lose.push(element)
                    }else{
                        PPF_win.push(element) 
                    }
                }
                else if(element.token === "PPD"){
                    PPD.push(element)
                    PPD_img = element.token_img
                    PPD_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPD_lose.push(element)
                    }else{
                        PPD_win.push(element) 
                    }
                }
                else if(element.token === "PPE"){
                    PPE.push(element)
                    PPE_img = element.token_img
                    PPE_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPE_lose.push(element)
                    }else{
                        PPE_win.push(element) 
                    }
                }
                else if(element.token === "PPL"){
                    PPL.push(element)
                    PPL_img = element.token_img
                    PPL_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPL_lose.push(element)
                    }else{
                        PPL_win.push(element) 
                    }
                }
            }

            let total_wagered = USDT_wagered + PPD_wagered
            let total_lose = PPF_lose.length + PPD_lose.length + PPE_lose.length + PPL_lose.length + USDT_lose.length 
            let total_win = PPF_win.length + PPD_win.length + PPE_win.length + PPL_win.length + USDT_win.length 
            let total_bet = global_statistics.length
            let ppf = {ppf_bets:PPF.length, ppf_win: PPF_win.length, ppf_lose: PPF_lose.length, ppf_wagered:PPF_wagered, ppf_img:PPF_img }
            let ppd = {ppd_bets:PPD.length, ppd_win: PPD_win.length, ppd_lose: PPD_lose.length, ppd_wagered:PPD_wagered, ppd_img:PPD_img }
            let ppe = {ppe_bets:PPE.length, ppe_win: PPE_win.length, ppe_lose: PPE_lose.length, ppe_wagered:PPE_wagered, ppe_img:PPE_img }
            let ppl = {ppl_bets:PPL.length, ppl_win: PPL_win.length, ppl_lose: PPL_lose.length, ppl_wagered:PPL_wagered, ppl_img:PPL_img }
            let usdt = {usdt_bets:USDT.length, usdt_win: USDT_win.length, usdt_lose: USDT_lose.length, usdt_wagered:USDT_wagered, usdt_img:USDT_img }

            res.status(200).json({total_wagered, total_bet,total_lose,total_win, ppf, ppd, ppe, ppl, usdt})
        },500)
    }
    catch(error){
        res.status(500).json({error})
    }
})

const diceStat = (async(req, res)=>{
    const {user_id} = req.body
    let global_statistics = []
    try{
        let dice_res = await DiceGame.find({user_id})
        dice_res.forEach(element => {
            global_statistics.push(element)
        })

        let PPF = []
        let PPF_lose = []
        let PPF_win = []
        let PPF_img = ''
        let PPF_wagered = 0

        let PPD = []
        let PPD_lose = []
        let PPD_win = []
        let PPD_img = ''
        let PPD_wagered = 0

        let PPE = []
        let PPE_lose = []
        let PPE_win = []
        let PPE_img = ''
        let PPE_wagered = 0

        let PPL = []
        let PPL_lose = []
        let PPL_win = []
        let PPL_img = ''
        let PPL_wagered = 0

        let USDT = []
        let USDT_lose = []
        let USDT_win = []
        let USDT_img = ''
        let USDT_wagered = 0

        setTimeout(()=>{
            global_statistics.forEach(element => {
                if(element.token === "USDT"){
                    USDT.push(element)
                    USDT_img = element.token_img
                    USDT_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        USDT_lose.push(element)
                    }else{
                        USDT_win.push(element) 
                    }
                }
                else if(element.token === "PPF"){
                    PPF.push(element)
                    PPF_img = element.token_img
                    PPF_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPF_lose.push(element)
                    }else{
                        PPF_win.push(element) 
                    }
                }
                else if(element.token === "PPD"){
                    PPD.push(element)
                    PPD_img = element.token_img
                    PPD_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPD_lose.push(element)
                    }else{
                        PPD_win.push(element) 
                    }
                }
                else if(element.token === "PPE"){
                    PPE.push(element)
                    PPE_img = element.token_img
                    PPE_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPE_lose.push(element)
                    }else{
                        PPE_win.push(element) 
                    }
                }
                else if(element.token === "PPL"){
                    PPL.push(element)
                    PPL_img = element.token_img
                    PPL_wagered += (parseInt(element.bet_amount))
                    if(element.has_won){
                        PPL_lose.push(element)
                    }else{
                        PPL_win.push(element) 
                    }
                }
          

            let total_wagered = USDT_wagered + PPD_wagered
            let total_lose = PPF_lose.length + PPD_lose.length + PPE_lose.length + PPL_lose.length + USDT_lose.length 
            let total_win = PPF_win.length + PPD_win.length + PPE_win.length + PPL_win.length + USDT_win.length 
            let total_bet = global_statistics.length
            let ppf = {ppf_bets:PPF.length, ppf_win: PPF_win.length, ppf_lose: PPF_lose.length, ppf_wagered:PPF_wagered, ppf_img:PPF_img }
            let ppd = {ppd_bets:PPD.length, ppd_win: PPD_win.length, ppd_lose: PPD_lose.length, ppd_wagered:PPD_wagered, ppd_img:PPD_img }
            let ppe = {ppe_bets:PPE.length, ppe_win: PPE_win.length, ppe_lose: PPE_lose.length, ppe_wagered:PPE_wagered, ppe_img:PPE_img }
            let ppl = {ppl_bets:PPL.length, ppl_win: PPL_win.length, ppl_lose: PPL_lose.length, ppl_wagered:PPL_wagered, ppl_img:PPL_img }
            let usdt = {usdt_bets:USDT.length, usdt_win: USDT_win.length, usdt_lose: USDT_lose.length, usdt_wagered:USDT_wagered, usdt_img:USDT_img }
            res.status(200).json({total_wagered, total_bet,total_lose,total_win, ppf, ppd, ppe, ppl, usdt})
            });
        },500)
    }
    catch(error){
        res.status(500).json({error})
    }
})

module.exports = { GlobalStat, crashStat , diceStat}