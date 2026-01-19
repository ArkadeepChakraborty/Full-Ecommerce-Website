import React, { useState } from "react";
import "./Addnewcart.css";

const Addnewcart = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.image) {
      alert("Please fill all fields.");
      return;
    }
    console.log("Product Added:", product);
    alert("Product added successfully!");
    setProduct({ name: "", price: "", image: "" });
  };

  return (
    <div className="add-newcart-container">
      <h2 className="fooditem">Add New Food Item</h2>
      <form onSubmit={handleSubmit}>
        <label className="lname">Cart Name:</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Enter food name"
          className="cname"
          required
        />

        <label className="lname">Cart Location:</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="cname"
          required
        />

        <label className="lname">Upload Cart Logo:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} required className="cname" />

        {product.image && <img src={product.image} alt="Food Preview" className="cartlogo-preview" />}

        <button type="submit" className="addcart">Add The Cart</button>
      </form>
    </div>
  );
};

export default Addnewcart;













