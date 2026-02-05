import React, { useState } from "react";
import "./ReviewPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReviewPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/review/create",
        { name, thoughts, rating },
        { withCredentials: true } // ✅ send cookies for auth
      );

      if (res.data.success) {
        setSuccess("Thank you for your review!");
        setName("");
        setThoughts("");
        setRating(0);
        navigate('/myorders');
      } else {
        setError("Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="review-page">
      <h1>Give your Review here!</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="Nameholder"
          placeholder="Enter your name"
          required
        />

        <label htmlFor="thoughts">Your Thoughts</label>
        <textarea
          id="thoughts"
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder="Share your thoughts"
          required
        />

        <label>Review</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? "active" : ""}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <button type="submit" className="Sbutton">Submit</button>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
      <p className="day">Have a good day 😊</p>
    </div>
  );
};

export default ReviewPage;
