import { useState } from "react";
import { Link } from "react-router-dom";

import lists from "../data/Items.json";

import Header from "../components/Header";
import SmallCard from "../components/SmallCard";
import Item from "../components/Item";

function Cart() {
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [isItemOpen, setIsItemOpen] = useState(null);

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
          {console.log(checkedItems)}
        </div>
        <div className="col-start-3 col-span-7 overflow-auto max-h-[62vh] ">
          {lists.map((item) => (
            <SmallCard
              item={item}
              key={item._id}
              checked={!!checkedItems[item._id]}
              onCheck={(checked) => handleItemCheck(item._id, checked)}
              onClick={() => setIsItemOpen(item)}
            />
          ))}
        </div>
        {isItemOpen && (
          <Item item={isItemOpen} onClose={() => setIsItemOpen(null)} />
        )}
        <Link
          to="/home/buynow"
          className="col-start-11 col-span-2 flex items-center justify-center bg-black text-white py-2 hover:bg-gray-600"
          state={{ products: lists.filter((item) => checkedItems[item._id]) }}
        >
          BuyNow
        </Link>
      </div>
    </>
  );
}

export default Cart;
