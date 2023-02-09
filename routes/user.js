const router = require("express").Router();

// controllers
const { registerUser, logIn } = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", logIn);

module.exports = router;
