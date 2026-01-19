import express from "express";
import isAuthenticated from "../middlewares/isauthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticatedAdmin from "../middlewares/isAuthenticatedAdmin.js";
import isAuthenticatedDeliveryBoy from "../middlewares/isauthenticatedDeliveryBoy.js";
import { addOrder,addOrderReceiveLocation,assignDeliveryBoyById,cancelOrderByUser,getAllOrders,getAllOrdersByUsers,getDeliveredFoodCategoryStats,getMonthlyTransactions,getOrderByAdminId,getOrderById,getOrdersByDeliveryBoy,getOrdersByUser, getOrdersForSupplier, getTopSellingFoodBasic, getTopSellingItems, postInvoice, verifyOtpAndMarkDelivered} from "../controllers/order.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, singleUpload, addOrder); 
router.route("/getOrdersByUser").get(isAuthenticated, getOrdersByUser);
router.route("/getall").get(isAuthenticatedAdmin, getAllOrders);
router.route("/getALLOrdersByUser").get(isAuthenticated, getAllOrdersByUsers);
router.route("/supplier").get(isAuthenticated, getOrdersForSupplier);
router.route('/user/cancel/:orderId').put(isAuthenticated, cancelOrderByUser);
// router.route('/provider/cancel/:orderId').put(isAuthenticated, cancelOrderByProvider);
router.route("/top-selling").get(getTopSellingItems);
router.route("/top-selling-basic").get(getTopSellingFoodBasic);
router.route("/assigndeliveryboy/:orderId").put (isAuthenticatedAdmin, assignDeliveryBoyById);
router.route("/deliveryBoy").get (isAuthenticatedDeliveryBoy, getOrdersByDeliveryBoy);
router.route("/verifyotp/:orderId").post(isAuthenticatedDeliveryBoy, verifyOtpAndMarkDelivered); 
router.route('/:orderId').get (isAuthenticatedDeliveryBoy,getOrderById);
router.route("/food/categorystats").get(isAuthenticatedAdmin, getDeliveredFoodCategoryStats);
router.route("/transactions/monthly").get(isAuthenticatedAdmin, getMonthlyTransactions);
router.route('/admin/:orderId').get (isAuthenticatedAdmin,getOrderByAdminId);
router.route('/postInvoice/:orderId').post(isAuthenticatedAdmin, postInvoice);
router.route("/addLocation/:orderId").patch(isAuthenticated, addOrderReceiveLocation);
// router.post("/offer/:orderId", isAuthenticatedAdmin, offerOrderToDeliveryBoy);
// router.post("/order/accept/:orderId", isAuthenticatedDeliveryBoy, acceptOrder);
// router.post("/order/reject/:orderId", isAuthenticatedDeliveryBoy, rejectOrder);



export default router;
