import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
// import Status from "./pages/Status";
import StatusAdmin from "./pages/StatusAdmin";
import Profile from "./pages/Profile";

import BuyNow from "./pages/BuyNow";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";

import Confirm from "./pages/Confirm";
import Shipping from "./pages/Shipping";
import Completed from "./pages/Completed";
import Reject from "./pages/Reject";

import StatusAnalysis from "./pages/StatusAnalysis";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <Router>
      {/* Navbar toggle for mobile */}
      <div className="md:hidden fixed top-2 left-2 z-50">
        <FontAwesomeIcon
          icon={faBars}
          className="text-[clamp(0.1rem,3vw,2.5rem)] p-[clamp(0.1rem,1vw,10rem)] rounded cursor-pointer"
          onClick={() => setShowMobileNav(true)}
        />
      </div>

      {/* Navbar for desktop */}
      <div className="grid grid-cols-12 transition-all duration-300 min-h-screen">
        <div
          className={`transition-all duration-300 hidden md:block ${
            isCollapsed ? "col-span-1" : "col-span-2"
          }`}
        >
          <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <div
          className={`transition-all duration-300 col-span-12 ${
            isCollapsed ? "md:col-span-11" : "md:col-span-10"
          }`}
        >
          <Routes>
            {/* <Route path="*" element={<Navigate to="/" />} /> */}

            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/status"
              element={<Navigate to="/status/confirm" replace />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart/buynow" element={<BuyNow />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/status_admin"
              element={<Navigate to="/status_admin/table" />}
            />
            <Route path="/status_admin/table" element={<StatusAdmin />} />
            <Route path="/status_admin/analysis" element={<StatusAnalysis />} />
            <Route path="/status/confirm" element={<Confirm />} />
            <Route path="/status/shipping" element={<Shipping />} />
            <Route path="/status/completed" element={<Completed />} />
            <Route path="/status/reject" element={<Reject />} />
          </Routes>
        </div>
      </div>
      {/* Navbar overlay for mobile */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="w-1/2 h-full">
            <Navbar
              isCollapsed={false}
              setIsCollapsed={() => {}}
              onCloseMobileNav={() => setShowMobileNav(false)}
            />
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
