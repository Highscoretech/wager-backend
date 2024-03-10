const speakeasy = require("speakeasy");
const {secret} = require("./twoFactorAuth")


const {ascii} = secret;

const twoFactorAuthVerify = async (req, res) => {
    const {data} = req.body;
    const verify = speakeasy.totp.verify({
        secret: `${ascii}` ,//ascii
        encoding: "ascii",
        token: data
    })
    
    res.json({
        isVerified: verify,
        message: verify ? "Two factor Authentication enabled" : "Code not correct"
    });
}

module.exports = {twoFactorAuthVerify}

