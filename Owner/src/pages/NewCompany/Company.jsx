import React, { useState } from "react";
import axios from "axios";
import "./Company.css";
import { Companyapi } from "../../utils/datauri.js";
import { motion } from "framer-motion";

const Company = () => {
  const [foodCounter, setFoodCounter] = useState({
    name: "",
    description: "",
    opening_hours: { start: "", end: "" },
    logo: "",
    status: "Open",
    location: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodCounter((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpeningHoursChange = (e) => {
    const { name, value } = e.target;
    setFoodCounter((prev) => ({
      ...prev,
      opening_hours: { ...prev.opening_hours, [name]: value },
    }));
  };

  const handleImageUpload = (e) => {
    const logo = e.target.files?.[0];
    setFoodCounter({ ...foodCounter, logo });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, opening_hours, location } = foodCounter;

    if (!name || !description || !opening_hours.start || !opening_hours.end || !location) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("foodcounterName", foodCounter.name);
    formData.append("description", foodCounter.description);
    formData.append("opening_hours", JSON.stringify(foodCounter.opening_hours));
    formData.append("location", foodCounter.location);
    formData.append("status", foodCounter.status);
    if (foodCounter.logo) {
      formData.append("file", foodCounter.logo);
    }

    try {
      const response = await axios.post(`${Companyapi}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Food Counter registered successfully!");
        setFoodCounter({
          name: "",
          description: "",
          opening_hours: { start: "", end: "" },
          logo: "",
          status: "Open",
          location: ""
        });
      } else {
        alert(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Error registering food counter.");
    }
  };

  return (
    <motion.div
      className="food-counter-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="Fc"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Add Food Counter
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="cf"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {/* Name */}
        <motion.label className="cam" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          Name:
        </motion.label>
        <motion.input
          className="cb"
          type="text"
          name="name"
          value={foodCounter.name}
          onChange={handleChange}
          required
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        />

        {/* Description */}
        <motion.label className="cam" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          Description:
        </motion.label>
        <motion.textarea
          name="description"
          className="cb"
          value={foodCounter.description}
          onChange={handleChange}
          required
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        />

        {/* Opening Hours */}
        <motion.label className="cam" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          Opening Hours:
        </motion.label>
        <motion.div className="opening-hours" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <input
            className="cb"
            type="text"
            name="start"
            placeholder="Start (e.g., 9:00 AM)"
            value={foodCounter.opening_hours.start}
            onChange={handleOpeningHoursChange}
            required
          />
          <span>to</span>
          <input
            className="cb"
            type="text"
            name="end"
            placeholder="End (e.g., 10:00 PM)"
            value={foodCounter.opening_hours.end}
            onChange={handleOpeningHoursChange}
            required
          />
        </motion.div>

        {/* Location */}
        <motion.label className="cam" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          Location:
        </motion.label>
        <motion.input
          className="cb"
          type="text"
          name="location"
          value={foodCounter.location}
          onChange={handleChange}
          placeholder="Enter location"
          required
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        />

        {/* Upload Logo */}
        <motion.label className="cam" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          Upload Logo (Optional):
        </motion.label>
        <motion.input
          className="cb"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        />
        {foodCounter.logo && (
          <motion.img
            src={URL.createObjectURL(foodCounter.logo)}
            alt="Food Counter Logo"
            className="logo-preview"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Status */}
        <motion.label className="cam" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          Status:
        </motion.label>
        <motion.select
          name="status"
          value={foodCounter.status}
          onChange={handleChange}
          className="cb"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <option value="Open">Open</option>
          <option value="Close">Close</option>
        </motion.select>

        {/* Submit */}
        <motion.button
          type="submit"
          className="cm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          Add Food Counter
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Company;
