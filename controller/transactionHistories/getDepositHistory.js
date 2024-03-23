const DepositHistory = require("../../model/transactionHistoryModels/DepositHistory");

const getDepositHistory = ( async (req, res) => {

    console.log("get deposit history");
    try{
        const data = req.body;
        let user_id = (data.user.uid)
        const current_user_transaction_history = DepositHistory.find({user_id});
        res.status(200).json(current_user_transaction_history);
    }catch(error){
        console.log(error);
    }})

    module.exports = { getDepositHistory };
