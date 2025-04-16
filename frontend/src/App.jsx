import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Status from "./pages/Status";
import Profile from "./pages/Profile";

import BuyNow from "./pages/BuyNow";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Router>
      <div className="grid grid-cols-12 transition-all duration-300">
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "col-span-1" : "col-span-2"
          } `}
        >
          <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "col-span-11" : "col-span-10"
          } `}
        >
          <Routes>
            {/* <Route path="*" element={<Navigate to="/" />} /> */}

            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/status" element={<Status />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/home/buynow" element={<BuyNow />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
