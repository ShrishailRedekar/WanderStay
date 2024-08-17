const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
//file upload
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

// Index Route
router.get("/", wrapAsync(listingController.index));

// category Route
router.get("/category", wrapAsync(listingController.filterListings));

// New Route Form
router.get("/new", isLoggedIn, listingController.newForm);

// Create listing Route
router.post(
  "/",
  isLoggedIn, //middleware - check user logged in or not
  upload.single("listing[image]"),
  validateListing, //middleware
  wrapAsync(listingController.createListing)
); 

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Edit form Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
