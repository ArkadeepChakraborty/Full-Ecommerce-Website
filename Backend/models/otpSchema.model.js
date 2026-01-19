import { mongoose, Schema } from "mongoose";

const otpSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductOrder'
      },
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7200, // Expires in 15 minutes
    },
}, { timestamps: true });

const otpModel = mongoose.model('Otp', otpSchema);
export { otpModel as Otp };
