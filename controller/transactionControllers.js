const Bills = require("../model/bill");
const BTCWallet = require("../model/btc-wallet")
const EThHWallet = require("../model/ETH-wallet")
const WGDWallet = require("../model/WGD-wallet")

const handleTransaction = (async(req, res)=>{
    const { id } = req.params;
    const { user_id } = req.id;
    try{
        const bill = id === "all" || id === "game" ? await Bills.find({user_id}) : []
        res.status(200).json(bill)
    }
    catch(error){
        res.status(500).json({error})
    }
})

const handleSwapCoins = (async(req, res)=>{
    const { data } = req.body
    const { user_id } = req.id
    try{
        if(data.sender.coin_name === "BTC"){
            await BTCWallet.updateOne({user_id},{
                balance: data.sender.balance - data.sender_amount 
            })
        }
        if(data.sender.coin_name === "ETH"){
            await EThHWallet.updateOne({user_id},{
                balance: data.sender.balance - data.sender_amount 
            })
        }
        if(data.sender.coin_name === "WGD"){
            await WGDWallet.updateOne({user_id},{
                balance: data.sender.balance - data.sender_amount 
            })
        }
        if(data.reciever.coin_name === "WGD"){
            await WGDWallet.updateOne({user_id},{
                balance: data.sender.balance + data.receiver_amount 
            })
        }
        if(data.reciever.coin_name === "ETH"){
            await EThHWallet.updateOne({user_id},{
                balance: data.sender.balance + data.receiver_amount 
            })
        }
        if(data.reciever.coin_name === "BTC"){
            await BTCWallet.updateOne({user_id},{
                balance: data.sender.balance + data.receiver_amount 
            })
        }
        res.status(200).json({message: "Swapped successfully"})
    }
    catch(err){
        res.status(500).json({message: err})
    }
})

module.exports = { handleTransaction, handleSwapCoins }