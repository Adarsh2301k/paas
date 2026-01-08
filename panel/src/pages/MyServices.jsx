import { useEffect, useState } from "react";
import {
  getMyServices,
  toggleServiceStatus,
  deleteService,
} from "../api/providerApi";
import toast from "react-hot-toast";
import { Pencil, Trash2, Power } from "lucide-react";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getMyServices();
      setServices(data);
    } catch {
      toast.error("Failed to load services");
    }
  };

  const toggleStatus = async (id) => {
    try {
      setLoadingId(id);
      const updated = await toggleServiceStatus(id);

      setServices((prev) =>
        prev.map((s) => (s._id === id ? updated : s))
      );

      toast.success(
        updated.isActive ? "Service activated" : "Service deactivated"
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-4">
      <h1 className="text-lg md:text-xl font-semibold mb-4">
        📋 My Services
      </h1>

      {services.length === 0 && (
        <p className="text-gray-500">No services found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s._id}
            className="relative bg-white border rounded-lg shadow-sm overflow-hidden"
          >
            {/* ICON ACTIONS (TOP RIGHT) */}
            <div className="absolute top-2 right-2 flex gap-1">
              {/* Toggle */}
              <button
                onClick={() => toggleStatus(s._id)}
                disabled={loadingId === s._id}
                title="Activate / Deactivate"
                className={`p-1.5 rounded-full text-white text-xs ${
                  s.isActive
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                <Power size={14} />
              </button>

              {/* Edit */}
              <button
                onClick={() => toast("Edit coming next")}
                title="Edit Service"
                className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Pencil size={14} />
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(s._id)}
                title="Delete Service"
                className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* IMAGE */}
            {s.image && (
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-36 sm:h-40 object-cover"
              />
            )}

            {/* CONTENT */}
            <div className="p-3">
              <h3 className="font-medium text-sm md:text-base">
                {s.title}
              </h3>

              <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                {s.description || "No description"}
              </p>

              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-sm">
                  ₹{s.price}
                </span>

                <span
                  className={`text-xs ${
                    s.isActive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm font-small mt-2">
  Status:{" "}
  {s.isApproved ? (
    <span className="text-green-600">Approved Byadmin</span>
  ) : (
    <span className="text-yellow-500">Pending approval</span>
  )}
</p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyServices;
