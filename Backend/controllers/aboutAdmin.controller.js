// controllers/aboutAdmin.controller.js

import { AboutAdmin } from "../models/aboutAdmin.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const saveAboutContent = async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrls = {};

    const imageFields = ["image1", "image2", "image3", "image4"];
    for (const field of imageFields) {
      if (req.files[field]) {
        const fileUri = getDataUri(req.files[field][0]);
        const upload = await cloudinary.uploader.upload(fileUri.content);
        imageUrls[field] = upload.secure_url;
      }
    }

    const newContent = await AboutAdmin.create({
      title,
      content,
      ...imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "About content saved successfully",
      data: newContent,
    });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAboutContent = async (req, res) => {
  try {
    const content = await AboutAdmin.findOne().sort({ createdAt: -1 });

    if (!content) {
      return res.status(404).json({ success: false, message: "No about content found" });
    }

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateAboutContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updates = { title, content };

    const imageFields = ["image1", "image2", "image3", "image4"];
    for (const field of imageFields) {
      if (req.files[field]) {
        const fileUri = getDataUri(req.files[field][0]);
        const upload = await cloudinary.uploader.upload(fileUri.content);
        updates[field] = upload.secure_url;
      }
    }

    const updated = await AboutAdmin.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "About content not found" });
    }

    res.status(200).json({ success: true, message: "Updated successfully", data: updated });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};