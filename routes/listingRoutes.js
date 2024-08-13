const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route Form
router.get("/new", isLoggedIn, listingController.newForm);

// Create listing Route
router.post(
  "/",
  isLoggedIn, //middleware - check user logged in or not
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
  wrapAsync(listingController.editListing)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
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
