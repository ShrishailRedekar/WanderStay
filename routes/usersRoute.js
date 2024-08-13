const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware");
const passport = require("passport");
const User = require("../models/user.js");

router.get("/signup", (req, res) => {
  res.render("authentication/signupForm.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      //store  user in DB with password
      // "register(user, password, cb)" automatically Checks if username is unique.
      let registerUser = await User.register(newUser, password);
      console.log(registerUser);
      // if user signup then automatically logged in
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wonderlust!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);


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