import express from "express";
import { createReview, getAllReviews, getRecentReviews } from "../controllers/review.controller.js";
import isAuthenticated from "../middlewares/isauthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createReview);
router.get("/all", getAllReviews); // Optional: if you want to fetch all reviews
router.get("/recent", getRecentReviews);

export default router;