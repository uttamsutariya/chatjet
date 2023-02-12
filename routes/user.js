const router = require("express").Router();
const { protect } = require("../middlewares/authenticateToken");

// controllers
const { registerUser, logIn, getAllUsers, logout, loadUser } = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", logIn);
router.get("/logout", logout);
router.get("/load", loadUser);
router.get("/", protect, getAllUsers);

module.exports = router;
