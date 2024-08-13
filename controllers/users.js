const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("authentication/signupForm.ejs");
};

module.exports.signup = async (req, res) => {
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
};

module.exports.loginForm = (req, res) => {
  res.render("authentication/loginForm.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Wonderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.loginOut = (req, res, next) => {
  //passport method - delete user from current session
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", " you logged out!");
    res.redirect("/listings");
  });
};
