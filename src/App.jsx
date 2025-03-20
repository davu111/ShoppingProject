import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Status from "./pages/Status";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Router>
      <div className="grid grid-cols-12 gap-4 transition-all duration-300">
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
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
