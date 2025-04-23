import { useState, useEffect, useRef } from "react";
import axios from "axios";

import Panner from "../assets/Panner.png";
import Card from "../components/Card";
import Item from "../components/Item";

// import Items from "../data/Items.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-regular-svg-icons";
const URL = "http://localhost:3000";

function Home() {
  const [Items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    axios
      .get(`${URL}/products/getProducts`)
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const updatePageSize = () => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const itemWidth = 200;
          const itemsPerRow = Math.floor(containerWidth / itemWidth);
          let rowsPerPage = 4;

          if (window.innerWidth >= 475) rowsPerPage = 8;
          if (window.innerWidth >= 600) rowsPerPage = 6;
          if (window.innerWidth >= 650) rowsPerPage = 3;
          if (window.innerWidth >= 768) rowsPerPage = 4;
          if (window.innerWidth >= 895) rowsPerPage = 3;
          if (window.innerWidth >= 1024) rowsPerPage = 3;

          setPageSize(itemsPerRow * rowsPerPage);
        }
      };

      updatePageSize();
      window.addEventListener("resize", updatePageSize);
      return () => window.removeEventListener("resize", updatePageSize);
    }
  }, [isMobile]);

  const totalPages = Math.ceil(Items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = isMobile
    ? Items
    : Items.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col w-full h-full">
      <img src={Panner} className="w-full border-y-2 border-black" />
      <div className="mx-2 flex-1 flex flex-row items-center">
        {!isMobile && (
          <FontAwesomeIcon
            icon={faSquareCaretLeft}
            className={`p-4 border-2 border-black bg-maincolor ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          />
        )}

        <div
          ref={containerRef}
          className="flex-1 m-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto"
        >
          {currentItems.map((item) => (
            <Card
              key={item._id}
              item={item}
              className="item-card"
              onClick={() => {
                setIsOpen(true);
                setItem(item);
              }}
            />
          ))}
        </div>

        {!isMobile && (
          <FontAwesomeIcon
            icon={faSquareCaretRight}
            className={`p-4 border-2 border-black bg-maincolor ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        )}
      </div>

      {isOpen && <Item item={item} onClose={() => setIsOpen(false)} />}
    </div>
  );
}

export default Home;
