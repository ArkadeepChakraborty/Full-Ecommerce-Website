import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Foodcart.css";

const Foodcart = () => {
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

  const featuredRestaurants = restaurants.slice(0, 3);

  return (
    <div className="containerooo" id="food-cart">
      <h1 className="titleee">Featured Restaurants</h1>
      <div className="grid-container">
        {featuredRestaurants.map((restaurant, index) => (
          <div
            className={`card ${restaurant.status === "Closed" ? "card-disabled" : ""}`}
            key={index}
            onClick={() => handleNavigate(restaurant._id, restaurant.status)}
          >
            <div
              className={`status-badge ${
                restaurant.status === "Open" ? "open-badge" : "closed-badge"
              }`}
            >
              {restaurant.status}
            </div>

            <div className="badge-container">
              {restaurant.fast && <span className="fast">Fast</span>}
            </div>

            <img
              src={restaurant.logo || restaurant.image || "/default-image.png"}
              alt={restaurant.name}
              className="image"
            />

            <div className="card-content">
              <h3 className="name">{restaurant.name}</h3>

              {restaurant.description && (
                <p className="description">{restaurant.description}</p>
              )}

              {restaurant.opening_hours?.start && restaurant.opening_hours?.end && (
                <p className="hours">
                  ⏰ {restaurant.opening_hours.start} - {restaurant.opening_hours.end}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {restaurants.length > 3 && (
        <button className="view-all" onClick={() => navigate("/viewfoodcart")}>
          View All
        </button>
      )}
    </div>
  );
};

export default Foodcart;
