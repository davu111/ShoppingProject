import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../contexts/axios";
import { useAuth } from "../contexts/AuthContext";

import HeaderBar from "../components/HeaderBar";
import ConfirmCard from "../components/ConfirmCard";
import PopUp from "../components/PopUp";
const URL = "http://localhost:3000";

function Confirm() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // const storedUser = JSON.parse(localStorage.getItem("user"));
  const { user: storedUser } = useAuth();

  const fetchOrders = () => {
    axios
      .get(`/orders/getOrder/${storedUser._id}?status=confirm`)
      .then((response) => setOrders(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!storedUser || !storedUser._id) return navigate("/profile/signin");
    fetchOrders();
  }, []);

  const handleCancel = (orderId) => {
    axios
      .delete(`/orders/deleteOrder/${storedUser._id}/${orderId}`)
      .then((response) => {
        console.log(response.data);
        setIsOpen(false);
        fetchOrders();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <HeaderBar title="Confirm" />
      <div className="grid grid-cols-11 overflow-auto max-h-[80vh]">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="col-start-3 col-span-7 bg-black/90 rounded-2xl p-4 mb-4"
            >
              <div className="flex flex-col text-white text-xs mb-2">
                <div>Order ID: {order._id}</div>
                <div>Total: ${order.total}</div>
                <div>Order Date: {order.date.split("T")[0]}</div>
              </div>
              <div className="flex flex-col gap-1">
                {order.products.map((item) => (
                  <ConfirmCard key={item.product} item={item} />
                ))}
              </div>
              <button
                className="float-right bg-red-600 text-white text-xs px-4 py-2 rounded-2xl font-bold mt-2 hover:bg-red-400 cursor-pointer"
                onClick={() => {
                  setOrderId(order._id), setIsOpen(true);
                }}
              >
                Cancel
              </button>
            </div>
          ))
        ) : (
          <div className="col-start-5 col-span-4 text-xs md:text-xl font-bold">
            No Confirm Order
          </div>
        )}
        {isOpen && (
          <PopUp
            title="Cancel Order"
            message="Are you sure you want to cancel this order?"
            onConfirm={() => handleCancel(orderId)}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
}
export default Confirm;
