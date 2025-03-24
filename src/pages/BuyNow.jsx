import lists from "../data/Items.json";

import Header from "../components/Header";
import SmallCard from "../components/SmallCard";

function BuyNow() {
  return (
    <>
      <Header name="Check out" />
      <div className="grid grid-cols-11">
        <div className="flex items-center col-start-3 col-span-7 h-[clamp(1rem,5vw,5rem)] border-2 border-black mr-4 mb-4 p-4">
          <input
            type="checkbox"
            className="h-[clamp(1rem,2vw,2.5rem)] w-[clamp(1rem,2vw,2.5rem)] cursor-pointer  mr-2"
            onChange={(e) => console.log(e.target.checked)}
          ></input>
          <div className="font-bold">Check all</div>
        </div>
        <div className="col-start-3 col-span-7 overflow-auto max-h-[62vh] ">
          {lists.map((item) => (
            <SmallCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </>
  );
}

export default BuyNow;
