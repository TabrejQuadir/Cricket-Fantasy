import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaBan } from "react-icons/fa";

const UpdateRestrictUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isRestricted, setIsRestricted] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdate = async () => {
    if (!selectedUser || isRestricted === "") {
      alert("Please select both User and Restriction Status before updating.");
      return;
    }

    try {
      const url = isRestricted === "true"
        ? `https://backend.prepaidtaskskill.in/api/admin/restrict-user/${selectedUser}`
        : `https://backend.prepaidtaskskill.in/api/admin/unrestrict-user/${selectedUser}`;

      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert(`User ${isRestricted === "true" ? "restricted" : "unrestricted"} successfully.`);
        setSelectedUser("");
        setIsRestricted("");
      } else {
        alert("Failed to update restriction status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating restriction status:", error);
      alert("An error occurred. Check console for details.");
    }
  };

  return (
    <div
      className="flex justify-center items-center bg-gray-900 bg-[url('/path-to-cricket-bg.jpg')] bg-cover bg-center"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="w-full max-w-md p-6 bg-gray-800 bg-opacity-60 backdrop-blur-xl rounded-xl shadow-xl border border-gray-700 text-white">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
          Update Restriction Status
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

        {/* Select Restriction Status */}
        <div className="mb-4">
          <label className="flex items-center text-sm font-semibold mb-2 text-gray-300">
            <FaBan className="mr-2 text-red-500" /> Restriction Status
          </label>
          <select
            onChange={(e) => setIsRestricted(e.target.value)}
            value={isRestricted}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-red-400 transition duration-300"
          >
            <option value="">Select Restriction Status</option>
            <option value="true">Restrict User</option>
            <option value="false">Unrestrict User</option>
          </select>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold py-3 rounded-md shadow-lg transition duration-300 transform hover:scale-102 focus:outline-none focus:ring-4 focus:ring-red-500 cursor-pointer"
        >
          Update Restriction Status
        </button>
      </div>
    </div>
  );
};

export default UpdateRestrictUser;
