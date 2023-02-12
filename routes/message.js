const router = require("express").Router();
const { protect } = require("../middlewares/authenticateToken");

// controllers
const { sendMessage, getChatMessages } = require("../controllers/message");

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getChatMessages);

module.exports = router;
