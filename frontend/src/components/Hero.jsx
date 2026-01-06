import React, { useState } from "react";
import { Search } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/autoplay";

// Poster images
import govpost from "../assets/govpost.png";
import heroImg from "../assets/hero2.png";
import motive from "../assets/motiv.png";

const Hero = () => {
  const posters = [govpost, heroImg, motive];
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/services?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between max-w-5xl mx-auto px-4 py-8 lg:py-10 gap-6">
      
      {/* 🔹 Text Section */}
      <div className="flex flex-col justify-center gap-4 text-center lg:text-left w-full lg:w-1/2">
        <h2 className="text-xl sm:text-4xl font-bold text-gray-800 leading-tight">
          Find <span className="text-blue-600">Trusted Professionals</span> Near You
        </h2>
        
        <p className="text-gray-600 text-base sm:text-md max-w-md mx-auto lg:mx-0">
          LocalLink helps you connect with verified electricians, plumbers,
          tutors, and more — fast, reliable, and local.
        </p>

        {/* 🔍 Search Bar */}
        <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden max-w-2xl mx-auto lg:mx-0 mt-2">
          <div className="flex items-center px-4 text-gray-500">
            <Search size={20} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for a service or category..."
            className="flex-1 px-4 py-4 outline-none text-gray-700 text-base"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-8 py-4 font-semibold hover:bg-blue-700 transition text-base"
          >
            Search
          </button>
        </div>
      </div>

      {/* 🔹 Poster Slider */}
      <div className="flex justify-center lg:justify-end lg:w-1/2">
        <div className="w-60 sm:w-72 md:w-[260px] lg:w-[300px] rounded-2xl shadow-lg overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop
            spaceBetween={20}
            centeredSlides
          >
            {posters.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt={`poster-${i}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Hero;
