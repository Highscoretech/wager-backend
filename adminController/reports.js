const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const crypto = require('crypto')

const reports = async (req, res) => {
  // try {
  //   const TotalResponse = [
  //     {
  //       users_reports: null,
  //       games_reports: [],
  //       totalPlayerBalance: null
  //     },
  //   ];


  //   // =============== collating the users data ================
  //   let userDatas = []
  //   const data = await helper.getAllUsersId()
  //   data.map(async(_data)=>{
      
  //    })
    
  //   for(const _data of data){
  //     let profile = await helper.get_user_specific_details(_data.user_id,'user_id')

  //     let totalWagerAmount = await helper.getAllUSDTRisked(_data.user_id)
      
  //     let totalWonAmount = await helper.getTotalUSDTWinByUser(_data.user_id)
  //     let user_id = _data.user_id;
  //     let userGGR = totalWagerAmount - totalWonAmount
  //     let {username} = profile[0][0];

  //     const userData = {
  //       username: username,
  //      userID: user_id,
  //      totalWagered: totalWagerAmount,
  //      totalPayout:totalWonAmount,
  //      totalGGR:userGGR,
  //     }
  //     userDatas.push(userData)
  //   }
  //   TotalResponse[0].users_reports = userDatas




  //   // =============== collating the crash games data ================
  //   const _result = await helper.getAllGamesReport("crash_game")
  //   // adding all the bet_amount (totalWager)
  //   let gamTotalWager = 0
  //   let gamTotalPayout = 0
  //   for(const wager of _result){
  //     gamTotalWager += +wager.bet_amount
  //     gamTotalPayout += +wager.cashout
  //   }

  //   let gamTotalGGR = gamTotalWager - gamTotalPayout


  //   TotalResponse[0].games_reports[0] = {no:"1",game:"crash",totalWagered:gamTotalWager,totalPayout:gamTotalPayout,totalGGR:gamTotalGGR}


  //   // =============== collating the dice games data ================
  //   const __result = await helper.getAllGamesReport("dice_game")
  //   // adding all the bet_amount (totalWager)
  //   let diceTotalWager = 0
  //   let diceTotalPayout = 0
  //   for(const wager of __result){
  //     diceTotalWager += +wager.bet_amount
  //     diceTotalPayout += +wager.cashout
  //   }

  //   let diceTotalGGR = diceTotalWager - diceTotalPayout

  //   TotalResponse[0].games_reports[1] = {no:"2",game:"dice",totalWagered:diceTotalWager,totalPayout:diceTotalPayout,totalGGR:diceTotalGGR}


  //   return res.status(200).json({
  //     status:true,
  //     data:TotalResponse
  //   })

  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({
  //     status: false,
  //     message: "Something completely went wrong"
  //   });
  // }
};

module.exports = { reports };