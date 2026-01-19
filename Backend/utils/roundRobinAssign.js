import { DeliveryBoy } from "../models/deliveryBoy.model.js";

let lastAssignedIndex = 0;

export const getNextDeliveryBoyRR = async () => {
  const availableDeliveryBoys = await DeliveryBoy.find({
    status: "Available",
    assignStatus: "Not Assigned"
  }).sort({ createdAt: 1 });

  if (availableDeliveryBoys.length === 0) return null;

  const deliveryBoy =
    availableDeliveryBoys[lastAssignedIndex % availableDeliveryBoys.length];

  lastAssignedIndex++;

  return deliveryBoy;
};


export const getNextDeliveryBoySmart = async () => {
  return await DeliveryBoy.findOne({
    status: "Available",
    assignStatus: "Not Assigned"
  }).sort({ activeOrders: 1, createdAt: 1 }); // lowest load first
};