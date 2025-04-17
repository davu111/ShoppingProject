import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import PopUp from "./PopUp";
import panner from "../assets/panner.jpg";
function SmallCard({
  item,
  checked,
  onCheck,
  onClick,
  onQuantityChange,
  quantity,
  setIsEditing,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex p-4 border-2 border-black hover:shadow-lg mb-1 items-center group cursor-pointer">
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
            onClick={() => {
              onQuantityChange(Math.max(1, quantity - 1));
              setIsEditing(true);
            }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <input
            className="border-y-1 border-gray-500 px-1 flex items-center justify-center font-bold focus:outline-none w-6 text-center"
            value={quantity}
            onChange={(e) => {
              onQuantityChange(e.target.value);
              setIsEditing(true);
            }}
          ></input>
          <div
            className="border-1 border-gray-500 p-1"
            onClick={() => {
              onQuantityChange(Math.min(100, quantity + 1));
              setIsEditing(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className="ml-2 text-sm">
            ${(quantity * item.price).toFixed(2)}
          </div>
        </div>
      </div>
      <FontAwesomeIcon
        icon={faTrashCan}
        className="ml-auto opacity-0 text-red-200 hover:text-red-400 group-hover:opacity-100 cursor-pointer"
        onClick={() => setIsOpen(true)}
      ></FontAwesomeIcon>
      {isOpen && (
        <PopUp
          title="Delete Item"
          message="Are you sure you want to delete this item?"
          onConfirm={() => {
            onDelete();
            setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
export default SmallCard;
