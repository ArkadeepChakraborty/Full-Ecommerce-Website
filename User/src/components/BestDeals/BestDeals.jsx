import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BestDeals.css";
import { useCart } from "../Context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BestDeals = () => {
  const [topItems, setTopItems] = useState([]);
  const { updateCartCount } = useCart();

  useEffect(() => {
    const fetchTopSellingItems = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/order/top-selling", {
          withCredentials: true,
        });

        if (res.data.success) {
          setTopItems(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch top-selling items:", err);
      }
    };

    fetchTopSellingItems();
  }, []);

  const handleAddToCart = async (foodId) => {
    try {
      // 🟡 Get the latest food info (to check availability)
      const res = await axios.get(`http://localhost:8000/api/v1/food/get/${foodId}`, {
        withCredentials: true,
      });

      const food = res.data?.food;

      if (!food || food.status !== "Available") {
        toast.error("This item is currently unavailable.");
        return;
      }

      // ✅ Add to cart if available
      const cartRes = await axios.post(
        "http://localhost:8000/api/v1/cart/post",
        {
          foodid: foodId,
          quantity: 1,
        },
        { withCredentials: true }
      );

      if (cartRes.data.message === "already in cart") {
        toast.info("Item already in cart.");
      } else {
        toast.success("Item added to cart!");
        updateCartCount();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Please login to add items to cart.");
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2000} />

      {topItems.map((item, idx) => (
        <div className="deals-container" key={item._id._id}>
          {idx % 2 === 0 ? (
            <>
              <div className="deals-content">
                <div className="deal-badge">🔥 Bestseller</div>
                <h1 className="deals-title">
                  Top Pick: <span className="highlight">{item._id.name}</span>
                </h1>
                <p className="deals-description">
                  Indulge in our most popular dish — {item._id.name}. Loved by countless customers for its perfect blend of flavors and unmatched freshness. Don't miss this mouthwatering experience that keeps people coming back for more!
                </p>
                <button
                  className="deals-button"
                  onClick={() => handleAddToCart(item._id._id)}
                >
                  ADD TO CART ➤
                </button>
              </div>
              <div className="deals-divider" />
              <div className="deals-image">
                <img src={item._id.photo} alt={item._id.name} />
              </div>
            </>
          ) : (
            <>
              <div className="deals-image">
                <img src={item._id.photo} alt={item._id.name} />
              </div>
              <div className="deals-divider" />
              <div className="deals-content">
                <div className="deal-badge">⭐ Customer Favorite</div>
                <h1 className="deals-title">
                  Must Try: <span className="highlight">{item._id.name}</span>
                </h1>
                <p className="deals-description">
                  Experience the delicious delight of our all-time favorite: {item._id.name}. Carefully crafted with premium ingredients to ensure every bite is filled with flavor, quality, and satisfaction.
                </p>
                <button
                  className="deals-button"
                  onClick={() => handleAddToCart(item._id._id)}
                >
                  ADD TO CART ➤
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default BestDeals;
