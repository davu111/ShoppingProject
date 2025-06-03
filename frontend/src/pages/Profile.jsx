import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../contexts/axios";
import { useAuth } from "../contexts/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";
import avatar from "../assets/avatar.jpg";
const URL = "http://localhost:3000";

function Profile() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user: storedUser } = useAuth();
  // console.log(storedUser);

  useEffect(() => {
    // const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser._id) return navigate("/profile/signin");
    axios
      .get(`/users/getUser/${storedUser._id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  if (!user) return <div>Loading user info...</div>;

  const handleEditClick = () => {
    setIsEditing(true);
    setTempUser({ ...user });
  };

  const handleSave = () => {
    // const storedUser = JSON.parse(localStorage.getItem("user"));
    // console.log(tempUser);
    if (tempUser.phone.length != 10) {
      setError("Please enter a valid 10 digit phone number");
      return;
    }
    if (/[^\p{L}\p{N}\s.,-]/u.test(tempUser.address)) {
      setError("Please enter an address without special characters.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempUser.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    axios
      .put(`/users/updateUser/${storedUser._id}`, tempUser)
      .then((response) => {
        setUser(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  return (
    <>
      <Header name="Profile" noMargin />
      <div className="grid grid-cols-11 p-6">
        <div className="col-span-7 col-start-3 bg-white shadow-md rounded-2xl p-6 mt-8 space-y-4 group relative">
          {/* Edit Button */}
          {!isEditing && (
            <button
              className="absolute top-4 right-4 text-sm cursor-pointer text-black-500 opacity-0 hover:text-[#ffc22c] group-hover:opacity-100 transition"
              onClick={handleEditClick}
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
          )}
          <div className="bg-white">
            <img
              src={avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full mx-auto"
            />
          </div>
          {error && (
            <div className="text-red-500 font-semibold text-center mb-2">
              {error}
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={tempUser.name || ""}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1 text-lg text-center"
              />
            ) : (
              <p className="text-lg">{user.name || user.account}</p>
            )}
          </h2>

          <div>
            <label className="text-gray-600 font-medium">Address:</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={tempUser.address || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            ) : (
              <p className="text-lg">{user.address}</p>
            )}
          </div>

          <div>
            <label className="text-gray-600 font-medium">Phone:</label>
            {isEditing ? (
              <input
                type="number"
                name="phone"
                value={tempUser.phone || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            ) : (
              <p className="text-lg">{user.phone}</p>
            )}
          </div>

          <div>
            <label className="text-gray-600 font-medium">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={tempUser.email || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            ) : (
              <p className="text-lg">{user.email}</p>
            )}
          </div>
        </div>
        {/* Save Changes/ Cancel Button */}
        {isEditing && (
          <div className="text-xs md:text-5xs col-span-3 col-end-10 mt-4 flex flex-row-reverse gap-2 font-bold">
            <button
              onClick={handleSave}
              className="float-right border-2 border-black text-black bg-[#ffc22c]  px-4 py-2 cursor-pointer hover:bg-black hover:text-[#ffc22c]"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="float-left border-2 border-black text-black bg-white  px-4 py-2 cursor-pointer hover:text-gray-500 hover:border-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
