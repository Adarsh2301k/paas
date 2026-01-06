import React, { useEffect, useState, useRef } from "react";
import { FiSave, FiEdit } from "react-icons/fi";
import { Mail, Phone, Camera, Home, Hash } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getProfile, updateProfile, getMyBookings } from "../api/api";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    pincode: "",
    avatar: "/assets/profile-placeholder.png",
  });

  const [bookings, setBookings] = useState([]);
  const fileInputRef = useRef(null);

  // 🔹 Fetch profile + recent bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileData, bookingData] = await Promise.all([
          getProfile(),
          getMyBookings(),
        ]);

        setProfile({
          name: profileData.name || "",
          email: profileData.email || "",
          mobile: profileData.mobile || "",
          address: profileData.address || "",
          pincode: profileData.pincode || "",
          avatar: profileData.avatar || "/assets/profile-placeholder.png",
        });

        // show latest 4 bookings
        setBookings(bookingData?.bookings?.slice(0, 4) || []);
      } catch (err) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // 🔹 Avatar preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // 🔹 Save profile
  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("address", profile.address);
      formData.append("pincode", profile.pincode);

      if (fileInputRef.current?.files[0]) {
        formData.append("avatar", fileInputRef.current.files[0]);
      }

      const updated = await updateProfile(formData);

      setProfile((prev) => ({
        ...prev,
        ...updated.user,
      }));

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-8 pb-10">
      <Toaster position="top-center" />

      {/* ================= PROFILE CARD ================= */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row gap-10">
        {/* Avatar */}
        <div className="relative">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-36 h-36 rounded-full object-cover border-4 border-blue-100"
          />
          {isEditing && (
            <>
              <button
                onClick={triggerFileSelect}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-full"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-5">
          {isEditing ? (
            <>
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="Name"
                />
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="Email"
                />
                <input
                  value={profile.mobile}
                  disabled
                  className="border rounded-md px-3 py-2 bg-gray-100"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="Address"
                />
                <input
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="Pincode"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="grid md:grid-cols-2 gap-3 text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={18} /> {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={18} /> {profile.mobile}
                </div>
                <div className="flex items-center gap-2">
                  <Home size={18} /> {profile.address || "Not provided"}
                </div>
                <div className="flex items-center gap-2">
                  <Hash size={18} /> {profile.pincode || "Not provided"}
                </div>
              </div>
            </>
          )}

          <div>
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
              >
                <FiSave /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                <FiEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= RECENT BOOKINGS ================= */}
      <div className="w-full max-w-6xl bg-white shadow-md rounded-2xl p-6 mt-10">
        <h3 className="text-xl font-semibold mb-5">Recent Bookings</h3>

        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center">
            No bookings yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="border rounded-xl p-3 hover:shadow-md transition"
              >
                <img
                  src={b.service?.image || "/placeholder.png"}
                  alt={b.service?.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-bold">{b.service?.title}</h4>
                <p className="text-sm text-gray-600">
                  {b.service?.category}
                </p>
                <p className="text-sm font-medium mt-1">
                  ₹{b.service?.price}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : b.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.status}
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
