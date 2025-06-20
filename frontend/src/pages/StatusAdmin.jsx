import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import OrderItem from "../components/OrderItem";
import StatusAdminHeader from "../components/StatusAdminHeader";
import PopUp from "../components/PopUp";

const URL = "http://localhost:3000";

function StatusAdmin() {
  const [orders, setOrders] = useState([]);
  const [orderOpen, setOrderOpen] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const cols = ["ID", "Date", "Phone", "Address", "Total", "Payment", "Status"];
  const colKeyMap = [
    "_id",
    "date",
    "phone",
    "address",
    "total",
    "payment",
    "status",
  ];

  const fetchOrders = async (sortKey = "date", direction = "desc") => {
    try {
      const res = await axios.get(`${URL}/orders/getOrders`, {
        params: { sortBy: sortKey, direction },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders(sortConfig.key, sortConfig.direction);
  }, [sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <>
      <StatusAdminHeader title="Table" />
      <div className="max-h-[75vh] overflow-y-auto m-4 bg-white no-scrollbar">
        <table className="w-full text-sm text-left bg-white text-black border border-black">
          <thead className="sticky top-0 text-xs uppercase bg-maincolor text-black">
            <tr>
              {cols.map((col, index) => {
                const keycol = colKeyMap[index];
                const isActive = sortConfig.key === keycol;
                return (
                  <th
                    key={col}
                    className="px-4 py-2 cursor-pointer select-none hover:bg-yellow-500"
                    onClick={() => handleSort(keycol)}
                  >
                    {col}
                    {isActive
                      ? sortConfig.direction === "asc"
                        ? " ↑"
                        : " ↓"
                      : ""}
                  </th>
                );
              })}
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
                    ? order.address.length > 25
                      ? `${order.address.slice(0, 25)}...`
                      : order.address
                    : "N/A"}
                </td>
                <td className="px-4 py-2">${order.total.toFixed(2)}</td>
                <td className="px-4 py-2">{order.payment}</td>
                <td className="px-4 py-2 capitalize">
                  <OrderStatus
                    order={order}
                    fetchOrders={() =>
                      fetchOrders(sortConfig.key, sortConfig.direction)
                    }
                  />
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
  const [isPopUp, setIsPopUp] = useState("");

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
    setIsPopUp("");
  };

  const handleAccept = async (products) => {
    const errorMessages = [];

    await Promise.all(
      products.map((product) => {
        console.log("Sending:", {
          id: product.product,
          quantity: product.quantity,
        });
        return axios
          .put(`${URL}/products/updateProduct/${product.product}`, {
            quantity: product.quantity,
          })
          .then((response) => {
            console.log("Updated:", response.data);
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              errorMessages.push(error.response.data.message);
            } else {
              console.error("Unexpected error:", error);
            }
          });
      })
    );
    if (errorMessages.length > 0) {
      // Gộp các lỗi và hiển thị
      setIsPopUp("");
      toast.error(
        <div>
          {errorMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      );
    } else {
      updateStatus("shipping");
      toast.success("Order accepted successfully"); // ✅ Cũng có thể dùng alert ở đây nếu muốn đồng bộ
    }
  };

  const handleReject = () => updateStatus("reject");

  return (
    <div>
      {status === "confirm" && (
        <div className="flex items-center justify-center gap-4 font-bold ">
          <div
            className="text-green-700 cursor-pointer rounded-full hover:bg-green-100 px-1"
            onClick={() => setIsPopUp("confirm")}
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div
            className="text-red-700 cursor-pointer rounded-full hover:bg-red-100 px-1"
            onClick={() => setIsPopUp("reject")}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      )}
      {status === "shipping" && (
        <div className="bg-yellow-200 text-yellow-700 flex justify-center py-1 rounded">
          Shipping
        </div>
      )}
      {status === "reject" && (
        <div className="bg-red-200 text-red-700 flex justify-center py-1 rounded">
          Reject
        </div>
      )}
      {status === "completed" && (
        <div className="bg-green-200 text-green-700 flex justify-center py-1 rounded">
          Completed
        </div>
      )}
      {isPopUp === "confirm" && (
        <PopUp
          onConfirm={() => handleAccept(order.products)}
          onClose={() => setIsPopUp("")}
          title="Accept?"
          message="Are you sure you want to accept this order?"
        />
      )}
      {isPopUp === "reject" && (
        <PopUp
          onConfirm={handleReject}
          onClose={() => setIsPopUp("")}
          title="Reject?"
          message="Are you sure you want to reject this order?"
        />
      )}
    </div>
  );
}

export default StatusAdmin;
