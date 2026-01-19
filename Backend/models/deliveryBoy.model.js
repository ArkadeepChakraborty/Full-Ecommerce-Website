import mongoose from "mongoose";

const delivaryBoySchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    profilePhoto:{
            type:String,
            default:"" 
    },
    status: {
        type: String,
        enum: ["Available", "Unavailable"],
        default: "Available",
    },
    assignStatus: {
        type: String,
        enum: ["Assigned", "Not Assigned"],
        default: "Not Assigned",
    },

},{timestamps:true});
export const DeliveryBoy = mongoose.model('DeliveryBoy', delivaryBoySchema);