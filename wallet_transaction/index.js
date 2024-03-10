const BTCWallet = require("../model/btc-wallet")
const EThHWallet = require("../model/ETH-wallet")
const WGFWallet = require("../model/WGF-wallet")
const WGDWallet = require("../model/WGD-wallet")
 
// ================ store USDt wallet details ===================
const handleDefaultWallet = (()=>{
    let wallet = [
        {
           is_active: true,
            balance: 0,
           coin_image:"https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400", 
           coin_name: "BTC", 
       },
       {
        is_active: false,   
        balance: 0,
        coin_image:"https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628", 
        coin_name: "ETC", 
       },
       {
        is_active: false,   
        balance: 10000,
        coin_image:"https://res.cloudinary.com/dxwhz3r81/image/upload/v1698010748/wft_z3ouah.png", 
        coin_name: "WGF", 
       },
       {
        is_active: false,   
        balance: 0,
        coin_image:"https://res.cloudinary.com/dxwhz3r81/image/upload/v1698011384/type_1_w_hqvuex.png", 
        coin_name: "WFD"
       }
   ]
   return wallet
})

// ================ store USDt wallet details ===================
const createbtc = (async(user_id)=>{
    let balance =  0
    let coin_image = "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400"
    let coin_name = "BTC"
    let coin_fname = "Bitcoin"
    let data = {user_id, balance, coin_image, coin_fname, coin_name, is_active: true}
    await BTCWallet.create(data)
})

 // ================ store PPD wallet  details===================
 const createEth = (async(user_id)=>{
    let balance =  0.0000
    let coin_image ="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628"
    let coin_fname = "Etheruem"
    let coin_name = "ETH"
    let data = {user_id, balance, coin_image, coin_name,coin_fname, is_active: false}
    await EThHWallet.create(data)
})

// ================ store PPF wallet  details===================
const createWGF = (async(user_id)=>{
    let now = new Date()
    let balance = 10000
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1698010748/wft_z3ouah.png"
    let coin_fname = "Wager Fun"
    let coin_name = "WGF"
    let date = now
    let data = {user_id, balance, coin_image, coin_fname, coin_name, date, is_active: false}
    await WGFWallet.create(data)
})

// ================ store PPF wallet  details===================
const createwagerToken = (async(user_id)=>{
    let balance = 0
    let coin_image = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1698011384/type_1_w_hqvuex.png"
    let coin_fname = "Wager Dollar"
    let coin_name = "WGD"          
    let data = {user_id, balance, coin_image, coin_fname, coin_name, is_active: false}
    await WGDWallet.create(data)
})

module.exports = {createWGF, createEth, createbtc, createwagerToken, handleDefaultWallet }