import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../contexts/axios";
import { useAuth } from "../contexts/AuthContext";

import HeaderBar from "../components/HeaderBar";
import ConfirmCard from "../components/ConfirmCard";
// const URL = "http://localhost:3000";

function Shipping() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);

  // const storedUser = JSON.parse(localStorage.getItem("user"));
  const { user: storedUser } = useAuth();
  if (!storedUser || !storedUser._id) navigate("/profile/signin");

  const fetchOrders = () => {
    axios
      .get(`/orders/getOrder/${storedUser._id}?status=completed`)
      .then((response) => setOrders(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrder = (order) => {
    const promises = order.map((product) =>
      axios.get(`/products/getProduct/${product.product}`).then((response) => ({
        ...response.data,
        quantity: product.quantity,
      }))
    );

    Promise.all(promises)
      .then((itemsWithQuantity) => {
        navigate("/cart/buynow", { state: { products: itemsWithQuantity } });
      })
      .catch((error) => {
        console.error("Failed to fetch product details:", error);
      });
  };

  return (
    <>
      <HeaderBar title="Completed" />
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
                onClick={() => handleOrder(order.products)}
                className="float-right bg-yellow-600 text-white text-xs px-4 py-2 rounded-2xl font-bold mt-2 hover:bg-yellow-500 cursor-pointer"
              >
                Order again
              </button>
            </div>
          ))
        ) : (
          <div className="col-start-5 col-span-4 text-xs md:text-xl font-bold">
            No Completed Order
          </div>
        )}
      </div>
    </>
  );
}
export default Shipping;
