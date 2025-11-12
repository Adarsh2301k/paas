import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProviderDetails, getProviders } from "../api/api"; // we'll reuse your backend
import { CheckCircle, MapPin, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProviderDetails(id);
        setService(data);

        // Fetch recommended (same category)
        const all = await getProviders();
        const rec = all.filter(
          (item) => item.category === data.category && item._id !== data._id
        );
        setRecommended(rec.slice(0, 5)); // limit to 5
      } catch (err) {
        console.error(err);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading...
      </div>
    );

  if (!service)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Service not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">
      {/* ===== MAIN CARD ===== */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border">
        <div className="flex flex-col md:flex-row">
          {/* Left - Image */}
          <div className="md:w-2/5">
            <img
              src={service.image || "/assets/sample.jpg"}
              alt={service.name}
              className="w-full h-72 object-cover"
            />
          </div>

          {/* Right - Info */}
          <div className="md:w-3/5 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {service.name}
              </h1>
              <p className="text-blue-600 font-medium mb-3">
                {service.category}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-semibold text-green-600">
                  ₹{service.price}
                </span>
                {service.verified && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle size={16} /> Verified Partner
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-3 leading-relaxed">
                {service.description ||
                  "No detailed description available for this service."}
              </p>

              <div className="border-t pt-3 mt-2 text-sm text-gray-700 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  <span>{service.address || "Address not provided"}</span>
                </div>
                {service.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-blue-500" />
                    <span>{service.mobile}</span>
                  </div>
                )}
                {service.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-500" />
                    <span>{service.email}</span>
                  </div>
                )}
                <p className="text-gray-500 text-xs">
                  Pincode: {service.pincode || "N/A"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setTimeout(() => {
    navigate(`/book/${service._id}`);
  }, 700);
              }}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition text-center"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* ===== RECOMMENDATIONS ===== */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Recommended for you
        </h2>

        {recommended.length === 0 ? (
          <p className="text-gray-500">No similar services found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommended.map((item) => (
              <Link
                to={`/services/${item._id}`}
                key={item._id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-2 flex flex-col"
              >
                <img
                  src={item.image || "/assets/sample.jpg"}
                  alt={item.name}
                  className="w-full h-28 object-cover rounded-md"
                />
                <h3 className="text-sm font-semibold text-gray-800 mt-2 truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {item.category}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  ₹{item.price}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
