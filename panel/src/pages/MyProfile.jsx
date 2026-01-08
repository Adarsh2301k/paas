import { useEffect, useState } from "react";
import {
  getProviderProfile,
  updateProviderProfile,
} from "../api/providerApi";
import toast from "react-hot-toast";

const categoriesList = [
  "Electrician",
  "Plumber",
  "AC Repair",
  "Cleaning",
  "Carpenter",
  "Electronics Repair",
];

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    pincode: "",
    categories: [],
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProviderProfile();
      setForm(data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  /* ================= HANDLERS ================= */
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCategory = (cat) => {
    if (!editMode) return;

    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const submitHandler = async () => {
    if (!form.name || !form.pincode) {
      toast.error("Name and pincode are required");
      return;
    }

    try {
      setLoading(true);
      await updateProviderProfile({
        name: form.name,
        pincode: form.pincode,
        categories: form.categories,
      });
      toast.success("Profile updated");
      setEditMode(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    loadProfile(); // revert changes
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">👤 My Profile</h1>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-100"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={changeHandler}
              disabled={!editMode}
              className={`w-full border rounded-lg p-2 text-sm ${
                !editMode
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Number
            </label>
            <input
              value={form.mobile}
              disabled
              className="w-full border rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mobile number cannot be changed
            </p>
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pincode
            </label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={changeHandler}
              disabled={!editMode}
              className={`w-full border rounded-lg p-2 text-sm ${
                !editMode
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-5">
          <label className="block text-sm font-medium mb-2">
            Service Categories
          </label>

          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                disabled={!editMode}
                className={`px-3 py-1 rounded-full text-sm border ${
                  form.categories.includes(cat)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700"
                } ${
                  !editMode
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {editMode && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={submitHandler}
              disabled={loading}
              className="bg-white-600 text-black px-6 py-2  border rounded-lg hover:bg-green-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={cancelEdit}
              disabled={loading}
              className="border px-6 py-2 rounded-lg hover:bg-red-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
