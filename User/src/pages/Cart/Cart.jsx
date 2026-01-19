import React, { useEffect, useState } from 'react';
import './Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../components/Context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { updateCartCount } = useCart();

  const init = async () => {
    try {
      const userRes = await axios.get('http://localhost:8000/api/v1/user/get', {
        withCredentials: true,
      });

      if (userRes.data.success) {
        const userId = userRes.data.user._id;

        const cartRes = await axios.get(`http://localhost:8000/api/v1/cart/getCartByUser`, {
          withCredentials: true,
        });

        if (cartRes.data.success) {
          setCartData(cartRes.data.data);
        }
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

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
    init();
  }, []);

  const handleCheckout = async (transaction_id) => {
    try {
      const userRes = await axios.get('http://localhost:8000/api/v1/user/get', {
        withCredentials: true,
      });

      if (!userRes.data.success) {
        alert('User not found');
        return;
      }

      const userId = userRes.data.user._id;

      const body = {
        userId,
        cartItems: cartData?.cartItems || [],
        summary: cartData?.summary || {},
        transactionId: transaction_id
      };

      const orderRes = await axios.post('http://localhost:8000/api/v1/order/post', body, {
        withCredentials: true,
      });

      if (orderRes.data.success) {
        const orderId = orderRes.data.data._id;
        alert('Order placed successfully!');
        updateCartCount();
        navigate(`/addLocation/${orderId}`);
      } else {
        alert('Order failed. Try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order.');
    }
  };

  const BuyNow = async () => {
    try {
      if (!cartData || cartData.cartItems.length === 0) {
        alert("There is no food in the cart to proceed with the order.");
        return;
      }

      const unavailableItems = [];

      for (const item of cartData.cartItems) {
        const foodId =
          typeof item.food === "string"
            ? item.food
            : item.food?._id;

        if (!foodId) continue;

        const res = await axios.get(`http://localhost:8000/api/v1/food/get/${foodId}`, {
          withCredentials: true,
        });

        const food = res.data?.food;

        if (!food || food.status !== "Available") {
          unavailableItems.push(food?.name || "Unknown Item");
        }
      }

      if (unavailableItems.length > 0) {
        alert(
          `The following item(s) are unavailable and cannot be ordered:\n\n${unavailableItems.join(", ")}`
        );
        return;
      }

      const options = {
        key: "rzp_test_agSIP3tMeNjkMT",
        amount: getTotalAmount() * 100,
        currency: "INR",
        name: "Food Faction",
        description: "Payment Medium to Order Your Favorite Food",
        image: "https://as1.ftcdn.net/v2/jpg/02/41/30/72/1000_F_241307210_MjjaJC3SJy2zJZ6B7bKGMRsKQbdwRSze.jpg",
        handler: function (response) {
          alert("Payment Successful");
          handleCheckout(response.razorpay_payment_id);
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error checking item availability:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setRemoving(true);
      await axios.delete(`http://localhost:8000/api/v1/cart/item/${cartItemId}`, {
        withCredentials: true,
      });
      await init();
      updateCartCount();
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setRemoving(false);
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity, foodPrice) => {
    try {
      if (newQuantity < 1) return;

      await axios.patch(`http://localhost:8000/api/v1/cart/uitem/${cartItemId}`, {
        quantity: newQuantity,
        foodPrice: foodPrice,
      }, {
        withCredentials: true,
      });

      await init();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const getTotalAmount = () => {
    return cartData?.summary?.totalAmount || 0;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Item Name</p>
          <p style={{marginRight:'28px'}}>Category</p>
          <p>Price</p>
          <p style={{marginLeft:'15px'}}>Quantity</p>
          <p>Remove</p>
        </div>
        <br />

        {cartData?.cartItems?.length > 0 ? (
          cartData.cartItems.map((item) => (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img src={item.food?.image} alt={item.food?.foodname} />
                <p>{item.food?.foodname}</p>
                <p>{item.food?.category}</p>
                <p>${item.totalPrice}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.food?.price)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.food?.price)}
                  >
                    +
                  </button>
                </div>
                <p
                  onClick={() => !removing && removeFromCart(item._id)}
                  className='cross'
                  style={{ opacity: removing ? 0.5 : 1 }}
                >
                  x
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>₹{getTotalAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Delivery Fee</p>
              <p>₹{getTotalAmount() === 0 ? 0 : 0}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <b>Total</b>
              <b>₹{getTotalAmount()}</b>
            </div>
          </div>
          <button onClick={BuyNow}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='Promo Code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
