import React, { useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/order/getOrdersByUser", {
          withCredentials: true,
        });

        const allOrders = res.data.data;

        // Keep canceled orders only if canceled within last 30 minutes
        const filteredOrders = allOrders.filter(order => {
          if (order.status !== "Canceled") return true;

          const canceledTime = new Date(order.updatedAt);
          const now = new Date();
          const diffInMinutes = (now - canceledTime) / (1000 * 60);

          return diffInMinutes <= 30;
        });

        setOrders(filteredOrders);
        setVisibleOrders(filteredOrders.slice(0, 5));
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/order/user/cancel/${orderId}`,
        { status: "Canceled" },
        { withCredentials: true }
      );

      alert("Your Amount will be refunded to you quickly.\nHave a good Day!");

      const updatedOrders = orders.map(order =>
        order._id === orderId
          ? { ...order, status: "Canceled", updatedAt: new Date().toISOString() }
          : order
      );

      const filteredOrders = updatedOrders.filter(order => {
        if (order.status !== "Canceled") return true;

        const canceledTime = new Date(order.updatedAt);
        const now = new Date();
        const diffInMinutes = (now - canceledTime) / (1000 * 60);

        return diffInMinutes <= 30;
      });

      setOrders(filteredOrders);
      setVisibleOrders(showAll ? filteredOrders : filteredOrders.slice(0, 5));
    } catch (err) {
      console.error("Error canceling order:", err);
      alert("Failed to cancel order");
    }
  };

  const handleViewMore = () => {
    setShowAll(true);
    setVisibleOrders(orders);
  };

  return (
    <div className="order-list-container">
      <h1 className="titleo">Order List</h1>

      {orders.length === 0 ? (
        <p className="no-orders-text">You didn't order yet!</p>
      ) : (
        <>
          <table className="order-table">
            <thead>
              <tr>
                <th>Food Image</th>
                <th>Food Name</th>
                <th>Total Price</th>
                <th>Quantity</th>
                <th>Counter</th>
                <th>Status/Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) =>
                order.cartItems.map((item, i) => (
                  <tr key={`${order._id}-${i}`}>
                    <td>
                      <img src={item.food?.photo} alt={item.food?.name} className="food-image" />
                    </td>
                    <td>{item.food?.name}</td>
                    <td>₹{item.totalPrice}</td>
                    <td>{item.quantity}</td>
                    <td>{item.food?.food_counter_id?.name || 'Unknown'}</td>
                    {i === 0 && (
                      <td rowSpan={order.cartItems.length} className={order.status.toLowerCase()}>
                        {order.status === "Pending" ? (
                          <button className="cancel-button" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                        ) : (
                          <span>{order.status}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!showAll && orders.length > 5 && (
            <div className="view-more-container">
              <button onClick={handleViewMore} className="view-more-button">View More</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyOrders;
