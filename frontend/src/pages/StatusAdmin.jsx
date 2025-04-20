import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";

const URL = "http://localhost:3000";
const cols = [
  "Order ID",
  "Date",
  "Phone",
  "Address",
  "Total",
  "Payment",
  "Status",
];

function StatusAdmin() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios
      .get(`${URL}/orders/getOrders`)
      .then((response) => setOrders(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Header name="Status" />
      <div className="p-4 bg-white rounded-xl">
        <table className="w-full text-sm text-left bg-white text-black border border-black">
          <thead className="text-xs uppercase bg-maincolor text-black">
            <tr>
              {cols.map((col) => (
                <th key={col} className="px-4 py-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t border-gray-600 hover:bg-gray-700 transition"
              >
                <td
                  className="px-4 py-2 max-w-[100px] truncate"
                  title={order._id}
                >
                  {order._id}
                </td>
                <td className="px-4 py-2">{order.date?.split("T")[0]}</td>
                <td className="px-4 py-2">{order.phone || "N/A"}</td>
                <td className="px-4 py-2">{order.address || "N/A"}</td>
                <td className="px-4 py-2">${order.total}</td>
                <td className="px-4 py-2">{order.payment}</td>
                <td className="px-4 py-2 capitalize">
                  <OrderStatus order={order} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function OrderStatus({ order }) {
  const { _id: orderId, user, status, ...rest } = order;

  const updateStatus = (status) => {
    axios
      .put(`${URL}/orders/updateOrder/${user}/${orderId}`, {
        status,
      })
      .then((response) => {
        console.log(response.data);
        fetchOrders();
      })
      .catch((error) => console.error(error));
  };

  const handleAccept = () => updateOrderStatus("shipping");
  const handleReject = () => updateOrderStatus("reject");

  return (
    <div>
      {status === "confirm" && (
        <div className="flex items-center flex-row-reverse gap-4 font-bold">
          <div
            className="flex items-center gap-1 text-green-700 cursor-pointer"
            onClick={() => handleAccept()}
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div
            className="flex items-center gap-1 text-red-700 cursor-pointer"
            onClick={() => handleReject()}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      )}
      {status === "shipping" && <div className="text-gray-700">Shipping</div>}
      {status === "reject" && <div className="text-red-700">Rejected</div>}
    </div>
  );
}

export default StatusAdmin;
