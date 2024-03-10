const userIdGeneratorService = async() => {
    const length = 28;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let userId = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      userId += charset.charAt(Math.floor(Math.random() * n));
    }
    return userId;
  }

module.exports = userIdGeneratorService