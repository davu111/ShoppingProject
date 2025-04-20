import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";

import panner from "../assets/panner.jpg";

const URL = "http://localhost:3000";

function BuyNow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = location.state;
  const [items, setItems] = useState(products);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("COD");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const methods = ["COD", "Credit"];
  const [error, setError] = useState("");

  const quantity = products.reduce((total) => total + 1, 0);
  const [total, setTotal] = useState(0);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser || !storedUser._id) navigate("/signin");

  useEffect(() => {
    axios.get(`${URL}/users/getUser/${storedUser._id}`).then((response) => {
      setPhone(response.data.phone);
      setAddress(response.data.address);
    });
  }, []);

  useEffect(() => {
    setTotal(
      items.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [items]);

  const handleOrder = () => {
    if (!phone.trim() || !address.trim()) {
      setError("Please enter your phone number and address.");
      return;
    }
    setError("");
    const products = [];
    items.forEach((item) =>
      products.push({
        product: item._id,
        quantity: item.quantity,
      })
    );

    axios
      .post(`${URL}/orders/createOrder/${storedUser._id}`, {
        products: products,
        payment: selected,
        total: total,
        phone: phone,
        address: address,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/status/confirm");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Header name="Payment" />
      <div className="grid grid-cols-11">
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
        <div className="flex flex-col col-start-3 col-span-7 border-2 border-black mr-4 my-4 p-4">
          {error && (
            <div className="text-red-500 font-semibold mb-2">{error}</div>
          )}
          <div className="w-full flex justify-between font-bold">
            <div>Phone</div>
            <input
              type="number"
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phones"
              className="w-1/2 p-1 outline-none text-right"
            ></input>
          </div>
          <div className="w-full flex justify-between font-bold">
            <div>Address</div>
            <input
              type="text"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your adress"
              className="w-1/2 p-1 outline-none text-right"
            ></input>
          </div>{" "}
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
          <div
            className="border-2 border-black text-black bg-[#ffc22c]  px-4 py-2 cursor-pointer hover:bg-black hover:text-[#ffc22c]"
            onClick={() => handleOrder()}
          >
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
