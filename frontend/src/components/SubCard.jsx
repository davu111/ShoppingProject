import { motion } from "framer-motion";
import panner from "../assets/panner.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function SubCard({ onClose, item }) {
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
        <div className="overflow-auto max-h-[60vh] no-scrollbar">
          <h2 className="text-xl font-bold mb-4">{item.title}</h2>

          <img src={item.img} />

          <p>{item.detail}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 px-4 py-2 text-2xl text-gray-300 hover:text-black hover:bg-red-500 "
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default SubCard;
