const WithdrawalHistory = require("../../model/transactionHistoryModels/WithdrawalHistory");


 const updateWithdrawalHistory = ( async (current_user_id , describtion, order_amount, previous_balance, current_balance, status) => {
    try{
        const newTransaction = {
            current_user_id,
            describtion,
            order_amount,
            previous_balance,
            current_balance,
            status
        }
        const transaction = await WithdrawalHistory.create(newTransaction);
        console.log(transaction);
        }catch(error){
            console.log(error);
        }
})

module.exports = { updateWithdrawalHistory };
