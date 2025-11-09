// src/components/Footer.jsx
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 px-6 md:px-16 border-t border-gray-200">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
    
    {/* Brand Info */}
    <div>
      <h2 className="text-blue-600 text-2xl font-bold mb-3">LocalLink</h2>
      <p className="text-sm leading-relaxed">
        Connecting locals with trusted professionals — from electricians to tutors — fast, easy, and nearby.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-gray-900 font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        {["Home", "Services", "About", "Login"].map((link) => (
          <li key={link}>
            <a
              href="#"
              className="hover:text-blue-500 transition-colors duration-200"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h3 className="text-gray-900 font-semibold mb-3">Contact</h3>
      <ul className="space-y-2 text-sm">
        <li>📧 support@locallink.com</li>
        {/* <li>📍 ABES College, Ghaziabad</li> */}
      </ul>
    </div>

    {/* Socials */}
    <div>
      <h3 className="text-gray-900 font-semibold mb-3">Follow Us</h3>
      <div className="flex space-x-4 text-lg">
        <a href="#" className="hover:text-blue-500 transition"><FaFacebook /></a>
        <a href="#" className="hover:text-blue-500 transition"><FaInstagram /></a>
        <a href="#" className="hover:text-blue-500 transition"><FaTwitter /></a>
      </div>
    </div>
  </div>

  <div className="text-center text-sm text-gray-500 pt-3 border-t border-gray-200">
    © 2025 LocalLink. All rights reserved.
  </div>
</footer>

  );
};

export default Footer;
