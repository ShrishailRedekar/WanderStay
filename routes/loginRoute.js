const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/login", (req, res) => {
  res.render("authentication/loginForm.ejs");
});

//authenticate() - used as route middleware to authenticate requests
//check user alredy registered or not
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wonderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

// Logout Route
router.get("/logout", (req, res, next) => {
  //passport method - delete user from current session
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", " you logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
