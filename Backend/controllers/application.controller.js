import { Application } from "../models/application.model.js";
import { food } from "../models/food.model.js";

export const buyFood = async (req, res) => {
    try {
        const userId = req.id;
        const foodId = req.params.id;
        if (!foodId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        const existingApplication = await Application.findOne({ Food: foodId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already ordered these foods",
                success: false
            });
        }

        // check if the jobs exists or not
        const Food = await food.findById(foodId);
        if (!Food) {
            return res.status(404).json({
                message: "Food not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            Food:foodId,
            applicant:userId,
        });

        Food.applications.push(newApplication._id);
        await Food.save();
        return res.status(201).json({
            message:"Food ordered successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getOrderedFoods = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'food',
            options:{sort:{createdAt:-1}}, // sort in ascending order
            populate:{              // nested populate
                path:'food_counter_id',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin wants to see all the applicant
export const getApplicants = async (req,res) => {
    try {
        const foodId = req.params.id;
        const Food = await food.findById(foodId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!Food){
            return res.status(404).json({
                message:'Food not found.',
                success:false
            })
        };
        return res.status(200).json({
            Food, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

