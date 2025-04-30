import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const URL = "http://localhost:3000";
const STATUS_ORDER = ["confirm", "shipping", "completed", "reject"];
// Ánh xạ status -> màu sắc cố định
const STATUS_COLORS = {
  confirm: "#FFBB28",
  completed: "#00C49F",
  reject: "#FF8042",
  shipping: "#0088FE",
  failed: "#d9534f", // nếu có thêm trạng thái khác
};

// Custom tooltip hiển thị số lượng
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "8px",
          border: "1px solid #ccc",
        }}
      >
        <strong>{name}</strong>: {value}
      </div>
    );
  }
  return null;
};

// Custom label hiển thị phần trăm
const renderLabel = ({ percent }) => `${(percent * 100).toFixed(1)}%`;

const StatusPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/orders/statusStats`).then((res) => {
      const raw = res.data;

      // Convert raw data to map for easy lookup
      const map = {};
      raw.forEach((item) => {
        map[item._id] = item.count;
      });

      // Sắp xếp theo STATUS_ORDER và gán count tương ứng (nếu không có thì là 0)
      const formatted = STATUS_ORDER.map((status) => ({
        name: status,
        value: map[status] || 0,
      }));

      setData(formatted);
    });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%" // Dùng phần trăm để responsive
              label={renderLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.name] || "#ccc"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusPieChart;
