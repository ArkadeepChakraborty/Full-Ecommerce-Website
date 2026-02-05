import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Wishlist.css";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useCart } from "../../components/Context/CartContext";

const Wishlist = () => {
  const [allWishlistItems, setAllWishlistItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { updateCartCount } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/wishlist/get", {
        withCredentials: true,
      });
      if (res.data.success) {
        const items = res.data.data.reverse(); // Reverse to show latest first
        setAllWishlistItems(items);
        setVisibleItems(items.slice(0, 5));
      } else {
        alert("Failed to fetch wishlist");
      }
    } catch (err) {
      console.error("Fetch wishlist error:", err);
      alert("Server error");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/wishlist/delete/${itemId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updated = allWishlistItems.filter((item) => item._id !== itemId);
        setAllWishlistItems(updated);
        setVisibleItems(showAll ? updated : updated.slice(0, 5));
        alert("Item removed from wishlist");
      }
    } catch (err) {
      console.error("Delete wishlist error:", err);
      alert("Server error");
    }
  };

  const handleAddToCart = async (foodid) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/post",
        { foodid, quantity: 1 },
        { withCredentials: true }
      );

      if (res.data.message === "already in cart") {
        alert("Item already in cart.");
      } else {
        alert("Item added to cart!");
        updateCartCount();
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Please login to add items to cart.");
    }
  };

  const handleViewMore = () => {
    setShowAll(true);
    setVisibleItems(allWishlistItems);
  };

  return (
    <div className="wishlist-container">
      <h2>My Wishlist ({allWishlistItems.length})</h2>
      {visibleItems.map((item) =>
        item.food ? (
          <div className="wishlist-item" key={item._id}>
            <img
              src={item.food.image}
              alt={item.food.name}
              className="wishlist-item-image"
            />
            <div className="wishlist-item-details">
              <p className="wishlist-item-name">{item.food.name}</p>
              <p className="wishlist-item-price">₹{item.food.price}</p>
            </div>
            <div className="wishlist-item-actions">
              {item.food.status === "Available" ? (
                <button
                  className="wishlist-action-button"
                  onClick={() => handleAddToCart(item.food._id)}
                  title="Add to Cart"
                >
                  <FaPlus />
                </button>
              ) : (
                <h4 className="wishlist-unavailable-text">Currently Unavailable</h4>
              )}
              <button
                className="wishlist-action-button"
                onClick={() => handleDelete(item._id)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ) : null
      )}

      {!showAll && allWishlistItems.length > 5 && (
        <div className="wishlist-view-more-container">
          <button className="wishlist-view-more-button" onClick={handleViewMore}>
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
