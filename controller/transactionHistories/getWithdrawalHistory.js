const WithdrawalHistory = require("../../model/transactionHistoryModels/WithdrawalHistory");

const getWithdrawalHistory = ( async (req, res) => {
    try{
        const data = req.body;
        let user_id = (data.user.uid)
        const current_user_transaction_history = WithdrawalHistory.find({user_id});
        res.status(200).json(current_user_transaction_history);
    }catch(error){
        console.log(error);
    }})

    module.exports = { getWithdrawalHistory };
