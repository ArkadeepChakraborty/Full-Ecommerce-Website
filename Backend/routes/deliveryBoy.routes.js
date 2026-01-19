import express from "express";
import { register, login, logout, updateProfile, updatePhoto, deleteById, deleteByName, sendOtp, verifyOtp, resetPassword, getAllDeliveryBoys, getDeliveryBoyById, getDeliveryBoyByName, updateStatus, getAvailableDeliveryBoys, deleteByIdAdmin } from "../controllers/deliveryBoy.controller.js";
import isAuthenticatedAdmin from "../middlewares/isAuthenticatedAdmin.js";
import isAuthenticatedDeliveryBoy from "../middlewares/isauthenticatedDeliveryBoy.js";
import { singleUpload } from "../middlewares/multerDeliveryBoy.js";

const router = express.Router();

// Public Routes
router.post("/login", login);
router.post("/forgetpassword/send-otp", sendOtp);
router.post("/forgetpassword/verify-otp", verifyOtp);
router.post("/forgetpassword/reset", resetPassword);

// Authenticated Delivery Boy Routes
router.put("/updateprofile", isAuthenticatedDeliveryBoy, updateProfile);
router.put("/updatephoto", isAuthenticatedDeliveryBoy, singleUpload, updatePhoto);
router.get("/me", isAuthenticatedDeliveryBoy, getDeliveryBoyById); // Get own info
router.get("/logout", isAuthenticatedDeliveryBoy, logout);
router.delete("/delete/:id", isAuthenticatedDeliveryBoy, deleteById);

// Admin Routes
router.post("/register", isAuthenticatedAdmin, register);
router.get("/all", isAuthenticatedAdmin, getAllDeliveryBoys);
router.get("/avaiable/all", isAuthenticatedAdmin, getAvailableDeliveryBoys);
router.get("/byname/:name", isAuthenticatedAdmin, getDeliveryBoyByName);
router.put("/updatestatus/:name", isAuthenticatedAdmin, updateStatus);
router.delete("/delete", isAuthenticatedAdmin, deleteByName);
router.delete("/admin/delete/:id", isAuthenticatedAdmin, deleteByIdAdmin);



export default router;
