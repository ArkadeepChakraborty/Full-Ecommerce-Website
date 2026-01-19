// const express = require('express');
import express from "express";
const router = express.Router();
// const Cart = require('../Model/cart');
// const User = require('../Model/user');
import { User } from '../models/user.model.js'; // Import your Admin model
import { food } from '../models/food.model.js'; // Import your Admin model
// const Food = require('../Model/food');
// const mongoose = require('mongoose');
import mongoose from "mongoose";
import { Cart } from '../models/cart.model.js'; // Import your Admin model

// Home route for Food
export const home = async (req, res) => {
    res.send("This is Cart Page....!!!");
};



// Add Food (POST Method)
// router.post('/addCart', async (req, res) => {
// controllers/cart.controller.js

export const addCart = async (req, res) => {
  const userId = req.id; // decoded from token by isAuthenticated middleware
  const { foodid, quantity } = req.body;

  if (!foodid || !quantity) {
    return res.status(400).json({ message: "Missing foodid or quantity" });
  }

  try {
    // Check for duplicate item
    const existingCartItem = await Cart.findOne({ userid: userId, foodid });
    if (existingCartItem) {
      return res.status(200).json({ message: "already in cart" });
    }

    // Create new cart item
    const newCart = new Cart({
      foodid,
      quantity,
      userid: userId, // ✅ Securely added from token, not from req.body
    });

    const savedCart = await newCart.save();
    return res.status(201).json({ message: "Item added", cart: savedCart });
  } catch (error) {
    console.error("Cart add error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getCartByUser = async (req, res) => {

    try {
        const userid = req.id;
        
        // Explicitly reference the models by their registered names
        const User = mongoose.model('User');
        const Cart = mongoose.model('Cart');
        const Food = mongoose.model('food');
        
        // First get the user details
        const user = await User.findById(userid).select('-password'); // Exclude password from results
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Find all cart items for this user
        const cartItems = await Cart.find({ userid });
        
        if (cartItems.length === 0) {
            return res.json({
                success: true,
                message: 'Cart is empty',
                data: {
                    user,
                    cartItems: []
                }
            });
        }

        // Get all food IDs from cart
        const foodIds = cartItems.map(item => item.foodid);
        
        // Get all food details in a single query - using lean() for better performance
        const foodDetails = await Food.find({ _id: { $in: foodIds } })
            .lean(); // Don't need populate here since we'll handle category display manually
        
        // Create a map of food details for quick lookup
        const foodMap = {};
        foodDetails.forEach(food => {
            foodMap[food._id.toString()] = food;
        });
        
        // Combine cart items with food details
        const detailedCartItems = cartItems.map(cartItem => {
            const food = foodMap[cartItem.foodid.toString()];
            const unitPrice = food ? food.price: 0;
            const totalPrice = unitPrice * cartItem.quantity;
            return {
                _id: cartItem._id,
                quantity: cartItem.quantity,
                food: food ? {
                    _id: food._id,
                    foodname: food.name,
                    price: food.price,
                    availability: food.availability,
                    image: food.photo,
                    category: food.category // Just pass the category ID for now
                } : null,
                unitPrice,
                totalPrice
            };
        });
        
        // Calculate cart summary
        const cartSummary = {
            totalItems: detailedCartItems.length,
            totalQuantity: detailedCartItems.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: detailedCartItems.reduce((sum, item) => sum + item.totalPrice, 0)
        };

        // Send the response
        return res.status(200).json({
            success: true,
            data: {
                user,
                cartItems: detailedCartItems,
                summary: cartSummary
            }
        });
        
    } catch (error) {
        console.error('Error fetching cart details:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch cart details',
            error: error.message
        });
    }
};

export const updateCart = async (req, res) => {

    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Cart.findByIdAndUpdate(id, updatedData, options);
        res.send(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Food by ID (DELETE Method)
export const deleteCart = async (req, res) => {

    try {
        const id = req.params.id;
        const data = await Cart.findByIdAndDelete(id);
        res.send({'message':`Food item with name "${data._id}" has been deleted.`});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// API endpoint: GET /userdata/:userid
export const userdata = async (req, res) => {

    try {
        const userId = req.params.userid;

        // Get user data
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get cart items for user, populate food details
        const cartItems = await Cart.find({ userid: userId })
                                    .populate('foodid')
                                    .lean();

        res.json({
            user: user,
            cart: cartItems
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const deleteCartItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const deletedItem = await Cart.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.json({ success: true, message: `Item removed successfully`, data: deletedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    const cartItem = await Cart.findById(itemId); // Find by _id directly
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ success: true, data: cartItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// module.exports = router;
