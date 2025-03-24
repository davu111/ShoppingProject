import panner from "../assets/panner.jpg";
function SmallCard({ item }) {
  return (
    <div className="flex p-4 border-2 border-black hover:shadow-lg mb-1 items-center">
      <input
        type="checkbox"
        className="h-[clamp(1rem,2vw,2.5rem)] w-[clamp(1rem,2vw,2.5rem)] cursor-pointer  mr-2"
      ></input>
      <div className="h-[clamp(1rem,3vw,2.5rem)] w-[clamp(1rem,3vw,2.5rem)] border-1 border-gray-500">
        <img src={panner} />
      </div>
      <div className="font-bold ml-2">{item.title}</div>
      <div className="ml-2">{item.price}</div>
    </div>
  );
}
export default SmallCard;
