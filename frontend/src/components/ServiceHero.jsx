import React from "react";
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

import mobileImg from "../assets/trending/mobileImg.jpg";
import washingImg from "../assets/trending/washingImg.jpg";
import laptopImg from "../assets/trending/laptopImg.jpg";
import fridgeImg from "../assets/trending/fridgeImg.jpg";
import acImg from "../assets/trending/acImg.jpg";
const ServiceHero = () => {
  
  const trending = [
    { name: "Mobile Repair", icon: <Smartphone size={22} />, image: mobileImg },
    { name: "Washing Machine Repair", icon: <Fan size={22} />, image: washingImg },
    { name: "Laptop Service", icon: <Laptop size={22} />, image: laptopImg },
    { name: "Fridge Repair", icon: <Wrench size={22} />, image: fridgeImg },
    { name: "AC Repair", icon: <Plug size={22} />, image: acImg },
  ];

  const genericServices = [
    { name: "AC / Cooler / Fridge Repairing", icon: <Wrench size={26} />, color: "bg-blue-100 text-blue-600" },
    { name: "Plumbing", icon: <Droplets size={26} />, color: "bg-sky-100 text-sky-600" },
    { name: "Home Cleaning / Helper", icon: <HelpCircleIcon size={26} />, color: "bg-purple-100 text-purple-600" },
    { name: "Carpentry", icon: <Hammer size={26} />, color: "bg-orange-100 text-orange-600" },
    { name: "Electronics Installation / Wiring", icon: <Tv size={26} />, color: "bg-yellow-100 text-yellow-600" },
  ];

  const professionalServices = [
    { name: "Laptop / Mobile / IT Repair", icon: <Laptop size={26} />, color: "bg-green-100 text-green-600" },
    { name: "Home Tutor", icon: <GraduationCap size={26} />, color: "bg-indigo-100 text-indigo-600" },
    { name: "Freelancer / Designer", icon: <PenTool size={26} />, color: "bg-pink-100 text-pink-600" },
    { name: "Corporate Services", icon: <Briefcase size={26} />, color: "bg-gray-100 text-gray-600" },
    { name: "Consultation / Coaching", icon: <User size={26} />, color: "bg-teal-100 text-teal-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 py-8 space-y-10">
      {/* Trending Section */}
       <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
        🔥 Trending Services
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
        {trending.map((service, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            {/* Image */}
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>

            {/* Text */}
            <div className="absolute bottom-3 left-3 text-white">
              <p className="font-semibold text-base sm:text-lg">
                {service.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>

      {/* Generic Section */}
      <section>
         <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Explore Services Around You
      </h2>
      
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Generic Services
          </h2>
          <button className="text-blue-600 hover:underline text-sm font-medium">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {genericServices.map((service, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl hover:shadow-md transition cursor-pointer ${service.color}`}
            >
              <div className="mb-3">{service.icon}</div>
              <p className="font-semibold text-gray-800 text-center text-sm sm:text-base">
                {service.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Professional Services
          </h2>
          <button className="text-blue-600 hover:underline text-sm font-medium">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {professionalServices.map((service, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl hover:shadow-md transition cursor-pointer ${service.color}`}
            >
              <div className="mb-3">{service.icon}</div>
              <p className="font-semibold text-gray-800 text-center text-sm sm:text-base">
                {service.name}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ServiceHero;
