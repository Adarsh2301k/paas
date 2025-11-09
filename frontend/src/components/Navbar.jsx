import React, { useState, useRef, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Check login state on mount
  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast.success("Logged out successfully");
    setUser(null);
    navigate("/login");
  };

  // ✅ Close dropdown on outside click or ESC
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          LocalLink
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/services" className="hover:text-blue-600 transition">
            Services
          </Link>
          <Link to="/mybooking" className="hover:text-blue-600 transition">
            My Bookings
          </Link>
          <Link to="/about" className="hover:text-blue-600 transition">
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
                onClick={() => setShowMenu((prev) => !prev)}
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

              {showMenu && (
                <div className="absolute right-0 top-12 w-44 bg-white shadow-lg rounded-lg p-2 text-gray-700 transition-all duration-150">
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
        <button className="md:hidden text-gray-700" onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-2/3 sm:w-1/2 bg-white shadow-2xl z-50 p-6 flex flex-col items-start gap-6 transition-transform duration-300">
            <button
              className="self-end text-gray-700"
              onClick={() => setOpen(false)}
            >
              <X size={28} />
            </button>

            <nav className="flex flex-col gap-5 text-lg font-medium text-gray-700 mt-6">
              <Link to="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link to="/services" onClick={() => setOpen(false)}>
                Services
              </Link>
              <Link to="/about" onClick={() => setOpen(false)}>
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
        </>
      )}
    </nav>
  );
};

export default Navbar;
