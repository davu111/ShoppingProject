import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../contexts/axios";
import { useAuth } from "../contexts/AuthContext";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Header";
import EmailVerification from "./EmailVerification";

const URL = "http://localhost:3000";

function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    account: "",
    password: "",
    confirmPassword: "",
    email: "",
    verifyCode: "",
  });

  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { account, password, confirmPassword, email, verifyCode } = formData;

    if (!account || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      setIsOpen(true);
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Duplicate account.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`/users/createUser`, formData);
      console.log("User created:", response.data);

      const res = await axios.get(`/users/getProfile`); // Đợi lấy profile
      await axios.post(`/carts/createCart/${res.data._id}`);
      console.log("Fetched profile:", res.data);
      toast.success("Authentication successful! Log in to the system");

      setUser(res.data); // Gọi context để lưu user
      navigate("/profile");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Duplicate account.");
    }
  };

  return (
    <>
      <Header name="Sign Up" />
      <div className="grid grid-cols-11">
        <form
          onSubmit={handleSubmit}
          className="col-span-11 md:col-span-5 col-start-1 md:col-start-4 bg-white shadow-md rounded-2xl p-6 mt-4 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <label className="block text-gray-600 mb-1">Account</label>
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter your account"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter password again"
            />
          </div>

          {/* <div>
            <label className="block text-gray-600 mb-1">
              Verification Code
            </label>
            <input
              type="number"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter verification code"
            />
          </div> */}

          <button
            type="submit"
            className="w-full border bg-[#ffc22c] text-black py-2 rounded hover:bg-[#ffd15d] hover:border-black/70 hover:text-black/70 transition cursor-pointer"
          >
            Registers
          </button>
        </form>
      </div>
      {isOpen && (
        <EmailVerification
          onClose={() => setIsOpen(false)}
          email={formData.email}
          handleLogin={handleLogin}
        />
      )}
    </>
  );
}

export default SignUp;
