import express from "express";
import isAuthenticated from "../middlewares/isauthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import {postfood,getAllfoods,getAdminfoods,getfoodById,updateAdminStatus,deleteFood,getFoodByCounterId,getFoodByCategory, updateFoodById, getFoodByCounterCategory, updateFoodStatus, getAllCategories, getFoodByName} from "../controllers/food.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, singleUpload, postfood); 
router.route("/get").get(getAllfoods); 
router.route("/getAdminfoods").get( getAdminfoods); 
router.route("/get/:id").get(getfoodById); 
//router.route("/updateAdminStatus/:id").put(isAuthenticated, updateAdminStatus);
router.route("/delete/:id").delete(isAuthenticated, deleteFood);
router.route("/counter/:counterId").get(getFoodByCounterId);
router.route("/category/:counterId/:category").get(getFoodByCounterCategory);
router.route("/search/:name").get(getFoodByName);
router.route("/category/:category").get(getFoodByCategory);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateFoodById);
router.route("/updatestatus/:id").put(isAuthenticated, updateFoodStatus);
router.route("/categories").get (getAllCategories);



export default router;
