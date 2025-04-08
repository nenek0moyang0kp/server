import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/product.service";
import starHeroIcon from "../../public/icons/Star.svg";
import logoHeroIcon from "../../public/icons/logo.svg";
import arrowRight from "../../public/icons/arrow-right.svg";
import line from "../../public/icons/line.svg";
import ContactForm from "../components/contactForm";

const HeroPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then((response) => {
        setProducts(response.slice(0, 6));
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 text-center p-8">Error: {error.message}</p>
      </div>
    );

  return (
    <section className="bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Animated Logo Section */}
        <div
          className="relative flex justify-center items-center mt-6 md:mt-12 group"
          id="home"
        >
          <img
            src={starHeroIcon}
            alt="Star Hero"
            className="absolute w-32 md:w-48 opacity-75 animate-float"
          />
          <img
            src={logoHeroIcon}
            alt="Logo Hero"
            className="relative z-10 w-3/4 max-w-xs md:max-w-md transform transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Gradient Quote Section */}
        <div className="relative py-8 px-4 md:px-16 my-12 rounded-2xl">
          <div className="absolute inset-0" />
          <h3 className="relative z-10 text-xs md:text-sm lg:text-base font-spartan text-center leading-relaxed italic">
            "Young Bloom Studio" carries a deep and inspiring meaning. The word
            "Young" symbolizes energy, creativity, and a fresh, youthful spirit.
            Meanwhile, the word "Bloom" represents the process of growth,
            development, and reaching one's full potential.
          </h3>
        </div>

        {/* Enhanced Gallery Section */}
        <div className="w-full px-4 sm:px-6">
          <h1 className="font-fustat text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-100 text-center mb-8">
            <span className="text-white">Gallery</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12 md:mb-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {product.title}
                    </h3>
                  </div>
                </div>
                <div className="p-4 bg-black/80 backdrop-blur-sm border-t border-gray-800">
                  <p className="text-gray-200 font-spartan text-sm md:text-base leading-relaxed">
                    {product.description.split(" ").slice(0, 12).join(" ")}...
                  </p>
                  <a
                    href="https://www.instagram.com/youngbloomstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-primary hover:underline hover:underline-offset-auto duration-200 group/link"
                  >
                    <span className="mr-2">Explore More on Instagram</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mt-1 group-hover/link:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Collaboration Section */}
        <div className="flex flex-col items-center mb-12 md:mb-24 px-4 group">
          <div className="flex items-center gap-2 mb-2 cursor-pointer transform transition-all duration-300 hover:gap-4">
            <h1 className="text-primary font-potta text-xl md:text-2xl animate-gradient-x">
              Lets Collaborate
            </h1>
            <img
              src={arrowRight}
              alt="Arrow right"
              className="w-6 h-6 mt-0.5 md:w-8 md:h-8 transition-transform duration-300 group-hover:translate-x-2"
            />
          </div>
          <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Social Links Section */}
        <div className="relative flex flex-col items-center justify-center gap-4 md:gap-6 mb-20 md:mb-36">
          <img
            src={starHeroIcon}
            alt="Decorative star"
            className="absolute w-48 md:w-60 opacity-30 animate-pulse"
          />
          {[
            ["Instagram", "https://www.instagram.com/youngbloomstudio"],
            ["YouTube", "https://youtube.com/@youngbloomstudio"],
            ["TikTok", "https://www.tiktok.com/@youngbloomstudio"],
          ].map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 font-spartan text-base md:text-lg hover:text-primary transition-colors duration-200"
            >
              {platform}
            </a>
          ))}
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-center px-4 mb-16 md:mb-24">
          <h1 className="text-white font-raleway text-2xl md:text-3xl font-bold mb-8">
            Contact Us
          </h1>
          <div className="w-full max-w-2xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
