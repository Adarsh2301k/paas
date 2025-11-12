import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getBookings, completeBooking } from "../api/providerApi";
import { useProviderAuth } from "../context/ProviderAuthContext";

export default function Booking() {
  const { token } = useProviderAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getBookings(token);
      setBookings(res.data);
    })();
  }, []);

  const complete = async (id) => {
    await completeBooking(id, token);
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "completed" } : b))
    );
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Bookings</h2>

          <div className="bg-white shadow-md rounded-md">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="p-3">{b.user?.name}</td>
                    <td className="p-3">{b.serviceName}</td>
                    <td className="p-3 capitalize">{b.status}</td>
                    <td className="p-3 text-center">
                      {b.status !== "completed" && (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md"
                          onClick={() => complete(b._id)}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
