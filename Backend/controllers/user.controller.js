import { User } from "../models/user.model.js";
import { food_Counter } from "../models/food_Counter.model.js";
import { food } from "../models/food.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Otp } from "../models/otpSchema.model.js"; // Import the OTP model (assumed to be created)
import bcrypt from "bcryptjs"; // Use bcrypt if you store hashed OTPs
// import streamifier from 'streamifier';

// In-memory store for OTPs (email -> { otp, expiresAt })
const otpStore = new Map();

export const welcome = async (req, res) => {
    return res.status(400).json({
        message: 'User Page',
        success: false,
    })
}

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // console.log(fullname)
         
        if (!fullname || !email || !phoneNumber || !password || !role ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        // const file = req.file;
        // if (!file) {
        //     return res.status(400).json({
        //         message: "Please provide Profile Photo",
        //         success: false
        //     })
        // }
        // const fileUri = getDataUri(file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role: role
        });
        
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        //console.log(100, user)

        return res.status(200).cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
//update profile backend
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber } = req.body;

        // Handle uploaded file (photo)
        const file = req.file;

        let cloudResponse;
        if (file) {
            // If a file is provided, upload it to Cloudinary
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            });

            // streamifier.createReadStream().pipe();
        }    

        
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Update profile data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        // if (bio) user.profile.bio = bio;

        // Update photos only if a file was uploaded
        if (cloudResponse) {
            user.profile.profilePhoto = cloudResponse.secure_url; // save the Cloudinary URL
            user.profile.profilePhotoOriginalName = file.originalname; // Save the original file name
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            // role: user.role,
            // profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        // Build query
        const query = {
            $or: [
                { fullname: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
            ]
        };

        // If keyword is numeric, also search phoneNumber
        if (!isNaN(keyword) && keyword.trim() !== "") {
            query.$or.push({ phoneNumber: Number(keyword) });
        }

        const users = await User.find(query, "-password").sort({ createdAt: -1 });

        if (!users.length) {
            return res.status(404).json({
                message: "Users not found.",
                success: false
            });
        }

        return res.status(200).json({
            users,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving users.",
            success: false
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const userId = req.id
        //console.log(232, userId)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get user by name
export const getUserByName = async (req, res) => {
    try {
        const nameQuery = req.params.name;
        const users = await User.find({ fullname: { $regex: nameQuery, $options: "i" } }); // Case-insensitive search
        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "No users found with the provided name.",
                success: false
            });
        }
        return res.status(200).json({
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


export const getUserByNameAdmin = async (req, res) => {
    try {
        const nameQuery = req.params.name;
        const users = await User.find({ fullname: { $regex: nameQuery, $options: "i" } }); // Case-insensitive search
        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "No users found with the provided name.",
                success: false
            });
        }
        return res.status(200).json({
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};



// Utility function to generate OTP
// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const otp = generateOtp();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        otpStore.set(email, { otp, expiresAt });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Your OTP for Password Reset",
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "OTP sent to email.",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to send OTP", success: false });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = otpStore.get(email);

        if (!otpRecord || otpRecord.otp != otp || Date.now() > otpRecord.expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        otpStore.delete(email); // Clear OTP after success

        return res.status(200).json({ message: "OTP verified", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "OTP verification failed", success: false });
    }
};

// Reset Password after OTP verified
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Password reset failed", success: false });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const userId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the Food_Counter by Food_Counter id
        const Userf = await User.findOne({_id:userId});
        if(!Userf){
            return res.status(404).json({
                message:"User not found.",
                success:false
            })
        };

        // update the status
        Userf.status = status.toLowerCase();
        await Userf.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

export const updateUserImage = async (req, res) => {
    try {
        const {image} = req.body;
        const userId = req.id;
        //console.log(459, userId)
        if(!image){
            return res.status(400).json({
                message:'image is required',
                success:false
            })
        };

        // find the Food_Counter by Food_Counter id
        const Userf = await User.findOne({_id:userId});
        if(!Userf){
            return res.status(404).json({
                message:"User not found.",
                success:false
            })
        };

        // update the status
        Userf.profile.profilePhoto = image
        await Userf.save();

        return res.status(200).json({
            message:"Image updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}


export const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Optional: Prevent users from deleting their own account unless allowed
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: "User deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Function to update the food counter and food statuses
const updateFoodCounterAndFoods = async (userId, status) => {
    try {
        // Find all food counters associated with the food provider
        const foodCounters = await food_Counter.find({ userId });

        // If no food counters are found, return early
        if (!foodCounters.length) return;

        // Update the status of all food counters
        const foodCounterUpdate = { status: status === "Active" ? "Open" : "Closed" };
        await food_Counter.updateMany({ userId }, foodCounterUpdate);

        // Find all foods associated with the food counters and update their status
        const foodUpdate = { status: status === "Active" ? "Available" : "Unavailable" };
        await food.updateMany({ food_counter_id: { $in: foodCounters.map(counter => counter._id) } }, foodUpdate);

    } catch (error) {
        console.error("Error updating food counters and foods: ", error);
        throw new Error("Failed to update food counters and foods.");
    }
};

// Update User Status (Active/Deactive) - Called when a food provider's status is changed
export const updateUserStatus1 = async (req, res) => {
    try {
        const { status } = req.body; // status should be 'Active' or 'Deactive'
        const userId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }

        // Find the user and ensure they exist
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if the user is a food provider
        if (user.role !== "food_provider") {
            return res.status(400).json({
                message: "User is not a food provider.",
                success: false
            });
        }

        // Update the user status (Active or Deactive)
        user.status = status;
        await user.save();

        // Update the food counters and foods based on the new status
        await updateFoodCounterAndFoods(userId, status);

        return res.status(200).json({
            message: "User status updated successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error in updateUserStatus: ", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Controller function (add this in your controller file)

// export const getMe = async (req, res) => {
//     try {
//         const userId = req.user._id; // assuming you have isAuthenticated middleware
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found.",
//                 success: false
//             });
//         }
//         return res.status(200).json({
//             user,
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error.",
//             success: false
//         });
//     }
// };

