import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewFoodcart.css";

const ViewFoodcart = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodCounters = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/foodcounter/all");
        const data = await response.json();
        if (response.ok && data.success) {
          setRestaurants(data.foodCounters);
        } else {
          setError(data.message || "Failed to load food counters");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodCounters();
  }, []);

  const handleNavigate = (counterId, status) => {
    if (status === "Closed") return;
    navigate(`/topdishes/${counterId}`);
  };

  if (loading) return <p>Loading restaurants...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="view-container">
      <h1 className="view-title">All Restaurants</h1>
      <div className="view-grid">
        {restaurants.map((restaurant, index) => (
          <div
            key={index}
            className={`view-card ${restaurant.status === "Closed" ? "view-card-disabled" : ""}`}
            onClick={() => handleNavigate(restaurant._id, restaurant.status)}
          >
            <div
              className={`view-status-badge ${
                restaurant.status === "Open" ? "open-badge" : "closed-badge"
              }`}
            >
              {restaurant.status}
            </div>

            <div className="view-badges">
              {restaurant.discount && (
                <span className="view-discount">{restaurant.discount}</span>
              )}
              {restaurant.fast && <span className="view-fast">Fast</span>}
            </div>

            <img
              src={restaurant.logo || restaurant.image || "/default-image.png"}
              alt={restaurant.name}
              className="view-image"
            />

            <div className="view-card-content">
              <h3 className="view-name">{restaurant.name}</h3>

              {restaurant.description && (
                <p className="view-description">{restaurant.description}</p>
              )}

              {restaurant.rating && (
                <p className="view-rating">⭐ {restaurant.rating}</p>
              )}

              {restaurant.opening_hours?.start && restaurant.opening_hours?.end && (
                <p className="view-hours">
                  ⏰ {restaurant.opening_hours.start} - {restaurant.opening_hours.end}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewFoodcart;
