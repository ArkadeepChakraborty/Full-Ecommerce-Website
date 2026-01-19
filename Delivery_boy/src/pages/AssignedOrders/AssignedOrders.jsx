import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedOrders.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AssignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchAssignedOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/order/deliveryboy", // backend endpoint
          { withCredentials: true }
        );

        // ✅ Filter only "Assigned" orders
        const assignedOrders = response.data.data.filter(
          (order) => order.status === "Assigned"
        );

        setOrders(assignedOrders);
      } catch (error) {
        console.error("Error fetching assigned orders:", error);
      }
    };

    fetchAssignedOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="assigned-orders-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="assigned-orders-containers">
        <p>Please login to view assigned orders.</p>
      </div>
    );
  }
  

  return (
    <div className="assigned-orders-container">
      <h2>Food Faction</h2>
      <h4>Your Assigned Orders</h4>

      <table className="assigned-orders-table">
        <thead>
          <tr>
            <th>Order No</th>
            <th>Customer Name</th>
            <th>Location</th>
            <th>Mobile No</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5">No assigned orders found.</td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.userId?.fullname || "N/A"}</td>
                <td>{order.receiveLocation || "Not provided"}</td>
                <td>{order.userId?.phoneNumber || "N/A"}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/deliveryboy/${order._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedOrders;
