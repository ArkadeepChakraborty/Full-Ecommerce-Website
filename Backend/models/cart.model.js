import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    foodid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true,
    },
    userid: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    quantity: {
        required: true,
        type: Number
    },
   
});

export const Cart  = mongoose.model("Cart", cartSchema);