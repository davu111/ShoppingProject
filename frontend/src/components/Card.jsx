import panner from "../assets/panner.jpg";

function Card({ item, onClick }) {
  return (
    <div
      className="flex flex-col border-2 border-black hover:shadow-lg hover:shadow-black cursor-pointer hover:scale-102"
      onClick={onClick}
    >
      <img src={panner} />
      <div className="font-bold ml-2">{item.title}</div>
      <div className="ml-2">{item.price}</div>
    </div>
  );
}

export default Card;
