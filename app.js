const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const listingRoutes = require("./routes/listingRoutes.js")
const reviewRoutes = require("./routes/reviewRoutes.js")

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


app.use("/listings", listingRoutes)
app.use("/listings/:id", reviewRoutes)


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
