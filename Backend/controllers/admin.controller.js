import { admin } from "../models/admin.model.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import streamifier from "streamifier";

// Hash password
const hashPassword = async (password) => await bcrypt.hash(password, 10);

// Compare password
const comparePassword = async (password, hash) => await bcrypt.compare(password, hash);

// ✅ Create Admin
export const createAdmin = async (req, res) => {
  try {
    const { email, password, name, phone_number } = req.body;

    const existing = await admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await hashPassword(password);

    const imageUrl = req.file?.path || "";

    const newAdmin = await admin.create({
      email,
      password: hashed,
      name: name || "",
      phone_number: phone_number || "",
      image: imageUrl,
    });

    res.status(201).json({ message: "Admin created", data: newAdmin });
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err.message });
  }
};

// ✅ Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await admin.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "admin" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,       // ❗ MUST be false on localhost
      sameSite: "lax",     // ❗ Required for Vite
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        image: user.image,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};


// ✅ Logout Admin
export const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,   // true only in production with https
    sameSite: "lax",
    path: "/"
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


// ✅ Get all or specific admin
export const getAdmins = async (req, res) => {
  try {
    if (req.params.id) {
      const adminOne = await admin.findById(req.params.id);
      if (!adminOne) return res.status(404).json({ message: "Admin not found" });
      return res.json(adminOne);
    }

    const allAdmins = await admin.find();
    res.json(allAdmins);
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
};

// ✅ Get admin by email
export const getAdminByEmail = async (req, res) => {
  try {
    const adminUser = await admin.findOne({ email: req.params.email });
    if (!adminUser) return res.status(404).json({ message: "Admin not found" });
    res.json(adminUser);
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
};

// ✅ Update Admin
export const updateAdminInfo = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
    };

    const updatedAdmin = await admin.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAdmin)
      return res.status(404).json({ success: false, message: "Admin not found" });

    res.status(200).json({
      success: true,
      message: "Admin info updated successfully",
      data: updatedAdmin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// export const updateAdminPhoto = async (req, res) => {
//   try {
//     const adminId = req.params.id;

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     // Upload to Cloudinary
//     const upload = await cloudinary.uploader.upload_stream(
//       { folder: "admin_profile" },
//       async (error, result) => {
//         if (error)
//           return res.status(500).json({ success: false, message: "Cloudinary error", error });

//         // Update DB
//         const updatedAdmin = await Admin.findByIdAndUpdate(
//           adminId,
//           { image: result.secure_url },
//           { new: true }
//         );

//         return res.status(200).json({
//           success: true,
//           message: "Profile photo updated successfully",
//           data: updatedAdmin,
//         });
//       }
//     );

//     // Stream file buffer
//     upload.end(req.file.buffer);

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Image upload failed",
//       error: error.message,
//     });
//   }
// };

// ✅ Delete Admin

// export const updateAdminPhoto = async (req, res) => {
//   try {
//     const adminId = req.params.id;

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const streamUpload = (buffer) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "admin_profile" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );
//         streamifier.createReadStream(buffer).pipe(stream);
//       });
//     };

//     const result = await streamUpload(req.file.buffer);

//     const updatedAdmin = await admin.findByIdAndUpdate(
//       adminId,
//       { image: result.secure_url },
//       { new: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Profile photo updated successfully",
//       data: updatedAdmin,
//     });
//   } catch (error) {
//     console.error("Image upload failed:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Image upload failed",
//       error: error.message,
//     });
//   }

// };

export const updateAdminPhoto = async (req, res) => {
  try {
    const adminId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // req.file.path contains the Cloudinary URL
    const updatedAdmin = await admin.findByIdAndUpdate(
      adminId,
      { image: req.file.path },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};


export const deleteAdmin = async (req, res) => {
  try {
    const deleted = await admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
};

export const loggedAdmin = async (req, res) => {
  try {
    const adminOne = await admin.findById(req.adminId);

    if (!adminOne) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin: adminOne,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// utils/otpStore.js
export const otpStore = new Map();


// ✅ Send OTP to Admin Email
export const sendAdminOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const adminUser = await admin.findOne({ email });
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

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
      subject: "Admin Password Reset OTP",
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
  }
};


// ✅ Verify Admin OTP
export const verifyAdminOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore.get(email);

  if (
    !record ||
    record.otp != otp ||
    Date.now() > record.expiresAt
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
};

// ✅ Reset Admin Password
export const resetAdminPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const adminUser = await admin.findOne({ email });
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const record = otpStore.get(email);
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required",
      });
    }

    adminUser.password = await bcrypt.hash(newPassword, 10);
    await adminUser.save();

    otpStore.delete(email);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};




export const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.adminId; // from auth middleware
    const { currentPassword, newPassword } = req.body;

    const adminUser = await admin.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      adminUser.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash & update password
    adminUser.password = await bcrypt.hash(newPassword, 10);
    await adminUser.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password update failed",
    });
  }
};
