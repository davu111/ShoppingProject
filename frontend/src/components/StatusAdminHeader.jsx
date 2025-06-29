import { useNavigate } from "react-router-dom";

import Header from "./Header";

const header = ["Table", "Analysis", "Chatbox"];

function StatusAdminHeader({ title }) {
  const navigate = useNavigate();
  return (
    <>
      <Header name="Status" noMargin />
      <div className="font-bold bg-white flex flex-row gap-2 text-center border-b-2 border-gray-200">
        {header.map((item, index) => (
          <div
            key={index}
            className={`${
              title === item ? "text-[#ffb700] bg-gray-100" : "text-black"
            } p-4 text-sm cursor-pointer line-hight-full`}
            onClick={() => navigate(`/status_admin/${item}`)}
          >
            {item}
          </div>
        ))}
      </div>
    </>
  );
}

export default StatusAdminHeader;
