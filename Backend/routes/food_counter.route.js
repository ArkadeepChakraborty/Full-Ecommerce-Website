import express from "express";
import isAuthenticated from "../middlewares/isauthenticated.js";
import {getFoodcounter,getFoodCounterById,registerfoodcounter,updateFoodCounter,updateAdminFoodCounterStatus,deleteFoodCounter, getAllFoodCounters} from "../controllers/food_counter.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post( isAuthenticated, singleUpload, registerfoodcounter);
router.route("/get").get(isAuthenticated, getFoodcounter);
router.route("/all").get( getAllFoodCounters); // public or admin access
router.route("/get/:id").get(isAuthenticated, getFoodCounterById);
router.route("/update/:id").put(isAuthenticated,  singleUpload, updateFoodCounter);
//router.route("/status/:id").patch(isAuthenticated, updateAdminFoodCounterStatus);
router.route("/delete/:id").delete(isAuthenticated, deleteFoodCounter);

export default router;
