import express from "express";
import isAuthenticated from "../middlewares/isauthenticated.js";
import {home,addCart,getCartByUser,updateCart,deleteCart,userdata,deleteCartItem, updateCartItem} from "../controllers/cart.controller.js";

const router = express.Router();

router.route("/").get(home);
router.route("/post").post(isAuthenticated, addCart); 
router.route("/getCartByUser").get(isAuthenticated, getCartByUser);
router.route("/updateCart/:id").patch(isAuthenticated, updateCart);
router.route("/deleteCart/:id").delete(isAuthenticated, deleteCart);
router.route("/userdata/:userid").get(userdata);
router.route('/item/:itemId').delete(isAuthenticated,deleteCartItem);
router.route('/uitem/:itemId').patch(isAuthenticated,updateCartItem);

export default router;
