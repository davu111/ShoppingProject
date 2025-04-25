import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

function Navbar({ isCollapsed, setIsCollapsed, onCloseMobileNav }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(location.pathname);

  const handleNavClick = (path) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (path === "/profile") {
      !user ? navigate("/signin") : navigate("/profile");
    } else if (path === "/status") {
      user?.role === "admin"
        ? navigate("/status_admin")
        : navigate("/status/confirm");
    } else {
      navigate(path);
    }

    setActive(path);
    onCloseMobileNav?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    onCloseMobileNav?.();
  };

  return (
    <nav className="flex flex-col items-center min-h-screen bg-maincolor py-8 border-2 border-black">
      <div className="font-mogra underline text-2xl md:text-[clamp(0.1rem,2vw,2.5rem)] text-black flex flex-row items-center">
        <FontAwesomeIcon
          icon={faBars}
          className="mr-2 p-2 rounded-lg bg-[#ffdb7a] cursor-pointer hover:bg-[#fddf8d]"
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            onCloseMobileNav?.();
          }}
        />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } transition-all duration-300`}
        >
          ShopNow
        </span>
      </div>

      <div className="relative w-full text-2xl md:text-[clamp(0.1rem,1.5vw,2.5rem)] flex flex-col font-bold text-black mt-20">
        {paths.includes(active) && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 w-full bg-black"
            initial={{ top: 0, height: "25%" }} // Mặc định ở Home
            animate={{
              top: `${paths.indexOf(active) * 25}%`, // Dịch chuyển ngang theo vị trí tab
              height: "25%", // Chia đều cho 4 tab
            }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          />
        )}
        {paths.map((path) => (
          <div
            key={path}
            onClick={() => handleNavClick(path)}
            className={`relative w-full py-8 px-8 md:py-4 cursor-pointer text-center ${
              active === path ? "text-maincolor" : "hover:bg-[#ffdb7a]"
            }`}
          >
            <span
              className={`relative z-10 flex items-center ${
                isCollapsed ? "justify-center" : "gap-2"
              }`}
            >
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
              />
              <span
                className={`${
                  isCollapsed ? "hidden" : ""
                } transition-all duration-300`}
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
          </div>
        ))}
      </div>

      <div className="w-full text-2xl md:text-[clamp(0.1rem,1.5vw,2.5rem)] font-bold text-black mt-auto">
        <div
          className={`flex items-center px-8 py-4 hover:bg-[#ffdb7a] cursor-pointer ${
            isCollapsed ? "justify-center" : "gap-2"
          }`}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOut} />
          <span
            className={`${
              isCollapsed ? "hidden" : ""
            } transition-all duration-300`}
          >
            Exit
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
