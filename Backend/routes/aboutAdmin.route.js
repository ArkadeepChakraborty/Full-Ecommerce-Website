import express from "express";
import isAuthenticated from "../middlewares/isAuthenticatedAdmin.js";
import { fieldUpload } from "../middlewares/multer.js";
import {
  saveAboutContent,
  getAboutContent,
  updateAboutContent,
} from "../controllers/aboutAdmin.controller.js";

const router = express.Router();

router.post("/about", isAuthenticated, fieldUpload, saveAboutContent);
router.get("/get", getAboutContent);
router.put("/update/:id", isAuthenticated, fieldUpload, updateAboutContent);

export default router;