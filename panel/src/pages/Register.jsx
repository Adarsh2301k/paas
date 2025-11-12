import { useState } from "react";
import { registerProvider } from "../api/providerApi";
import { useProviderAuth } from "../context/ProviderAuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { token, setProvider } = useProviderAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    experience: "",
    description: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await registerProvider(form, token);
    setProvider(res.data);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md p-6 rounded-md w-[420px]">
        <h2 className="text-2xl font-bold mb-5 text-center text-blue-600">
          Complete Registration
        </h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key}
            className="w-full p-2 border rounded-md mb-3 capitalize"
            value={form[key]}
            onChange={handleChange}
          />
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded-md mt-3"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
