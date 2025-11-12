import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyOtp } from "../api/providerApi";
import { useProviderAuth } from "../context/ProviderAuthContext";
import { toast } from "react-hot-toast";

export default function OtpVerify() {
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { setProvider, setToken } = useProviderAuth();

  const handleVerify = async () => {
    const res = await verifyOtp(state.mobile, otp);

    setToken(res.data.token);
    setProvider(res.data.provider);

    if (res.data.exists) {
      navigate("/dashboard");
      toast.success("OTP verified successfully");
    } else {
      navigate("/register");
      toast.info("Please complete your registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md p-6 rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Enter OTP
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-2 border rounded-md mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded-md"
          onClick={handleVerify}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
