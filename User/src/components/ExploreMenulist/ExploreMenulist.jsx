import React, { useEffect, useRef, useState } from "react";
import "./ExploreMenulist.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const menu_list = [
  { menu_name: "All", menu_image: "./src/assets/Allfood.jpg" },
  { menu_name: "Nonveg", menu_image: "./src/assets/menu_8.png" },
  { menu_name: "Veg", menu_image: "./src/assets/menu_6.png" },
  { menu_name: "Burger", menu_image: "./src/assets/Br.jpg" },
  { menu_name: "Dessert", menu_image: "./src/assets/menu_5.png" },
  { menu_name: "Drinks", menu_image: "./src/assets/D2.png" },
  { menu_name: "Pizza", menu_image: "./src/assets/Pizza.jpg" },
];

const ExploreMenulist = () => {
  const scrollRef = useRef(null);
  const cardScrollRef = useRef(null);
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [foods, setFoods] = useState([]);

  const scroll = (direction, ref) => {
    ref.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const fetchFoods = async () => {
    try {
      const res =
        category === "All"
          ? await axios.get("http://localhost:8000/api/v1/food/get")
          : await axios.get(`http://localhost:8000/api/v1/food/category/${category}`);

      if (res.data.success) setFoods(res.data.foods);
      else setFoods([]);
    } catch (err) {
      console.error("Fetch error:", err);
      setFoods([]);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [category]);

  const handleCategoryClick = (selected) => {
    setCategory(selected);
  };

  return (
    <div className="explore-section" id="menu">
      <h2 className="section-title">Explore Our Menu</h2>

      {/* Horizontal Category Menu */}
      <div className="menu-bar">
        <button className="arrow-button" onClick={() => scroll("left", scrollRef)}>&#8592;</button>
        <div className="category-container" ref={scrollRef}>
          {menu_list.map((item, index) => (
            <div
              key={index}
              className={`category-item ${category === item.menu_name ? "active" : ""}`}
              onClick={() => handleCategoryClick(item.menu_name)}
            >
              <img src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
        <button className="arrow-button" onClick={() => scroll("right", scrollRef)}>&#8594;</button>
      </div>

      {/* Food Cards */}
      <div className="food-scroll-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left", cardScrollRef)}>&#8249;</button>

        <div className="card-list" ref={cardScrollRef}>
          {foods.length > 0 ? (
            foods.map((item) => (
              <div className="food-card" key={item._id}>
                <img src={item.photo} alt={item.name} />
                <h3>{item.name}</h3>
                <p className="restaurant">📍 <span>{item.restaurant}</span></p>
                <p className="price">₹{item.price}</p>

                {item.status === "Available" ? (
                  <button
                    className="order-btn"
                    onClick={() => navigate(`/detail/${item._id}`)}
                  >
                    Order now
                  </button>
                ) : (
                  <button className="unavailable-btn" disabled>
                    Unavailable
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="no-results">No food items found.</p>
          )}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right", cardScrollRef)}>&#8250;</button>
      </div>
    </div>
  );
};

export default ExploreMenulist;
