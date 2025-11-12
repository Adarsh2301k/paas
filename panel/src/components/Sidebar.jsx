import { Link, useLocation } from "react-router-dom";
import { Home, User, ClipboardList, LogOut } from "lucide-react";
import { useProviderAuth } from "../context/ProviderAuthContext";

export default function Sidebar() {
  const { setToken, setProvider } = useProviderAuth();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("providerToken");
    setToken(null);
    setProvider(null);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-200";

  return (
    <div className="w-64 min-h-screen bg-white shadow-md p-4 hidden md:block">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">LocalLink</h2>

      <nav className="flex flex-col gap-3">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 p-3 rounded-md ${isActive(
            "/dashboard"
          )}`}
        >
          <Home size={20} /> Dashboard
        </Link>

        <Link
          to="/bookings"
          className={`flex items-center gap-3 p-3 rounded-md ${isActive(
            "/bookings"
          )}`}
        >
          <ClipboardList size={20} /> Bookings
        </Link>

        <Link
          to="/profile"
          className={`flex items-center gap-3 p-3 rounded-md ${isActive(
            "/profile"
          )}`}
        >
          <User size={20} /> Profile
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-md text-red-600 hover:bg-red-100 mt-10"
        >
          <LogOut size={20} /> Logout
        </button>
      </nav>
    </div>
  );
}
