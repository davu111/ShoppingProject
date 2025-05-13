import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "../contexts/axios";
import { useAuth } from "../contexts/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";
import SmallCard from "../components/SmallCard";
import SubCard from "../components/SubCard";
// const URL = "http://localhost:3000";

function Cart() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [isItemOpen, setIsItemOpen] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const { user } = useAuth();
  useEffect(() => {
    console.log(user);
    if (!user || !user._id) return navigate("/profile/signin");
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .get(`/carts/getCart/${user._id}`)
        .then((response) => {
          const products = response.data || [];
          setLists(products);

          const quantites = {};
          products.forEach((item) => {
            quantites[item._id] = item.quantity;
          });
          setItemQuantities(quantites);
          setIsChange(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [isChange]);

  const handleCheckAll = () => {
    const newValue = !isCheckAll;
    setIsCheckAll(newValue);

    const updatedChecks = {};
    lists.forEach((item) => (updatedChecks[item._id] = newValue));
    setCheckedItems(updatedChecks);
  };

  const handleItemCheck = (id, checked) => {
    const updated = { ...checkedItems, [id]: checked };
    setCheckedItems(updated);

    const allChecked = lists.every((item) => updated[item._id]);
    setIsCheckAll(allChecked);
  };

  const handleQuantityChange = (id, quantity) => {
    setItemQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    const products = lists;
    const quantites = {};
    products.forEach((item) => {
      quantites[item._id] = item.quantity;
    });
    setItemQuantities(quantites);
  };

  const handleDoneEditing = () => {
    axios
      .put(`/carts/updateQuantity/${user._id}`, itemQuantities)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
    setIsChange(true);
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    axios
      .delete(`/carts/deleteProduct/${user._id}/${id}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
    setIsChange(true);
  };

  const quantity = Object.values(checkedItems).reduce(
    (total, checked) => (checked ? total + 1 : total),
    0
  );
  const total = lists.reduce((acc, item) => {
    if (!checkedItems[item._id]) return acc;
    const qty = itemQuantities[item._id] || 0;
    return acc + item.price * qty;
  }, 0);

  return (
    <>
      <Header name="Check out" />
      <div className="grid grid-cols-11">
        <div className="flex items-center col-start-3 col-span-7 h-[clamp(1rem,5vw,5rem)] border-2 border-black mb-4 p-4">
          <div className="w-full flex justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-[clamp(1rem,2vw,2.5rem)] w-[clamp(1rem,2vw,2.5rem)] cursor-pointer  mr-2"
                checked={isCheckAll}
                onChange={handleCheckAll}
              ></input>
              <div className="font-bold">Check all</div>
            </div>
            {isEditing && (
              <div className="flex items-center flex-row-reverse gap-4 font-bold">
                <div
                  className="flex items-center gap-1 text-green-700 cursor-pointer"
                  onClick={() => handleDoneEditing()}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  <p>Done</p>
                </div>
                <div
                  className="flex items-center gap-1 text-red-700 cursor-pointer"
                  onClick={() => handleCancelEditing()}
                >
                  <FontAwesomeIcon icon={faXmark} />
                  <p>Cancel</p>
                </div>
              </div>
            )}
          </div>
          {/* {console.log(checkedItems)} */}
        </div>
        {/* {console.log(itemQuantities)} */}
        <div className="col-start-3 col-span-7 overflow-auto max-h-[62vh] no-scrollbar">
          {lists.map((item) => (
            <SmallCard
              item={item}
              key={item._id}
              checked={!!checkedItems[item._id]}
              onCheck={(checked) => handleItemCheck(item._id, checked)}
              onClick={() => setIsItemOpen(item)}
              quantity={itemQuantities[item._id]}
              onQuantityChange={(quantity) =>
                handleQuantityChange(item._id, quantity)
              }
              setIsEditing={setIsEditing}
              onDelete={() => handleDelete(item._id)}
            />
          ))}
        </div>
        {isItemOpen && (
          <SubCard item={isItemOpen} onClose={() => setIsItemOpen(null)} />
        )}
        <div className="col-start-3 col-span-7 flex items-center justify-between font-bold mt-8">
          <div className="text-2xl flex flex-row">
            Total
            <div className="text-lg">({quantity})</div>
          </div>
          <div className="text-2xl">${total.toFixed(2)}</div>
          <Link
            to={total === 0 ? "#" : "/cart/buynow"} // tránh điều hướng nếu rỗng
            className={`border-2 border-black px-4 py-2 mr-2
              ${
                total === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#ffc22c] text-black hover:bg-black hover:text-[#ffc22c] cursor-pointer"
              }
            `}
            state={{ products: lists.filter((item) => checkedItems[item._id]) }}
          >
            BuyNow
          </Link>
        </div>
      </div>
    </>
  );
}

export default Cart;
