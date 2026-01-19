import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import foodCounterRoute from "./routes/food_counter.route.js";
import foodRoute from "./routes/food.route.js";
import applicationRoute from "./routes/application.route.js";
import adminRoute from "./routes/admin.route.js";
import paymentGetway from "./routes/payment.route.js";
import CartRoute from "./routes/cart.route.js";
import OrderRoute from "./routes/order.route.js";
import reviewRoute from "./routes/review.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import aboutAdmin  from "./routes/aboutAdmin.route.js";
import deliveryBoy  from "./routes/deliveryBoy.routes.js";

dotenv.config({});

const app = express();

// app.use(cors({
//     origin: "*"
// }));

app.use(express.json()); //body-parser
app.use(express.urlencoded({extended:true})); //body-parser
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
];
// const corsOptions = {
//     origin:'http://localhost:5173',  //allow requests from this origin
//     credentials:true //allow cookies
// }

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
//2
 
const PORT = process.env.PORT || 3000;

//Get all Method
// app.get('/', (req, res) => {
//     res.send('Welcome in Food Project')
// })

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/foodCounter", foodCounterRoute);
app.use("/api/v1/food", foodRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/adminRoute", adminRoute);
app.use("/api/v1/paymentGetway",paymentGetway);
app.use("/api/v1/cart",CartRoute);
app.use("/api/v1/order", OrderRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/aboutAdmin", aboutAdmin);
app.use("/api/v1/deliveryBoy", deliveryBoy);




app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})