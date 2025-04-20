import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import panner from "../assets/panner.jpg";

const URL = "http://localhost:3000";

function OrderItem({ onClose, products }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Đóng khi click bên ngoài
    >
      <motion.div
        className="relative bg-white p-6 rounded-lg shadow-lg max-w-2lg max-h-[80vh] flex flex-col"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào nội dung
      >
        <div className="overflow-auto max-h-[60vh] no-scrollbar">
          {products.map((item) => (
            <Item key={item._id} item={item} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Item({ item }) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    console.log(item);
    axios
      .get(`${URL}/products/getProduct/${item.product}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div className="w-lg flex p-2 bg-white border-2 border-black hover:shadow-lg items-center rounded-lg">
      <div className="h-[clamp(1rem,2vw,5rem)] w-[clamp(1rem,2vw,5rem)] border-1 border-gray-500">
        <img src={panner} />
      </div>
      <div className="flex flex-col ml-2">
        <div className="font-bold">{product.title}</div>
        <div className="flex flex-row text-center text-xs">
          <div>x{item.quantity}</div>
          <div className="ml-2">
            ${(product.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderItem;
