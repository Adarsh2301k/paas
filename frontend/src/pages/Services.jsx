import React, { useEffect, useState } from "react";
import { MapPin, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { getServices, getProfile } from "../api/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../config/categories";
import { Link } from "react-router-dom";


const Services = () => {
  const navigate = useNavigate();

  // 🔹 DATA
  const [allServices, setAllServices] = useState([]); // MASTER
  const [services, setServices] = useState([]);       // CURRENT DATASET
  const [filtered, setFiltered] = useState([]);       // UI RESULT

  // 🔹 UI STATE
  const [category, setCategory] = useState("All");
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // 🔹 SEARCH (FROM HOME)
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase();

  // 🔹 INITIAL LOAD
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        const safe = Array.isArray(data) ? data : [];
        setAllServices(safe);
        setServices(safe);
      } catch {
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 🔹 FILTER (PURE)
  useEffect(() => {
    let result = [...services];

    // SEARCH
    if (query) {
      const matchedCategory = CATEGORIES.find((cat) =>
        cat.keywords.some((k) => query.includes(k))
      );

      if (matchedCategory) {
        result = result.filter(
          (s) => s.category === matchedCategory.label
        );
      } else {
        result = result.filter((s) =>
          s.title?.toLowerCase().includes(query)
        );
      }
    }

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (s) =>
          s.category?.toLowerCase() === category.toLowerCase()
      );
    }

    setFiltered(result);
  }, [services, category, query]);

  // 🔹 CATEGORY CLICK
  const handleCategoryChange = (cat) => {
    setCategory(cat);

    // EXIT NEARBY → RESTORE FULL DATA
    if (nearbyOnly) {
      setNearbyOnly(false);
      setServices(allServices);
    }

    // CLEAR SEARCH WHEN ALL SELECTED
    if (cat === "All" && query) {
      navigate("/services", { replace: true });
    }
  };

  // 🔹 NEARBY
  const handleNearby = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login");

      // CLEAR SEARCH
      if (query) {
        navigate("/services", { replace: true });
      }

      setLoading(true);
      setNearbyOnly(true);
      setCategory("All");

      const user = await getProfile();
      const pincode = user?.pincode;
      if (!pincode) {
        toast.error("Update pincode in profile");
        return;
      }

      const data = await getServices({ pincode });
      setServices(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load nearby services");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-6">
    <div className="max-w-7xl mx-auto">

      {/* 🔹 TOP CONTROLS */}
      <div className="flex justify-end mb-6 gap-3">
        <button
          onClick={handleNearby}
          className="md:hidden p-2 rounded-lg border bg-white"
        >
          <MapPin size={20} />
        </button>

        <button
          onClick={() => setShowFilter(true)}
          className="md:hidden p-2 rounded-lg border bg-white"
        >
          <Filter size={20} />
        </button>

        <div className="hidden md:flex gap-3">
          <button
            onClick={handleNearby}
            className={`px-4 py-2 rounded-lg border ${
              nearbyOnly
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Nearby
          </button>

          <button
            onClick={() => setShowFilter(true)}
            className="px-4 py-2 rounded-lg border bg-white"
          >
            Filter
          </button>
        </div>
      </div>

      {/* 🔹 DESKTOP CATEGORIES */}
      <div className="hidden md:flex flex-wrap gap-3 mb-10">
        {["All", ...CATEGORIES.map((c) => c.label)].map((cat) => {
          const isActive = category === cat && !nearbyOnly;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full border ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 🔹 CONTENT */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No services found
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((s) => (
            <Link
              key={s._id}
              to={`/services/${s._id}`}
              className="group bg-white border rounded-xl overflow-hidden hover:shadow-md transition hover:-translate-y-0.5"
            >
              {/* IMAGE */}
              <div className="h-32 w-full bg-gray-100">
                <img
                  src={s.image || "/placeholder.png"}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate group-hover:text-blue-600">
                  {s.title}
                </h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  {s.category}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-blue-600">
                    ₹{s.price}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate max-w-[90px]">
                    {s.provider?.name || "Provider"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 🔹 MOBILE FILTER */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:hidden">
          <div className="bg-white w-full p-5 rounded-t-2xl">
            <div className="flex flex-wrap gap-3">
              {["All", ...CATEGORIES.map((c) => c.label)].map((cat) => {
                const isActive = category === cat && !nearbyOnly;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      handleCategoryChange(cat);
                      setShowFilter(false);
                    }}
                    className={`px-4 py-2 rounded-full border ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
);

};

export default Services;
