const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware");
const passport = require("passport");

const userController = require("../controllers/users.js");

//signup Form
router.get("/signup", userController.signupForm);

router.post("/signup", wrapAsync(userController.signup));


//login Form
router.get("/login", userController.loginForm);

//authenticate() - used as route middleware to authenticate requests
//check user alredy registered or not
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Logout Route
router.get("/logout", userController.loginOut);

module.exports = router;