// import { useEffect, useState } from "react";
// import { FaClock } from "react-icons/fa";
// import { IoBagCheck, IoBagHandle } from "react-icons/io5";
// import { TiShoppingCart } from "react-icons/ti";
// import { IoIosSend } from "react-icons/io";
// import axios from "axios";
// import {
//   CartesianGrid,
//   LineChart,
//   Tooltip,
//   XAxis,
//   YAxis,
//   Legend,
//   ResponsiveContainer,
//   Line as LineRechart,
// } from "recharts";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Transactions = () => {
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sendingInvoiceIds, setSendingInvoiceIds] = useState([]);
//   const rowsPerPage = 6;

//   // Fetch monthly transactions
//   const fetchMonthlyTransactions = async () => {
//     try {
//       const { data } = await axios.get(
//         "http://localhost:8000/api/v1/order/transactions/monthly"
//       );
//       if (data.success) setMonthlyData(data.data);
//     } catch (error) {
//       toast.error("Failed to fetch monthly transactions");
//       console.error(error);
//     }
//   };

//   // Fetch all orders
//   const fetchAllOrders = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:8000/api/v1/order/getall");
//       if (data.success) setOrders(data.data.reverse());
//     } catch (error) {
//       toast.error("Failed to fetch orders");
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     toast("Welcome to Transaction Overview!");
//     fetchMonthlyTransactions();
//     fetchAllOrders();
//   }, []);

//   // ❌ Do not show cancelled orders anywhere below
//   const nonCancelledOrders = orders.filter((o) => o.status !== "Canceled");

//   // Send invoice
//   const handleSendStatement = async (orderId) => {
//     if (sendingInvoiceIds.includes(orderId)) return;

//     try {
//       setSendingInvoiceIds((prev) => [...prev, orderId]);
//       const { data } = await axios.post(
//         `http://localhost:8000/api/v1/order/postInvoice/${orderId}`
//       );

//       if (data.success) {
//         toast.success("Invoice sent successfully!");
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order._id === orderId ? { ...order, invoiceStatus: "Posted" } : order
//           )
//         );
//       } else {
//         toast.error(data.message || "Failed to send invoice");
//       }
//     } catch (err) {
//       toast.error("Server error while sending invoice");
//       console.error(err);
//     } finally {
//       setSendingInvoiceIds((prev) => prev.filter((id) => id !== orderId));
//     }
//   };

//   // Latest transactions — remove Posted invoice & remove Cancelled
//   const pendingOrdersList = nonCancelledOrders.filter(
//     (order) => order.invoiceStatus !== "Posted"
//   );

//   const totalPages = Math.ceil(pendingOrdersList.length / rowsPerPage);
//   const currentPageData = pendingOrdersList.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   // Overview card numbers (keep all orders including cancelled — as per your original logic)
//   const totalOrders = orders.length;
//   const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;
//   const completedOrders = orders.filter((o) => o.status === "Delivered").length;
//   const totalProducts = orders.reduce(
//     (acc, order) => acc + order.cartItems.length,
//     0
//   );

//   return (
//     <>
//       <ToastContainer />
//       <div className="flex w-full flex-col">
//         <div className="bg-white rounded-md p-4 border border-gray-200 overflow-y-scroll h-[88vh]">

//           {/* Header */}
//           <header className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Transaction Overview</h1>
//           </header>

//           {/* Notification Banner */}
//           <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 shadow-md">
//             Your <strong>Food App</strong> business is too good. Make it bigger.
//           </div>

//           {/* Overview Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             {[
//               { title: "Total Order", value: totalOrders, icon: <IoBagHandle className="text-orange-500 text-3xl" />, trend: "+0.1%" },
//               { title: "Pending Orders", value: pendingOrders, icon: <FaClock className="text-red-500 text-3xl" />, trend: "-0.1%" },
//               { title: "Completed Orders", value: completedOrders, icon: <IoBagCheck className="text-green-500 text-3xl" />, trend: "+0.2%" },
//               { title: "Total Products", value: totalProducts, icon: <TiShoppingCart className="text-blue-500 text-3xl" />, trend: "+2 new items" },
//             ].map((item, i) => (
//               <div key={i} className="bg-white shadow-lg p-6 rounded-lg">
//                 <div className="flex justify-between items-center">
//                   <h2 className="font-semibold text-gray-800">{item.title}</h2>
//                   {item.icon}
//                 </div>
//                 <p className="text-2xl font-bold mt-2">{item.value}</p>
//                 <span className="text-sm text-green-600">{item.trend}</span>
//               </div>
//             ))}
//           </div>

//           {/* Graph + Recent Transactions */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//             {/* Monthly Graph */}
//             <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg flex flex-col">
//               <h2 className="font-semibold text-xl mb-2">Monthly Transactions</h2>
//               <div className="flex-1 min-h-[250px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={monthlyData.map((m) => ({ name: m.month, Income: m.totalAmount }))}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <LineRechart type="monotone" dataKey="Income" stroke="#32cd32" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Recent Transactions — Cancelled removed */}
//             <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
//               <h2 className="font-semibold text-xl border-b pb-2 mb-3">Recent Transactions</h2>

//               <ul className="space-y-4 overflow-y-auto max-h-[250px] pr-2">
//                 {nonCancelledOrders.slice(0, 5).map((order) => (
//                   <li key={order._id} className="flex justify-between items-center">
//                     <div>
//                       <p className="font-medium text-gray-700">
//                         Payment from #{order.userId?.fullname}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(order.createdAt).toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-blue-600">
//                         +₹{order.summary.totalAmount.toFixed(2)}
//                       </p>
//                       <span className={`font-medium ${order.status === "Delivered" ? "text-green-600" : "text-red-600"}`}>
//                         {order.status === "Delivered" ? "Success" : "Pending"}
//                       </span>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Latest Transactions Table */}
//           <div className="bg-white shadow-lg p-6 rounded-lg mt-6">
//             <h2 className="text-gray-900 mb-4 font-semibold text-xl">Latest Transactions</h2>

//             <table className="w-full border-collapse text-left">
//               <thead>
//                 <tr className="border-b bg-gray-50">
//                   <th className="py-2 px-4 text-center">#</th>
//                   <th className="py-2 px-4 text-center">DATE</th>
//                   <th className="py-2 px-4 text-center">PRODUCT</th>
//                   <th className="py-2 px-4 text-center">AMOUNT</th>
//                   <th className="py-2 px-4 text-center">STATUS</th>
//                   <th className="py-2 px-4 text-center">PAYMENT STATEMENT</th>
//                   <th className="py-2 px-4 text-center">Send Statement</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentPageData.map((order, index) => (
//                   <tr key={order._id} className="border-b">
//                     <td className="py-2 px-4 text-center">
//                       {(currentPage - 1) * rowsPerPage + index + 1}
//                     </td>
//                     <td className="py-2 px-4 text-center">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="py-2 px-4 text-center">
//                       {order.cartItems.map((c) => c.food.name).join(", ")}
//                     </td>
//                     <td className="py-2 px-4 text-center">
//                       ₹{order.summary.totalAmount.toFixed(2)}
//                     </td>
//                     <td
//                       className={`py-2 px-4 text-center font-bold ${order.status === "Delivered"
//                           ? "text-green-500"
//                           : order.status === "Pending"
//                             ? "text-yellow-500"
//                             : "text-red-500"
//                         }`}
//                     >
//                       {order.status === "Delivered"
//                         ? "Success"
//                         : order.status === "Pending"
//                           ? "Pending"
//                           : "Canceled"}
//                     </td>

//                     <td className="py-2 px-4 text-center">
//                       {order.invoiceStatus || "Not Posted"}
//                     </td>

//                     <td className="py-2 px-4 text-center">
//                       <button
//                         onClick={() => handleSendStatement(order._id)}
//                         disabled={sendingInvoiceIds.includes(order._id)}
//                         className={`px-4 py-1 rounded-lg text-white transition-colors ${sendingInvoiceIds.includes(order._id)
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-blue-500 hover:bg-blue-600"
//                           }`}
//                       >
//                         {sendingInvoiceIds.includes(order._id) ? "Sent" : <IoIosSend />}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-4">
//               <span>Page {currentPage} of {totalPages}</span>
//               <div className="flex gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 bg-gray-300 rounded"
//                   onClick={() => setCurrentPage(prev => prev - 1)}
//                 >
//                   &lt;
//                 </button>
//                 <button
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1 bg-gray-300 rounded"
//                   onClick={() => setCurrentPage(prev => prev + 1)}
//                 >
//                   &gt;
//                 </button>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Transactions;

import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { IoBagCheck, IoBagHandle } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import axios from "axios";
import {
  CartesianGrid,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Line as LineRechart,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transactions = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // Fetch monthly transactions
  const fetchMonthlyTransactions = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/order/transactions/monthly"
      );
      if (data.success) setMonthlyData(data.data);
    } catch (error) {
      toast.error("Failed to fetch monthly transactions");
      console.error(error);
    }
  };

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/order/getall"
      );
      if (data.success) {
        // Sort latest orders first
        setOrders(
          data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    }
  };

  useEffect(() => {
    toast("Welcome to Transaction Overview!");
    fetchMonthlyTransactions();
    fetchAllOrders();
  }, []);

  // Remove cancelled orders if needed
  const allOrders = orders.filter((order) => order.status !== "Canceled");

  // Pagination
  const totalPages = Math.ceil(allOrders.length / rowsPerPage);
  const currentPageData = allOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Overview cards
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const totalProducts = orders.reduce(
    (acc, order) => acc + order.cartItems.length,
    0
  );

  return (
    <>
      <ToastContainer />

      <div className="flex w-full flex-col">
        <div className="bg-white rounded-md p-4 border border-gray-200 overflow-y-scroll h-[88vh]">

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Transaction Overview
          </h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <div className="flex justify-between">
                <h2>Total Orders</h2>
                <IoBagHandle className="text-orange-500 text-3xl" />
              </div>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg">
              <div className="flex justify-between">
                <h2>Pending Orders</h2>
                <FaClock className="text-red-500 text-3xl" />
              </div>
              <p className="text-2xl font-bold">{pendingOrders}</p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg">
              <div className="flex justify-between">
                <h2>Completed Orders</h2>
                <IoBagCheck className="text-green-500 text-3xl" />
              </div>
              <p className="text-2xl font-bold">{completedOrders}</p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg">
              <div className="flex justify-between">
                <h2>Total Products</h2>
                <TiShoppingCart className="text-blue-500 text-3xl" />
              </div>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>

          {/* Monthly Graph */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Transactions
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyData.map((m) => ({
                  name: m.month,
                  Income: m.totalAmount,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <LineRechart
                  type="monotone"
                  dataKey="Income"
                  stroke="#22c55e"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Latest Transactions Table */}
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Latest Transactions
            </h2>

            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-center">#</th>
                  <th className="p-3 text-center">Transaction ID</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Product</th>
                  <th className="p-3 text-center">Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Invoice</th>
                </tr>
              </thead>

              <tbody>
                {currentPageData.map((order, index) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-center">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>

                    <td className="p-3 text-center">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="p-3 text-center">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-center">
                      {order.cartItems.map((c) => c.food.name).join(", ")}
                    </td>

                    <td className="p-3 text-center">
                      ₹{order.summary.totalAmount.toFixed(2)}
                    </td>

                    <td
                      className={`p-3 text-center font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {order.status === "Delivered" ? "Success" : "Pending"}
                    </td>

                    <td className="p-3 text-center font-semibold">
                      {order.invoiceStatus || "Not Posted"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  &lt;
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  &gt;
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
