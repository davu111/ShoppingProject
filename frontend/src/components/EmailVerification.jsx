import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const URL = "http://localhost:3000";

function Body({ email, handleLogin }) {
  const [code, setCode] = useState("");

  const sendVerificationCode = async () => {
    try {
      const res = await fetch(`${URL}/mails/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Verification code has been sent to your email");
      } else {
        toast.error(data.message || "Error sending verification code");
      }
    } catch (err) {
      toast.error("System error");
    }
  };

  useEffect(() => {
    sendVerificationCode();
  }, []);

  const verifyCode = async () => {
    try {
      const res = await fetch(`${URL}/mails/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok) {
        handleLogin();
        // redirect or update auth state
      } else {
        toast.error(data.message || "Not correct code");
      }
    } catch (err) {
      toast.error("System error");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <>
        <h2 className="text-2xl font-bold">Enter Verification Code</h2>
        <input
          type="text"
          placeholder="Nhập mã xác thực"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={verifyCode}
          className="w-full bg-green-600 text-white p-2 rounded cursor-pointer hover:bg-green-700"
        >
          Submit
        </button>
      </>
      <div
        className="text-blue-500 cursor-pointer text-xs hover:text-blue-700"
        onClick={() => {
          sendVerificationCode();
        }}
      >
        Re-send verification code
      </div>
    </div>
  );
}

function EmailVerification({ onClose, email, handleLogin }) {
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
        <Body email={email} handleLogin={handleLogin} />
      </motion.div>
    </motion.div>
  );
}

export default EmailVerification;
