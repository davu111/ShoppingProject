import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";

import panner from "../assets/panner.jpg";

function BuyNow() {
  const location = useLocation();
  const { products } = location.state;
  const [items, setItems] = useState(products);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("COD");
  const methods = ["COD", "Credit"];

  const quantity = products.reduce((total) => total + 1, 0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(
      items.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [items]);

  return (
    <>
      <Header name="Payment" />
      <div className="grid grid-cols-11">
        {console.log(items)}

        <div className="col-start-3 col-span-7 overflow-auto max-h-[62vh] ">
          {items.map((item) => (
            <PayItem
              key={item._id}
              item={item}
              items={items}
              setItems={setItems}
            />
          ))}
        </div>
        <div className="flex items-center col-start-3 col-span-7 h-[clamp(1rem,5vw,5rem)] border-2 border-black mr-4 my-4 p-4">
          <div className="w-full flex justify-between font-bold">
            <div>Payment method</div>
            <div>
              <div
                className="relative cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selected}
                <FontAwesomeIcon icon={faChevronRight} />
                {isOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-white border-1 border-black py-2 shadow">
                    {methods.map((method) => (
                      <div
                        className="px-2 cursor-pointer hover:bg-gray-200"
                        key={method}
                        onClick={() => {
                          setSelected(method);
                          setIsOpen(false);
                        }}
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-start-3 col-span-7 flex items-center justify-between font-bold mt-4">
          <div className="text-2xl flex flex-row">
            Total
            <div className="text-lg">({quantity})</div>
          </div>
          <div className="text-2xl">${total.toFixed(2)}</div>
          <div className="border-2 border-black text-black bg-[#ffc22c]  px-4 py-2 cursor-pointer hover:bg-black hover:text-[#ffc22c]">
            BuyNow
          </div>
        </div>
      </div>
    </>
  );
}

function PayItem({ item, items, setItems }) {
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
            onClick={() =>
              setItems(
                items.map((i) =>
                  i._id === item._id
                    ? { ...i, quantity: Math.max(1, i.quantity - 1) }
                    : i
                )
              )
            }
          >
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <input
            className="border-y-1 border-gray-500 px-1 flex items-center justify-center font-bold focus:outline-none w-6 text-center"
            value={item.quantity}
            onChange={(e) =>
              setItems(
                items.map((i) =>
                  i._id === item._id
                    ? {
                        ...i,
                        quantity: Math.min(
                          i.amount,
                          Math.max(1, e.target.value)
                        ),
                      }
                    : i
                )
              )
            }
          ></input>
          <div
            className="border-1 border-gray-500 p-1 cursor-pointer"
            onClick={() =>
              setItems(
                items.map((i) =>
                  i._id === item._id
                    ? { ...i, quantity: Math.min(i.amount, i.quantity + 1) }
                    : i
                )
              )
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className="ml-2 text-sm">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;
