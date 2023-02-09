const router = require("express").Router();
const { protect } = require("../middlewares/authenticateToken");

// controllers
const { registerUser, logIn, getAllUsers } = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", logIn);
router.get("/", protect, getAllUsers);

module.exports = router;
