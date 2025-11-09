import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number!");
      return;
    }
    // later: send API request to backend (POST /send-otp)
    toast.success("OTP Sent (Demo)");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { mobile, otp } = formData;
    if (!mobile || !otp) {
      toast.error("Please fill all fields!");
      return;
    }

    // later: verify OTP with backend (POST /verify-otp)
    console.log("Login Attempt:", formData);
    toast.success("Login Successful!");
    navigate("/"); // redirect to homepage or dashboard
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-10">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 md:p-8">
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">OTP</label>
            <div className="flex gap-3">
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-base"
          >
            Login 
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
