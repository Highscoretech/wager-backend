const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const secret = speakeasy.generateSecret({
    name: "Dotplayplay"
})

const twoFactorAuth = async (req, res) => {
    qrcode.toDataURL(secret.otpauth_url, (err, data) => {
        res.json({
            qrcodeLink: data,
            message: "Enabling two factor authentication"
        });
    })

}

module.exports = {twoFactorAuth, secret};

