import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";
import OrderItem from "../components/OrderItem";

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
  const [orderOpen, setOrderOpen] = useState(null);

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
      <div className="max-h-[70vh] overflow-y-auto m-4 bg-white no-scrollbar">
        <table className="w-full text-sm text-left bg-white text-black border border-black">
          <thead className="sticky top-0 text-xs uppercase bg-maincolor text-black">
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
                className="border-t border-gray-600 hover:bg-gray-200 transition"
              >
                <td
                  className="px-4 py-2 max-w-[100px] truncate underline cursor-pointer text-blue-500"
                  title={order._id}
                  onClick={() => setOrderOpen(order.products)}
                >
                  {order._id}
                </td>
                <td className="px-4 py-2">{order.date?.split("T")[0]}</td>
                <td className="px-4 py-2">{order.phone || "N/A"}</td>
                <td
                  className="px-4 py-2 max-w-[200px] whitespace-normal break-words"
                  title={order.address}
                >
                  {order.address
                    ? order.address > 100
                      ? `${order.address.slice(0, 100)}...`
                      : order.address
                    : "N/A"}
                </td>
                <td className="px-4 py-2">${order.total}</td>
                <td className="px-4 py-2">{order.payment}</td>
                <td className="px-4 py-2 capitalize">
                  <OrderStatus order={order} fetchOrders={fetchOrders} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orderOpen && (
        <OrderItem onClose={() => setOrderOpen(null)} products={orderOpen} />
      )}
    </>
  );
}

function OrderStatus({ order, fetchOrders }) {
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

  const handleAccept = () => updateStatus("shipping");
  const handleReject = () => updateStatus("reject");

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
      {status === "completed" && (
        <div className="text-green-700">Completed</div>
      )}
    </div>
  );
}

export default StatusAdmin;
