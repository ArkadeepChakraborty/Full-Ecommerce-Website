import { food } from "../models/food.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

// admin post 
export const postfood = async (req, res) => {
    try {
        console.log(9, req.body);
        const { description, name, price, category, food_counter_id } = req.body;
        const userId = req.id;

        // Check for missing required fields
        if (!description || !name || !price || !category || !food_counter_id) {
            return res.status(400).json({
                message: "Something is missing. Please provide all required fields.",
                success: false,
            });
        }

        // Ensure a photo is provided
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Please provide a Food Photo. Photo is required.",
                success: false,
            });
        }

        // Convert the file to a data URI and upload it to Cloudinary
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        // Save the new food item with the status field
        const new_food = await food.create({
            description,
            name,
            price: Number(price),
            category,
            photo: cloudResponse.secure_url,
            food_counter_id: food_counter_id,
            created_by: userId,
            //status: "Available" // ✅ Explicitly set status
        });

        return res.status(201).json({
            message: "New food item added successfully.",
            new_food,
            success: true,
        });
    } catch (error) {
        console.error("Error in postfood:", error);
        return res.status(500).json({
            message: "An error occurred while adding the food item.",
            success: false,
            error: error.message,
        });
    }
};



// user 
export const getAllfoods = async (req, res) => {
    try {
        //search by keyword in searchbar
        const keyword = req.query.keyword || "";
        const query = {
            //multiple things so use or
            $or: [
                { name: { $regex: keyword, $options: "i" } },//case sensitive (upper case or lower case)for i 
                { description: { $regex: keyword, $options: "i" } },
                ...(isNaN(Number(keyword)) ? [] : [{ price: Number(keyword) }])
            ]
        };
        const foods = await food.find(query).populate({
            path: "food_counter_id"
        }).sort({ createdAt: -1 });
        if (!foods) {
            return res.status(404).json({
                message: "Foods not found.",
                success: false
            })
        };
        return res.status(200).json({
            foods,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getfoodById = async (req, res) => {
    try {
        const { id: foodId } = req.params;
        // console.log(95, foodId)
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            return res.status(400).json({
                message: "Invalid food ID format.",
                success: false
            });
        }

        // Fetch food by ID
        const foodItem = await food.findById(foodId).populate({
            path: "applications"
        });

        if (!foodItem) {
            return res.status(404).json({
                message: "Food not found.",
                success: false
            });
        }

        return res.status(200).json({ food: foodItem, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred.", success: false });
    } 
};

// admin how many food is added
export const getAdminfoods = async (req, res) => {
    try {
        const adminId = req.id;
        const foods = await food.find({ created_by: adminId }).populate({
            path:"food_counter_id",
            createdAt:-1 //ascending order 
        });
        if (!foods) {
            return res.status(404).json({
                message: "Foods not found.",
                success: false
            })
        };
        return res.status(200).json({
            foods,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//  admin can update the status 
export const updateAdminStatus = async (req, res) => {
    try {
        const { status } = req.body; // Expect "accepted", "rejected", or other statuses
        const updatedAdmin = await admin.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ message: "Admin status updated successfully", data: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};

// Admin - Delete a food item
export const deleteFood = async (req, res) => {
    try {
        const { id: foodId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            return res.status(400).json({ message: "Invalid food ID format.", success: false });
        }
        const deletedFood = await food.findByIdAndDelete(foodId);
        if (!deletedFood) {
            return res.status(404).json({ message: "Food not found.", success: false });
        }
        res.status(200).json({ message: "Food deleted successfully.", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error deleting food.", error: error.message });
    }
};

export const getFoodByCounterId = async (req, res) => {
    try {
        const { counterId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(counterId)) {
            return res.status(400).json({
                message: "Invalid food counter ID format.",
                success: false
            });
        }

        // Fetch foods by food counter ID
        const foods = await food.find({ food_counter_id: counterId }).populate({
            path: "food_counter_id"
        });

        if (!foods || foods.length === 0) {
            return res.status(404).json({
                message: "Foods not found.",
                success: false
            });
        }

        return res.status(200).json({
            foods,
            success: true
        });
    } catch (error) {
        console.error("Error in getFoodsByFoodCounterId:", error);
        res.status(500).json({
            message: "An error occurred while fetching foods by food counter ID.",
            success: false,
            error: error.message,
        });
    }
};


//Admin get foods by food name
export const getFoodByName = async (req, res) => {
    try {
        const { name } = req.params;

        // Search by food name (case-insensitive)
        const foods = await food.find({ name: new RegExp(name, "i") }).populate({
            path: "food_counter_id"
        });

        if (!foods || foods.length === 0) {
            return res.status(404).json({
                message: "Foods not found.",
                success: false
            });
        }

        return res.status(200).json({
            foods,
            success: true
        });
    } catch (error) {
        console.error("Error in getFoodsByFoodName:", error);
        res.status(500).json({
            message: "An error occurred while fetching foods by food name.",
            success: false,
            error: error.message,
        });
    }
};

export const getFoodByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        // Search by category (case-insensitive)
        //const foods = await food.find({ category: new RegExp(category, "i") }).populate("food_counter_id");

        const foods = await food.find({ category: category}).populate("food_counter_id");

        if (!foods || foods.length === 0) {
            return res.status(404).json({
                message: "Foods not found.",
                success: false
            });
        }

        return res.status(200).json({
            foods,
            success: true
        });
    } catch (error) {
        console.error("Error in getFoodByCategory:", error);
        res.status(500).json({
            message: "An error occurred while fetching foods by category.",
            success: false,
            error: error.message,
        });
    }
};


export const getFoodByCounterCategory = async (req, res) => {
  try {
    const { counterId, category } = req.params;

    const foods = await food.find({
      food_counter_id: counterId,
      category: category  // Case-insensitive match
    }).populate("food_counter_id");

    if (!foods || foods.length === 0) {
      return res.status(404).json({
        message: "No food items found for this counter and category.",
        success: false,
      });
    }

    return res.status(200).json({
      foods,
      success: true,
    });
  } catch (error) {
    console.error("Error in getFoodByCounterCategory:", error);
    return res.status(500).json({
      message: "Failed to fetch food items by counter and category.",
      success: false,
      error: error.message,
    });
  }
};


// Admin - Update a food item by ID
export const updateFoodById = async (req, res) => {
    try {
        const { id: foodId } = req.params;
        const { description, name, price, category, food_counter_id } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            return res.status(400).json({
                message: "Invalid food ID format.",
                success: false
            });
        }

        // Find the food item first
        const existingFood = await food.findById(foodId);
        if (!existingFood) {
            return res.status(404).json({
                message: "Food item not found.",
                success: false
            });
        }

        // If a new file is uploaded, replace the photo
        let photoUrl = existingFood.photo;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            photoUrl = cloudResponse.secure_url;
        }

        // Update the food item
        const updatedFood = await food.findByIdAndUpdate(
            foodId,
            {
                description: description || existingFood.description,
                name: name || existingFood.name,
                price: price ? Number(price) : existingFood.price,
                category: category || existingFood.category,
                photo: photoUrl,
                food_counter_id: food_counter_id || existingFood.food_counter_id
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Food item updated successfully.",
            updatedFood,
            success: true
        });
    } catch (error) {
        console.error("Error in updateFoodById:", error);
        res.status(500).json({
            message: "An error occurred while updating the food item.",
            success: false,
            error: error.message
        });
    }
};

export const updateFoodStatus = async (req, res) => {
  try {
    
    // console.log("Reached updateFoodStatus");
    // console.log(377, "req.params:", req.params);
    // console.log(378, "req.body:", req.body);

    const { id: foodId } = req.params;
    const { status } = req.body;

    if (!["Available", "Unavailable"].includes(status)) {
      console.log("Invalid status value");
      return res.status(400).json({
        message: "Invalid status value. Use 'Available' or 'Unavailable'.",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({
        message: "Invalid food ID format.",
        success: false,
      });
    }

    const updatedFood = await food.findByIdAndUpdate(
      foodId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      console.log("Food item not found");
      return res.status(404).json({
        message: "Food item not found.",
        success: false,
      });
    }

    console.log("Status updated successfully");
    return res.status(200).json({
      message: "Food status updated successfully.",
      updatedFood,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateFoodStatus:", error.stack || error.message);
    return res.status(500).json({
      message: "Failed to update food status.",
      success: false,
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await food.distinct("category");

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
