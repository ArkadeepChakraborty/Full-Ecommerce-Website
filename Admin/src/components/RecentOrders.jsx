import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RecentOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/order/getall",
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders(res.data.data.slice(0, 10)); 
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    if (status === "Delivered") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    if (status === "Canceled") return "text-red-600";
    return "";
  };

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium">Recent Orders</strong>

      <div className="border-x border-gray-200 rounded-sm mt-3 h-[35vh] overflow-y-scroll">
        <table className="w-full text-gray-700">
          <thead>
            <tr>
              <th className="text-center">#</th>
              {/* Order ID removed intentionally */}
              <th className="text-center">User</th>
              <th className="text-center">Items</th>
              <th className="text-center">Quantity</th>
              <th className="text-center">Order Date</th>
              <th className="text-center">Total Amount</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => {
              const totalQuantity = order.cartItems.reduce(
                (acc, item) => acc + item.quantity,
                0
              );

              const itemNames = order.cartItems
                .map((ci) => ci.food?.name)
                .join(", ");

              return (
                <tr key={order._id} className="border-t">
                  <td className="text-center font-medium">
                    <b>{index + 1}</b>
                  </td>

                  <td className="text-center">
                    {order.userId?.fullname || "Unknown User"}
                  </td>

                  <td className="text-center">{itemNames}</td>

                  <td className="text-center">{totalQuantity}</td>

                  <td className="text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="text-center">
                    ₹{order.summary?.totalAmount}
                  </td>

                  <td
                    className={`${getStatusClass(order.status)} font-medium text-center`}
                  >
                    {order.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
