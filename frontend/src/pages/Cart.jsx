import { use, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import lists from "../data/Items.json";

import Header from "../components/Header";
import SmallCard from "../components/SmallCard";
// import Item from "../components/Item";
const URL = "http://localhost:3000";

function Cart() {
  const [item, setItem] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [isItemOpen, setIsItemOpen] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});

  useEffect(() => {
    axios
      .get(`${URL}/carts/getCarts`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
        <div className="flex items-center col-start-3 col-span-7 h-[clamp(1rem,5vw,5rem)] border-2 border-black mr-4 mb-4 p-4">
          <input
            type="checkbox"
            className="h-[clamp(1rem,2vw,2.5rem)] w-[clamp(1rem,2vw,2.5rem)] cursor-pointer  mr-2"
            checked={isCheckAll}
            onChange={handleCheckAll}
          ></input>
          <div className="font-bold">Check all</div>
          {/* {console.log(checkedItems)} */}
        </div>
        {console.log(itemQuantities)}
        <div className="col-start-3 col-span-7 overflow-auto max-h-[62vh] ">
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
            />
          ))}
        </div>
        {isItemOpen && (
          <Item item={isItemOpen} onClose={() => setIsItemOpen(null)} />
        )}
        <div className="col-start-3 col-span-7 flex items-center justify-between font-bold mt-4">
          <div className="text-2xl flex flex-row">
            Total
            <div className="text-lg">({quantity})</div>
          </div>
          <div className="text-2xl">${total.toFixed(2)}</div>
          <Link
            to="/home/buynow"
            className="border-2 border-black text-black bg-[#ffc22c]  px-4 py-2 cursor-pointer hover:bg-black hover:text-[#ffc22c]"
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
