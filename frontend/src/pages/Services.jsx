import React, { useEffect, useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { getProviders } from "../api/api"; // 🔗 Import from your API.js
import { Link } from "react-router-dom";

const Services = () => {
  const [providers, setProviders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const categories = [
    "All",
    "Electrician",
    "Plumber",
    "Repair",
    "Cleaning",
    "Painter",
    "Tutor",
    "Servicing",
  ];

  // ✅ Fetch providers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const data = await getProviders();
        setProviders(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  // ✅ Filter providers by category and search
  useEffect(() => {
    const result = providers.filter((p) => {
      const matchesCategory =
        category === "All" || p.category.toLowerCase() === category.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.address?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFiltered(result);
  }, [category, search, providers]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 🔍 Search + Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-3">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by service, category, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast("Nearby feature coming soon!")}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <MapPin size={18} /> Nearby
            </button>
            <button
              onClick={() => toast("Filter feature coming soon!")}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        {/* 🧭 Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border transition text-sm font-medium ${category === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🧰 Provider Cards */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading services...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No services found for your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden"
              >
                <Link to={`/services/${p._id}`}>
                  <img
                    src={p.image || "/assets/sample.jpg"}
                    alt={p.name}
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500">{p.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium text-blue-600">
                        ₹{p.price}
                      </span>
                      {p.verified && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          ✅ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
