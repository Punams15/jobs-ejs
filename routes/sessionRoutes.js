const express = require("express");
const passport = require("passport");
const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

const router = express.Router();

// Registration
router.route("/register").get(registerShow).post(registerDo);

// Logon
router.route("/logon").get(logonShow).post(
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sessions/logon",
    failureFlash: true,
  })
);

// Logoff
router.route("/logoff").post(logoff);

module.exports = router;
