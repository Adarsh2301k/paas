import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useProviderAuth } from "../context/ProviderAuthContext";
import { getDashboardStats } from "../api/providerApi";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const { token } = useProviderAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getDashboardStats(token);
      setStats(res.data);
    })();
  }, []);

  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white shadow-md p-6 rounded-md text-center"
            >
              <h3 className="text-lg font-semibold capitalize">{key}</h3>
              <p className="text-3xl font-bold text-blue-600">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
