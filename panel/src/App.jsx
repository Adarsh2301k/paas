import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Booking from "./pages/Booking.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import { useProviderAuth } from "./context/ProviderAuthContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { token } = useProviderAuth();
  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route 
          path="/" 
          element={token ? <Dashboard /> : <Home />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
