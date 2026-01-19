import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./TopDishes.css";
import { useCart } from "../Context/CartContext";

const TopDishes = () => {
  const { counterId } = useParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCartCount } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTopDishes();
  }, [counterId]);

  const fetchTopDishes = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/food/counter/${counterId}`);
      if (res.data.success) {
        setFoods(res.data.foods);
      } else {
        alert(res.data.message || "No dishes found.");
      }
    } catch (err) {
      console.error("Error fetching dishes:", err);
      alert("Error loading dishes.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (dish) => {
    if (dish.status !== "Available") return;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/post",
        {
          foodid: dish._id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      if (res.data.message === "already in cart") {
        alert(`"${dish.name}" is already in your cart.`);
      } else {
        alert(`"${dish.name}" added to cart!`);
        updateCartCount();
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Please login to add items to cart.");
    }
  };

  if (loading) return <div>Loading top dishes...</div>;

  return (
    <div className="container">
      <h1 className="title">Top dishes near you</h1>
      <div className="dishes-grid">
        {foods.length > 0 ? (
          foods.map((dish, index) => (
            <div key={index} className="card">
              <img src={dish.photo} alt={dish.name} className="card-image" />
              <div className="card-content">
                <h2 className="card-title">{dish.name}</h2>
                <p className="card-description">
                  {dish.description || "Delicious food item!"}
                </p>
                <div className="card-footer">
                  <span className="card-price">₹{dish.price}</span>
                  <span className="card-rating">{"★".repeat(Math.floor(dish.rating || 4))}</span>
                </div>

                {dish.status === "Available" ? (
                  <button className="add-button" onClick={() => addToCart(dish)}>+ Add</button>
                ) : (
                  <button className="unavailable-buttonoo" disabled>Unavailable</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No dishes available for this counter.</p>
        )}
      </div>
    </div>
  );
};

export default TopDishes;
