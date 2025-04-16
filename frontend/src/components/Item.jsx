import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import panner from "../assets/panner.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

function Item({ onClose, item }) {
  const [quantity, setQuantity] = useState(1);

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
        <div className="overflow-auto max-h-[60vh]">
          <h2 className="text-xl font-bold mb-4">{item.title}</h2>

          <img src={panner} />

          <p>{item.detail}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 px-4 py-2 text-2xl text-gray-300 hover:text-black hover:bg-red-500 "
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="pb-[60px]"></div>

        <div className="absolute bottom-0 left-0 right-0 bg-white shadow-md border-t p-4 flex items-center justify-between">
          <div className="font-bold text-xs">
            <button
              className="border-y-2 border-l-2 border-black px-4 py-2 cursor-pointer bg-[#ffc22c] hover:bg-[#fddf8d]"
              onClick={() => setQuantity(Math.max(quantity - 1, 1))}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>

            <span className="border-2 border-black px-4 py-2 ">{quantity}</span>

            <button
              className="border-y-2 border-r-2 border-black px-4 py-2 cursor-pointer bg-[#ffc22c] hover:bg-[#fddf8d]"
              onClick={() => setQuantity(Math.min(quantity + 1, item.amount))}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className="font-bold text-2xl">
            {`$${(quantity * item.price).toFixed(2)}`}
          </div>
          <div className="font-bold ">
            <Link
              to={{ pathname: "cart" }}
              className="border-2 mr-1 border-black bg-white text-black px-4 py-2 cursor-pointer hover:border-black/50 hover:text-black/50"
            >
              Add to Cart
            </Link>
            <Link
              to={{ pathname: "home/buynow" }}
              className="border-2 border-black text-black bg-[#ffc22c]  px-4 py-2 cursor-pointer hover:bg-black hover:text-[#ffc22c]"
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
