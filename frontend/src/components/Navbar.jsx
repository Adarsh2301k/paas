import React, { useState, useRef, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false); // mobile sidebar
  const [showMenu, setShowMenu] = useState(false); // profile dropdown
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Load user from localStorage (works with JWT or plain object)
  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      try {
        setUser(JSON.parse(data));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // ✅ Close dropdown on outside click or Esc
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    const handleEsc = (e) => e.key === "Escape" && setShowMenu(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showMenu]);

  // ✅ Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // ✅ Helper for active link highlight
  const isActive = (path) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          LocalLink
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-gray-700 font-medium">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/services" className={isActive("/services")}>
            Services
          </Link>
          <Link to="/mybooking" className={isActive("/mybooking")}>
            My Bookings
          </Link>
          <Link to="/about" className={isActive("/about")}>
            About Us
          </Link>

          {/* Auth Section */}
          {!user ? (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((p) => !p)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
              >
                {user?.name ? (
                  <span className="text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={18} />
                )}
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-12 w-44 bg-white shadow-lg rounded-lg p-2 text-gray-700 animate-fadeIn">
                  <Link
                    to="/myprofile"
                    className="block px-4 py-2 hover:bg-blue-50 rounded-md"
                    onClick={() => setShowMenu(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-md flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 sm:w-1/2 bg-white shadow-2xl z-50 p-6 flex flex-col items-start gap-6 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="self-end text-gray-700 mb-4" onClick={() => setOpen(false)}>
          <X size={28} />
        </button>

        <nav className="flex flex-col gap-5 text-lg font-medium text-gray-700 mt-6">
          <Link to="/" onClick={() => setOpen(false)} className={isActive("/")}>
            Home
          </Link>
          <Link to="/services" onClick={() => setOpen(false)} className={isActive("/services")}>
            Services
          </Link>
          <Link to="/about" onClick={() => setOpen(false)} className={isActive("/about")}>
            About Us
          </Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/mybooking" onClick={() => setOpen(false)}>
                My Bookings
              </Link>
              <Link to="/myprofile" onClick={() => setOpen(false)}>
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="text-left hover:text-blue-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
