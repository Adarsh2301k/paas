import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyServices, getProviderProfile } from "../api/providerApi";
import { getProviderBookings } from "../api/bookingApi";

import { BarChart } from "recharts/es6";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

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

  const [bookings, setBookings] = useState([]);

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
    } catch {}
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
    } catch {}
  };

  /* ================= BOOKINGS ================= */
  const loadBookings = async () => {
    try {
      const data = await getProviderBookings();
      const list = data.bookings || [];
      setBookings(list);

      const completed = list.filter((b) => b.status === "completed");
      const pending = list.filter(
        (b) => b.status === "pending" || b.status === "accepted"
      );

      const earnings = completed.reduce(
        (sum, b) => sum + (b.service?.price || 0),
        0
      );

      setBookingStats({
        total: list.length,
        completed: completed.length,
        pending: pending.length,
        earnings,
      });
    } catch {}
  };

  /* ================= CHART DATA ================= */
  const bookingChartData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const prevMonthDate = new Date(today);
    prevMonthDate.setMonth(thisMonth - 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevMonthYear = prevMonthDate.getFullYear();

    let todayCount = 0;
    let yesterdayCount = 0;
    let thisMonthCount = 0;
    let prevMonthCount = 0;

    bookings.forEach((b) => {
      const d = new Date(`${b.date}T00:00:00`);

      if (d.getTime() === today.getTime()) todayCount++;
      if (d.getTime() === yesterday.getTime()) yesterdayCount++;

      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear)
        thisMonthCount++;

      if (
        d.getMonth() === prevMonth &&
        d.getFullYear() === prevMonthYear
      )
        prevMonthCount++;
    });

    return [
      { name: "Today", bookings: todayCount },
      { name: "Yesterday", bookings: yesterdayCount },
      { name: "This Month", bookings: thisMonthCount },
      { name: "Prev Month", bookings: prevMonthCount },
    ];
  }, [bookings]);

  /* ================= STAT CARD ================= */
  const StatCard = ({ title, value, color, to }) => (
    <div
      onClick={() => to && navigate(to)}
      className="bg-white rounded-xl shadow p-4 cursor-pointer
                 hover:shadow-md transition active:scale-[0.98]"
    >
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-2xl md:text-3xl font-bold mt-1 ${color}`}>
        {value}
      </p>
    </div>
  );

  return (
    <>
      {/* ===== HEADER ===== */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
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

      {/* ===== SERVICES ===== */}
      <h2 className="text-lg font-semibold mb-3">🧰 Services</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Services"
          value={serviceStats.total}
          color="text-gray-800"
          to="/my-services"
        />
        <StatCard
          title="Active Services"
          value={serviceStats.active}
          color="text-green-600"
          to="/my-services"
        />
        <StatCard
          title="Inactive Services"
          value={serviceStats.inactive}
          color="text-red-500"
          to="/my-services"
        />
      </div>

      {/* ===== BOOKINGS ===== */}
      <h2 className="text-lg font-semibold mb-3">📦 Bookings</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Bookings"
          value={bookingStats.total}
          color="text-gray-800"
          to="/bookings"
        />
        <StatCard
          title="Completed Jobs"
          value={bookingStats.completed}
          color="text-green-600"
          to="/bookings"
        />
        <StatCard
          title="Pending Jobs"
          value={bookingStats.pending}
          color="text-yellow-600"
          to="/bookings"
        />
        <StatCard
          title="Earnings (₹)"
          value={bookingStats.earnings}
          color="text-blue-600"
        />
      </div>

      {/* ===== BOOKING TRENDS ===== */}
      <h2 className="text-lg font-semibold mb-3">📊 Booking Trends</h2>
      <div className="bg-white rounded-xl shadow p-4 mb-8 h-52 max-w-3xl mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bookingChartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="bookings"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-400">
          🛠 Support coming soon
        </div>
      </div>
    </>
  );
};

export default Dashboard;
