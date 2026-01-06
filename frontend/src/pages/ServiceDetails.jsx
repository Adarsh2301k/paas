import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getServiceById, getServices } from "../api/api";
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

        // 🔹 Fetch main service
        const data = await getServiceById(id);
        setService(data);

        // 🔹 Fetch recommendations (same category)
        const all = await getServices();
        const similar = all.filter(
          (s) =>
            s.category === data.category &&
            s._id !== data._id
        );

        setRecommended(similar.slice(0, 5));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading service…
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Service not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">
      {/* ===== MAIN SERVICE CARD ===== */}
      <div className="max-w-5xl mx-auto bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row">

          {/* IMAGE */}
          <div className="md:w-2/5">
            <img
              src={service.image || "/placeholder.png"}
              alt={service.title}
              className="w-full h-72 object-cover"
            />
          </div>

          {/* DETAILS */}
          <div className="md:w-3/5 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-xl  text-gray-800">
                {service.title}
              </h1>

              <p className="text-blue-600 font-small mt-1">
                {service.category}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-xl font-semibold text-green-600">
                  ₹{service.price}
                </span>

                {service.verified && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle size={16} />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-gray-600 mt-4 leading-relaxed">
                {service.description ||
                  "No detailed description available for this service."}
              </p>

              {/* PROVIDER INFO */}
              <div className="border-t mt-5 pt-4 text-sm text-gray-700 space-y-2">
                <p className="font-small">
                  Provider: {service.provider?.name || "N/A"}
                </p>

                {service.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <span>{service.address}</span>
                  </div>
                )}

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
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(`/book/${service._id}`)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
            >
              Book Service
            </button>
          </div>
        </div>
      </div>

      {/* ===== RECOMMENDED SERVICES ===== */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Similar Services
        </h2>

        {recommended.length === 0 ? (
          <p className="text-gray-500">
            No similar services found.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommended.map((item) => (
              <Link
                key={item._id}
                to={`/services/${item._id}`}
                className="bg-white border rounded-xl p-2 hover:shadow-md transition"
              >
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="w-full h-28 object-cover rounded-md"
                />

                <h3 className="text-sm font-semibold mt-2 truncate">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500 truncate">
                  {item.category}
                </p>

                <p className="text-sm font-medium text-green-600">
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
