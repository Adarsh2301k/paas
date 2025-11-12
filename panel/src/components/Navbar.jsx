import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useProviderAuth } from "../context/ProviderAuthContext";

export default function Navbar({ toggleSidebar }) {
  const { provider, token } = useProviderAuth();
  const isLoggedIn = !!token;

  return (
    <div className="w-full bg-white shadow-md p-4 flex items-center justify-between">
      {/* Logo → go to dashboard if logged in, else home */}
      <Link to={isLoggedIn ? "/dashboard" : "/"} className="text-xl font-bold text-blue-600">
        PartnerLink
      </Link>

      <button className="md:hidden" onClick={toggleSidebar}>
        <Menu size={28} />
      </button>

      <div className="hidden md:flex items-center gap-6">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="px-4 py-2 text-blue-600 font-semibold">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md">Register</Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">{provider?.name || "Provider"}</span>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              {provider?.name?.[0] || "P"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
