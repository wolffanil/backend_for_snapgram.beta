const express = require("express");
const {
  signup,
  login,
  logout,
  isLogged,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", signup);

router.post("/login", login);

router.get("/logout", logout);

router.get("/check", isLogged);

module.exports = router;
