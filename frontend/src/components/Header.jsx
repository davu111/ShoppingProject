function Header({ name, noMargin = false }) {
  return (
    <div
      className={`bg-maincolor text-center p-4 border-y-2 border-black ${
        noMargin ? "" : "mb-4"
      }`}
    >
      <h1 className="font-mogra text-4xl ">{name}</h1>
    </div>
  );
}

export default Header;
