import React from "react";
import "./HowItWorks.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
import { FaFirstOrder } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";

const HowItWorks = () => {
  return (
    <div className="how-it-works-container">
      <h2 className="how-it-works-title">How does it work</h2>
      <div className="how-it-works-grid">
        <div className="how-it-works-step">
          <div className="icon-wrapper">
            <FaLocationDot />
          </div>
          <h3 className="step-title">Select location</h3>
          <p className="step-description">Choose the location where your food will be delivered.</p>
        </div>

        <div className="how-it-works-step">
          <div className="icon-wrapper">
          <FaFirstOrder />
          </div>
          <h3 className="step-title">Choose order</h3>
          <p className="step-description">Check over hundreds of menus to pick your favorite food.</p>
        </div>

        <div className="how-it-works-step">
          <div className="icon-wrapper">
          <FaSackDollar />
          </div>
          <h3 className="step-title">Pay advanced</h3>
          <p className="step-description">It's quick, safe, and simple. Select several methods of payment.</p>
        </div>

        <div className="how-it-works-step">
          <div className="icon-wrapper">
          <GiMeal />
          </div>
          <h3 className="step-title">Enjoy meals</h3>
          <p className="step-description">Food is made and delivered directly to your home.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
