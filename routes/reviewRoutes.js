const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

//Submit Reviews
router.post(
  "/review",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    // access listing
    let listing = await Listing.findById(req.params.id);
    // create new review
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!")
    res.redirect(`/listings/${listing.id}`);
  })
);

// Delete review Royute
router.delete(
  "/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
