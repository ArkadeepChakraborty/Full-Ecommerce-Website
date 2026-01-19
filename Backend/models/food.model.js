import { mongoose, Schema } from "mongoose";

const food = new Schema({
  food_counter_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "food_Counter",
  },
  description: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
  photo: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  status: {
    type: String,
    enum: ["Available", "Unavailable"],
    default: "Available",
  },
}, { timestamps: true });

const foodModel = mongoose.model("food", food);
export { foodModel as food };
