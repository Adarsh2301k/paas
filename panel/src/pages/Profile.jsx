import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getProfile, updateProfile } from "../api/providerApi";
import { useProviderAuth } from "../context/ProviderAuthContext";

export default function Profile() {
  const { token, setProvider } = useProviderAuth();
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProfile(token);
      setForm(res.data);
    })();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    const res = await updateProfile(form, token);
    setProvider(res.data);
    setEditing(false);
    alert("Profile Updated!");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profile</h2>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2 bg-blue-600 text-white rounded-md"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={save}
                className="px-5 py-2 bg-green-600 text-white rounded-md"
              >
                Save
              </button>
            )}
          </div>

          {/* ✅ Profile card */}
          <div className="bg-white shadow-md p-6 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT SIDE */}
              <div>
                <label className="block text-gray-600 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full p-2 border rounded-md ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                />

                <label className="block text-gray-600 mt-4 mb-1">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full p-2 border rounded-md ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                />

                <label className="block text-gray-600 mt-4 mb-1">Price</label>
                <input
                  name="price"
                  type="number"
                  value={form.price || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full p-2 border rounded-md ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                />

                <label className="block text-gray-600 mt-4 mb-1">
                  Experience (years)
                </label>
                <input
                  name="experience"
                  type="number"
                  value={form.experience || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full p-2 border rounded-md ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>

              {/* RIGHT SIDE */}
              <div>
                <label className="block text-gray-600 mb-1">Address</label>
                <input
                  name="address"
                  value={form.address || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full p-2 border rounded-md ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                />

                <label className="block text-gray-600 mt-4 mb-1">Pincode</label>
                <input
                  name="pincode"
                  value={form.pincode || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full p-2 border rounded-md ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                />

                <label className="block text-gray-600 mt-4 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  rows={5}
                  className={`w-full p-2 border rounded-md ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ✅ show mobile view spacing */}
          <div className="h-10 md:h-6"></div>
        </div>
      </div>
    </div>
  );
}
