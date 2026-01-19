import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import axios from "axios";

const TransactionDetails = () => {
  const [details, setDetails] = useState([]);

  const fetchMonthlyTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/order/transactions/monthly",
        { withCredentials: true }
      );

      if (res.data.success) {
        // Convert backend `{ month, totalAmount }` → Recharts compatible format
        const formatted = res.data.data.map((item) => ({
          name: item.month,           // "Jan", "Feb", ...
          Income: item.totalAmount,   // Number
        }));
        setDetails(formatted);
      }
    } catch (error) {
      console.error("Error loading monthly transactions:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyTransactions();
  }, []);

  return (
    <div className="h-{22rem} bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-800 font-medium">Transaction Details</strong>

      <div className="w-full mt-3 flex-1 text-xs">
        <LineChart
          width={880}
          height={250}
          data={details}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Backend key → Income */}
          <Line type="monotone" dataKey="Income" stroke="#32cd32" />
        </LineChart>
      </div>
    </div>
  );
};

export default TransactionDetails;
