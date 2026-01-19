import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    role:{
        type:String,
        enum:['food_provider','user'],
        required:true
    },
    profile:{
        bio:{type:String,
            default:""
        },
        food_provider_id:{type:mongoose.Schema.Types.ObjectId, ref:'food_Counter'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
    status:{
        type: String,
        enum: ["Active", "Deactive"], // Allows only these values
            default: "Active",
    }
},{timestamps:true});
export const User = mongoose.model('User', userSchema);