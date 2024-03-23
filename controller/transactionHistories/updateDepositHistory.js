const DepositHistory = require("../../model/transactionHistoryModels/DepositHistory");
const setCoinIcon = require("../../lib/setCoinIcons")

// const updateDepositHistory = ( async (user_id, transaction_partner_id , status, order_amount, coinImage, previous_balance, current_balance) => {
const updateDepositHistory = ( async (order_id, depositRequestModel) => {
    try{
    const {    
        user_id,
        crypto,
        pay_address,
        token_id,
        status,
        merchant_order_id,
        amount,
    } = await depositRequestModel.findOne({order_id});

    const coin_image = setCoinIcon(crypto)

        newDeposit = {
            user_id,
            crypto,
            pay_address,
            token_id,
            coin_image,
            status,
            merchant_order_id,
            amount,
        }

        const transaction = await DepositHistory.create(newDeposit);

        console.log(transaction);
        }catch(error){
            console.log(error);
        }
})

module.exports = { updateDepositHistory };
