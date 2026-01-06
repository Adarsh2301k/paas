import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import Aboutus from "./pages/Aboutus";
import MyBooking from "./pages/MyBooking";
import BookService from "./pages/BookService";
import ServiceDetailS from "./pages/ServiceDetails";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    
      <div>
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <ScrollToTop />
        <Routes>
           
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/mybooking" element={<MyBooking />} />
          <Route path="/services/:id" element={<ServiceDetailS/>} />
          <Route path="/book/:id" element={<BookService />} />
        </Routes>
        <Footer />
      </div>
   
  );
}

export default App;
