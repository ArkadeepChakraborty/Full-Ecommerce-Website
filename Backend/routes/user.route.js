import express from "express";
import { login, logout, register, updateProfile, getAllUsers, getUserById, getUserByName, welcome, updateUserStatus, updateUserImage, deleteUserById, sendOtp, verifyOtp, resetPassword, updateUserStatus1, getUserByNameAdmin} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isauthenticated.js";
import isAuthenticatedAdmin from "../middlewares/isAuthenticatedAdmin.js";
import { singleUpload } from "../middlewares/multer.js"; // Corrected import path

const router = express.Router();

// Routes for user operations
router.route("/welcome").get(welcome);
router.route("/register").post(register); // Register new user with profile photo
router.route("/login").post(login); // User login
router.route("/logout").get(logout); // User logout
router.route("/profile/update").patch(isAuthenticated, singleUpload, updateProfile); // Update user profile
router.route("/status/:id").patch(isAuthenticated, updateUserStatus);
router.route("/updateimage").patch(isAuthenticated, updateUserImage);
router.route("/delete/:id").delete(isAuthenticated, deleteUserById);
router.route("/status1/:id").patch(isAuthenticated, updateUserStatus1);

// Admin-only routes
router.route("/admin/users").get(isAuthenticatedAdmin, getAllUsers); // Get all users (admin only)
router.route("/get").get( isAuthenticated, getUserById); // Get user by ID (admin only)
router.route("/user/name/:name").get(isAuthenticated, getUserByName); // Get user by name (admin only)
router.route("/:name").get(isAuthenticatedAdmin, getUserByNameAdmin);

router.route("/otp/send").post(sendOtp);
router.route("/otp/verify").post(verifyOtp);
router.route("/otp/reset-password").post(resetPassword);

export default router;
