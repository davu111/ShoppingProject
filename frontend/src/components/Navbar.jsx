import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../index.css";
import {
  faBars,
  faCartShopping,
  faHome,
  faBox,
  faUser,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const paths = ["/", "/cart", "/status", "/profile"];

function Navbar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  return (
    <nav className="flex flex-col items-center h-screen bg-maincolor py-8 border-2 border-black">
      <div className="font-mogra underline text-[clamp(1rem,2vw,2.5rem)] text-black flex flex-row items-center">
        <FontAwesomeIcon
          icon={faBars}
          className="mr-2 p-2 rounded-lg bg-[#ffdb7a] cursor-pointer hover:bg-[#fddf8d]"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        <span
          className={`transition-all duration-300 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          ShopNow
        </span>
      </div>
      <div className="relative w-full text-[clamp(1rem,1.5vw,2.5rem)] flex flex-col  font-bold text-black mt-20">
        {paths.includes(active) && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 w-full bg-black"
            initial={{ top: 0, height: "25%" }} // Mặc định ở Home
            animate={{
              top: `${paths.indexOf(active) * 25}%`, // Dịch chuyển ngang theo vị trí tab
              height: "25%", // Chia đều cho 4 tab
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
        )}
        {paths.map((path) => (
          <Link
            key={path}
            to={path}
            onClick={() => setActive(path)}
            className={`relative w-full px-8 py-4  cursor-pointer text-center ${
              active === path ? "text-maincolor " : "hover:bg-[#ffdb7a] "
            }`}
          >
            <span className={`relative z-10 flex items-center gap-2 `}>
              <FontAwesomeIcon
                icon={
                  path === "/"
                    ? faHome
                    : path === "/cart"
                    ? faCartShopping
                    : path === "/status"
                    ? faBox
                    : faUser
                }
              ></FontAwesomeIcon>
              <span
                className={`transition-all duration-300 ${
                  isCollapsed ? "hidden" : ""
                }`}
              >
                {path === "/"
                  ? "Home"
                  : path === "/cart"
                  ? "Cart"
                  : path === "/status"
                  ? "Status"
                  : "Profile"}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className=" w-full text-[clamp(1rem,1.5vw,2.5rem)] font-bold text-black mt-auto">
        <div className="px-8 py-4 hover:bg-[#ffdb7a]  cursor-pointer">
          <FontAwesomeIcon icon={faSignOut} className="mr-2"></FontAwesomeIcon>
          <span
            className={`transition-all duration-300 ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Log out
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
