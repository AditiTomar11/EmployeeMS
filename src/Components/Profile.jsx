import React from "react";

const Profile = () => {
  const user = {
    name: "John Doe",
    title: "Software Engineer",
    email: "john.doe@example.com",
    location: "San Francisco, CA",
    avatar: "https://via.placeholder.com/150",
    bio: "Passionate about building scalable applications and delivering customer-centric solutions.",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center pl-12 pr-6 pt-6 pb-6">
  <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-6">
    {/* Profile content */}
    <div className="min-h-screen bg-gray-100 flex items-center pl-12 pr-6 pt-6 pb-6">
      <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <img
            src={user.avatar}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-sm"
          />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.title}</p>
        </div>

        {/* Contact Info */}
        <div className="mt-6 border-t pt-4 space-y-2">
          <p className="text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-700">
            <strong>Location:</strong> {user.location}
          </p>
        </div>

        {/* Bio Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">About</h2>
          <p className="text-gray-600 mt-2">{user.bio}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow transition">
            Edit Profile
          </button>
          <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg shadow transition">
            Logout
          </button></div></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;