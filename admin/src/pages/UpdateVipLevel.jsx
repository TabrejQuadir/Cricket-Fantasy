import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCrown } from "react-icons/fa";

const UpdateVipLevel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [vipLevel, setVipLevel] = useState("");
  const vipLevels = ["Vip Level-1", "Vip Level-2", "Vip Level-3", "Vip Level-4"];

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("https://backend.prepaidtaskskill.in/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleUpdate = async () => {
    if (!selectedUser || !vipLevel) {
      alert("Please select both User and VIP Level before updating.");
      return;
    }
  
    try {
      const response = await axios.put(
        "https://backend.prepaidtaskskill.in/api/admin/update-vip-level",
        { userId: selectedUser, vipLevel },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert("VIP Level updated successfully");
        setSelectedUser("");
        setVipLevel("");
      } else {
        alert("Failed to update VIP Level. Please try again.");
      }
    } catch (error) {
      console.error("Error updating VIP Level:", error);
      alert("An error occurred. Check console for details.");
    }
  };
  

  return (
    <div
      className="flex justify-center items-center bg-gray-900 bg-[url('/path-to-cricket-bg.jpg')] bg-cover bg-center"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="w-full max-w-md p-6 bg-gray-800 bg-opacity-60 backdrop-blur-xl rounded-xl shadow-xl border border-gray-700 text-white">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
          Update VIP Level
        </h1>

        {/* Select User */}
        <div className="mb-4">
          <label className="flex items-center text-sm font-semibold mb-2 text-gray-300">
            <FaUser className="mr-2 text-blue-400" /> Select User
          </label>
          <select
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-300"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Select VIP Level */}
        <div className="mb-4">
          <label className="flex items-center text-sm font-semibold mb-2 text-gray-300">
            <FaCrown className="mr-2 text-yellow-400" /> Select VIP Level
          </label>
          <select
            onChange={(e) => setVipLevel(e.target.value)}
            value={vipLevel}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400 transition duration-300"
          >
            <option value="">Select VIP Level</option>
            {vipLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-yellow-500 text-white font-semibold py-3 rounded-md shadow-lg transition duration-300 transform hover:scale-102 focus:outline-none focus:ring-4 focus:ring-green-500 cursor-pointer"
        >
          Update VIP Level
        </button>
      </div>
    </div>
  );
};

export default UpdateVipLevel;
