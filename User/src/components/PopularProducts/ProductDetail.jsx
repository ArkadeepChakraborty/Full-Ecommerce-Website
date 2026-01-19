import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import { useCart } from '../Context/CartContext';

const ProductDetail = () => {
  const { id: foodId } = useParams();
  const [foodData, setFoodData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
    window.scrollTo(0, 0);
    fetchFood();
  }, [foodId]);

  useEffect(() => {
    if (foodData?.price) {
      setTotalPrice(quantity * foodData.price);
    }
  }, [quantity, foodData]);

  const fetchFood = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/food/get/${foodId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const food = res.data.food;
        setFoodData(food);
        setMainImage(food.photo || food.image || "");
        setTotalPrice(quantity * (food.price || 0));
      } else {
        alert(res.data.message || "Failed to fetch food item.");
      }
    } catch (err) {
      console.error("Error fetching food:", err);
      alert("Server error occurred while fetching food item.");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/post",
        {
          foodid: foodData._id,
          quantity,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.message === "already in cart") {
        alert("Item already in cart.");
      } else {
        alert("Item added to cart!");
        updateCartCount();
      }

      navigate("/");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Please login to add items to cart.");
    }
  };

  const BuyNow = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/food/get/${foodId}`, {
        withCredentials: true,
      });

      const latestFood = res.data?.food;

      if (!latestFood || latestFood.status !== "Available") {
        alert("Sorry, this item is currently unavailable.");
        return;
      }

      const options = {
        key: "rzp_test_agSIP3tMeNjkMT",
        amount: totalPrice * 100,
        currency: "INR",
        name: "Food Faction",
        description: "Payment Medium to Order Your Favorite Food",
        image: "https://as1.ftcdn.net/v2/jpg/02/41/30/72/1000_F_241307210_MjjaJC3SJy2zJZ6B7bKGMRsKQbdwRSze.jpg",
        handler: async function (response) {
          alert("Payment Successful");

          try {
            const userRes = await axios.get("http://localhost:8000/api/v1/user/get", {
              withCredentials: true,
            });

            const userId = userRes.data?.user?._id;

            if (!userId) {
              alert("User not found.");
              return;
            }

            const body = {
                userId,
                cartItems: [
                  {
                    food: foodData._id,
                    quantity,
                    totalPrice: totalPrice,
                  },
                ],
                summary: {
                  totalItems: 1,
                  totalQuantity: quantity,
                  totalAmount: totalPrice,
                },
                transactionId: response.razorpay_payment_id,
              };
            const orderRes = await axios.post("http://localhost:8000/api/v1/order/post", body, {
              withCredentials: true,
            });

            if (orderRes.data.success) {
              const orderId = orderRes.data.data._id;
              alert("Order placed successfully!");
              navigate(`/addLocation/${orderId}`);
            } else {
              alert("Order failed. Try again later.");
            }
          } catch (err) {
            console.error("Error placing order:", err);
            alert("Failed to place order after payment.");
          }
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("BuyNow error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleWishlist = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/wishlist/add",
        { foodid: foodData._id },
        { withCredentials: true }
      );

      if (res.data.message === "Already in wishlist") {
        alert("Item already in wishlist.");
      } else {
        alert("Item added to wishlist!");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      alert("Please login to add items to wishlist.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!foodData) return <div>Food item not found.</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-gallery">
        <div className="product-detail-thumbnails">
          {[foodData.photo || foodData.image].map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`product-detail-thumb ${mainImage === img ? 'active' : ''}`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
        <div className="product-detail-main-image">
          <img src={mainImage} alt="Product" />
        </div>
      </div>

      <div className="product-detail-info">
        <h1 className="product-detail-title">{foodData.name}</h1>
        <p className="product-detail-description">{foodData.description || "No description available."}</p>

        <div className="product-detail-price">Price per item: ₹{foodData.price || "N/A"}</div>
        <div className="product-detail-price">Total Price: ₹{totalPrice}</div>

        <p className="product-detail-delivery">
          Express Delivery: <span>{foodData.expressDelivery ? "Unavailable" : "Available"}</span>
        </p>

        <div className="product-detail-quantity-control">
          <button onClick={decreaseQuantity} className="product-detail-qty-btn">-</button>
          <span className="product-detail-quantity">{quantity}</span>
          <button onClick={increaseQuantity} className="product-detail-qty-btn">+</button>
        </div>

        <div className="product-detail-actions">
          <button className="product-detail-cart-btn" onClick={addToCart}>Add to Cart</button>
          <button className="product-detail-cart-btn1" onClick={BuyNow}>Buy Now</button>
          <button className="product-detail-wishlist-btn" onClick={handleWishlist}>❤</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
