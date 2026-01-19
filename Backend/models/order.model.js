import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryBoyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryBoy',
  },
  cartItems: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      totalPrice: {
        type: Number,
        required: true
      }
    }
  ],
  transactionId: {
    type: String,
    required: true
  },
  summary: {
    totalItems: {
      type: Number,
      required: true
    },
    totalQuantity: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  receiveLocation: {
    type: String
  },
  // status: {
  //       type: String,
  //       enum: ["Pending", "Delivered","Canceled"],
  //       default: "Pending",
  //   },
  // status: {
  //   type: String,
  //   enum: ["Pending", "Offered", "Assigned", "Delivered", "Canceled"],
  //   default: "Pending",
  // },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "Delivered", "Canceled"],
    default: "Pending",
  },

  invoiceStatus: {
    type: String,
    enum: ["Not Posted", "Posted"],
    default: "Not Posted"
  }

}, { timestamps: true });

export const Order = mongoose.model("ProductOrder", orderSchema);
