import { useState } from "react";
import { useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";

import panner from "../assets/panner.jpg";

function BuyNow() {
  const location = useLocation();
  const { products } = location.state;

  return (
    <>
      <Header name="Payment" />
      <div className="grid grid-cols-11">
        <div className="col-start-3 col-span-7 overflow-auto max-h-[62vh] ">
          {console.log(products)}
          {products.map((product) => (
            <PayItem key={product._id || product.id} item={product} />
          ))}
        </div>
      </div>
    </>
  );
}

function PayItem({ item }) {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  return (
    <div className="flex p-4 border-2 border-black hover:shadow-lg mb-1 items-center">
      <div className="h-[clamp(1rem,6vw,5rem)] w-[clamp(1rem,6vw,5rem)] border-1 border-gray-500">
        <img src={panner} />
      </div>
      <div className="flex flex-col ml-2">
        <div className="font-bold">{item.title}</div>
        <div className="flex flex-row text-center text-xs">
          <div
            className="border-1 border-gray-500 p-1 cursor-pointer"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <input
            className="border-y-1 border-gray-500 px-1 flex items-center justify-center font-bold focus:outline-none w-6 text-center"
            value={quantity}
            onChange={(e) => {
              setQuantity(Math.min(item.amount, Math.max(1, e.target.value)));
            }}
          ></input>
          <div
            className="border-1 border-gray-500 p-1 cursor-pointer"
            onClick={() => setQuantity(Math.min(100, quantity + 1))}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </div>
      <div className="ml-2">${(quantity * item.price).toFixed(2)}</div>
    </div>
  );
}

export default BuyNow;
