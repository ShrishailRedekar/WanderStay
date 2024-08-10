// middleware for check user logged in or not
module.exports.isLoggedIn = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  // passport method- check user logged in or not
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be logged in to create listing!");
    res.redirect("/login");
  }
  next()
};

// passport automatically reset the session after logged in so store the redirectUrl in locals res variable
module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next()
}