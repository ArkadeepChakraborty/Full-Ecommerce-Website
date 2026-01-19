import React, { useEffect, useState } from "react";
import "./OrderList.css";
import { motion } from "framer-motion";
import axios from "axios";

const ITEMS_PER_PAGE = 4;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/order/supplier", {
        withCredentials: true,
      });

      if (res.data.success) {
        const allOrders = res.data.data.reverse();
        setOrders(allOrders);
      } else {
        alert("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders");
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/deliveryboys");
      if (res.data.success) {
        setDeliveryBoys(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching delivery boys:", err);
    }
  };

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <motion.div className="order-list-container" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <motion.h1 className="title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Orders Placed for Your Items
      </motion.h1>

      {orders.length === 0 ? (
        <motion.p className="no-orders-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          No order made yet!
        </motion.p>
      ) : (
        <>
          <motion.table className="order-table" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Food Image</th>
                <th>Food Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Food Counter</th>
                <th>Delivery Boy</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, orderIndex) => {
                const cartItems = order.cartItems;

                const counterGroups = {};
                cartItems.forEach((item, idx) => {
                  const counterName = item.food?.food_counter_id?.name || "Unknown";
                  if (!counterGroups[counterName]) counterGroups[counterName] = [];
                  counterGroups[counterName].push(idx);
                });

                return cartItems.map((item, itemIndex) => {
                  const counterName = item.food?.food_counter_id?.name || "Unknown";
                  const showCounter = counterGroups[counterName][0] === itemIndex;
                  const counterRowSpan = counterGroups[counterName].length;

                  return (
                    <motion.tr
                      key={`${order._id}-${itemIndex}`}
                      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.4 }}
                    >
                      {itemIndex === 0 && (
                        <td rowSpan={cartItems.length}>
                          {order.userId?.fullname || "Unknown User"}
                        </td>
                      )}
                      <td>
                        <motion.img
                          src={item.food?.photo || "/fallback.jpg"}
                          alt={item.food?.name || "Unknown"}
                          className="food-image"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      </td>
                      <td>{item.food?.name || "Unknown"}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.totalPrice}</td>

                      {showCounter && (
                        <td rowSpan={counterRowSpan} className="counter-cell">
                          {counterName}
                        </td>
                      )}

                      {itemIndex === 0 && (
                        <td rowSpan={cartItems.length} className="assign-cell">
                          {order.deliveryBoyId ? (
                            <div className="assigned-name">
                              {order.deliveryBoyId.fullname || "Assigned"}
                            </div>
                          ) : (
                            <span className="not-assigned">Not Assigned</span>
                          )}
                        </td>
                      )}

                      {itemIndex === 0 && (
                        <td rowSpan={cartItems.length} className="status-cell">
                          {order.status || "Pending"}
                        </td>
                      )}
                    </motion.tr>
                  );
                });
              })}
            </tbody>
          </motion.table>

          {totalPages > 1 && (
            <motion.div className="pagination-controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <button className="pagination-btn" onClick={handlePrev} disabled={currentPage === 1}>
                ⬅ Previous
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button className="pagination-btn" onClick={handleNext} disabled={currentPage === totalPages}>
                Next ➡
              </button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default OrderList;
