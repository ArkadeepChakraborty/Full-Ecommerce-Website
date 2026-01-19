import express from "express";
import isAuthenticated from "../middlewares/isauthenticated.js";
import { buyFood, getOrderedFoods, getApplicants, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, buyFood);
router.route("/get").get(isAuthenticated, getOrderedFoods);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
 

export default router;
