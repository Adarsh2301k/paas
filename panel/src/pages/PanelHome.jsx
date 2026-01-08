import { useState } from "react";
import { sendProviderOtp, verifyProviderOtp } from "../api/providerApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PanelHome = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("mobile");
  const navigate = useNavigate();

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (mobile.trim().length !== 10) {
      toast.error("Enter valid 10-digit mobile number");
      return;
    }

    try {
      await sendProviderOtp(mobile.trim());
      toast.success("OTP sent (check backend console)");
      setStep("otp");
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    if (otp.trim().length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      // ✅ data is already the response
      const data = await verifyProviderOtp(
        mobile.trim(),
        otp.trim()
      );

      const { token, needsRegistration } = data;

      if (token) {
        localStorage.setItem("providerToken", token);
      }
      localStorage.setItem(
  "providerIsAdmin",
  data.isAdmin ? "true" : "false"
);


      if (needsRegistration) {
        navigate("/register", { state: { mobile: mobile.trim() } });
      } else {
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch {
      toast.error("Invalid or expired OTP");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 md:p-8">
      
      {/* Logo / Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          LocalLink
        </h1>
        <p className="text-gray-500 mt-1">
          Provider Panel
        </p>
      </div>

      {/* STEP 1: MOBILE */}
      {step === "mobile" && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Mobile Number
            </label>
            <input
              placeholder="Enter 10-digit mobile number"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <button
            onClick={sendOtp}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg hover:bg-blue-700 transition"
          >
            Send OTP
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            OTP will be shown in backend console (dev mode)
          </p>
        </>
      )}

      {/* STEP 2: OTP */}
      {step === "otp" && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Enter OTP
            </label>
            <input
              placeholder="6-digit OTP"
              className="w-full border rounded-xl p-3 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 text-white py-3 rounded-xl text-lg hover:bg-green-700 transition"
          >
            Verify & Continue
          </button>

          {/* Change Number */}
          <button
            onClick={() => {
              setStep("mobile");
              setOtp("");
            }}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Change mobile number
          </button>
        </>
      )}
    </div>
  </div>
);

};

export default PanelHome;
