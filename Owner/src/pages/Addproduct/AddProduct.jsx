import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AddProduct.css";
import { motion } from "framer-motion";

const AddProduct = () => {
  const { id: counterId } = useParams();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔹 Categories state
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔹 Ref for detecting outside click
  const categoryRef = useRef(null);

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/food/categories", {
          withCredentials: true,
        });
        console.log("Categories API response:", res.data);
        if (res.data.success) {
          setAllCategories(res.data.categories);
          setFilteredCategories(res.data.categories); // default all
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    // 🔹 Filter categories while typing
    if (name === "category") {
      if (value.trim() === "") {
        setFilteredCategories(allCategories); // show all if empty
      } else {
        const matches = allCategories.filter((cat) =>
          cat.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCategories(matches);
      }
      setShowDropdown(true); // always show while typing
    }
  };

  const handleCategorySelect = (cat) => {
    setProduct((prev) => ({ ...prev, category: cat }));
    setShowDropdown(false); // close dropdown
  };

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowDropdown(false); // just hide, don't clear list
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (product.category.trim() === "") {
      setFilteredCategories(allCategories);
    }
    setShowDropdown(true); // reopen on focus
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, category } = product;
    if (!name || !description || !price || !category || !imageFile || !counterId) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("food_counter_id", counterId);
    formData.append("file", imageFile);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/food/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        alert("Product added successfully!");
        setProduct({ name: "", description: "", price: "", category: "" });
        setImageFile(null);
        setPreview(null);
        setFilteredCategories(allCategories); // reset
      } else {
        alert(res.data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Server error occurred.");
    }
  };

  return (
    <motion.div
      className="add-product-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2>Add New Food Item</motion.h2>

      <motion.form onSubmit={handleSubmit} encType="multipart/form-data">
        {[
          { label: "Food Name", type: "text", name: "name", value: product.name },
          { label: "Description", type: "textarea", name: "description", value: product.description },
          { label: "Price", type: "number", name: "price", value: product.price },
        ].map((field, index) => (
          <motion.div key={index}>
            <label className="fname">{field.label}:</label>
            {field.type === "textarea" ? (
              <textarea
                rows="3"
                name={field.name}
                value={field.value}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className="pname"
                required
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className="pname"
                required
              />
            )}
          </motion.div>
        ))}

        {/* 🔹 Category Input with Suggestions + Outside Click */}
        <motion.div className="category-wrapper" ref={categoryRef}>
          <label className="fname">Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="Type or select category"
            className="pname"
            required
          />
          {showDropdown && filteredCategories.length > 0 && (
            <ul className="suggestions-list">
              {filteredCategories.map((cat, idx) => (
                <li key={idx} onClick={() => handleCategorySelect(cat)}>
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div>
          <label className="fname">Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} required className="pname" />
        </motion.div>

        {preview && <motion.img src={preview} alt="Preview" className="image-preview" />}

        <motion.button
          type="submit"
          className="add"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Product
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AddProduct;
