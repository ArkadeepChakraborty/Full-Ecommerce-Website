import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#dc2626", "#a855f7"];

const RADIAN = Math.PI / 180;

// Custom label inside the pie slice
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function BuyerChart() {
  const [data, setData] = useState([]);

  // Fetch category statistics on mount
  const fetchCategoryStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/order/food/categorystats",
        { withCredentials: true }
      );

      if (res.data.success) {
        const transformed = res.data.data.map((item) => ({
          name: item.category,
          value: item.percentage, // recharts key
        }));

        setData(transformed);
      }
    } catch (error) {
      console.error("Error fetching category stats:", error);
    }
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  return (
    <div className="w-80 h-{22rem} bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
      <strong className="text-gray-800 font-medium">Buyer Profile</strong>

      <div className="w-full mt-3 flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={500} height={500}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value" // % value
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* Legend showing categories */}
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={10}
              formatter={(value) => {
                const index = data.findIndex((d) => d.name === value);
                return (
                  <span style={{ color: COLORS[index] }}>{value}</span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BuyerChart;
