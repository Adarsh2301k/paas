import { useEffect, useState } from "react";
import { getMyServices, getProviderProfile } from "../api/providerApi";
import { getProviderBookings } from "../api/bookingApi";

const Dashboard = () => {
  const [provider, setProvider] = useState({
    name: "Provider",
    isBanned: false,
    isAdmin: false,
  });

  const [serviceStats, setServiceStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [bookingStats, setBookingStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    earnings: 0,
  });

  useEffect(() => {
    loadProfile();
    loadServices();
    loadBookings();
  }, []);

  /* ================= PROFILE ================= */
  const loadProfile = async () => {
    try {
      const data = await getProviderProfile();
      setProvider(data);
    } catch (err) {
      console.error("Profile load failed");
    }
  };

  /* ================= SERVICES ================= */
  const loadServices = async () => {
    try {
      const services = await getMyServices();
      const active = services.filter((s) => s.isActive).length;

      setServiceStats({
        total: services.length,
        active,
        inactive: services.length - active,
      });
    } catch (err) {
      console.error("Services load failed");
    }
  };

  /* ================= BOOKINGS ================= */
  const loadBookings = async () => {
    try {
      const data = await getProviderBookings();
      const bookings = data.bookings || [];

      const total = bookings.length;

      const completed = bookings.filter(
        (b) => b.status === "completed"
      );

      const pending = bookings.filter(
        (b) => b.status === "pending" || b.status === "accepted"
      );

      const earnings = completed.reduce(
        (sum, b) => sum + (b.service?.price || 0),
        0
      );

      setBookingStats({
        total,
        completed: completed.length,
        pending: pending.length,
        earnings,
      });
    } catch (err) {
      console.error("Bookings load failed");
    }
  };

  const StatCard = ({ title, value, color }) => (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );

  return (
    <>
      {/* ===== HEADER ===== */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            👋 Hi, {provider.name}
            {provider.isAdmin && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                ADMIN
              </span>
            )}
          </h1>

          {provider.isBanned && (
            <p className="text-sm text-red-600 mt-1">
              🚫 Your account is restricted by admin
            </p>
          )}
        </div>
      </div>

      {/* ===== SERVICES STATS ===== */}
      <h2 className="text-lg font-semibold mb-3">🧰 Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Services"
          value={serviceStats.total}
          color="text-gray-800"
        />
        <StatCard
          title="Active Services"
          value={serviceStats.active}
          color="text-green-600"
        />
        <StatCard
          title="Inactive Services"
          value={serviceStats.inactive}
          color="text-red-500"
        />
      </div>

      {/* ===== BOOKINGS STATS (REAL DATA) ===== */}
      <h2 className="text-lg font-semibold mb-3">📦 Bookings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Bookings"
          value={bookingStats.total}
          color="text-gray-800"
        />
        <StatCard
          title="Completed Jobs"
          value={bookingStats.completed}
          color="text-green-600"
        />
        <StatCard
          title="Pending Jobs"
          value={bookingStats.pending}
          color="text-yellow-600"
        />
        <StatCard
          title="Earnings (₹)"
          value={bookingStats.earnings}
          color="text-blue-600"
        />
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-500">
          🛠 Support coming soon
        </div>
      </div>
    </>
  );
};

export default Dashboard;
