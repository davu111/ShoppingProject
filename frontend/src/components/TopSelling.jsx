import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const URL = "http://localhost:3000";

function TopSelling() {
  const [data, setData] = useState([]);

  const [month, setMonth] = useState("All");
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/orders/availableMonths`).then((res) => {
      setAvailableMonths(["All", ...res.data]);
    });
  }, []);

  useEffect(() => {
    const query = month !== "All" ? `?month=${month}` : "";
    axios.get(`${URL}/orders/topProducts${query}`).then((res) => {
      setData(res.data);
    });
  }, [month]);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 bg-white">
      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={window.innerWidth < 500 ? 20 : 120} // responsive width
              tick={renderYAxisTick}
            />
            <Tooltip formatter={(value) => [`${value}`, "Ordered"]} />
            <Legend />
            <Bar dataKey="totalSold" fill="#8884d8" name="Ordered amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function renderYAxisTick(props) {
  const { x, y, payload } = props;
  const fullName = payload.value;
  const shortName =
    fullName.length > 15 ? fullName.slice(0, 15) + "..." : fullName;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#666" title={fullName}>
        <title>{fullName}</title> {/* Tooltip mặc định khi hover */}
        {shortName}
      </text>
    </g>
  );
}

export default TopSelling;
