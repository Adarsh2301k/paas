import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Droplets,
  Plug,
  Hammer,
  Tv,
  Laptop,
  User,
  Briefcase,
  PenTool,
  GraduationCap,
  Smartphone,
  Fan,
  HelpCircleIcon,
} from "lucide-react";

// Images
import mobileImg from "../assets/trending/mobileImg.jpg";
import washingImg from "../assets/trending/washingImg.jpg";
import laptopImg from "../assets/trending/laptopImg.jpg";
import fridgeImg from "../assets/trending/fridgeImg.jpg";
import acImg from "../assets/trending/acImg.jpg";

const ServiceHero = () => {
  const navigate = useNavigate();

  // 🔥 ONLY THIS IS FUNCTIONAL
  const trending = [
    { name: "Mobile Repair", query: "mobile repair", image: mobileImg },
    { name: "Washing Machine Repair", query: "washing machine repair", image: washingImg },
    { name: "Laptop Service", query: "laptop repair", image: laptopImg },
    { name: "Fridge Repair", query: "fridge repair", image: fridgeImg },
    { name: "AC Repair", query: "ac repair", image: acImg },
  ];

  // 🧊 STATIC FOR NOW
  const genericServices = [
    { name: "AC / Cooler / Fridge Repairing", icon: <Wrench size={26} />, color: "bg-blue-100 text-blue-600" },
    { name: "Plumbing", icon: <Droplets size={26} />, color: "bg-sky-100 text-sky-600" },
    { name: "Home Cleaning / Helper", icon: <HelpCircleIcon size={26} />, color: "bg-purple-100 text-purple-600" },
    { name: "Carpentry", icon: <Hammer size={26} />, color: "bg-orange-100 text-orange-600" },
    { name: "Electronics Installation / Wiring", icon: <Tv size={26} />, color: "bg-yellow-100 text-yellow-600" },
  ];

  const professionalServices = [
    { name: "IT Services", icon: <Laptop size={26} />, color: "bg-green-100 text-green-600" },
    { name: "Home Tutor", icon: <GraduationCap size={26} />, color: "bg-indigo-100 text-indigo-600" },
    { name: "Freelancer / Designer", icon: <PenTool size={26} />, color: "bg-pink-100 text-pink-600" },
    { name: "Corporate Services", icon: <Briefcase size={26} />, color: "bg-gray-100 text-gray-600" },
    { name: "Consultation / Coaching", icon: <User size={26} />, color: "bg-teal-100 text-teal-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">

      {/* 🔥 TRENDING SERVICES (REAL) */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          🔥 Trending Services
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          {trending.map((service, i) => (
            <div
              key={i}
              onClick={() =>
                navigate(`/services?query=${encodeURIComponent(service.query)}`)
              }
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white font-semibold">
                {service.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧊 GENERIC SERVICES (STATIC) */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Generic Services
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {genericServices.map((service, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl ${service.color}`}
            >
              <div className="mb-3">{service.icon}</div>
              <p className="font-semibold text-center text-sm">
                {service.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧊 PROFESSIONAL SERVICES (STATIC / LATER) */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Professional Services
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {professionalServices.map((service, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl ${service.color} opacity-80`}
            >
              <div className="mb-3">{service.icon}</div>
              <p className="font-semibold text-center text-sm">
                {service.name}
              </p>
              <span className="text-xs text-gray-500 mt-1">Coming Soon</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServiceHero;
