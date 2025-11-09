import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { sendOtp, verifyLoginOtp } from "../api/api"; // ✅ updated import

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Send OTP
  const handleSendOtp = async () => {
    try {
      if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        toast.error("Enter a valid 10-digit mobile number!");
        return;
      }
      setLoading(true);
      const res = await sendOtp({ mobile: formData.mobile, purpose: "login" });

      toast.success(res.message || "OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP (for login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { mobile, otp } = formData;
    if (!mobile || !otp) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const { user, token } = await verifyLoginOtp({ mobile, otp });
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      // ✅ Refresh Navbar immediately
      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-10">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 md:p-8">
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              disabled={loading}
            />
          </div>

          {/* OTP Field (appears after send) */}
          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                disabled={loading}
              />
            </div>
          )}

          {/* Buttons */}
          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
