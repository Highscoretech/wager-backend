const crypto = require('crypto');

const fetchPreviousCrashHistory = (async( req, res)=>{
const dataEl = req.body

const salt = "Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4"
// const crashHash = "6062e0e87b3c3beff3259d59b067da49551c44e6cf33565b38e929c0c21d212c";
let data = [];
let currenthash = []

const getCurrentHash = ((event)=>{
  let seed = crypto
    .createHmac("sha256", salt)
    .update(event.hash, "hex")
    .digest("hex");
  const nBits = 52; // number of most significant bits to use
  // 1. r = 52 most significant bits
  seed = seed.slice(0, nBits / 4);
  const r = parseInt(seed, 16);
  // 2. X = r / 2^52
  let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)
  // 3. X = 99 / (1-X)
  X = 99 / (1 - X);
  // 4. return max(trunc(X), 100)
  const result = Math.floor(X);
  let reso = Math.max(1, result / 100)
  let row = { hash: event.hash, crashpoint: reso};
  currenthash.push(row)

  // const hash = crypto.createHmac("sha256", event).update(dataEl.salt).digest("hex");
  // const hex = hash.substring(0, 8);
  // const int = parseInt(hex, 16);
  // const crashpoint = Math.max(1, (Math.pow(2, 32) / (int + 1)) * (1 - 0.01)).toFixed(3);
  // const rounddown = (Math.floor(crashpoint * 100) / 100).toFixed(2);
  // let row = { hash: event, crashpoint: rounddown};
 
})

function generateHash(seed) {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

function crashPointFromHash(gameHash) {
  let seed = crypto
  .createHmac("sha256", salt)
  .update(gameHash, "hex")
  .digest("hex");
    const nBits = 52; // number of most significant bits to use
    // 1. r = 52 most significant bits
    seed = seed.slice(0, nBits / 4);
    const r = parseInt(seed, 16);
    // 2. X = r / 2^52
    let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)
    // 3. X = 99 / (1-X)
    X = 99 / (1 - X);
    // 4. return max(trunc(X), 100)
    const result = Math.floor(X);
    let reso = Math.max(1, result / 100)
  // const hash = crypto.createHmac("sha256", gameHash).update(dataEl.salt).digest("hex");
  // const hex = hash.substring(0, 8);
  // const int = parseInt(hex, 16);
  // const crashpoint = Math.max(1, (Math.pow(2, 32) / (int + 1)) * (1 - 0.01)).toFixed(3);
  // const rounddown = (Math.floor(crashpoint * 100) / 100).toFixed(2);
  let row = { hash: gameHash, crashpoint: reso};
  data.push(row);
}

function getPreviousGames() {
  const previousGames = [];
  let gameHash = generateHash(dataEl.hash);
  for (let i = 0; i < parseInt(dataEl.number); i++) {
    const gameResult = crashPointFromHash(gameHash);
    previousGames.push({ gameHash, gameResult });
    gameHash = generateHash(gameHash);
  }
  return previousGames;
}


setTimeout(()=>{
res.status(200).json([...currenthash, ...data])
}, 1000)

getPreviousGames()
  getCurrentHash(dataEl)
})


const VerifyDice = (async(req, res)=>{
  const data = req.query
  let server_seed = (data.s)
  let client_seed = (data.c)
  let nonce = (server_seed)
  let maxRange = 100
function generateRandomNumber() {
  const combinedSeed = `${server_seed}-${client_seed}-${nonce}`;
  const hmac = crypto.createHmac('sha256', combinedSeed);
  const hmacHex = hmac.digest('hex');
  const decimalValue = (parseInt(hmacHex , 32) % 10001 / 100)
  const randomValue = (decimalValue % maxRange).toFixed(2);
  let result = { point : randomValue, server_seed:server_seed, client_seed:nonce, nonce }
 res.status(200).json({result})
}
generateRandomNumber()

})

module.exports = { fetchPreviousCrashHistory , VerifyDice}