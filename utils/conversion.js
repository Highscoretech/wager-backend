//Coversion of Either USDT > PPL or PPD to PPL
//USDT = 1$, PPD = 1$, PPL = 0.1
const conversion = (value) => {
    return parseInt(value) / 0.1
}

console.log(conversion(1))
module.exports = {
    conversion
}