import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();

  // ✅ Read admin flag (no mobile, no env, no secrets)
  const isAdmin = localStorage.getItem("providerIsAdmin") === "true";

  const logout = () => {
    localStorage.removeItem("providerToken");
    localStorage.removeItem("providerIsAdmin");
    navigate("/");
  };

  const linkClass =
    "block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-100";

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 px-4 mt-5">
        LocalLink
      </h2>

      <nav className="flex-1 space-y-2 px-2">
        <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/create-service" className={linkClass} onClick={onClose}>
          ➕ Create Service
        </NavLink>

        <NavLink to="/my-services" className={linkClass} onClick={onClose}>
          📋 My Services
        </NavLink>

        <NavLink to="/my-profile" className={linkClass} onClick={onClose}>
          👤 My Profile
        </NavLink>

        {/* 🛡 ADMIN PANEL (VISIBLE ONLY IF ADMIN) */}
        {isAdmin && (
          <NavLink
            to="/admin-dashboard"
            className={`${linkClass} bg-yellow-50 text-yellow-700`}
            onClick={onClose}
          >
            🛡 Admin Panel
          </NavLink>
        )}
      </nav>

      <button
        onClick={logout}
        className="mx-4 mb-4 bg-red-500 text-white py-2 rounded-lg"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;
