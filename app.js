const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash")

const listingRoutes = require("./routes/listingRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //one week milisecond time
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true // prevents cross-sripting attack
  },
};

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next();
})

app.use("/listings", listingRoutes);
app.use("/listings/:id", reviewRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Fount!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.render("error.ejs", { err });
  // res.status(statusCode).send(message)
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
