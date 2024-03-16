const express = require("express");
const router = express.Router();
const { handlePublicChat } = require("../socket/ably")

router.post("/public-chat", handlePublicChat)

module.exports = router;