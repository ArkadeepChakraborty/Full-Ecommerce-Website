import React from "react";
import "./FeaturesSection.css";

const features = [
  {
    id: 1,
    image: "./src/assets/discount.jpg",
    title: "Daily Discounts",
  },
  {
    id: 2,
    image: "./src/assets/gps_symbol.jpg",
    title: "Live Tracking",
  },
  {
    id: 3,
    image: "./src/assets/quick-order-delivery.jpg",
    title: "Quick Delivery",
  },
];

const FeaturesSection = () => {
  return (
    <div className="features-container">
      <div className="features-box">
        {features.map((feature, index) => (
          <div key={feature.id} className="feature-item">
            <img src={feature.image} alt={feature.title} className="feature-icon" />
            <span className="feature-text">{feature.title}</span>
            {index !== features.length - 1 && <div className="divider"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
