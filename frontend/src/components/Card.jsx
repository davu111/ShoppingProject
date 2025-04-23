import panner from "../assets/panner.jpg";

function Card({ item, onClick }) {
  return (
    <div
      className="relative flex flex-col border-2 border-black hover:shadow-lg hover:shadow-black cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-full h-45">
        <img
          src={item.img}
          alt="Ảnh sản phẩm"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 w-full h-1/2 p-2 flex flex-col bg-white bg-opacity-50 text-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-10">
          <div className="font-bold">{item.title}</div>
          <div>{`$${item.price.toFixed(2)}`}</div>
        </div>
      </div>
    </div>
  );
}

export default Card;
