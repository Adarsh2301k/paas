import { useEffect, useState } from "react";
import {
  getAllServicesAdmin,
  approveServiceAdmin,
  toggleServiceAdmin,
  getAllProvidersAdmin,
  
} from "../api/adminApi";
import toast from "react-hot-toast";
import {  toggleProviderBan  } from "../api/adminApi";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (activeTab === "services") loadServices();
    if (activeTab === "providers") loadProviders();
  }, [activeTab]);

  /* ================= LOADERS ================= */

  const loadServices = async () => {
    try {
      const data = await getAllServicesAdmin();
      setServices(data);
    } catch {
      toast.error("Failed to load services");
    }
  };

  const loadProviders = async () => {
    try {
      const data = await getAllProvidersAdmin();
      setProviders(data);
    } catch {
      toast.error("Failed to load providers");
    }
  };

  /* ================= ACTIONS ================= */

  const approveService = async (id) => {
    try {
      setLoadingId(id);
      const updated = await approveServiceAdmin(id);
      setServices((prev) =>
        prev.map((s) => (s._id === id ? updated : s))
      );
      toast.success(updated.isApproved ? "Approved" : "Unapproved");
    } catch {
      toast.error("Approval failed");
    } finally {
      setLoadingId(null);
    }
  };

  const toggleStatus = async (id) => {
    try {
      setLoadingId(id);
      const updated = await toggleServiceAdmin(id);
      setServices((prev) =>
        prev.map((s) => (s._id === id ? updated : s))
      );
      toast.success(updated.isActive ? "Activated" : "Deactivated");
    } catch {
      toast.error("Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= UI ================= */

  const tabBtn = (key, label) => (
    <button
      onClick={() => setActiveTab(key)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
        activeTab === key
          ? "bg-blue-600 text-white"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-lg font-semibold mb-4">🛡 Admin Dashboard</h1>

      {/* ===== TABS ===== */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabBtn("services", "🧰 Services")}
        {tabBtn("providers", "👤 Providers")}
        {tabBtn("bookings", "📦 Bookings")}
      </div>

      {/* ===== SERVICES ===== */}
      {activeTab === "services" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s) => (
            <div
              key={s._id}
              className="relative bg-white rounded-xl shadow p-3 text-sm"
            >
              {/* ACTION ICONS */}
              <div className="absolute top-3 right-3 flex gap-2">
                {/* APPROVE */}
                <button
                  onClick={() => approveService(s._id)}
                  disabled={loadingId === s._id}
                  title="Approve"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    s.isApproved ?  " bg-green-500" : "bg-orange-500"
                  }`}
                >
                  ✔
                </button>

                {/* ACTIVE TOGGLE */}
                <button
                  onClick={() => toggleStatus(s._id)}
                  disabled={loadingId === s._id}
                  title="Activate / Deactivate"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    s.isActive ? "bg-green-500":"bg-red-500"
                  }`}
                >
                  ⏻
                </button>
              </div>

              {/* IMAGE */}
              {s.image?.[0] && (
                <img
                  src={s.image[0]}
                  alt={s.title}
                  className="w-full h-28 object-cover rounded-lg mb-2"
                />
              )}

              {/* INFO */}
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-xs text-gray-500">{s.category}</p>
              <p className="font-medium mt-1">₹{s.price}</p>

              {/* STATUS */}
              <div className="flex justify-between text-xs mt-2">
                <span
                  className={
                    s.isActive ? "text-green-600" : "text-red-500"
                  }
                >
                  {s.isActive ? "Active" : "Inactive"}
                </span>

                <span
                  className={
                    s.isApproved
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {s.isApproved ? "Approved" : "Pending"}
                </span>
              </div>

              <p className="text-[11px] text-gray-400 mt-1">
                Provider: {s.provider?.name || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ===== PROVIDERS ===== */}
      {/* ===== PROVIDERS ===== */}
{activeTab === "providers" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {providers.map((p) => (
      <div
        key={p._id}
        className={`rounded-xl border p-4 text-sm shadow-sm ${
          p.isBanned ? "bg-red-50 border-red-300" : "bg-white"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold text-base">{p.name}</p>
            <p className="text-xs text-gray-500">{p.mobile}</p>
          </div>

          {/* BAN / UNBAN */}
          <button
            onClick={() => toggleProviderBan(p._id)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              p.isBanned
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {p.isBanned ? "Unban" : "Ban"}
          </button>
        </div>

        {/* INFO */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>📍 Pincode: {p.pincode}</p>
          <p>
            🧰 Categories:{" "}
            {p.categories?.length
              ? p.categories.join(", ")
              : "Not selected"}
          </p>
          <p>
            🕒 Joined:{" "}
            {new Date(p.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* STATUS */}
        <div className="flex gap-2 mt-3">
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              p.isBanned
                ? "bg-red-200 text-red-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {p.isBanned ? "Banned" : "Active"}
          </span>

          <span
            className={`px-2 py-0.5 rounded text-xs ${
              p.isVerified
                ? "bg-blue-200 text-blue-800"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {p.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>
    ))}
  </div>
)}


      {/* ===== BOOKINGS ===== */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-xl border p-6 text-sm text-gray-500">
          📦 Booking management coming soon
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
