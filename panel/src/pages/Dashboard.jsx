import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyServices } from "../api/providerApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const services = await getMyServices();
      const active = services.filter(s => s.isActive).length;

      setStats({
        total: services.length,
        active,
        inactive: services.length - active,
      });
    };

    loadStats();
  }, []);

  const Card = ({ title, value, color, onClick }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-lg transition"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        👋 Welcome, Provider
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card
          title="Total Services"
          value={stats.total}
          color="text-gray-800"
          onClick={() => navigate("/my-services")}
        />
        <Card
          title="Active Services"
          value={stats.active}
          color="text-green-600"
          onClick={() => navigate("/my-services")}
        />
        <Card
          title="Inactive Services"
          value={stats.inactive}
          color="text-red-500"
          onClick={() => navigate("/my-services")}
        />
      </div>

      
    </>
  );
};

export default Dashboard;
