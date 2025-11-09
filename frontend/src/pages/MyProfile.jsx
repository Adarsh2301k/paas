// src/pages/Profile.jsx
import { useState } from "react";
import { FiSave, FiEdit } from "react-icons/fi";
import { Mail, Phone, Camera, Home, Hash, User } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Adarsh Kesharwani",
    email: "adarsh2301k@gmail.com",
    mobileNumber: "8354800889",
    address: "Ghaziabad, Uttar Pradesh",
    pincode: "201010",
    avatar: "/assets/profile-placeholder.png",
  });

  const bookings = [
    {
      _id: "b1",
      image: "/assets/trending/sample1.jpg",
      name: "AC Service",
      provider: "CoolFix Pvt Ltd",
      description: "Full diagnostic and gas top-up",
      price: 1200,
      status: "approved",
    },
    {
      _id: "b2",
      image: "/assets/trending/sample2.jpg",
      name: "Home Tutor - Maths",
      provider: "TutorPro",
      description: "3 sessions booked for algebra",
      price: 1500,
      status: "pending",
    },
    {
      _id: "b3",
      image: "/assets/trending/sample3.jpg",
      name: "Plumbing Fix",
      provider: "PipeCare",
      description: "Bathroom leak repair",
      price: 800,
      status: "rejected",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-8 pb-10">
      {/* Profile Section */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Avatar (left on desktop, top on mobile) */}
        <div className="flex-shrink-0 relative">
          <img
            src={profile.avatar}
            alt="User Avatar"
            className="w-36 h-36 rounded-full object-cover border-4 border-blue-100 shadow-sm"
          />
          <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition">
            <Camera size={16} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1 w-full space-y-5">
          {isEditing ? (
            <>
              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="mobileNumber"
                  value={profile.mobileNumber}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full"
                  placeholder="Mobile Number"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full"
                  placeholder="Address"
                />
                <input
                  type="text"
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full"
                  placeholder="Pincode"
                />
              </div>
            </>
          ) : (
            <>
              {/* Display Fields */}
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={18} className="text-blue-600" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} className="text-green-600" />
                  <span>{profile.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Home size={18} className="text-orange-600" />
                  <span>{profile.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Hash size={18} className="text-purple-600" />
                  <span>{profile.pincode}</span>
                </div>
              </div>
            </>
          )}

          {/* Button at bottom */}
          <div className="pt-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <FiSave /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FiEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="w-full max-w-6xl bg-white shadow-md rounded-2xl p-6 mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-5">Recent Bookings</h3>

        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center">No recent bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-3"
              >
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="text-base font-bold text-blue-600">{b.name}</h4>
                <p className="text-gray-600 text-sm">{b.provider}</p>
                <p className="text-gray-700 text-sm mt-1">{b.description}</p>
                <p className="text-gray-800 font-medium mt-1">₹{b.price}</p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    b.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : b.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
