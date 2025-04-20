import { motion } from "framer-motion";

function PopUp({ title, message, onConfirm, onClose }) {
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
        <div className="max-h-[60vh]">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p>{message}</p>
          <div className="flex flex-row-reverse gap-2 mt-4">
            <button
              className="border-2 border-black text-black bg-white  px-4 py-2 cursor-pointer hover:border-black/50 hover:text-black/50"
              onClick={() => onClose()}
            >
              No
            </button>
            <button
              className="border-2 border-black text-black bg-[#ffc22c]  px-4 py-2 cursor-pointer hover:bg-black hover:text-[#ffc22c]"
              onClick={() => onConfirm()}
            >
              Yes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PopUp;
