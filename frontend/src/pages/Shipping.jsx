import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import HeaderBar from "../components/HeaderBar";
import ConfirmCard from "../components/ConfirmCard";
const URL = "http://localhost:3000";

function Shipping() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser || !storedUser._id) navigate("/signin");

  const fetchOrders = () => {
    axios
      .get(`${URL}/orders/getOrder/${storedUser._id}?status=shipping`)
      .then((response) => setOrders(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReceived = (orderId) => {
    axios
      .put(`${URL}/orders/updateOrder/${storedUser._id}/${orderId}`, {
        status: "completed",
      })
      .then((response) => {
        console.log(response.data);
        fetchOrders();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <HeaderBar title="Shipping" />
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
                className="float-right bg-green-600 text-white text-xs px-4 py-2 rounded-2xl font-bold mt-2 hover:bg-green-500 cursor-pointer"
                onClick={() => handleReceived(order._id)}
              >
                Received
              </button>
            </div>
          ))
        ) : (
          <div className="col-start-5 col-span-4 font-bold">
            No Shipping Order
          </div>
        )}
      </div>
    </>
  );
}
export default Shipping;
