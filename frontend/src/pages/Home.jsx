import { useState, useEffect, useRef } from "react";

import Panner from "../assets/Panner.png";
import Card from "../components/Card";
import Item from "../components/Item";

import Items from "../data/Items.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-regular-svg-icons";

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [item, setItem] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const updatePageSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const itemWidth = 200; // Ước tính kích thước mỗi card (bao gồm margin, padding)
        const itemsPerRow = Math.floor(containerWidth / itemWidth);
        let rowsPerPage = 3; // Số hàng có thể hiển thị
        if (window.innerWidth >= 768) {
          rowsPerPage = 5;
        }

        if (window.innerWidth >= 1080) {
          rowsPerPage = 3;
        }

        setPageSize(itemsPerRow * rowsPerPage);
      }
    };

    updatePageSize(); // Gọi lần đầu khi component mount

    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const totalPages = Math.ceil(Items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = Items.slice(startIndex, startIndex + pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col">
      <img src={Panner} className="w-full border-y-2 border-black" />
      <div className="mx-2 flex-1 flex flex-row items-center">
        <FontAwesomeIcon
          icon={faSquareCaretLeft}
          className={`p-4 border-2 border-black bg-maincolor ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={handlePrevPage}
        />

        <div
          ref={containerRef}
          className="flex-1 m-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4"
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
        <FontAwesomeIcon
          icon={faSquareCaretRight}
          className={`p-4 border-2 border-black bg-maincolor ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={handleNextPage}
        />
      </div>
      {isOpen && <Item item={item} onClose={() => setIsOpen(false)} />}
    </div>
  );
}

export default Home;
