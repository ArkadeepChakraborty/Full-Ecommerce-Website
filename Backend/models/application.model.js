import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'food',
        required:true
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['Pending', 'Delivered', 'Canceled'],
        default:'pending'
    }
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);