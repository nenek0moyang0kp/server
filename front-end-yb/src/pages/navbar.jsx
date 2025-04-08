import React, { useState } from "react";
import { Link } from "react-router-dom";
import topNavIcon from "../../public/icons/Top.svg";
import bottomNavIcon from "../../public/icons/Bottom.svg";

const NavbarPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-black fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center justify-between py-4">
            <a href="#home" className="flex items-center ml-3">
              <img src={topNavIcon} alt="Top Logo" />
              <div className="-ml-3.5">
                <img src={bottomNavIcon} alt="Bottom Logo" className="pt-5" />
              </div>
              <h2 className="font-pragati text-white text-sm absolute left-0 mx-4">
                <span className="text-primary">youngbloom</span> studio <br />
                media creative
              </h2>
            </a>
          </div>

          {/* Hamburger Button for Mobile */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label="Toggle Menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>

          {/* Navigation Menu */}
          <nav
            className={`absolute top-20 left-0 w-full bg-black shadow-lg lg:shadow-none transition-all duration-300 ease-in-out lg:transition-none ${
              isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            } lg:opacity-100 lg:visible lg:static lg:w-auto lg:bg-transparent`}
          >
            <ul className="flex flex-col items-center space-y-4 py-6 lg:flex-row lg:space-y-0 lg:space-x-8 lg:py-0">
              <li>
                <Link
                  to="/"
                  className="text-white text-lg hover:text-primary transition-colors duration-200 px-4 py-2"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-white text-lg hover:text-primary transition-colors duration-200 px-4 py-2"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <a
                  href="/main"
                  className="text-white text-lg hover:text-primary transition-colors duration-200 px-4 py-2"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavbarPage;
