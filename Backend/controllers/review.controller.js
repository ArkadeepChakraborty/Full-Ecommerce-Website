import Review from "../models/review.model.js";

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { name, rating, thoughts } = req.body;
        const userId = req.id; // from isAuthenticated middleware

        if (!name || !rating || !thoughts) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const newReview = await Review.create({
            userId,
            name,
            rating,
            thoughts
        });

        return res.status(201).json({
            message: "Review submitted successfully",
            review: newReview,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Optionally: Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate("userId", "fullname email");
        return res.status(200).json({
            reviews,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch reviews",
            success: false
        });
    }
};

// Get latest 10 reviews, excluding last N (where N = total - 10)
export const getRecentReviews = async (req, res) => {
  try {
    const totalCount = await Review.countDocuments();

    if (totalCount <= 10) {
      // Return latest 10 or less if total < 10
      const latestReviews = await Review.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("userId", "fullname email");

      return res.status(200).json({ reviews: latestReviews, success: true });
    }

    const skip = totalCount - 10; // Skip the oldest (total - 10)

    const recentReviews = await Review.find()
      .sort({ createdAt: 1 }) // ascending to skip earliest
      .skip(skip)
      .sort({ createdAt: -1 }) // then reverse to return latest
      .limit(10)
      .populate("userId", "fullname email");

    return res.status(200).json({ reviews: recentReviews, success: true });

  } catch (error) {
    console.error("Error in getRecentReviews:", error);
    return res.status(500).json({ message: "Failed to fetch recent reviews", success: false });
  }
};
