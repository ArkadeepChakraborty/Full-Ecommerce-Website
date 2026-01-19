import { mongoose, Schema } from "mongoose";

const paymentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: 'USD',
    },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'SUCCESS', 'FAILED'], // Allowed values for status
        default: 'PENDING',
    },
    transactionId: {
        type: String,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    relatedEntities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application', // Replace with any related model
        }
    ]
}, { timestamps: true });

const paymentModel = mongoose.model('Payment', paymentSchema);

export { paymentModel as Payment };
