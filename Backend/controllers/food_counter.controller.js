import { food_Counter } from "../models/food_Counter.model.js";
import { food } from "../models/food.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const registerfoodcounter = async (req, res) => {
    try {
        const { foodcounterName, description, opening_hours, location } = req.body;

        if (!foodcounterName) {
            return res.status(400).json({
                message: "Food Counter name is required.",
                success: false
            });
        }

        let logoUrl = "";
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudinaryResult = await cloudinary.uploader.upload(fileUri.content);
            logoUrl = cloudinaryResult.secure_url;
        }

        const existingCounter = await food_Counter.findOne({ name: foodcounterName });
        if (existingCounter) {
            return res.status(400).json({
                message: "You can't register same Food_Counter.",
                success: false
            });
        }

        const parsedOpeningHours = JSON.parse(opening_hours);

        const newCounter = await food_Counter.create({
            name: foodcounterName,
            description,
            opening_hours: {
                start: parsedOpeningHours.start,
                end: parsedOpeningHours.end
            },
            userId: req.id,
            logo: logoUrl,
            location: location,
            status: "Open" // ✅ default status
        });

        return res.status(201).json({
            message: "Food Counter registered successfully.",
            food_Counter: newCounter,
            success: true
        });

    } catch (error) {
        console.error("Error registering food counter:", error);
        return res.status(500).json({
            message: "Server error while registering food counter.",
            success: false
        });
    }
};


export const getFoodcounter = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const food_counters = await food_Counter.find({ userId });
        if (!food_counters) {
            return res.status(404).json({
                message: "Food counters not found.",
                success: false
            })
        }
        return res.status(200).json({
            food_counters,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getFoodCounterById = async (req, res) => {
    try {
        const foodCounterId = req.params.id;
        const foodCounter = await food_Counter.findById(foodCounterId);
        if (!foodCounter) {
            return res.status(404).json({
                message: "Food Counter not found.",
                success: false
            })
        }
        return res.status(200).json({
            foodCounter,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


// export const updateFoodCounter = async (req, res) => {
//     try {
//         let { name, description, opening_hours, status } = req.body;

//         if (typeof opening_hours === "string") {
//             opening_hours = JSON.parse(opening_hours);
//         }

//         if (!name || !description || !opening_hours) {
//             return res.status(400).json({
//                 message: "Something is missing",
//                 success: false
//             });
//         }

//         const file = req.file;
//         let updateData = {};

//         if (!file) {
//             updateData = { name, description, opening_hours };
//         } else {
//             const fileUri = getDataUri(file);
//             const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//             const logo = cloudResponse.secure_url;
//             updateData = { name, description, opening_hours, logo };
//         }

//         // Only allow valid statuses if provided
//         if (status && ["Open", "Closed"].includes(status)) {
//             updateData.status = status;
//         }

//         const foodCounter = await food_Counter.findByIdAndUpdate(req.params.id, updateData, { new: true });

//         if (!foodCounter) {
//             return res.status(404).json({
//                 message: "Food Counter not found.",
//                 success: false
//             });
//         }

//         return res.status(200).json({
//             message: "Food Counter information updated.",
//             success: true
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Server error",
//             success: false
//         });
//     }
// };



export const updateFoodCounter = async (req, res) => {
  try {
    let { name, description, opening_hours, status } = req.body;

    // Parse opening_hours if it's a string
    if (typeof opening_hours === "string") {
      opening_hours = JSON.parse(opening_hours);
    }

    if (!name || !description || !opening_hours) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const file = req.file;
    let updateData = {};

    if (!file) {
      updateData = { name, description, opening_hours };
    } else {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      const logo = cloudResponse.secure_url;
      updateData = { name, description, opening_hours, logo };
    }

    // Add status if valid
    let newFoodStatus = null;
    if (status && ["Open", "Closed"].includes(status)) {
      updateData.status = status;
      newFoodStatus = status === "Closed" ? "Unavailable" : "Available";
    }

    // Update the food counter
    const foodCounter = await food_Counter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!foodCounter) {
      return res.status(404).json({
        message: "Food Counter not found.",
        success: false,
      });
    }

    // ✅ Sync all food items' status if counter status changed
    if (newFoodStatus) {
      await food.updateMany(
        { food_counter_id: req.params.id },
        { status: newFoodStatus }
      );
    }

    return res.status(200).json({
      message: "Food Counter information updated.",
      success: true,
    });

  } catch (error) {
    console.log("Error in updateFoodCounter:", error.message);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


// Update admin status
export const updateAdminFoodCounterStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const foodCounterId = req.params.id;

        if (!status || !["Open", "Closed"].includes(status)) {
            return res.status(400).json({
                message: "Valid status (Open or Closed) is required.",
                success: false
            });
        }

        const Food_Counter = await food_Counter.findById(foodCounterId);
        if (!Food_Counter) {
            return res.status(404).json({
                message: "Food_Counter not found.",
                success: false
            });
        }

        Food_Counter.status = status;
        await Food_Counter.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Delete food counter
export const deleteFoodCounter = async (req, res) => {
    try {
        const { id: foodCounterId } = req.params;
        const deletedFoodCounter = await food_Counter.findByIdAndDelete(foodCounterId);
        if (!deletedFoodCounter) {
            return res.status(404).json({
                message: "Food Counter not found.",
                success: false
            });
        }
        return res.status(200).json({
            message: "Food Counter deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting food counter.",
            success: false
        });
    }
};

export const getAllFoodCounters = async (req, res) => {
    try {
        const foodCounters = await food_Counter.find();
        if (!foodCounters || foodCounters.length === 0) {
            return res.status(404).json({
                message: "No food counters found.",
                success: false
            });
        }

        return res.status(200).json({
            foodCounters,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch food counters.",
            success: false
        });
    }
};
