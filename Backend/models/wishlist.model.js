import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  foodid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "food",
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
}, {
  timestamps: true // optional: tracks added time
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
