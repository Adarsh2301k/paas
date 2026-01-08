import { useState } from "react";
import Sidebar from "../components/Sidebar";

const ProviderLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-white shadow">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Topbar */}
        <div className="md:hidden bg-white shadow p-4 flex items-center">
          <button onClick={() => setOpen(true)} className="text-2xl">
            ☰
          </button>
          <h1 className="ml-4 font-bold text-blue-600">
            LocalLink Provider
          </h1>
        </div>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default ProviderLayout;
