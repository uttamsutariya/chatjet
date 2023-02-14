const router = require("express").Router();
const { protect } = require("../middlewares/authenticateToken");

// controllers
const {
	accessChat,
	fetchChat,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
	deleteGroup,
} = require("../controllers/chat");

router.post("/", protect, accessChat);
router.get("/", protect, fetchChat);
router.post("/group", protect, createGroupChat);
router.put("/rename-group", protect, renameGroup);
router.put("/group-add", protect, addToGroup);
router.put("/group-remove", protect, removeFromGroup);
router.delete("/group-delete/:chatId", protect, deleteGroup);

module.exports = router;
