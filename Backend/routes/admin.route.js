import express from "express";
import upload from "../middlewares/multerAdmin.js";
import isAuthenticated from "../middlewares/isAuthenticatedAdmin.js";
import { createAdmin,loginAdmin,logoutAdmin,getAdmins,getAdminByEmail,deleteAdmin, loggedAdmin, updateAdminInfo, updateAdminPhoto, sendAdminOtp, verifyAdminOtp, resetAdminPassword, changeAdminPassword } from "../controllers/admin.controller.js";

const router = express.Router();

// Public
router.post("/admin/register", upload.single("image"), createAdmin);
router.post("/admin/login", loginAdmin);
router.get("/admin/logout", logoutAdmin);

// Protected (admin-only)
router.get("/admin", isAuthenticated, getAdmins); // all admins
router.get("/admin/:id", isAuthenticated, getAdmins); // by ID
router.get("/admin/email/:email", isAuthenticated, getAdminByEmail);
router.delete("/admin/:id", isAuthenticated, deleteAdmin);
router.get("/admin/me", isAuthenticated, loggedAdmin);

// Update TEXT only
router.put("/admin/update/info/:id", isAuthenticated, updateAdminInfo);

// Update PHOTO only
router.put("/admin/update/photo/:id", isAuthenticated, upload.single("image"), updateAdminPhoto);

router.post("/send-otp", sendAdminOtp);
router.post("/verify-otp", verifyAdminOtp);
router.post("/reset-password", resetAdminPassword);
router.post("/change-password", isAuthenticated,changeAdminPassword);

export default router;