import express from "express";
import isAuthenticated from "../middlewares/isauthenticated.js";
import {addToWishlist,getWishlist,deleteWishlistItem } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/add", isAuthenticated, addToWishlist);
router.get("/get", isAuthenticated, getWishlist);
router.delete("/delete/:itemId", isAuthenticated, deleteWishlistItem);

export default router;
