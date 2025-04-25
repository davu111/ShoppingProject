import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import panner from "../assets/panner.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const URL = "http://localhost:3000";

function Item({ onClose, item }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (item, quantity) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser._id) {
      console.log("User not logged in");
      navigate("/signin");
      return;
    }
    axios
      .post(`${URL}/carts/addProduct/${storedUser._id}`, {
        product_id: item._id,
        quantity: quantity,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Đóng khi click bên ngoài
    >
      <motion.div
        className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg max-h-[80vh] flex flex-col"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào nội dung
      >
        <div className="overflow-auto max-h-[60vh] pb-[100px] no-scrollbar">
          <h2 className="text-xl font-bold mb-4">{item.title}</h2>

          <img src={item.img} />

          <p>{item.detail}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 px-4 py-2 text-2xl text-gray-300 hover:text-black hover:bg-red-500 rounded-tr-lg"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="pb-[100px]"></div>

        <div className="absolute bottom-0 left-0 right-0 bg-white shadow-md border-t p-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="font-bold text-xs flex items-center">
            <button
              className="border-y-2 border-l-2 border-black px-4 py-2 cursor-pointer bg-[#ffc22c] hover:bg-[#fddf8d]"
              onClick={() => setQuantity(Math.max(quantity - 1, 1))}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>

            <span className="border-2 border-black px-4 py-2">{quantity}</span>

            <button
              className="border-y-2 border-r-2 border-black px-4 py-2 cursor-pointer bg-[#ffc22c] hover:bg-[#fddf8d]"
              onClick={() => setQuantity(Math.min(quantity + 1, item.amount))}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <div className="font-bold text-xl md:text-2xl text-center">
            {`$${(quantity * item.price).toFixed(2)}`}
          </div>

          <div className="font-bold flex flex-col md:flex-row gap-2 text-center">
            <button
              onClick={() => {
                handleAddToCart(item, quantity);
                setAddedToCart(true);
                setTimeout(() => {
                  onClose();
                }, 1000);
              }}
              className="border-2 border-black bg-white text-black px-4 py-2 cursor-pointer hover:border-black/50 hover:text-black/50"
            >
              {addedToCart ? (
                <div>
                  <FontAwesomeIcon
                    className="font-bold text-green-700 mr-2"
                    icon={faCheck}
                  />
                  Added
                </div>
              ) : (
                "Add to Cart"
              )}
            </button>
            <Link
              to={{ pathname: "cart/buynow" }}
              className="border-2 border-black text-black bg-[#ffc22c] px-4 py-2 cursor-pointer hover:bg-black hover:text-[#ffc22c]"
              state={{ products: [{ ...item, quantity: quantity }] }}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Item;
