import { Link } from "react-router-dom";
import { useProviderAuth } from "../context/ProviderAuthContext";

export default function Home() {
  const { token } = useProviderAuth();
  const isLoggedIn = !!token;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-600 text-center">
        Join LocalLink as a Service Provider
      </h1>
      <p className="text-gray-700 text-center max-w-2xl mt-4 text-lg">
        Grow your business by reaching thousands of local customers daily.
      </p>

      <div className="mt-10 flex gap-6">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg">Login</Link>
            <Link to="/register" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-md text-lg">Register</Link>
          </>
        ) : (
          <Link to="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg">
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
