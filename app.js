if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
// User Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// require Routes
const listingRoutes = require("./routes/listingRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const usersRoute = require("./routes/usersRoute.js");

const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //Interval (in seconds) between session updates.
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //one week milisecond time
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevents cross-sripting attack
  },
};

app.use(session(sessionOption));
app.use(flash());

// User Authentication
app.use(passport.initialize());
app.use(passport.session());
//use static authenticate method of model in localStrytegy
//by default added by passport-local-mongoose to perform Login/signup
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); //serialize users into the session (user related info store into session)
passport.deserializeUser(User.deserializeUser()); //deserialize users into the session (user related info unstore/remove from session)

// flash message
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// restructuring listing and review to seperate folder
app.use("/listings", listingRoutes);
app.use("/listings/:id", reviewRoutes);
app.use("/", usersRoute);

// if route not exist
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Fount!"));
});

// error message
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.render("error.ejs", { err });
  // res.status(statusCode).send(message)
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
