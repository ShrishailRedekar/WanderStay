const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

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

module.exports = router;
