import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerProvider } from "../api/providerApi";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  "Electrician",
  "Plumber",
  "AC Repair",
  "Cleaning",
  "Carpenter",
  "Electronics Repair",
];

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = location.state?.mobile || "";

  const [form, setForm] = useState({
    name: "",
    pincode: "",
    categories: [],
  });

  const toggleCategory = (category) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const submitHandler = async () => {
    if (!form.name || !form.pincode || form.categories.length === 0) {
      toast.error("All fields are required");
      return;
    }

    if (form.pincode.length !== 6) {
      toast.error("Enter valid 6-digit pincode");
      return;
    }

    try {
      const res = await registerProvider({
  name: form.name.trim(),
  mobile,
  pincode: form.pincode.trim(),
  categories: form.categories,
});

// 🔥 THIS WAS MISSING
localStorage.setItem("providerToken", res.token);

      toast.success("Registration successful");
      navigate("/dashboard");
    } catch {
      toast.error("Registration failed");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-600">
        Provider Registration
      </h2>

      {/* Mobile */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">Mobile</label>
        <input
          value={mobile}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />
      </div>

      {/* Name + Pincode (2-col on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full border p-3 rounded"
            placeholder="Your name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <input
            className="w-full border p-3 rounded"
            placeholder="Area pincode"
            onChange={(e) =>
              setForm({ ...form, pincode: e.target.value })
            }
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">
          Service Categories
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-xl p-4">
          {CATEGORY_OPTIONS.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={submitHandler}
        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg hover:bg-blue-700 transition"
      >
        Register
      </button>
    </div>
  </div>
);

};

export default Register;
