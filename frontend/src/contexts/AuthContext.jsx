import { createContext, useContext, useState, useEffect } from "react";
import axios from "../contexts/axios";

const AuthContext = createContext();
const URL = "http://localhost:3000/users";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    console.log("useEffect");
    const token = document.cookie.includes("token="); // Kiểm tra token trong cookie

    if (!token) {
      setChecking(false); // Nếu không có token, set checking = false và không gọi API
      console.log("no token");
      return;
    }
    const checkAuth = async () => {
      try {
        const res = await axios.get(`users/profile`);
        console.log(res.data);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setChecking(false);
      }
    };
    if (!user) {
      // Chỉ gọi khi chưa có user
      checkAuth();
    } else {
      setChecking(false);
    }
  }, [user]);

  const logout = async () => {
    await axios.post(`/users/logout`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, checking, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
