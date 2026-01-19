import { DeliveryBoy } from "../models/deliveryBoy.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import { Order } from "../models/order.model.js";
import { Otp } from "../models/otpSchema.model.js";

// In-memory store for OTPs
const otpStore = new Map();

// Register
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;
    if (!fullname || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existing = await DeliveryBoy.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists", success: false });
    }

    const hashed = await bcrypt.hash(password, 10);
    const deliveryBoy = await DeliveryBoy.create({
      fullname, email, phoneNumber, password: hashed
    });

    res.status(201).json({ message: "Registered successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const deliveryBoy = await DeliveryBoy.findOne({ email });

    if (!deliveryBoy || !(await bcrypt.compare(password, deliveryBoy.password))) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ deliveryBoyId: deliveryBoy._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }).json({
      message: `Welcome back ${deliveryBoy.fullname}`,
      deliveryBoy,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Logout
export const logout = async (req, res) => {
  res.cookie("token", "", { maxAge: 0 }).json({
    message: "Logged out successfully",
    success: true,
  });
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, status } = req.body; // ✅ include status

    const deliveryBoy = await DeliveryBoy.findById(req.id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Not found", success: false });
    }

    if (fullname) deliveryBoy.fullname = fullname;
    if (email) deliveryBoy.email = email;
    if (phoneNumber) deliveryBoy.phoneNumber = phoneNumber;
    if (status) deliveryBoy.status = status;  // ✅ update status

    await deliveryBoy.save();

    res.json({ message: "Profile updated", success: true, deliveryBoy });
  } catch (err) {
    console.log("Update profile error:", err);
    res.status(500).json({ message: "Internal error", success: false });
  }
};


// Update Photo
export const updatePhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded", success: false });

    const fileUri = getDataUri(file);
    const upload = await cloudinary.uploader.upload(fileUri.content);
    const deliveryBoy = await DeliveryBoy.findById(req.id);

    deliveryBoy.profilePhoto = upload.secure_url;
    await deliveryBoy.save();

    res.json({ message: "Photo updated", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed", success: false });
  }
};

// Delete by ID
export const deleteById = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findByIdAndDelete(req.params.id);
    if (!deliveryBoy) return res.status(404).json({ message: "Not found", success: false });

    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal error", success: false });
  }
};

export const deleteByIdAdmin = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findByIdAndDelete(req.params.id);
    if (!deliveryBoy) return res.status(404).json({ message: "Not found", success: false });

    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal error", success: false });
  }
};

// Delete by Name
export const deleteByName = async (req, res) => {
  try {
    const { fullname } = req.body;

    if (!fullname) {
      return res.status(400).json({ message: "Name is required", success: false });
    }
    const trimmedName = fullname.trim();
    const result = await DeliveryBoy.deleteMany({
      fullname: { $regex: `^${trimmedName}$`, $options: "i" },
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No matching delivery boy found", success: false });
    }

    res.json({
      message: `Deleted ${result.deletedCount} delivery boy(s) named '${trimmedName}'`,
      success: true,
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Internal error", success: false });
  }
};

// Forget Password - Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const deliveryBoy = await DeliveryBoy.findOne({ email });
    if (!deliveryBoy) return res.status(404).json({ message: "Not found", success: false });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "OTP for Password Reset",
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    res.json({ message: "OTP sent", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending OTP", success: false });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record || record.otp != otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP", success: false });
  }

  otpStore.delete(email);
  res.json({ message: "OTP verified", success: true });
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const deliveryBoy = await DeliveryBoy.findOne({ email });
    if (!deliveryBoy) return res.status(404).json({ message: "User not found", success: false });

    deliveryBoy.password = await bcrypt.hash(newPassword, 10);
    await deliveryBoy.save();

    res.json({ message: "Password reset", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error resetting password", success: false });
  }
};

// Get All
export const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, deliveryBoys });
  } catch (error) {
    console.error("Error fetching delivery boys:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get by ID
export const getDeliveryBoyById = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.id); 
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found", success: false });
    }
    res.status(200).json({ deliveryBoy, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal error", success: false });
  }
};

// Get by Name
export const getDeliveryBoyByName = async (req, res) => {
  try {
    const name = req.params.name;
    const deliveryBoys = await DeliveryBoy.find({ fullname: { $regex: name, $options: "i" } });
    res.json({ deliveryBoys, success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal error", success: false });
  }
};

// Update Status
// export const updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const { name } = req.params;

//     const deliveryBoy = await DeliveryBoy.findOne({ fullname: name });

//     if (!deliveryBoy) {
//       return res.status(404).json({ message: "Delivery boy not found", success: false });
//     }

//     deliveryBoy.status = status;
//     await deliveryBoy.save();

//     res.json({ message: "Status updated", success: true });
//   } catch (err) {
//     console.error("Status update error:", err);
//     res.status(500).json({ message: "Internal error", success: false });
//   }
// };

/**
 * Update availability of delivery boy
 */
// export const updateStatus = async (req, res) => {
//   try {
//     const { name } = req.params;
//     const { status } = req.body; // Available | Unavailable

//     const deliveryBoy = await DeliveryBoy.findOne({ fullname: name });

//     if (!deliveryBoy) {
//       return res.status(404).json({ success: false, message: "Delivery boy not found" });
//     }

//     // ✅ If setting UNAVAILABLE
//     if (status === "Unavailable") {
//       deliveryBoy.status = "Unavailable";
//       deliveryBoy.assignStatus = "Not Assigned";
//       await deliveryBoy.save();

//       // 🔁 Find all active orders of this delivery boy
//       const activeOrders = await Order.find({
//         deliveryBoyId: deliveryBoy._id,
//         status: { $in: ["Assigned"] }
//       });

//       for (const order of activeOrders) {
//         // Remove delivery boy from order
//         order.deliveryBoyId = null;
//         order.status = "Pending";
//         await order.save();

//         // Try reassign immediately
//         await tryAssignDeliveryBoy(order._id);
//       }

//       return res.json({
//         success: true,
//         message: "Delivery boy marked unavailable & orders reassigned"
//       });
//     }

//     // ✅ If setting AVAILABLE
//     deliveryBoy.status = "Available";
//     deliveryBoy.assignStatus = "Not Assigned";
//     await deliveryBoy.save();

//     // 🔁 Try to assign pending orders
//     const pendingOrders = await Order.find({ status: "Pending" });

//     for (const order of pendingOrders) {
//       await tryAssignDeliveryBoy(order._id);
//     }

//     res.json({
//       success: true,
//       message: "Delivery boy marked available"
//     });

//   } catch (error) {
//     console.error("Update delivery boy error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// export const getAvailableDeliveryBoys = async (req, res) => {
//   try {
//     const deliveryBoys = await DeliveryBoy.find({ assignStatus: "Not Assigned" });
//     res.status(200).json({ success: true, deliveryBoys });
//   } catch (error) {
//     console.error("Error fetching available delivery boys:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };



export const updateStatus = async (req, res) => {
  try {
    const { name } = req.params;
    const { status } = req.body; // "Available" | "Unavailable"

    const deliveryBoy = await DeliveryBoy.findOne({ fullname : name });
    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: "Delivery boy not found" });
    }

    /* ============================
       IF ADMIN SETS UNAVAILABLE
    ============================ */
    if (status === "Unavailable") {
      deliveryBoy.status = "Unavailable";
      deliveryBoy.assignStatus = "Not Assigned";
      await deliveryBoy.save();

      // Find active orders of this delivery boy
      const activeOrders = await Order.find({
        deliveryBoyId: deliveryBoy._id,
        status: "Assigned"
      });

      // Process each order
      for (const order of activeOrders) {
        order.deliveryBoyId = null;
        order.status = "Pending";
        await order.save();

        // 🔁 WAIT & AUTO ASSIGN
        const interval = setInterval(async () => {
          try {
            const freshOrder = await Order.findById(order._id);
            if (!freshOrder || freshOrder.status !== "Pending") {
              clearInterval(interval);
              return;
            }

            const availableBoy = await DeliveryBoy.findOne({
              status: "Available",
              assignStatus: "Not Assigned"
            });

            if (!availableBoy) return; // keep waiting

            freshOrder.deliveryBoyId = availableBoy._id;
            freshOrder.status = "Assigned";
            await freshOrder.save();

            availableBoy.assignStatus = "Assigned";
            await availableBoy.save();

            clearInterval(interval);
          } catch (err) {
            console.error("Auto assign error:", err);
          }
        }, 5000); // checks every 5 sec
      }

      return res.json({
        success: true,
        message: "Delivery boy unavailable, orders reassigned when possible"
      });
    }

    /* ============================
       IF ADMIN SETS AVAILABLE
    ============================ */
    deliveryBoy.status = "Available";
    deliveryBoy.assignStatus = "Not Assigned";
    await deliveryBoy.save();

    // Assign pending orders immediately
    const pendingOrders = await Order.find({ status: "Pending" });

    for (const order of pendingOrders) {
      const freeBoy = await DeliveryBoy.findOne({
        status: "Available",
        assignStatus: "Not Assigned"
      });

      if (!freeBoy) break;

      order.deliveryBoyId = freeBoy._id;
      order.status = "Assigned";
      await order.save();

      freeBoy.assignStatus = "Assigned";
      await freeBoy.save();
    }

    res.json({
      success: true,
      message: "Delivery boy available & pending orders assigned"
    });

  } catch (error) {
    console.error("updateStatus error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getAvailableDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find({ status: "Available" });
    res.status(200).json({ success: true, deliveryBoys });
  } catch (error) {
    console.error("Error fetching available delivery boys:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};