import express from "express";
import { 
  initiatePayment, 
  verifyPayment, 
  getPaymentDetails 
} from "../controllers/payment.controller.js";
import isAuthenticated from "../middlewares/isauthenticated.js"; // Middleware for authentication

const router = express.Router();

// Routes for payment operations
router.route("/initiate").post(isAuthenticated, initiatePayment); // Initiate a payment
router.route("/verify").post(isAuthenticated, verifyPayment); // Verify a payment
router.route("/:paymentId").get(isAuthenticated, getPaymentDetails); // Get payment details by ID

export default router;
