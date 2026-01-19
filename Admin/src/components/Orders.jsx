// // import { Link, useNavigate } from "react-router-dom";
// // import { FaEdit } from "react-icons/fa";
// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { ToastContainer, toast } from "react-toastify";

// // const Orders = () => {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const rowsPerPage = 6;
// //   const navigate = useNavigate();

// //   // 🔹 Fetch orders from API
// //   const fetchOrders = async () => {
// //     try {
// //       const res = await axios.get(
// //         "http://localhost:8000/api/v1/order/getAll"
// //       );

// //       if (res.status === 200 && res.data.success) {
// //         setOrders(res.data.data);
// //       } else {
// //         toast.error("Failed to fetch orders");
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       toast.error("Server error while fetching orders");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOrders();
// //     toast.success("Welcome to Order Details!");
// //   }, []);

// //   // 🔹 Pagination logic (unchanged)
// //   const totalPages = Math.ceil(orders.length / rowsPerPage);
// //   const currentPageData = orders.slice(
// //     (currentPage - 1) * rowsPerPage,
// //     currentPage * rowsPerPage
// //   );

// //   // 🔹 Status color handler
// //   const getStatusClass = (status) => {
// //     if (["ORDER_PLACED", "SHIPPED", "DELIVERED"].includes(status))
// //       return "text-green-500";

// //     if (["PENDING", "CANCELLED", "REFUND"].includes(status))
// //       return "text-red-500";

// //     if (status === "OUT_FOR_DELIVERY") return "text-yellow-500";

// //     return "text-gray-500";
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-[80vh] text-lg">
// //         Loading orders...
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <ToastContainer />

// //       <div className="flex w-full flex-col">
// //         <div className="bg-white rounded-md p-4 border border-gray-200 overflow-y-scroll h-[88vh]">

// //           {/* Header */}
// //           <h1 className="text-2xl font-bold text-gray-800 mb-4">
// //             Order Details
// //           </h1>

// //           {/* Info Banner */}
// //           <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-6 shadow-md">
// //             <p className="text-sm">
// //               Review and manage all orders. Only administrators and team leaders
// //               can access this section.
// //             </p>
// //           </div>

// //           {/* Search (kept as-is) */}
// //           <div className="flex justify-between items-center mb-4">
// //             <input
// //               type="text"
// //               placeholder="Search for order ID, customer, or status..."
// //               className="border border-gray-400 rounded-lg px-4 py-2 w-full max-w-2xl"
// //             />
// //           </div>

// //           {/* Orders Table */}
// //           <div className="bg-white rounded-lg shadow-md overflow-hidden">
// //             <table className="w-full text-gray-700">
// //               <thead>
// //                 <tr>
// //                   <th className="text-center">ID</th>
// //                   <th className="text-center">Order ID</th>
// //                   <th className="text-center">Customer Name</th>
// //                   <th className="text-center">Order Items</th>
// //                   <th className="text-center">Quantity</th>
// //                   <th className="text-center">Order Date</th>
// //                   <th className="text-center">Total Price</th>
// //                   <th className="text-center">Order Status</th>
// //                   <th className="text-center">Invoice Status</th>
// //                   <th />
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {currentPageData.map((order, index) => {
// //                   const totalQty = order.cartItems?.reduce(
// //                     (sum, i) => sum + i.quantity,
// //                     0
// //                   );

// //                   const totalPrice = order.summary?.totalAmount || "—";

// //                   return (
// //                     <tr key={order._id}>
// //                       <td className="text-center">
// //                         #{index + 1}
// //                       </td>

// //                       <td className="text-center">
// //                         #{order._id.slice(-6)}
// //                       </td>

// //                       <td className="text-center">
// //                         {order.userId?.fullname || "N/A"}
// //                       </td>

// //                       <td className="text-center">
// //                         {order.cartItems
// //                           ?.map((i) => i.food?.name)
// //                           .join(", ")}
// //                       </td>

// //                       <td className="text-center">
// //                         {totalQty}
// //                       </td>

// //                       <td className="text-center">
// //                         {new Date(order.createdAt).toLocaleDateString()}
// //                       </td>

// //                       <td className="text-center">
// //                         ₹{totalPrice}
// //                       </td>

// //                       <td
// //                         className={`${getStatusClass(
// //                           order.orderStatus
// //                         )} font-medium text-center`}
// //                       >
// //                         {order.status}
// //                       </td>

// //                       <td className="text-center font-semibold">
// //                         {order.invoiceStatus}
// //                       </td>

// //                       {/* <td className="text-center">
// //                         <button
// //                           onClick={() =>
// //                             navigate(`/OrderStatement/${order._id}`)
// //                           }
// //                         >
// //                           <FaEdit className="w-5" />
// //                         </button>
// //                       </td> */}
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination */}
// //           <div className="flex justify-between items-center mt-4">
// //             <span className="text-sm">
// //               Page {currentPage} of {totalPages}
// //             </span>

// //             <div className="flex space-x-2">
// //               <button
// //                 disabled={currentPage === 1}
// //                 onClick={() => setCurrentPage((p) => p - 1)}
// //                 className="px-4 py-2 bg-gray-200 rounded-lg"
// //               >
// //                 &lt;
// //               </button>

// //               <button
// //                 disabled={currentPage === totalPages}
// //                 onClick={() => setCurrentPage((p) => p + 1)}
// //                 className="px-4 py-2 bg-gray-200 rounded-lg"
// //               >
// //                 &gt;
// //               </button>
// //             </div>
// //           </div>

// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Orders;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   const rowsPerPage = 6;
//   const navigate = useNavigate();

//   // 🔹 Fetch orders from API
//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/v1/order/getAll"
//       );

//       if (res.status === 200 && res.data.success) {
//         setOrders(res.data.data);
//       } else {
//         toast.error("Failed to fetch orders");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Server error while fetching orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     toast.success("Welcome to Order Details!");
//   }, []);

//   // 🔹 Pagination
//   const totalPages = Math.ceil(orders.length / rowsPerPage);
//   const currentPageData = orders.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );


  
//   // 🔹 Status color handler
//   const getStatusClass = (status) => {
//     if (["Assigned", "Delivered"].includes(status))
//       return "text-green-600";

//     if (["Pending", "Canceled"].includes(status))
//       return "text-red-500";

//     return "text-gray-500";
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[80vh] text-lg">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />

//       <div className="flex w-full flex-col">
//         <div className="bg-white rounded-md p-4 border border-gray-200 overflow-y-scroll h-[88vh]">

//           {/* Header */}
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">
//             Order Details
//           </h1>

//           {/* Info Banner */}
//           <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-6 shadow-md">
//             <p className="text-sm">
//               Review and manage all orders. Only administrators and team leaders
//               can access this section.
//             </p>
//           </div>

//           {/* Orders Table */}
//           <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//             <table className="w-full text-gray-700 border-collapse">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3 text-center">#</th>
//                   <th className="p-3 text-center">Order ID</th>
//                   <th className="p-3 text-center">Customer</th>
//                   <th className="p-3 text-center">Items</th>
//                   <th className="p-3 text-center">Qty</th>
//                   <th className="p-3 text-center">Date</th>
//                   <th className="p-3 text-center">Amount</th>
//                   <th className="p-3 text-center">Status</th>
//                   <th className="p-3 text-center">Invoice</th>
//                   <th className="p-3 text-center">Delivery Boy</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentPageData.length === 0 ? (
//                   <tr>
//                     <td colSpan="10" className="text-center py-6">
//                       No orders found.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentPageData.map((order, index) => {
//                     const totalQty = order.cartItems?.reduce(
//                       (sum, item) => sum + item.quantity,
//                       0
//                     );

//                     return (
//                       <tr
//                         key={order._id}
//                         className="border-t hover:bg-gray-50"
//                       >
//                         <td className="p-3 text-center">
//                           {(currentPage - 1) * rowsPerPage + index + 1}
//                         </td>

//                         <td className="p-3 text-center">
//                           #{order._id.slice(-6)}
//                         </td>

//                         <td className="p-3 text-center">
//                           {order.userId?.fullname || "N/A"}
//                         </td>

//                         <td className="p-3 text-center">
//                           {order.cartItems
//                             ?.map((i) => i.food?.name)
//                             .join(", ")}
//                         </td>

//                         <td className="p-3 text-center">
//                           {totalQty}
//                         </td>

//                         <td className="p-3 text-center">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </td>

//                         <td className="p-3 text-center">
//                           ₹{order.summary?.totalAmount}
//                         </td>

//                         <td
//                           className={`p-3 text-center font-medium ${getStatusClass(
//                             order.status
//                           )}`}
//                         >
//                           {order.status}
//                         </td>

//                         <td className="p-3 text-center font-semibold">
//                           {order.invoiceStatus}
//                         </td>

//                         {/* ✅ Delivery Boy Column */}
//                         <td className="p-3 text-center font-medium">
//                           {order.deliveryBoyId
//                             ? order.deliveryBoyId.fullname
//                             : "Not Assigned"}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-between items-center mt-4">
//             <span className="text-sm text-gray-600">
//               Page {currentPage} of {totalPages}
//             </span>

//             <div className="flex space-x-2">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//               >
//                 &lt;
//               </button>

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//               >
//                 &gt;
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Orders;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 6;
  const navigate = useNavigate();

  // 🔹 Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/order/getAll"
      );

      if (res.status === 200 && res.data.success) {
        setOrders(res.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    toast.success("Welcome to Order Details!");
  }, []);

  /* ================================
     🔹 CHANGE #1: SORT ORDERS
     Latest order comes first
  ================================= */
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  /* ================================
     🔹 CHANGE #2: PAGINATION
     Now uses sortedOrders
  ================================= */
  const totalPages = Math.ceil(sortedOrders.length / rowsPerPage);

  const currentPageData = sortedOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // 🔹 Status color handler
  const getStatusClass = (status) => {
    if (["Assigned", "Delivered"].includes(status))
      return "text-green-600";

    if (["Pending", "Canceled"].includes(status))
      return "text-red-500";

    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-lg">
        Loading orders...
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="flex w-full flex-col">
        <div className="bg-white rounded-md p-4 border border-gray-200 overflow-y-scroll h-[88vh]">

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Order Details
          </h1>

          {/* Info Banner */}
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-6 shadow-md">
            <p className="text-sm">
              Review and manage all orders. Only administrators and team leaders
              can access this section.
            </p>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-gray-700 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-center">#</th>
                  <th className="p-3 text-center">Order ID</th>
                  <th className="p-3 text-center">Customer</th>
                  <th className="p-3 text-center">Items</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Invoice</th>
                  <th className="p-3 text-center">Delivery Boy</th>
                </tr>
              </thead>

              <tbody>
                {currentPageData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  currentPageData.map((order, index) => {
                    const totalQty = order.cartItems?.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );

                    return (
                      <tr
                        key={order._id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3 text-center">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>

                        <td className="p-3 text-center">
                          #{order._id.slice(-6)}
                        </td>

                        <td className="p-3 text-center">
                          {order.userId?.fullname || "N/A"}
                        </td>

                        <td className="p-3 text-center">
                          {order.cartItems
                            ?.map((i) => i.food?.name)
                            .join(", ")}
                        </td>

                        <td className="p-3 text-center">
                          {totalQty}
                        </td>

                        <td className="p-3 text-center">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-3 text-center">
                          ₹{order.summary?.totalAmount}
                        </td>

                        <td
                          className={`p-3 text-center font-medium ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </td>

                        <td className="p-3 text-center font-semibold">
                          {order.invoiceStatus}
                        </td>

                        <td className="p-3 text-center font-medium">
                          {order.deliveryBoyId
                            ? order.deliveryBoyId.fullname
                            : "Not Assigned"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                &lt;
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Orders;
