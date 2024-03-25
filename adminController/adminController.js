
// const jwt = require("jsonwebtoken");
// const { connection } = require("../database/index");
// const { db } = require("../database/firebase");
// var SECRET = `highscoretechBringwexsingthebestamoung23498hx93`;
// const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require("uuid");
// const { createAdminSchema, loginAdminSchema } = require("../utils/validation");
// const { format } = require("date-fns");
// const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

// const createToken = (_id) => {
//   return jwt.sign({ _id }, SECRET, { expiresIn: "3d" });
// };

// const doesUsernameExist = (username, callback) => {
//   connection.query(
//     "SELECT COUNT(*) AS count FROM admins WHERE username = ?",
//     [username],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         return callback(err);
//       }
//       const count = results[0].count;
//       const usernameExists = count > 0;
//       callback(null, usernameExists);
//     }
//   );
// };

// const updateActivityLog = (
//   _id,
//   logDateTime,
//   action,
//   device,
//   location,
//   ipAddress,
//   callback
// ) => {
//   connection.query(
//     `
//     UPDATE admins
//     SET activityLog = JSON_ARRAY_APPEND(
//       COALESCE(activityLog, JSON_ARRAY()),
//       '$',
//       JSON_OBJECT(
//         'date_time', ?,
//         'action', ?,
//         'device', ?,
//         'location', ?,
//         'ip_address', ?
//       )
//     )
//     WHERE _id = ?;
//   `,
//     [logDateTime, action, device, location, ipAddress, _id],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         return callback(err);
//       }
//       callback(null, results);
//     }
//   );
// };

// exports.createAdmin = async (req, res) => {
//   try {
//     const { error } = createAdminSchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ status: false, error: error.details[0].message });
//     }

//     const { username, password, pin } = req.body;
//     const _id = uuidv4();
//     const adminData = {
//       _id,
//       username,
//       password,
//       pin,
//     };

//     doesUsernameExist(adminData.username, async (err, exists) => {
//       if (err) {
//         console.error("Error checking username existence:", err);
//         return res
//           .status(500)
//           .json({ status: false, error: "Error checking username existence" });
//       }

//       if (exists) {
//         return res.status(409).json({
//           status: false,
//           error: `Username "${adminData.username}" already exists in the database.`,
//         });
//       }

//       const hashedPassword = await bcrypt.hash(adminData.password, 10);

//       const token = createToken(adminData._id);

//       connection.query(
//         "INSERT INTO admins (_id, username, password, pin) VALUES (?, ?, ?, ?)",
//         [adminData._id, adminData.username, hashedPassword, adminData.pin],
//         (err, results) => {
//           if (err) {
//             console.error(err);
//             return res.status(400).json({
//               status: false,
//               error: "Error creating admin",
//             });
//           }
//           res.status(201).json({
//             status: true,
//             message: "Admin created successfully",
//             token,
//           });
//         }
//       );
//     });
//   } catch (error) {
//     console.error("Error in createAdmin:", error);
//     res.status(500).json({
//       status: false,
//       error: "Internal Server Error",
//     });
//   }
// };

// exports.loginAdmin = async (req, res) => {
//   try {
//     const { error } = loginAdminSchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ status: false, error: error.details[0].message });
//     }
//     const { username, password } = req.body;

//     connection.query(
//       "SELECT * FROM admins WHERE username = ?",
//       [username],
//       async (err, results) => {
//         if (err) {
//           console.error(err);
//           return res
//             .status(500)
//             .json({ status: false, error: "Error logging in" });
//         }

//         if (results.length === 0) {
//           return res
//             .status(401)
//             .json({ status: false, error: "Invalid username or password" });
//         }

//         const admin = results[0];

//         const passwordMatch = await bcrypt.compare(password, admin.password);

//         if (passwordMatch) {
//           const ipAddress =
//           "102.89.40.126" ||
//             req.headers["x-forwarded-for"] ||
//             req.connection.remoteAddress ||
//             req.ip;
//           const response = await fetch(
//             `https://ipinfo.io/${ipAddress}?token=698fcb317689ec`
//           );
//           const data = await response.json();
//           const location = data.country;
//           const logDateTime = currentTime;
//           const action = "Log in";
//           const device = req.headers["user-agent"];
//           updateActivityLog(
//             admin._id,
//             logDateTime,
//             action,
//             device,
//             location,
//             ipAddress,
//             async (err, results) => {
//               // console.log(results)
//               if (err) {
//                 console.error("Error updating activity log", err);
//                 return res.status(500).json({
//                   status: false,
//                   error: "Error updating activity log",
//                 });
//               }
//               const token = createToken(admin._id);
//               res.status(200).json({
//                 status: true,
//                 message: "Logged in successfully",
//                 token,
//               });
//             }
//           );
//         } else {
//           res
//             .status(401)
//             .json({ status: false, error: "Invalid username or password" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error in createAdmin:", error);
//     res.status(500).json({
//       status: false,
//       error: "Internal Server Error",
//     });
//   }
// };

// exports.retrieveAdmins = async (req, res) => {
//   try {
//     connection.query("SELECT * FROM admins", (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(400).json({
//           status: false,
//           error: "Error fetching admins",
//         });
//       }
//       const adminsWithParsedActivityLog = results.map((admin) => ({
//         ...admin,
//         activityLog: JSON.parse(admin.activityLog),
//       }));
//       return res.status(200).json({
//         status: true,
//         message: "Admins retrieved successfully",
//         admins: adminsWithParsedActivityLog,
//       });
//     });
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//     return res
//       .status(500)
//       .json({ status: false, error: "Internal Server Error" });
//   }
// };

// exports.getAdmin = async (req, res) => {
//   try {
//     const { adminId } = req.query;

//     connection.query(
//       "SELECT * FROM admins WHERE _id = ?",
//       [adminId],
//       (err, results) => {
//         if (err) {
//           console.error(err);
//           return res.status(400).json({
//             status: false,
//             error: "Error fetching admin by ID",
//           });
//         }

//         if (results.length === 0) {
//           return res.status(404).json({
//             status: false,
//             error: "Admin not found",
//           });
//         }

//         const adminWithParsedActivityLog = {
//           ...results[0],
//           activityLog: JSON.parse(results[0].activityLog),
//         };

//         return res.status(200).json({
//           status: true,
//           message: "Admin retrieved successfully",
//           admin: adminWithParsedActivityLog,
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error fetching admin by ID:", error);
//     return res
//       .status(500)
//       .json({ status: false, error: "Internal Server Error" });
//   }
// };

// exports.updateAdminBasicInfo = async (req, res) => {
//   try {
//     const { username, password, pin, suspend } = req.body;
//     const _id = req.query.adminId;

//     connection.query(
//       "SELECT * FROM admins WHERE _id = ?",
//       [_id],
//       async (err, results) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ status: false, error: "Something went wrong" });
//         }
//         let hashedPassword = results[0].password;
//         if (password) {
//           hashedPassword = await bcrypt.hash(password, 10);
//         }
//         connection.query(
//           "UPDATE admins SET username = ?, password = ?, pin = ?, suspend = ? WHERE _id = ?",
//           [username, hashedPassword, pin, suspend, _id],
//           async (err, results) => {
//             if (err) {
//               console.error(err);
//               return res.status(400).json({
//                 status: false,
//                 error: "Something went wrong",
//               });
//             }
//             return res.status(200).json({
//               status: true,
//               message: "Admin information updated successfully",
//             });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Error updating admin information:", error);
//     res.status(500).json({ status: false, error: "Internal Server Error" });
//   }
// };

// const accessEnum = ["Full Access", "No Access", "View Only"];

// exports.updateAdminAccess = async (req, res) => {
//   try {
//     const _id = req.query.adminId;
//     const {
//       memberListAccess,
//       createMemberAccess,
//       memberProfileAccess,
//       dailyReportAccess,
//       gameReportAccess,
//       ggrReportAccess,
//       depositBonusReportAccess,
//       createAdminAccess,
//     } = req.body;

//     const invalidAccessLevels = [
//       memberListAccess,
//       createMemberAccess,
//       memberProfileAccess,
//       dailyReportAccess,
//       gameReportAccess,
//       ggrReportAccess,
//       depositBonusReportAccess,
//       createAdminAccess,
//     ].filter((access) => !accessEnum.includes(access));

//     if (invalidAccessLevels.length > 0) {
//       return res
//         .status(400)
//         .json({ status: false, error: "Invalid access level(s)" });
//     }
//     connection.query(
//       "SELECT * FROM admins WHERE _id = ?",
//       [_id],
//       async (err, results) => {
//         // console.log(results);
//         if (err) {
//           console.error(err);
//           return res.status(400).json({
//             status: false,
//             error: "Something went wrong",
//           });
//         }
//         if (!results) {
//           return res
//             .status(404)
//             .json({ status: false, error: "Admin not found" });
//         }
//         connection.query(
//           `
//       UPDATE admins
//       SET
//         memberListAccess = ?,
//         createMemberAccess = ?,
//         memberProfileAccess = ?,
//         dailyReportAccess = ?,
//         gameReportAccess = ?,
//         ggrReportAccess = ?,
//         depositBonusReportAccess = ?,
//         createAdminAccess = ?
//       WHERE _id = ?;
//     `,
//           [
//             memberListAccess,
//             createMemberAccess,
//             memberProfileAccess,
//             dailyReportAccess,
//             gameReportAccess,
//             ggrReportAccess,
//             depositBonusReportAccess,
//             createAdminAccess,
//             _id,
//           ],
//           async (err, results) => {
//             // console.log("final ", results);
//             if (err) {
//               console.error(err);
//               return res.status(400).json({
//                 status: false,
//                 error: "Something went wrong",
//               });
//             }
//             return res.status(200).json({
//               status: true,
//               message: "Admin information updated successfully",
//             });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Error updating admin access:", error);
//     return res
//       .status(500)
//       .json({ status: false, error: "Internal Server Error" });
//   }
// };


// // const { connection } = require("../database/index")
// // const { format } = require('date-fns');
// // const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
// // const {Helper} = require('../utils/helperFunction')
// // const helper = new Helper();
// // const crypto = require('crypto')

// // const dashboard = async (req, res) => {
// //   try {
// //     const TotalResponse = [
// //       {
// //         totalDepositedPlayers: null,
// //         totalGGR: null,
// //         totalPlayerBalance: null
// //       },
// //       {
// //         totalWins : null,
// //         totalLoses: null,
// //         totalBets : null,
// //         totalWagered : null,
// //       },
// //       {
// //         totalWageredRanking: null,
// //         totalWinRanking: null,
// //         totalLossRanking:null,
// //         totalWageredRanking: null,
// //         totalBetRanking:null,
// //       }
// //     ];

// //     // show total players that has deposited
// //     const response1 = await helper.get_players_that_used_USDT(); //correct this
    
// //     const data1 = await helper.uniqueArray(response1)

// //     // Update the properties of the objects inside the array
// //     TotalResponse[0].totalDepositedPlayers = data1.length;

// //     if(data1 && data1.length !== 0) {
// //       TotalResponse[0].totalPlayerBalance = await helper.get_total_player_balance(data1)
// //     }else{
// //       TotalResponse[0].totalPlayerBalance = 0
// //     }

    
// //     const response2 = await helper.get_players_that_won_used_USDT();
// //     TotalResponse[1].totalWins = response2.length;

    
// //     const response4 = await helper.get_players_that_used_USDT();
// //     TotalResponse[1].totalBets = response4.length;

// //     const response3 = await helper.get_players_that_loss_used_USDT();
// //     TotalResponse[1].totalLoses = response3.length;

// //     TotalResponse[1].totalWagered = await helper.getTotalUSDTWagered()

// //     const players1 = await helper.get_players_that_used_USDT()
// //     const wageredUsers = await helper.uniqueArray(players1)

// //     const players2 = await helper.get_players_that_won_used_USDT()
// //     const winUsers = await helper.uniqueArray(players2)

// //     const players3 = await helper.get_players_that_loss_used_USDT()
// //     const lossUsers = await helper.uniqueArray(players3)

// //     TotalResponse[0].totalGGR = (await helper.getTotalUSDTWagered()) - (await helper.getTotalUSDTWin())
    


// //     const _response1 = []
// //     const _response2 = []
// //     const _response3 = []
// //     const _response4 = []
    
// //     if(wageredUsers.length !== 0){
// //       for(const user of wageredUsers){
// //         const result = await helper.get_user_specific_details(user,"user_id")

// //         const highest_bet = await helper.getUserHighestBet(result[0][0].user_id)
// //         result[0][0].highest_bet = Number(highest_bet)
// //         _response1.push(result[0][0])
// //       }
// //     }

// //     if(winUsers.length !== 0){
// //       for(const user of winUsers){
// //         const result = await helper.get_user_specific_details(user,"user_id")

// //         const highest_bet = await helper.getUserHighestBetWon(result[0][0].user_id)
// //         result[0][0].highest_bet = Number(highest_bet)
// //         _response2.push(result[0][0])
// //       }
// //     }

// //     if(lossUsers.length !== 0){
// //       for(const user of lossUsers){
// //         const result = await helper.get_user_specific_details(user,"user_id")

// //         const highest_bet = await helper.getUserHighestBetLoss(result[0][0].user_id)
// //         result[0][0].highest_bet = Number(highest_bet)
// //         _response3.push(result[0][0])
// //       }
// //     }


// //     TotalResponse[2].totalWageredRanking = _response1.slice(0, 6) //init the list to just 6
// //     TotalResponse[2].totalWinRanking = _response2.slice(0, 6) //init the list to just 6
// //     TotalResponse[2].totalLossRanking = _response3.slice(0, 6) //init the list to just 6
// //     TotalResponse[2].totalBetRanking = _response1


// //     return res.status(200).json({
// //       status: true,
// //       message: "Dashboard retrieved successfully",
// //       data: TotalResponse
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     return res.status(500).json({
// //       status: false,
// //       message: "Something completely went wrong"
// //     });
// //   }
// // };

// module.exports = { dashboard };

