import { useState } from "react";
import Sidebar from "../components/Sidebar";

const ProviderLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-screen bg-gray-100 overflow-hidden">
      
      {/* ===== SIDEBAR (FIXED, DOES NOT AFFECT LAYOUT FLOW) ===== */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r z-40">
        <Sidebar />
      </aside>

      {/* ===== MOBILE DRAWER ===== */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white shadow">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* ===== MAIN CONTENT (ONLY SHIFT ON DESKTOP) ===== */}
      <div className="h-full md:pl-64 flex flex-col">
        
        {/* MOBILE TOPBAR */}
        <div className="md:hidden bg-white shadow p-4 flex items-center">
          <button onClick={() => setOpen(true)} className="text-2xl">
            ☰
          </button>
          <h1 className="ml-4 font-bold text-blue-600">
            LocalLink Provider
          </h1>
        </div>

        {/* SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
