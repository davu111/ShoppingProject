import { useState } from "react";
import axios from "../contexts/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Header from "./Header";

const URL = "http://localhost:3000";

function SignIn() {
  const { setUser } = useAuth(); // gọi hook

  const [formData, setFormData] = useState({
    account: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { account, password } = formData;

    if (!account || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`/users/login`, formData);
      const userData = response.data.message;
      console.log(response);

      if (userData === "Login successful") {
        // localStorage.setItem("user", JSON.stringify(userData));
        const res = await axios.get(`/users/getProfile`);
        console.log(res.data);
        setUser(res.data); // cập nhật user vào AuthContext
        setError("");
        navigate("/profile", { replace: true });
      } else setError("User not found. Please try again.");
    } catch (err) {
      console.error("Login failed:", err.response?.status, err.response?.data);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <Header name="Sign In" />
      <div className="grid grid-cols-11 p-6">
        <form
          onSubmit={handleSubmit}
          className="col-span-11 md:col-span-5 col-start-1 md:col-start-4 bg-white shadow-md rounded-2xl p-6 mt-8 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Sign In</h2>

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
          <div className="flex flex-row-reverse gap-2">
            <button
              type="submit"
              className="p-4 border bg-[#ffc22c] text-black py-2 rounded hover:bg-[#ffd15d] hover:border-black/70 hover:text-black/70 transition cursor-pointer"
            >
              Log In
            </button>
            <button
              type="submit"
              className="p-4 border bg-white text-black py-2 rounded hover:border-black/70 hover:text-black/70 transition cursor-pointer"
              onClick={() => navigate("/profile/signup")}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignIn;
