// AddLocation.jsx
import React, { useState } from "react";
import "./AddLocation.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const AddLocation = () => {
  const { orderId } = useParams();
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const addLocationHandler = async () => {
    if (!location) {
      toast.error("Please enter your delivery location");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/order/addLocation/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiveLocation: location })
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Delivery location added successfully");
        navigate('/review');
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to add location");
      console.error(err);
    }
  };

  return (
    <div className="add-location-modal">
      <ToastContainer />
      <div className="add-location-box">
        <h2>Enter Delivery Location</h2>
        <input
          type="text"
          placeholder="Enter your delivery address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={addLocationHandler}>Submit</button>
      </div>
    </div>
  );
};


export default AddLocation;
