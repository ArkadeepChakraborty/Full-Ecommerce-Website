import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditFood.css";

const EditFood = () => {
  const { id: foodId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Category suggestion states
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const categoryRef = useRef(null);

  // Fetch food details
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/food/get/${foodId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const { name, description, price, category, photo } = res.data.food;
          setProduct({ name, description, price, category });
          setPreview(photo);
        } else {
          alert(res.data.message || "Failed to load food.");
        }
      } catch (error) {
        console.error("Error fetching food:", error);
        alert("Server error occurred while fetching food.");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/food/categories", {
          withCredentials: true,
        });
        if (res.data.success) {
          setAllCategories(res.data.categories);
          setFilteredCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      if (value.trim() === "") {
        setFilteredCategories(allCategories);
      } else {
        const matches = allCategories.filter((cat) =>
          cat.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCategories(matches);
      }
    }
  };

  const handleCategorySelect = (cat) => {
    setProduct((prev) => ({ ...prev, category: cat }));
    setShowSuggestions(false);
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
    if (!name || !description || !price || !category) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (imageFile) formData.append("file", imageFile);

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/food/update/${foodId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert("Product updated successfully!");
        navigate(-1);
      } else {
        alert(res.data.message || "Failed to update product.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Server error occurred.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-food-containerx">
      <h2>Edit Food Item</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="fnamex">Food Name:</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Enter food name"
          className="pnamex"
          required
        />

        <label className="fnamex">Description:</label>
        <textarea
          rows="3"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Enter Description"
          className="pnamex"
          required
        />

        <label className="fnamex">Price:</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="pnamex"
          required
        />

        {/* 🔹 Updated Category with Suggestions */}
        <div className="category-wrapper" ref={categoryRef}>
          <label className="fnamex">Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type or select category"
            className="pnamex"
            required
          />
          {showSuggestions && filteredCategories.length > 0 && (
            <ul className="suggestionslist">
              {filteredCategories.map((cat, idx) => (
                <li key={idx} onClick={() => handleCategorySelect(cat)}>
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="fnamex">Upload Image (optional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="pnamex"
        />

        {preview && <img src={preview} alt="Food Preview" className="image-previewy" />}

        <button type="submit" className="edity">Update Product</button>
      </form>
    </div>
  );
};

export default EditFood;
