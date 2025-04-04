import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import panner from "../assets/panner.jpg";
function SmallCard({ item, checked, onCheck, onClick }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex p-4 border-2 border-black hover:shadow-lg mb-1 items-center cursor-pointer">
      <input
        type="checkbox"
        className="h-[clamp(1rem,2vw,2.5rem)] w-[clamp(1rem,2vw,2.5rem)] cursor-pointer  mr-2"
        checked={checked}
        onChange={(e) => onCheck(e.target.checked)}
      ></input>
      <div
        className="h-[clamp(1rem,6vw,5rem)] w-[clamp(1rem,6vw,5rem)] border-1 border-gray-500"
        onClick={onClick}
      >
        <img src={panner} />
      </div>
      <div className="flex flex-col ml-2">
        <div className="font-bold" onClick={onClick}>
          {item.title}
        </div>
        <div className="flex flex-row text-center text-xs">
          <div
            className="border-1 border-gray-500 p-1"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <input
            className="border-y-1 border-gray-500 px-1 flex items-center justify-center font-bold focus:outline-none w-6 text-center"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          ></input>
          <div
            className="border-1 border-gray-500 p-1"
            onClick={() => setQuantity(Math.min(100, quantity + 1))}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </div>
      <div className="ml-2">{item.price}</div>
    </div>
  );
}
export default SmallCard;
