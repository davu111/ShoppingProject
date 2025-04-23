import { useState, useEffect } from "react";
import axios from "axios";

import panner from "../assets/panner.jpg";

const URL = "http://localhost:3000";

function ConfirmCard({ item }) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`${URL}/products/getProduct/${item.product}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="flex p-2 bg-white border-2 border-black hover:shadow-lg items-center rounded-lg">
      <div className="h-[clamp(1rem,2vw,5rem)] w-[clamp(1rem,2vw,5rem)] border-1 border-gray-500">
        <img src={product.img} />
      </div>
      <div className="flex flex-col ml-2">
        <div className="font-bold">{product.title}</div>
        <div className="flex flex-row text-center text-xs">
          <div>x{item.quantity}</div>
          <div className="ml-2">
            ${(product.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ConfirmCard;
