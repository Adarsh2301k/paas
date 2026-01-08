import { Routes, Route } from "react-router-dom";
import PanelHome from "./pages/PanelHome";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProviderLayout from "./pages/ProviderLayout";
import CreateService from "./pages/CreateServices";
import MyServices from "./pages/MyServices";
import MyProfile from "./pages/MyProfile";
import AdminDashboard from "./pages/AdminDashboard";
import Bookings from "./pages/Bookings";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PanelHome />} />
      <Route path="/register" element={<Register />} />

      {/* Provider Panel (Protected later) */}
      <Route
        path="/dashboard"
        element={
          <ProviderLayout>
            <Dashboard />
          </ProviderLayout>
        }
      />
      <Route path="/create-service" element={<ProviderLayout><CreateService /></ProviderLayout>} />
      <Route path="/bookings" element={<ProviderLayout><Bookings /></ProviderLayout>} />
      <Route path="/my-services" element={<ProviderLayout><MyServices /></ProviderLayout>} />
      <Route path="/my-profile" element={<ProviderLayout><MyProfile /></ProviderLayout>} />
      <Route path="/admin-dashboard" element={<ProviderLayout><AdminDashboard /></ProviderLayout>} />
    </Routes>
  );
}

export default App;
