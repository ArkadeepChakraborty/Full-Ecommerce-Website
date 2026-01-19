import express from "express";
import { Order } from '../models/order.model.js'; // Import your Admin model
// import { food } from '../models/food.model.js'; // Import your Admin model
import mongoose from "mongoose";
import { Cart } from '../models/cart.model.js'; // Import your Admin model
import { Otp } from "../models/otpSchema.model.js";
import { DeliveryBoy } from '../models/deliveryBoy.model.js';
import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateInvoice } from '../utils/generateInvoice.js';
import { getNextDeliveryBoyRR, getNextDeliveryBoySmart } from "../utils/roundRobinAssign.js";
import { User } from "../models/user.model.js"; // ✅ REQUIRED


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);  // ✅ Add this
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
  res.send("This is Order Page....!!!");
});

// addOrder (MODIFIED)
// export const addOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, summary, transactionId } = req.body;

//     // 1️⃣ Create new order (Pending by default)
//     const newOrder = new Order({
//       userId,
//       cartItems,
//       summary,
//       transactionId,
//       status: "Pending",
//     });

//     const savedOrder = await newOrder.save();

//     // 2️⃣ Assign delivery boy immediately using Round Robin
//     const deliveryBoy = await getNextDeliveryBoyRR();

//     if (deliveryBoy) {
//       savedOrder.deliveryBoyId = deliveryBoy._id;
//       savedOrder.status = "Assigned";
//       await savedOrder.save();

//       // 3️⃣ Lock delivery boy
//       deliveryBoy.assignStatus = "Assigned";
//       await deliveryBoy.save();

//       // 4️⃣ Generate OTP for delivery confirmation
//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       await Otp.create({ orderId: savedOrder._id, email: userId.email, otp });

//       // 5️⃣ Send OTP email to user
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.GMAIL_USER,
//           pass: process.env.GMAIL_PASS
//         }
//       });

//       await transporter.sendMail({
//         from: `"Food Faction" <${process.env.GMAIL_USER}>`,
//         to: userId.email,
//         subject: "Your OTP for Food Delivery Confirmation",
//         html: `<p>Hello,</p><p>Your OTP for food delivery is: <b>${otp}</b></p>`
//       });

//       // 6️⃣ Clear cart
//       await Cart.deleteMany({ userid: userId });

//       res.status(200).json({
//         success: true,
//         message: "Order placed and delivery boy assigned",
//         data: savedOrder
//       });

//     } else {
//       // No delivery boy available → order stays Pending
//       await Cart.deleteMany({ userid: userId });

//       res.status(200).json({
//         success: true,
//         message: "Order placed, waiting for delivery boy",
//         data: savedOrder
//       });
//     }

//   } catch (error) {
//     console.error("Add Order Error:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// export const addOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, summary, transactionId } = req.body;

//     // ✅ 1. Validate user
//     const user = await User.findById(userId).select("email fullname");
//     if (!user || !user.email) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found or email missing"
//       });
//     }

//     // ✅ 2. Create order
//     const newOrder = new Order({
//       userId,
//       cartItems,
//       summary,
//       transactionId,
//       status: "Pending"
//     });

//     const savedOrder = await newOrder.save();

//     // ✅ 3. Assign delivery boy
//     const deliveryBoy = await getNextDeliveryBoyRR();

//     if (deliveryBoy) {
//       savedOrder.deliveryBoyId = deliveryBoy._id;
//       savedOrder.status = "Assigned";
//       await savedOrder.save();

//       // Lock delivery boy
//       deliveryBoy.assignStatus = "Assigned";
//       await deliveryBoy.save();

//       // ✅ 4. Generate OTP
//       const otp = Math.floor(100000 + Math.random() * 900000).toString();

//       await Otp.create({
//         orderId: savedOrder._id,
//         email: user.email, // ✅ FIXED
//         otp
//       });

//       // ✅ 5. Send OTP Email
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.GMAIL_USER,
//           pass: process.env.GMAIL_PASS
//         }
//       });

//       await transporter.sendMail({
//         from: `"Food Faction" <${process.env.GMAIL_USER}>`,
//         to: user.email,
//         subject: "Your OTP for Food Delivery Confirmation",
//         html: `
//           <p>Hello ${user.fullname},</p>
//           <p>Your OTP for food delivery is <b>${otp}</b></p>
//         `
//       });
//     }

//     // ✅ 6. Clear cart
//     await Cart.deleteMany({ userid: userId });

//     res.status(200).json({
//       success: true,
//       message: "Order placed successfully",
//       data: savedOrder
//     });

//   } catch (error) {
//     console.error("Add Order Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message
//     });
//   }
// };
//final addorder still
// export const addOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, summary, transactionId } = req.body;

//     // 1️⃣ Validate user
//     const user = await User.findById(userId).select("email fullname");
//     if (!user || !user.email) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found or email missing"
//       });
//     }

//     // 2️⃣ Create order
//     const order = await Order.create({
//       userId,
//       cartItems,
//       summary,
//       transactionId,
//       status: "Pending"
//     });

//     // 🔁 ASSIGNMENT LOGIC (IMMEDIATE + WAIT)
//     const tryAssignDeliveryBoy = async () => {
//       const deliveryBoy = await DeliveryBoy.findOne({
//         status: "Available",
//         assignStatus: "Not Assigned"
//       });

//       if (!deliveryBoy) return false;

//       // Assign order
//       order.deliveryBoyId = deliveryBoy._id;
//       order.status = "Assigned";
//       await order.save();

//       deliveryBoy.assignStatus = "Assigned";
//       await deliveryBoy.save();

//       // Generate OTP
//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       await Otp.create({
//         orderId: order._id,
//         email: user.email,
//         otp
//       });

//       // Send OTP email
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.GMAIL_USER,
//           pass: process.env.GMAIL_PASS
//         }
//       });

//       await transporter.sendMail({
//         to: user.email,
//         subject: "Your OTP for Food Delivery",
//         html: `<p>Hello ${user.fullname},</p><p>Your OTP is <b>${otp}</b></p>`
//       });

//       return true;
//     };

//     // 3️⃣ Try immediately
//     const assigned = await tryAssignDeliveryBoy();

//     // 4️⃣ If not assigned → wait in background
//     if (!assigned) {
//       const interval = setInterval(async () => {
//         try {
//           const freshOrder = await Order.findById(order._id);
//           if (!freshOrder || freshOrder.status !== "Pending") {
//             clearInterval(interval);
//             return;
//           }

//           const success = await tryAssignDeliveryBoy();
//           if (success) clearInterval(interval);

//         } catch (err) {
//           console.error("Waiting assign error:", err);
//         }
//       }, 5000); // check every 5 sec
//     }

//     // 5️⃣ Clear cart
//     await Cart.deleteMany({ userid: userId });

//     res.status(200).json({
//       success: true,
//       message: "Order placed successfully",
//       data: order
//     });

//   } catch (error) {
//     console.error("Add Order Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error"
//     });
//   }
// };

// export const addOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, summary, transactionId } = req.body;

//     // 1️⃣ Validate user
//     const user = await User.findById(userId).select("email fullname");
//     if (!user || !user.email) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found or email missing"
//       });
//     }

//     // 2️⃣ Create order
//     const order = await Order.create({
//       userId,
//       cartItems,
//       summary,
//       transactionId,
//       status: "Pending"
//     });

//     // ✅ 3️⃣ GENERATE OTP ONLY ONCE
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     await Otp.create({
//       orderId: order._id,
//       email: user.email,
//       otp
//     });

//     // ✅ Send OTP email ONCE
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS
//       }
//     });

//     await transporter.sendMail({
//       to: user.email,
//       subject: "Your OTP for Food Delivery",
//       html: `<p>Hello ${user.fullname},</p><p>Your OTP is <b>${otp}</b></p>`
//     });

//     // 🔁 ASSIGN / REASSIGN DELIVERY BOY (NO OTP HERE)
//     const assignDeliveryBoy = async () => {
//       const deliveryBoy = await DeliveryBoy.findOne({
//         status: "Available",
//         assignStatus: "Not Assigned"
//       });

//       if (!deliveryBoy) return false;

//       order.deliveryBoyId = deliveryBoy._id;
//       order.status = "Assigned";
//       await order.save();

//       deliveryBoy.assignStatus = "Assigned";
//       await deliveryBoy.save();

//       return true;
//     };

//     // 4️⃣ Initial assign
//     await assignDeliveryBoy();

//     // 5️⃣ Monitor delivery boy availability & reassign if needed
//     const interval = setInterval(async () => {
//       try {
//         const freshOrder = await Order.findById(order._id);
//         if (!freshOrder) {
//           clearInterval(interval);
//           return;
//         }

//         // Stop monitoring after delivery or cancel
//         if (["Delivered", "Canceled"].includes(freshOrder.status)) {
//           clearInterval(interval);
//           return;
//         }

//         // If delivery boy becomes unavailable
//         if (freshOrder.deliveryBoyId) {
//           const currentDeliveryBoy = await DeliveryBoy.findById(
//             freshOrder.deliveryBoyId
//           );

//           if (
//             !currentDeliveryBoy ||
//             currentDeliveryBoy.status === "Unavailable"
//           ) {
//             if (currentDeliveryBoy) {
//               currentDeliveryBoy.assignStatus = "Not Assigned";
//               await currentDeliveryBoy.save();
//             }

//             freshOrder.deliveryBoyId = null;
//             freshOrder.status = "Pending";
//             await freshOrder.save();
//           }
//         }

//         // Reassign if pending
//         if (freshOrder.status === "Pending") {
//           await assignDeliveryBoy();
//         }

//       } catch (err) {
//         console.error("Auto reassignment error:", err);
//       }
//     }, 10000);

//     // 6️⃣ Clear cart
//     await Cart.deleteMany({ userid: userId });

//     res.status(200).json({
//       success: true,
//       message: "Order placed successfully",
//       data: order
//     });

//   } catch (error) {
//     console.error("Add Order Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error"
//     });
//   }
// };


// export const addOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, summary, transactionId } = req.body;

//     // 1️⃣ Validate user
//     const user = await User.findById(userId).select("email fullname");
//     if (!user || !user.email) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found or email missing"
//       });
//     }

//     // 2️⃣ Create order
//     const order = await Order.create({
//       userId,
//       cartItems,
//       summary,
//       transactionId,
//       status: "Pending"
//     });

//     // 3️⃣ Generate OTP only once
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     await Otp.create({
//       orderId: order._id,
//       email: user.email,
//       otp
//     });

//     // 4️⃣ Send OTP email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS
//       }
//     });

//     await transporter.sendMail({
//       to: user.email,
//       subject: "Your OTP for Food Delivery",
//       html: `<p>Hello ${user.fullname},</p><p>Your OTP is <b>${otp}</b></p>`
//     });

//     // 5️⃣ Assign delivery boy function
//     const assignDeliveryBoy = async () => {
//       const deliveryBoy = await DeliveryBoy.findOne({
//         status: "Available",
//         assignStatus: "Not Assigned"
//       });

//       if (!deliveryBoy) return false;

//       order.deliveryBoyId = deliveryBoy._id;
//       order.status = "Assigned";
//       await order.save();

//       deliveryBoy.assignStatus = "Assigned";
//       await deliveryBoy.save();

//       return true;
//     };

//     // 6️⃣ Initial assign
//     await assignDeliveryBoy();

//     // 7️⃣ Monitor delivery boy availability & reassign if needed
//     const interval = setInterval(async () => {
//       try {
//         const freshOrder = await Order.findById(order._id);
//         if (!freshOrder) {
//           clearInterval(interval);
//           return;
//         }

//         // Stop monitoring if delivered or canceled
//         if (["Delivered", "Canceled"].includes(freshOrder.status)) {
//           clearInterval(interval);
//           return;
//         }

//         // If delivery boy becomes unavailable
//         if (freshOrder.deliveryBoyId) {
//           const currentDeliveryBoy = await DeliveryBoy.findById(freshOrder.deliveryBoyId);

//           if (!currentDeliveryBoy || currentDeliveryBoy.status === "Unavailable") {
//             // Release old delivery boy
//             if (currentDeliveryBoy) {
//               currentDeliveryBoy.assignStatus = "Not Assigned";
//               await currentDeliveryBoy.save();
//             }

//             // Remove delivery boy from order
//             freshOrder.deliveryBoyId = null;

//             // Attempt reassignment
//             const reassigned = await assignDeliveryBoy();

//             // If no delivery boy available, set status to Pending
//             if (!reassigned) {
//               freshOrder.status = "Pending";
//               await freshOrder.save();
//             }
//           }
//         }

//         // Reassign if still pending
//         if (freshOrder.status === "Pending" && !freshOrder.deliveryBoyId) {
//           await assignDeliveryBoy();
//         }

//       } catch (err) {
//         console.error("Auto reassignment error:", err);
//       }
//     }, 10000);

//     // 8️⃣ Clear user's cart
//     await Cart.deleteMany({ userid: userId });

//     res.status(200).json({
//       success: true,
//       message: "Order placed successfully",
//       data: order
//     });

//   } catch (error) {
//     console.error("Add Order Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error"
//     });
//   }
// };

// export const addOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, summary, transactionId } = req.body;

//     // 1️⃣ Validate user
//     const user = await User.findById(userId).select("email fullname");
//     if (!user || !user.email) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found or email missing",
//       });
//     }

//     // 2️⃣ Create order
//     const order = await Order.create({
//       userId,
//       cartItems,
//       summary,
//       transactionId,
//       status: "Pending",
//     });

//     // 3️⃣ Generate OTP only once
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     await Otp.create({
//       orderId: order._id,
//       email: user.email,
//       otp,
//     });

//     // 4️⃣ Send OTP email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       to: user.email,
//       subject: "Your OTP for Food Delivery",
//       html: `<p>Hello ${user.fullname},</p><p>Your OTP is <b>${otp}</b></p>`,
//     });

//     // 5️⃣ Assign delivery boy function (fixed)
//     const assignDeliveryBoy = async (orderToUpdate) => {
//       const deliveryBoy = await DeliveryBoy.findOne({
//         status: "Available",
//         assignStatus: "Not Assigned",
//       });

//       if (!deliveryBoy) return false;

//       // ✅ Set status to Assigned whenever a delivery boy is assigned
//       orderToUpdate.deliveryBoyId = deliveryBoy._id;
//       orderToUpdate.status = "Assigned";
//       await orderToUpdate.save();

//       deliveryBoy.assignStatus = "Assigned";
//       await deliveryBoy.save();

//       return true;
//     };

//     // 6️⃣ Initial assign
//     await assignDeliveryBoy(order);

//     // 7️⃣ Monitor delivery boy availability & reassign if needed
//     const interval = setInterval(async () => {
//       try {
//         const freshOrder = await Order.findById(order._id);
//         if (!freshOrder) {
//           clearInterval(interval);
//           return;
//         }

//         // Stop monitoring if delivered or canceled
//         if (["Delivered", "Canceled"].includes(freshOrder.status)) {
//           clearInterval(interval);
//           return;
//         }

//         // If delivery boy becomes unavailable
//         if (freshOrder.deliveryBoyId) {
//           const currentDeliveryBoy = await DeliveryBoy.findById(
//             freshOrder.deliveryBoyId
//           );

//           if (!currentDeliveryBoy || currentDeliveryBoy.status === "Unavailable") {
//             // Release old delivery boy
//             if (currentDeliveryBoy) {
//               currentDeliveryBoy.assignStatus = "Not Assigned";
//               await currentDeliveryBoy.save();
//             }

//             // Remove delivery boy from order
//             freshOrder.deliveryBoyId = null;

//             // Attempt reassignment
//             const reassigned = await assignDeliveryBoy(freshOrder);

//             // If no delivery boy available, set status to Pending
//             if (!reassigned) {
//               freshOrder.status = "Pending";
//               await freshOrder.save();
//             }
//           }
//         }

//         // Reassign if still pending and no delivery boy
//         if (freshOrder.status === "Pending" && !freshOrder.deliveryBoyId) {
//           await assignDeliveryBoy(freshOrder);
//         }
//       } catch (err) {
//         console.error("Auto reassignment error:", err);
//       }
//     }, 10000); // checks every 10 seconds

//     // 8️⃣ Clear user's cart
//     await Cart.deleteMany({ userid: userId });

//     res.status(200).json({
//       success: true,
//       message: "Order placed successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("Add Order Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

export const addOrder = async (req, res) => {
  try {
    const { userId, cartItems, summary, transactionId } = req.body;

    // 1️⃣ Validate user
    const user = await User.findById(userId).select("email fullname");
    if (!user || !user.email) {
      return res.status(400).json({
        success: false,
        message: "User not found or email missing",
      });
    }

    // 2️⃣ Create order
    const order = await Order.create({
      userId,
      cartItems,
      summary,
      transactionId,
      status: "Pending",
      deliveryBoyId: null,
    });

    // 3️⃣ Assign delivery boy function (OTP sent ONLY here)
    const assignDeliveryBoy = async (orderToUpdate) => {
      const deliveryBoy = await DeliveryBoy.findOne({
        status: "Available",
        assignStatus: "Not Assigned",
      });

      if (!deliveryBoy) return false;

      // Assign delivery boy
      orderToUpdate.deliveryBoyId = deliveryBoy._id;
      orderToUpdate.status = "Assigned";
      await orderToUpdate.save();

      deliveryBoy.assignStatus = "Assigned";
      await deliveryBoy.save();

      // 🔐 Check if OTP already exists
      const existingOtp = await Otp.findOne({
        orderId: orderToUpdate._id,
      });

      if (!existingOtp) {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({
          orderId: orderToUpdate._id,
          email: user.email,
          otp,
        });

        // Send OTP email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        await transporter.sendMail({
          to: user.email,
          subject: "Your OTP for Food Delivery",
          html: `
            <p>Hello ${user.fullname},</p>
            <p>Your OTP is <b>${otp}</b></p>
          `,
        });
      }

      return true;
    };

    // 4️⃣ Initial assignment attempt
    await assignDeliveryBoy(order);

    // 5️⃣ Monitor & reassign delivery boy if needed
    const interval = setInterval(async () => {
      try {
        const freshOrder = await Order.findById(order._id);
        if (!freshOrder) {
          clearInterval(interval);
          return;
        }

        // Stop if delivered or canceled
        if (["Delivered", "Canceled"].includes(freshOrder.status)) {
          clearInterval(interval);
          return;
        }

        // If delivery boy becomes unavailable
        if (freshOrder.deliveryBoyId) {
          const currentDeliveryBoy = await DeliveryBoy.findById(
            freshOrder.deliveryBoyId
          );

          if (
            !currentDeliveryBoy ||
            currentDeliveryBoy.status === "Unavailable"
          ) {
            // Release old delivery boy
            if (currentDeliveryBoy) {
              currentDeliveryBoy.assignStatus = "Not Assigned";
              await currentDeliveryBoy.save();
            }

            freshOrder.deliveryBoyId = null;
            freshOrder.status = "Pending";
            await freshOrder.save();
          }
        }

        // Try reassignment if still pending
        if (freshOrder.status === "Pending" && !freshOrder.deliveryBoyId) {
          await assignDeliveryBoy(freshOrder);
        }
      } catch (err) {
        console.error("Auto reassignment error:", err);
      }
    }, 10000); // every 10 seconds

    // 6️⃣ Clear user's cart
    await Cart.deleteMany({ userid: userId });

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Add Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getAllOrdersByUsers = async (req, res) => {
  try {
    const userId = req.id;

    const orders = await Order.find({ userId }).populate('cartItems.food');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullname email")
      .populate("deliveryBoyId", "fullname")
      .populate("cartItems.food");

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "cartItems.food",
        populate: {
          path: "food_counter_id", // assuming this is the field in food model
          model: "food_Counter"
        }
      });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getOrdersForSupplier = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "cartItems.food",
        populate: {
          path: "food_counter_id", // Nested population
          model: "food_Counter",
          select: "name", // Only get the name field
        }
      })
      .populate("userId", "fullname") // User's full name
      .populate("deliveryBoyId", "fullname"); // Delivery boy’s full name if needed

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching supplier orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};



// GET /order/top-selling
export const getTopSellingItems = async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      // Step 1: Exclude canceled orders
      { $match: { status: { $ne: "Canceled" } } },

      // Step 2: Flatten cartItems
      { $unwind: "$cartItems" },

      // Step 3: Group by food ID and sum quantity
      {
        $group: {
          _id: "$cartItems.food",
          totalSold: { $sum: "$cartItems.quantity" }
        }
      },

      // Step 4: Sort and limit top 2
      { $sort: { totalSold: -1 } },
      { $limit: 2 }
    ]);

    // Step 5: Populate food details
    const populatedItems = await Order.populate(topItems, {
      path: "_id",
      model: "food"
    });

    res.status(200).json({ success: true, data: populatedItems });
  } catch (error) {
    console.error("Error in getTopSellingItems:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const assignDeliveryBoyById = async (req, res) => {
  const session = await mongoose.startSession(); session.startTransaction();

  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }

    // 1️⃣ Get order
    const order = await Order.findById(orderId)
      .populate("userId", "fullname email")
      .session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.deliveryBoyId) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Already assigned" });
    }

    // 2️⃣ Round Robin pick
    const deliveryBoy = await getNextDeliveryBoyRR();

    if (!deliveryBoy) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "No delivery boys available" });
    }

    // 3️⃣ Update order
    order.deliveryBoyId = deliveryBoy._id;
    order.status = "Assigned";
    await order.save({ session });

    // 4️⃣ 🔥 FORCE update delivery boy in DB
    await DeliveryBoy.findByIdAndUpdate(
      { _id: deliveryBoy._id, assignStatus: "Not Assigned" },
      { assignStatus: "Assigned" }
    );

    // 5️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create([{
      orderId,
      email: order.userId.email,
      otp
    }], { session });

    await session.commitTransaction();

    // 6️⃣ Send email AFTER commit
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Food Faction" <${process.env.GMAIL_USER}>`,
      to: order.userId.email,
      subject: "Your OTP for Food Delivery Confirmation",
      html: `
    <p>Hello ${order.userId.fullname},</p>
    <p>Your OTP is <b>${otp}</b></p>
  `
    });

    res.status(200).json({
      success: true,
      message: "Delivery boy assigned (Round Robin)",
      deliveryBoy: {
        id: deliveryBoy._id,
        name: deliveryBoy.fullname
      }
    });
  } catch (error) { await session.abortTransaction(); console.error(error); res.status(500).json({ success: false, message: "Server Error" }); } finally { session.endSession(); }
};

export const getOrdersByDeliveryBoy = async (req, res) => {
  try {
    const deliveryBoyId = req.id; // From auth middleware
    // console.log(240, deliveryBoyId)
    if (deliveryBoyId == undefined) {
      res.status(200).json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.find({ deliveryBoyId })
      .sort({ createdAt: -1 })
      .populate({
        path: "cartItems.food",
        select: "name photo category price food_counter_id",
        populate: {
          path: "food_counter_id",
          model: "food_Counter",
          select: "name"
        }
      })
      .populate("userId", "fullname phoneNumber") // show user details
      .populate("deliveryBoyId", "fullname"); // optional, for display if needed

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in getOrdersByDeliveryBoy:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const cancelOrderByUser = async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "Canceled" },
      { new: true }
    ).populate("userId", "fullname email");

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order canceled successfully by user",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error canceling order by user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// export const verifyOtpAndMarkDelivered = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { otp } = req.body;

//     if (!otp) {
//       return res.status(400).json({ success: false, message: "OTP is required" });
//     }

//     const existingOtp = await Otp.findOne({ orderId }).sort({ createdAt: -1 });

//     if (!existingOtp) {
//       return res.status(404).json({ success: false, message: "OTP not found" });
//     }

//     if (existingOtp.otp !== otp) {
//       return res.status(400).json({ success: false, message: "Incorrect OTP" });
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { status: "Delivered" },
//       { new: true }
//     );

//     // After successful delivery, mark delivery boy as "Not Assigned"
//     if (updatedOrder?.deliveryBoyId) {
//       await DeliveryBoy.findByIdAndUpdate(updatedOrder.deliveryBoyId, {
//         assignStatus: "Not Assigned",
//         status: "Available",
//         $inc: { activeOrders: -1 }
//       });
//     }

//     await Otp.deleteMany({ orderId }); // Clean up OTPs

//     res.status(200).json({
//       success: true,
//       message: "Order marked as delivered",
//       data: updatedOrder
//     });

//   } catch (error) {
//     console.error("Error in verifyOtpAndMarkDelivered:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

export const verifyOtpAndMarkDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    // ✅ 1. Get latest OTP
    const existingOtp = await Otp.findOne({ orderId }).sort({ createdAt: -1 });
    if (!existingOtp) {
      return res.status(404).json({ success: false, message: "OTP not found" });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    // ✅ 2. Fetch order with full population (required for invoice)
    const order = await Order.findById(orderId)
      .populate("userId")
      .populate({
        path: "cartItems.food",
        populate: { path: "food_counter_id", model: "food_Counter" }
      });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 🛑 Prevent duplicate invoice sending
    if (order.invoiceStatus === "Posted") {
      return res.status(400).json({
        success: false,
        message: "Invoice already sent for this order"
      });
    }

    // ✅ 3. Mark order as Delivered
    order.status = "Delivered";
    order.invoiceStatus = "Posted";
    await order.save();

    // ✅ 4. Free delivery boy
    if (order.deliveryBoyId) {
      await DeliveryBoy.findByIdAndUpdate(order.deliveryBoyId, {
        assignStatus: "Not Assigned",
        status: "Available",
        $inc: { activeOrders: -1 }
      });
    }

    // ✅ 5. Generate Invoice PDF
    const invoicesDir = path.join(process.cwd(), "invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const invoiceFilePath = path.join(invoicesDir, `Invoice_${orderId}.pdf`);

    // ⏳ Generate PDF & send email
    generateInvoice(order, invoiceFilePath, async () => {
      try {
        // ✅ 6. Send invoice email
        await sendInvoiceToUser(order, invoiceFilePath);

        // ✅ 7. Cleanup
        fs.unlink(invoiceFilePath, err => {
          if (err) console.error("Invoice delete error:", err);
        });

        await Otp.deleteMany({ orderId });

        res.status(200).json({
          success: true,
          message: "Order delivered & invoice sent successfully"
        });

      } catch (error) {
        console.error("Invoice send error:", error);
        res.status(500).json({
          success: false,
          message: "Delivered but invoice sending failed"
        });
      }
    });

  } catch (error) {
    console.error("Error in verifyOtpAndMarkDelivered:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid order ID format" });
  }

  try {
    const order = await Order.findById(orderId)
      .populate('userId') // Populate user details
      .populate({
        path: 'cartItems.food',
        populate: {
          path: 'food_counter_id',
          model: 'food_Counter',
          select: 'name'
        }
      });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Add delivery location after payment
export const addOrderReceiveLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { receiveLocation } = req.body;
    const userId = req.id;

    if (!receiveLocation) {
      return res.status(400).json({ success: false, message: "Delivery location is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    // Update the order only if it belongs to the user
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, userId },
      { receiveLocation },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you are not authorized"
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery location added successfully",
      data: updatedOrder
    });

  } catch (error) {
    console.error("Error adding delivery location:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getDeliveredFoodCategoryStats = async (req, res) => {
  try {
    // 1️⃣ Group only DELIVERED items by category
    const deliveredStats = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $unwind: "$cartItems" },
      {
        $lookup: {
          from: "foods",
          localField: "cartItems.food",
          foreignField: "_id",
          as: "foodDetails"
        }
      },
      { $unwind: "$foodDetails" },
      {
        $group: {
          _id: "$foodDetails.category",
          totalQuantity: { $sum: "$cartItems.quantity" }
        }
      },
      {
        $project: {
          category: "$_id",
          totalQuantity: 1,
          _id: 0
        }
      }
    ]);

    if (deliveredStats.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // 2️⃣ Calculate total delivered quantity
    const totalDeliveredItems = deliveredStats.reduce(
      (acc, item) => acc + item.totalQuantity,
      0
    );

    // 3️⃣ Separate categories with quantity = 1
    const singleQuantityCategories = deliveredStats.filter(
      (item) => item.totalQuantity === 1
    );
    const otherCategories = deliveredStats.filter(
      (item) => item.totalQuantity > 1
    );

    let finalCategories = [];

    if (singleQuantityCategories.length > 5) {
      // Group all "quantity=1" categories into Others
      const othersTotal = singleQuantityCategories.reduce(
        (acc, item) => acc + item.totalQuantity,
        0
      );

      finalCategories = [
        ...otherCategories,
        { category: "Others", totalQuantity: othersTotal }
      ];
    } else {
      // Keep all categories separately
      finalCategories = [...deliveredStats];
    }

    // 4️⃣ Calculate exact percentages
    let percentages = finalCategories.map(item => ({
      category: item.category,
      totalQuantity: item.totalQuantity,
      exact: (item.totalQuantity / totalDeliveredItems) * 100
    }));

    // 5️⃣ Floor values
    let floored = percentages.map(item => ({
      ...item,
      percentage: Math.floor(item.exact),
      remainder: item.exact - Math.floor(item.exact) // save decimal part
    }));

    // 6️⃣ Distribute remaining percentage points to fix rounding
    let totalFloored = floored.reduce((acc, item) => acc + item.percentage, 0);
    let remainder = 100 - totalFloored;

    // Sort by largest remainder
    floored.sort((a, b) => b.remainder - a.remainder);

    for (let i = 0; i < remainder; i++) {
      floored[i].percentage += 1;
    }

    // 7️⃣ Final clean data
    const formattedData = floored.map(item => ({
      category: item.category,
      percentage: item.percentage,
      totalQuantity: item.totalQuantity
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category stats",
      error: error.message
    });
  }
};


export const getMonthlyTransactions = async (req, res) => {
  try {
    const transactions = await Order.aggregate([
      {
        $match: { status: "Delivered" }  // ✅ Only Delivered orders
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month number
          totalAmount: { $sum: "$summary.totalAmount" }, // Sum only delivered amounts
        },
      },
      {
        $project: {
          month: "$_id",
          totalAmount: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Fill missing months with 0
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedData = months.map((m, i) => {
      const found = transactions.find(t => t.month === i + 1);
      return {
        month: m,
        totalAmount: found ? found.totalAmount : 0,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching monthly transactions",
      error: error.message,
    });
  }
};

export const getOrderByAdminId = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid order ID format" });
  }

  try {
    const order = await Order.findById(orderId)
      .populate('userId', 'fullname email phoneNumber') // Only essential fields
      .populate({
        path: 'cartItems.food',
        model: 'food',
        populate: {
          path: 'food_counter_id',
          model: 'food_Counter',
          select: 'name' // Only take name from food counter
        }
      });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Send invoice email
const sendInvoiceToUser = async (order, invoicePath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Food Faction" <${process.env.GMAIL_USER}>`,
    to: order.userId.email,
    subject: `Invoice for Order #${order._id}`,
    text: `Please find attached the invoice for your order #${order._id}.`,
    attachments: [
      {
        filename: `Invoice_${order._id}.pdf`,
        path: invoicePath
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

// Controller to generate and send invoice
export const postInvoice = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch order with deep population
    const order = await Order.findById(orderId)
      .populate('userId')
      .populate({
        path: 'cartItems.food',
        populate: { path: 'food_counter_id', model: 'food_Counter' }
      });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure invoices directory exists
    const invoicesDir = path.join(process.cwd(), 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const invoiceFilePath = path.join(invoicesDir, `Invoice_${orderId}.pdf`);

    // Generate invoice PDF
    generateInvoice(order, invoiceFilePath, async () => {
      try {
        await sendInvoiceToUser(order, invoiceFilePath);

        // Update order
        order.invoiceStatus = "Posted";
        order.status = "Delivered";
        await order.save();

        // Delete invoice file to save space
        fs.unlink(invoiceFilePath, err => {
          if (err) console.error('Error deleting invoice file:', err);
        });

        res.status(200).json({
          success: true,
          message: 'Invoice posted and sent to user successfully'
        });
      } catch (error) {
        console.error('Error sending invoice:', error);
        res.status(500).json({ success: false, message: 'Error sending invoice' });
      }
    });

  } catch (error) {
    console.error('Error posting invoice:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// NEW API: Returns only name, image, price of ALL top selling food items
export const getTopSellingFoodBasic = async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      { $match: { status: { $ne: "Canceled" } } }, // exclude canceled orders
      { $unwind: "$cartItems" }, // flatten cart items
      {
        $group: {
          _id: "$cartItems.food",
          totalSold: { $sum: "$cartItems.quantity" }
        }
      },
      { $sort: { totalSold: -1 } } // sort top selling first
    ]);

    // Populate only required food details
    const populated = await Order.populate(topItems, {
      path: "_id",
      model: "food",
      select: "name price photo"  // Use `photo` instead of `image`
    });

    // Format clean response
    const formatted = populated.map(item => ({
      id: item._id._id,
      name: item._id.name,
      image: item._id.photo, // correct field from your food model
      price: item._id.price
    }));

    res.status(200).json({ success: true, data: formatted });

  } catch (error) {
    console.error("Error in getTopSellingFoodBasic:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// export const offerOrderToDeliveryBoy = async (req, res) => {
//   const { orderId } = req.params;

//   const order = await Order.findById(orderId);
//   if (!order) return res.status(404).json({ message: "Order not found" });

//   const deliveryBoy = await getNextDeliveryBoySmart();
//   if (!deliveryBoy)
//     return res.status(400).json({ message: "No delivery boys available" });

//   order.deliveryBoyId = deliveryBoy._id;
//   order.status = "Offered";
//   await order.save();

//   deliveryBoy.assignStatus = "Assigned";
//   await deliveryBoy.save();

//   res.json({
//     success: true,
//     message: "Order offered to delivery boy",
//     deliveryBoy: deliveryBoy.fullname
//   });
// };

// export const acceptOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const deliveryBoyId = req.id; // from isAuthenticatedDeliveryBoy

//     const order = await Order.findById(orderId)
//       .populate("userId", "fullname email");

//     if (!order)
//       return res.status(404).json({ message: "Order not found" });

//     if (order.status !== "Offered")
//       return res.status(400).json({ message: "Order not available for accept" });

//     if (order.deliveryBoyId.toString() !== deliveryBoyId)
//       return res.status(403).json({ message: "Not authorized" });

//     // ✅ Assign order
//     order.status = "Assigned";
//     await order.save();

//     // ✅ Update delivery boy
//     await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {
//       assignStatus: "Assigned",
//       $inc: { activeOrders: 1 }
//     });

//     // ✅ Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await Otp.create({
//       orderId,
//       email: ordersder.userId.email,
//       otp
//     });

//     // ✅ Send OTP email (same logic you already have)
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS
//       }
//     });

//     await transporter.sendMail({
//       to: order.userId.email,
//       subject: "Delivery OTP",
//       html: `<p>Your OTP is <b>${otp}</b></p>`
//     });

//     res.json({
//       success: true,
//       message: "Order accepted successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// export const rejectOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const deliveryBoyId = req.id;

//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (order.deliveryBoyId.toString() !== deliveryBoyId)
//       return res.status(403).json({ message: "Unauthorized" });

//     // Free current delivery boy
//     await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {
//       assignStatus: "Not Assigned"
//     });

//     // Offer to next delivery boy
//     const nextDeliveryBoy = await getNextDeliveryBoySmart();

//     if (!nextDeliveryBoy) {
//       order.deliveryBoyId = null;
//       order.status = "Pending";
//       await order.save();
//       return res.json({ message: "No delivery boy available" });
//     }

//     order.deliveryBoyId = nextDeliveryBoy._id;
//     order.status = "Offered";
//     await order.save();

//     nextDeliveryBoy.assignStatus = "Assigned";
//     await nextDeliveryBoy.save();

//     res.json({
//       success: true,
//       message: "Order reassigned to next delivery boy"
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

