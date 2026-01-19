import { useEffect, useState } from "react";
import axios from "axios";
import {
  IoBagHandle,
  IoBarChartSharp,
  IoPeopleSharp,
  IoRestaurantSharp,
} from "react-icons/io5";

const DashboardStart = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
  });

  // -------------------------------
  // FETCH ALL ADMIN DASHBOARD DATA
  // -------------------------------
  const fetchDashboardData = async () => {
    try {
      // 1️⃣ Fetch Users (role = user)
      const usersRes = await axios.get(
        "http://localhost:8000/api/v1/user/admin/users",
        { withCredentials: true }
      );

      let totalUsers = 0;
      if (usersRes.data?.users) {
        totalUsers = usersRes.data.users.filter(
          (u) => u.role === "user"
        ).length;
      }

      // 2️⃣ Fetch Admin Products
      const productsRes = await axios.get(
        "http://localhost:8000/api/v1/food/get",
        {
          withCredentials: true,
        }
      );

      const totalProducts = productsRes.data?.foods?.length || 0;

      // 3️⃣ Fetch All Orders
      const ordersRes = await axios.get(
        "http://localhost:8000/api/v1/order/getall",
        { withCredentials: true }
      );

      const allOrders = ordersRes.data?.data || [];

      // Total Orders
      const totalOrders = allOrders.length;

      // 4️⃣ Total Sales = sum of Delivered orders only
      const deliveredOrders = allOrders.filter(
        (o) => o.status === "Delivered"
      );

      const totalSales = deliveredOrders.reduce(
        (acc, order) => acc + (order.summary?.totalAmount || 0),
        0
      );

      // Update state
      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalSales,
      });

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex gap-4 w-full">

      {/* Total Sales */}
      <div className="bg-white rounded-md p-4 flex-1 border border-gray-200 flex items-center cursor-pointer">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-purple-600">
          <IoBagHandle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-gray-500 text-sm font-light">Total Sales</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              ₹{stats.totalSales}
            </strong>
          </div>
        </div>
      </div>

      {/* Total Products */}
      <div className="bg-white rounded-md p-4 flex-1 border border-gray-200 flex items-center cursor-pointer">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-orange-500">
          <IoBarChartSharp className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-gray-500 text-sm font-light">Total Products</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {stats.totalProducts}
            </strong>
          </div>
        </div>
      </div>

      {/* Total Users */}
      <div className="bg-white rounded-md p-4 flex-1 border border-gray-200 flex items-center cursor-pointer">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-yellow-400">
          <IoPeopleSharp className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-gray-500 text-sm font-light">Total Customers</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {stats.totalUsers}
            </strong>
          </div>
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-white rounded-md p-4 flex-1 border border-gray-200 flex items-center cursor-pointer">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-green-600">
          <IoRestaurantSharp className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-gray-500 text-sm font-light">Total Orders</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {stats.totalOrders}
            </strong>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardStart;
