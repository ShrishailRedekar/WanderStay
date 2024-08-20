const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Beach",
      "Cottage",
      "Cities",
      "Mountains",
      "Castles",
      "Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Boats",
      "Van",
      "Tower",
      "Other",
    ],
  },
});

// post mongoose middleware - Delete listing with it's reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
