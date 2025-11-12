import { useState } from "react";
import { sendOtp } from "../api/providerApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!mobile) return alert("Enter mobile number");

    await sendOtp(mobile);
    navigate("/otp", { state: { mobile } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md p-6 rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Provider Login
        </h2>

        <input
          type="text"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <button
          onClick={handleSendOtp}
          className="w-full bg-blue-600 text-white p-2 rounded-md"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
