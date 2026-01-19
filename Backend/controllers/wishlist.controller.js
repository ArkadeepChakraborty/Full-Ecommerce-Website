import { Wishlist } from "../models/wishlist.model.js";
import { food } from "../models/food.model.js";

// 1. Add to Wishlist
export const addToWishlist = async (req, res) => {
  const userId = req.id; // from isAuthenticated
  const { foodid } = req.body;

  if (!foodid) {
    return res.status(400).json({ message: "Missing foodid" });
  }

  try {
    // Avoid duplicates
    const exists = await Wishlist.findOne({ userid: userId, foodid });
    if (exists) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    const item = new Wishlist({ foodid, userid: userId });
    await item.save();
    res.status(201).json({ message: "Added to wishlist", data: item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2. Get Wishlist Items with Food Details
export const getWishlist = async (req, res) => {
  const userId = req.id;

  try {
    const wishlist = await Wishlist.find({ userid: userId })
      .populate("foodid", "name photo price status") // <-- include status
      .lean();

    const result = wishlist.map(item => ({
      _id: item._id,
      food: item.foodid ? {
        _id: item.foodid._id,
        name: item.foodid.name,
        image: item.foodid.photo,
        price: item.foodid.price,
        status: item.foodid.status, // <-- include in frontend
      } : null
    }));

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3. Delete Wishlist Item
export const deleteWishlistItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const deleted = await Wishlist.findByIdAndDelete(itemId);
    if (!deleted) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.json({ success: true, message: "Item removed", data: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
